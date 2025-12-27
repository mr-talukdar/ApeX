import { Decision } from "../types/decision";
import { MembershipStatus } from "../types/group";

export const resolveMembership = (
  membershipSatus: MembershipStatus,
  nextStatus: MembershipStatus
): Decision => {
  if (membershipSatus !== MembershipStatus.PENDING) {
    return {
      allowed: false,
      reason: "only pending memberships can be resolved",
    };
  }

  if (
    nextStatus !== MembershipStatus.ACTIVE &&
    nextStatus !== MembershipStatus.REJECTED
  ) {
    return {
      allowed: false,
      reason: "invalid next membership status",
    };
  }

  return {
    allowed: true,
  };
};
