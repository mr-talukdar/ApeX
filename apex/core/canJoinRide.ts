import { Decision } from "../types/decision";
import { UserState } from "../types/user";
import { isValidApexUser } from "./isValidApexUser";
import { MembershipStatus } from "../types/group";
import { GroupState } from "../types/group";
import { RideState, RideStatus } from "../types/ride";

export const canJoinRide = (
  userState: UserState,
  groupState: GroupState,
  membershipStatus: MembershipStatus | null,
  rideState: RideState
): Decision => {
  const isValidUser = isValidApexUser(userState);
  if (!isValidUser.allowed) {
    return isValidUser;
  }

  if (membershipStatus !== MembershipStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "User is not a active group member",
    };
  }

  if (!groupState.isActive) {
    return {
      allowed: false,
      reason: "Group is not active",
    };
  }

  if (rideState.status !== RideStatus.OPEN) {
    return {
      allowed: false,
      reason: "Ride is not open",
    };
  }

  return {
    allowed: true,
  };
};
