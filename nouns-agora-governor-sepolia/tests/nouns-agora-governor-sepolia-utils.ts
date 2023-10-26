import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  AdminChanged,
  BeaconUpgraded,
  DroposalTypeApproved,
  DroposalTypeProposed,
  DroposalTypeSet,
  Initialized,
  OwnershipTransferred,
  ProposalCanceled,
  ProposalCreated,
  ProposalExecuted,
  ProposalThresholdSet,
  Upgraded,
  VoteCast,
  VoteCastWithParams,
  VotingDelaySet,
  VotingPeriodSet
} from "../generated/NounsAgoraGovernorSepolia/NounsAgoraGovernorSepolia"

export function createAdminChangedEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminChanged {
  let adminChangedEvent = changetype<AdminChanged>(newMockEvent())

  adminChangedEvent.parameters = new Array()

  adminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminChangedEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminChangedEvent
}

export function createBeaconUpgradedEvent(beacon: Address): BeaconUpgraded {
  let beaconUpgradedEvent = changetype<BeaconUpgraded>(newMockEvent())

  beaconUpgradedEvent.parameters = new Array()

  beaconUpgradedEvent.parameters.push(
    new ethereum.EventParam("beacon", ethereum.Value.fromAddress(beacon))
  )

  return beaconUpgradedEvent
}

export function createDroposalTypeApprovedEvent(
  droposalTypeId: BigInt
): DroposalTypeApproved {
  let droposalTypeApprovedEvent = changetype<DroposalTypeApproved>(
    newMockEvent()
  )

  droposalTypeApprovedEvent.parameters = new Array()

  droposalTypeApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "droposalTypeId",
      ethereum.Value.fromUnsignedBigInt(droposalTypeId)
    )
  )

  return droposalTypeApprovedEvent
}

export function createDroposalTypeProposedEvent(
  droposalTypeId: BigInt,
  config: ethereum.Tuple
): DroposalTypeProposed {
  let droposalTypeProposedEvent = changetype<DroposalTypeProposed>(
    newMockEvent()
  )

  droposalTypeProposedEvent.parameters = new Array()

  droposalTypeProposedEvent.parameters.push(
    new ethereum.EventParam(
      "droposalTypeId",
      ethereum.Value.fromUnsignedBigInt(droposalTypeId)
    )
  )
  droposalTypeProposedEvent.parameters.push(
    new ethereum.EventParam("config", ethereum.Value.fromTuple(config))
  )

  return droposalTypeProposedEvent
}

export function createDroposalTypeSetEvent(
  droposalTypeId: BigInt,
  config: ethereum.Tuple
): DroposalTypeSet {
  let droposalTypeSetEvent = changetype<DroposalTypeSet>(newMockEvent())

  droposalTypeSetEvent.parameters = new Array()

  droposalTypeSetEvent.parameters.push(
    new ethereum.EventParam(
      "droposalTypeId",
      ethereum.Value.fromUnsignedBigInt(droposalTypeId)
    )
  )
  droposalTypeSetEvent.parameters.push(
    new ethereum.EventParam("config", ethereum.Value.fromTuple(config))
  )

  return droposalTypeSetEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createProposalCanceledEvent(
  proposalId: BigInt
): ProposalCanceled {
  let proposalCanceledEvent = changetype<ProposalCanceled>(newMockEvent())

  proposalCanceledEvent.parameters = new Array()

  proposalCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )

  return proposalCanceledEvent
}

export function createProposalCreatedEvent(
  proposalId: BigInt,
  proposer: Address,
  targets: Array<Address>,
  values: Array<BigInt>,
  signatures: Array<string>,
  calldatas: Array<Bytes>,
  startBlock: BigInt,
  endBlock: BigInt,
  description: string
): ProposalCreated {
  let proposalCreatedEvent = changetype<ProposalCreated>(newMockEvent())

  proposalCreatedEvent.parameters = new Array()

  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("proposer", ethereum.Value.fromAddress(proposer))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam("targets", ethereum.Value.fromAddressArray(targets))
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "values",
      ethereum.Value.fromUnsignedBigIntArray(values)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "signatures",
      ethereum.Value.fromStringArray(signatures)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "calldatas",
      ethereum.Value.fromBytesArray(calldatas)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "startBlock",
      ethereum.Value.fromUnsignedBigInt(startBlock)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endBlock",
      ethereum.Value.fromUnsignedBigInt(endBlock)
    )
  )
  proposalCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return proposalCreatedEvent
}

