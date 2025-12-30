import { UserRole, UserState } from "../types/user";
import { Decision } from "../types/decision";
import { isValidApexUser } from "./isValidApexUser";

import { GroupState, MembershipStatus } from "../types/group";

export const canCreateRide = (
  userState: UserState,
  groupState: GroupState,
  membershipStatus: MembershipStatus | null
): Decision => {
  const isValidUser = isValidApexUser(userState);
  if (!isValidUser.allowed) {
    return isValidUser;
  }
  if (userState.role !== UserRole.ADMIN) {
    return {
      allowed: false,
      reason: "User is not an admin, only admins can create rides",
    };
  }
  if (!groupState.isActive) {
    return {
      allowed: false,
      reason: "Group is not active",
    };
  }
  if (membershipStatus !== MembershipStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "User is not a active group member",
    };
  }
  return {
    allowed: true,
  };
};
