// Mix of Nouns and OZ style constants

import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const BIGINT_ZERO = BigInt.fromI32(0);
export const BIGINT_ONE = BigInt.fromI32(1);
export const BIGINT_FIVE = BigInt.fromI32(5);
export const BIGINT_HUNDRED = BigInt.fromI32(100);
export const BIGINT_10K = BigInt.fromI32(10000);
export const BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export const FIXED_PRICE_MINTER_ADDRESS = "0x04E2516A2c207E84a1839755675dfd8eF6302F0a";

export const GOVERNANCE_NAME = "OZGovernor";
export namespace GovernanceFrameworkType {
  export const OPENZEPPELIN_GOVERNOR = "OZGovernor";
}

export const NOUNS_STATUS_PENDING = "PENDING";
export const NOUNS_STATUS_CANCELLED = "CANCELLED";
export const NOUNS_STATUS_VETOED = "VETOED";
export const NOUNS_STATUS_EXECUTED = "EXECUTED";
export const NOUNS_STATUS_QUEUED = "QUEUED";
export const NOUNS_STATUS_ACTIVE = "ACTIVE";

export namespace DroposalState {
  export const PENDING = "PENDING";
  export const ACTIVE = "ACTIVE";
  export const CANCELED = "CANCELED";
  export const DEFEATED = "DEFEATED";
  export const SUCCEEDED = "SUCCEEDED";
  export const QUEUED = "QUEUED";
  export const EXPIRED = "EXPIRED";
  export const EXECUTED = "EXECUTED";
}

export namespace VoteChoice {
  export const AGAINST_VALUE = 0;
  export const FOR_VALUE = 1;
  export const ABSTAIN_VALUE = 2;
  export const AGAINST = "AGAINST";
  export const FOR = "FOR";
  export const ABSTAIN = "ABSTAIN";
}
