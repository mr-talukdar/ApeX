export enum GroupJoinPolicy {
  OPEN = "OPEN",
  APPROVAL_REQUIRED = "APPROVAL_REQUIRED",
}

export type GroupState = {
  isActive: boolean;
  joinPolicy: GroupJoinPolicy;
};

export enum MembershipStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
