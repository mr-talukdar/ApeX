import { Decision } from "../types/decision";
import { GroupState, MembershipStatus, GroupJoinPolicy } from "../types/group";
import { UserState } from "../types/user";
import { isValidApexUser } from "./isValidApexUser";

export function canJoinGroup(
  userState: UserState,
  groupState: GroupState,
  membershipSatus: MembershipStatus
): Decision {
  const isValidUser = isValidApexUser(userState);
  if (!isValidUser.allowed) {
    return isValidUser;
  }

  if (!groupState.isActive) {
    return {
      allowed: false,
      reason: "Group is not active",
    };
  }

  if (membershipSatus !== MembershipStatus.NONE) {
    return {
      allowed: false,
      reason: "User is already a member or has applied",
    };
  }

  return {
    allowed: true,
  };
}
