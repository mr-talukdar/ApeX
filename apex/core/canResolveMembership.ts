import { Decision } from "../types/decision";
import { UserState, UserRole } from "../types/user";
import { isValidApexUser } from "./isValidApexUser";
import { GroupState, MembershipStatus } from "../types/group";

export const canResolveMembersips = (
  actor: UserState,
  membershipSatus: MembershipStatus,
  group: GroupState
): Decision => {
  const isValidUser = isValidApexUser(actor);
  if (!isValidUser.allowed) {
    return isValidUser;
  }

  if (actor.role !== UserRole.ADMIN) {
    return {
      allowed: false,
      reason: "User is not an admin",
    };
  }

  if (!group.isActive) {
    return {
      allowed: false,
      reason: "Group is not active",
    };
  }

  if (membershipSatus !== MembershipStatus.PENDING) {
    return {
      allowed: false,
      reason: "only pending memberships can be resolved",
    };
  }

  return {
    allowed: true,
  };
};