export function createProposalExecutedEvent(
  proposalId: BigInt
): ProposalExecuted {
  let proposalExecutedEvent = changetype<ProposalExecuted>(newMockEvent())

  proposalExecutedEvent.parameters = new Array()

  proposalExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )

  return proposalExecutedEvent
}

export function createProposalThresholdSetEvent(
  oldProposalThreshold: BigInt,
  newProposalThreshold: BigInt
): ProposalThresholdSet {
  let proposalThresholdSetEvent = changetype<ProposalThresholdSet>(
    newMockEvent()
  )

  proposalThresholdSetEvent.parameters = new Array()

  proposalThresholdSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldProposalThreshold",
      ethereum.Value.fromUnsignedBigInt(oldProposalThreshold)
    )
  )
  proposalThresholdSetEvent.parameters.push(
    new ethereum.EventParam(
      "newProposalThreshold",
      ethereum.Value.fromUnsignedBigInt(newProposalThreshold)
    )
  )

  return proposalThresholdSetEvent
}

export function createUpgradedEvent(implementation: Address): Upgraded {
  let upgradedEvent = changetype<Upgraded>(newMockEvent())

  upgradedEvent.parameters = new Array()

  upgradedEvent.parameters.push(
    new ethereum.EventParam(
      "implementation",
      ethereum.Value.fromAddress(implementation)
    )
  )

  return upgradedEvent
}

export function createVoteCastEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  reason: string
): VoteCast {
  let voteCastEvent = changetype<VoteCast>(newMockEvent())

  voteCastEvent.parameters = new Array()

  voteCastEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam(
      "support",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support))
    )
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam("weight", ethereum.Value.fromUnsignedBigInt(weight))
  )
  voteCastEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )

  return voteCastEvent
}

export function createVoteCastWithParamsEvent(
  voter: Address,
  proposalId: BigInt,
  support: i32,
  weight: BigInt,
  reason: string,
  params: Bytes
): VoteCastWithParams {
  let voteCastWithParamsEvent = changetype<VoteCastWithParams>(newMockEvent())

  voteCastWithParamsEvent.parameters = new Array()

  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("voter", ethereum.Value.fromAddress(voter))
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam(
      "proposalId",
      ethereum.Value.fromUnsignedBigInt(proposalId)
    )
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam(
      "support",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(support))
    )
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("weight", ethereum.Value.fromUnsignedBigInt(weight))
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("reason", ethereum.Value.fromString(reason))
  )
  voteCastWithParamsEvent.parameters.push(
    new ethereum.EventParam("params", ethereum.Value.fromBytes(params))
  )

  return voteCastWithParamsEvent
}

export function createVotingDelaySetEvent(
  oldVotingDelay: BigInt,
  newVotingDelay: BigInt
): VotingDelaySet {
  let votingDelaySetEvent = changetype<VotingDelaySet>(newMockEvent())

  votingDelaySetEvent.parameters = new Array()

  votingDelaySetEvent.parameters.push(
    new ethereum.EventParam(
      "oldVotingDelay",
      ethereum.Value.fromUnsignedBigInt(oldVotingDelay)
    )
  )
  votingDelaySetEvent.parameters.push(
    new ethereum.EventParam(
      "newVotingDelay",
      ethereum.Value.fromUnsignedBigInt(newVotingDelay)
    )
  )

  return votingDelaySetEvent
}

export function createVotingPeriodSetEvent(
  oldVotingPeriod: BigInt,
  newVotingPeriod: BigInt
): VotingPeriodSet {
  let votingPeriodSetEvent = changetype<VotingPeriodSet>(newMockEvent())

  votingPeriodSetEvent.parameters = new Array()

  votingPeriodSetEvent.parameters.push(
    new ethereum.EventParam(
      "oldVotingPeriod",
      ethereum.Value.fromUnsignedBigInt(oldVotingPeriod)
    )
  )
  votingPeriodSetEvent.parameters.push(
    new ethereum.EventParam(
      "newVotingPeriod",
      ethereum.Value.fromUnsignedBigInt(newVotingPeriod)
    )
  )

  return votingPeriodSetEvent
}
