import { Address, BigInt } from "@graphprotocol/graph-ts";
import {
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  DroposalTypeApproved,
  VoteCast,
} from "../generated/NounsAgoraGovernorSepolia/NounsAgoraGovernorSepolia";
import {
  _handleProposalCreated,
  _handleProposalCanceled,
  _handleProposalExecuted,
  _handleVoteCast,
  getProposal,
  getGovernance,
} from "./handlers";
import { GovernanceFramework, Proposal } from "../generated/schema";
import { NounsAgoraGovernorSepolia } from "../generated/NounsAgoraGovernorSepolia/NounsAgoraGovernorSepolia";
import {
  BIGINT_ONE,
  GovernanceFrameworkType,
  ProposalState,
} from "./constants";

// export function handleDroposalTypeApproved(
//   event: DroposalTypeApprovedEvent
// ): void {
//   let entity = new DroposalTypeApproved(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.droposalTypeId = event.params.droposalTypeId;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

export function handleProposalCanceled(event: ProposalCanceled): void {
  _handleProposalCanceled(event.params.proposalId.toString(), event);
}

export function handleProposalCreated(event: ProposalCreated): void {
  const quorumVotes = getQuorumFromContract(
    event.address,
    event.block.number.minus(BIGINT_ONE)
  );

  _handleProposalCreated(
    event.params.proposalId.toString(),
    event.params.proposer.toHexString(),
    event.params.targets,
    event.params.values,
    event.params.signatures,
    event.params.calldatas,
    event.params.startBlock,
    event.params.endBlock,
    event.params.description,
    quorumVotes,
    event
  );
}

// ProposalExecuted(proposalId)
export function handleProposalExecuted(event: ProposalExecuted): void {
  _handleProposalExecuted(event.params.proposalId.toString(), event);
}

// VoteCast(account, proposalId, support, weight, reason);
export function handleVoteCast(event: VoteCast): void {
  const proposal = getLatestProposalValues(
    event.params.proposalId.toString(),
    event.address
  );

  // Proposal will be updated as part of handler
  _handleVoteCast(
    proposal,
    event.params.voter.toHexString(),
    event.params.weight,
    event.params.reason,
    event.params.support,
    event
  );
}

function getLatestProposalValues(
  proposalId: string,
  contractAddress: Address
): Proposal {
  const proposal = getProposal(proposalId);

  // On first vote, set state and quorum values
  if (proposal.state == ProposalState.PENDING) {
    proposal.state = ProposalState.ACTIVE;
    proposal.quorumVotes = getQuorumFromContract(
      contractAddress,
      proposal.startBlock
    );

    const governance = getGovernance();
    proposal.tokenHoldersAtStart = governance.currentTokenHolders;
    proposal.delegatesAtStart = governance.currentDelegates;
  }
  return proposal;
}

function getGovernanceFramework(contractAddress: string): GovernanceFramework {
  let governanceFramework = GovernanceFramework.load(contractAddress);

  if (!governanceFramework) {
    governanceFramework = new GovernanceFramework(contractAddress);
    const contract = NounsAgoraGovernorSepolia.bind(
      Address.fromString(contractAddress)
    );

    governanceFramework.name = "nouns-agora-governance";
    governanceFramework.type = GovernanceFrameworkType.OPENZEPPELIN_GOVERNOR;
    governanceFramework.version = contract.version();

    governanceFramework.contractAddress = contractAddress;
    governanceFramework.tokenAddress = contract.token().toHexString();

    governanceFramework.votingDelay = contract.votingDelay();
    governanceFramework.votingPeriod = contract.votingPeriod();
    governanceFramework.proposalThreshold = contract.proposalThreshold();
  }

  return governanceFramework;
}

