// Helper file that will abstract much of the logic of saving the entities

import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts";
import {
  BIGINT_ONE,
  BIGINT_ZERO,
  DroposalState,
  VoteChoice,
} from "./utils/constants";
import { getOrCreateDelegate } from "./utils/nounsHelpers";
import { Droposal, DroposalVote } from "../generated/schema";

export const SECONDS_PER_DAY = 60 * 60 * 24;

export function toDecimal(value: any, decimals: any = 18): BigInt {
  const divisor = new BigInt(10 ** decimals);
  return value / divisor;
}

export function addressesToStrings(addresses: Address[]): Array<string> {
  const byteAddresses = new Array<string>();
  for (let i = 0; i < addresses.length; i++) {
    byteAddresses.push(addresses[i].toHexString());
  }
  return byteAddresses;
}

export function getVoteChoiceByValue(choiceValue: number): string {
  if (choiceValue === VoteChoice.AGAINST_VALUE) {
    return VoteChoice.AGAINST;
  } else if (choiceValue === VoteChoice.FOR_VALUE) {
    return VoteChoice.FOR;
  } else if (choiceValue === VoteChoice.ABSTAIN_VALUE) {
    return VoteChoice.ABSTAIN;
  } else {
    // Case that shouldn't happen
    log.error("Voting choice of {} does not exist", [choiceValue.toString()]);
    return VoteChoice.ABSTAIN;
  }
}

export function getDroposal(id: string): Droposal {
  let droposal = Droposal.load(id);
  if (!droposal) {
    droposal = new Droposal(id);
    droposal.tokenHoldersAtStart = BIGINT_ZERO;
    droposal.delegatesAtStart = BIGINT_ZERO;
  }

  return droposal as Droposal;
}

export function _handleDroposalCreated(
  droposalId: string,
  proposerAddr: string,
  targets: Address[],
  values: BigInt[],
  signatures: string[],
  calldatas: Bytes[],
  startBlock: BigInt,
  endBlock: BigInt,
  description: string,
  quorum: BigInt,
  event: ethereum.Event
): void {
  const droposal = getDroposal(droposalId);
  let proposer = getOrCreateDelegate(proposerAddr);

  // Checking if the proposer was a delegate already accounted for, if not we should log an error
  // since it shouldn't be possible for a delegate to propose anything without first being "created"
  if (proposer == null) {
    log.error(
      "Delegate participant {} not found on ProposalCreated. tx_hash: {}",
      [proposerAddr, event.transaction.hash.toHexString()]
    );
  }

  // Creating it anyway since we will want to account for this event data, even though it should've never happened
  proposer = getOrCreateDelegate(proposerAddr);

  droposal.proposer = proposer.id;
  droposal.txnHash = event.transaction.hash.toHexString();
  droposal.againstDelegateVotes = BIGINT_ZERO;
  droposal.forDelegateVotes = BIGINT_ZERO;
  droposal.abstainDelegateVotes = BIGINT_ZERO;
  droposal.totalDelegateVotes = BIGINT_ZERO;
  droposal.againstWeightedVotes = BIGINT_ZERO;
  droposal.forWeightedVotes = BIGINT_ZERO;
  droposal.abstainWeightedVotes = BIGINT_ZERO;
  droposal.totalWeightedVotes = BIGINT_ZERO;
  droposal.targets = addressesToStrings(targets);
  droposal.values = values;
  droposal.signatures = signatures;
  droposal.calldatas = calldatas;
  droposal.creationBlock = event.block.number;
  droposal.creationTime = event.block.timestamp;
  droposal.startBlock = startBlock;
  droposal.endBlock = endBlock;
  droposal.description = description;
  droposal.state =
    event.block.number >= droposal.startBlock
      ? DroposalState.ACTIVE
      : DroposalState.PENDING;
  droposal.quorumVotes = quorum;
  droposal.save();
}

export function _handleDroposalCanceled(
  droposalId: string,
  event: ethereum.Event
): void {
  const proposal = getDroposal(droposalId);
  proposal.state = DroposalState.CANCELED;
  proposal.cancellationTxnHash = event.transaction.hash.toHexString();
  proposal.cancellationBlock = event.block.number;
  proposal.cancellationTime = event.block.timestamp;
  proposal.save();
}

export function _handleDroposalExecuted(
  droposalId: string,
  event: ethereum.Event
): void {
  // Update proposal status + execution metadata
  const proposal = getDroposal(droposalId);
  proposal.state = DroposalState.EXECUTED;
  proposal.executionTxnHash = event.transaction.hash.toHexString();
  proposal.executionBlock = event.block.number;
  proposal.executionTime = event.block.timestamp;
  proposal.save();
}

export function _handleDroposalExtended(
  droposalId: string,
  extendedDeadline: BigInt
): void {
  // Update proposal endBlock
  const proposal = getDroposal(droposalId);
  proposal.endBlock = extendedDeadline;
  proposal.save();
}

export function _handleProposalQueued(
  droposalId: BigInt,
  eta: BigInt,
  event: ethereum.Event
): void {
  // Update proposal status + execution metadata
  const proposal = getDroposal(droposalId.toString());
  proposal.state = DroposalState.QUEUED;
  proposal.queueTxnHash = event.transaction.hash.toHexString();
  proposal.queueBlock = event.block.number;
  proposal.queueTime = event.block.timestamp;
  proposal.executionETA = eta;
  proposal.save();
}

export function _handleDroposalVoteCast(
  droposal: Droposal,
  voterAddress: string,
  weight: BigInt,
  reason: string,
  support: i32,
  event: ethereum.Event
): void {
  const voteId = voterAddress.concat("-").concat(droposal.id);
  const vote = new DroposalVote(voteId);
  vote.droposal = droposal.id;
  vote.voter = voterAddress;
  vote.weight = weight;
  vote.reason = reason;
  vote.block = event.block.number;
  vote.blockTime = event.block.timestamp;
  vote.txnHash = event.transaction.hash.toHexString();
  vote.logIndex = event.logIndex;
  // Retrieve enum string key by value (0 = Against, 1 = For, 2 = Abstain)
  vote.choice = getVoteChoiceByValue(support);
  vote.blockTimeId = `${event.block.timestamp.toI64()}-${event.logIndex}`;
  vote.save();

  // Increment respective vote choice counts
  // NOTE: We are counting the weight instead of individual votes
  if (support === VoteChoice.AGAINST_VALUE) {
    droposal.againstDelegateVotes = droposal.againstDelegateVotes.plus(
      BIGINT_ONE
    );
    droposal.againstWeightedVotes = droposal.againstWeightedVotes.plus(weight);
  } else if (support === VoteChoice.FOR_VALUE) {
    droposal.forDelegateVotes = droposal.forDelegateVotes.plus(BIGINT_ONE);
    droposal.forWeightedVotes = droposal.forWeightedVotes.plus(weight);
  } else if (support === VoteChoice.ABSTAIN_VALUE) {
    droposal.abstainDelegateVotes = droposal.abstainDelegateVotes.plus(
      BIGINT_ONE
    );
    droposal.abstainWeightedVotes = droposal.abstainWeightedVotes.plus(weight);
  }
  // Increment total
  droposal.totalDelegateVotes = droposal.totalDelegateVotes.plus(BIGINT_ONE);
  droposal.totalWeightedVotes = droposal.totalWeightedVotes.plus(weight);
  droposal.save();

  // Add 1 to participant's proposal voting count
  const voter = getOrCreateDelegate(voterAddress);
  voter.numberDroposalVotes = voter.numberDroposalVotes + 1;
  voter.save();
}