function getQuorumFromContract(
  contractAddress: Address,
  blockNumber: BigInt
): BigInt {
  const contract = NounsAgoraGovernorSepolia.bind(contractAddress);
  const quorumVotes = contract.quorum(blockNumber);

  const governanceFramework = getGovernanceFramework(
    contractAddress.toHexString()
  );
  governanceFramework.quorumVotes = quorumVotes;
  governanceFramework.save();

  return quorumVotes;
}

// export function handleDroposalTypeProposed(
//   event: DroposalTypeProposedEvent
// ): void {
//   let entity = new DroposalTypeProposed(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.droposalTypeId = event.params.droposalTypeId;
//   entity.config_name = event.params.config.name;
//   entity.config_editionSize = event.params.config.editionSize;
//   entity.config_publicSalePrice = event.params.config.publicSalePrice;
//   entity.config_publicSaleDuration = event.params.config.publicSaleDuration;
//   entity.config_fundsRecipientSplit = event.params.config.fundsRecipientSplit;
//   entity.config_minter = event.params.config.minter;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleDroposalTypeSet(event: DroposalTypeSetEvent): void {
//   let entity = new DroposalTypeSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.droposalTypeId = event.params.droposalTypeId;
//   entity.config_name = event.params.config.name;
//   entity.config_editionSize = event.params.config.editionSize;
//   entity.config_publicSalePrice = event.params.config.publicSalePrice;
//   entity.config_publicSaleDuration = event.params.config.publicSaleDuration;
//   entity.config_fundsRecipientSplit = event.params.config.fundsRecipientSplit;
//   entity.config_minter = event.params.config.minter;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleInitialized(event: InitializedEvent): void {
//   let entity = new Initialized(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.version = event.params.version;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleOwnershipTransferred(
//   event: OwnershipTransferredEvent
// ): void {
//   let entity = new OwnershipTransferred(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.previousOwner = event.params.previousOwner;
//   entity.newOwner = event.params.newOwner;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleProposalThresholdSet(
//   event: ProposalThresholdSetEvent
// ): void {
//   let entity = new ProposalThresholdSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.oldProposalThreshold = event.params.oldProposalThreshold;
//   entity.newProposalThreshold = event.params.newProposalThreshold;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleUpgraded(event: UpgradedEvent): void {
//   let entity = new Upgraded(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.implementation = event.params.implementation;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleVoteCast(event: VoteCastEvent): void {
//   let entity = new VoteCast(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.voter = event.params.voter;
//   entity.proposalId = event.params.proposalId;
//   entity.support = event.params.support;
//   entity.weight = event.params.weight;
//   entity.reason = event.params.reason;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleVoteCastWithParams(event: VoteCastWithParamsEvent): void {
//   let entity = new VoteCastWithParams(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.voter = event.params.voter;
//   entity.proposalId = event.params.proposalId;
//   entity.support = event.params.support;
//   entity.weight = event.params.weight;
//   entity.reason = event.params.reason;
//   entity.params = event.params.params;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleVotingDelaySet(event: VotingDelaySetEvent): void {
//   let entity = new VotingDelaySet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.oldVotingDelay = event.params.oldVotingDelay;
//   entity.newVotingDelay = event.params.newVotingDelay;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleVotingPeriodSet(event: VotingPeriodSetEvent): void {
//   let entity = new VotingPeriodSet(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.oldVotingPeriod = event.params.oldVotingPeriod;
//   entity.newVotingPeriod = event.params.newVotingPeriod;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleAdminChanged(event: AdminChangedEvent): void {
//   let entity = new AdminChanged(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.previousAdmin = event.params.previousAdmin;
//   entity.newAdmin = event.params.newAdmin;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }

// export function handleBeaconUpgraded(event: BeaconUpgradedEvent): void {
//   let entity = new BeaconUpgraded(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );
//   entity.beacon = event.params.beacon;

//   entity.blockNumber = event.block.number;
//   entity.blockTimestamp = event.block.timestamp;
//   entity.transactionHash = event.transaction.hash;

//   entity.save();
// }
