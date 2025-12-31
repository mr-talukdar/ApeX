import { Decision } from "../types/decision";
import { UserState, UserRole } from "../types/user";
import { isValidApexUser } from "./isValidApexUser";
import { GroupState } from "../types/group";
import { RideState, RideStatus } from "../types/ride";
import { MembershipStatus } from "../types/group";

export const canRateRider = (
  user: UserState,
  group: GroupState,
  rideState: RideState,
  membershipStatus: MembershipStatus
): Decision => {
  const isValidUser = isValidApexUser(user);
  if (!isValidUser.allowed) {
    return isValidUser;
  }

  if (user.role !== UserRole.ADMIN) {
    return {
      allowed: false,
      reason: "User is not an admin, only admins can rate riders",
    };
  }

  if (!group.isActive) {
    return {
      allowed: false,
      reason: "Group is not active, cant rate a rider in an inactive group",
    };
  }

  if (membershipStatus !== MembershipStatus.ACTIVE) {
    return {
      allowed: false,
      reason: "User is not a active group member to rate a rider",
    };
  }

  if (rideState.status !== RideStatus.CLOSED) {
    return {
      allowed: false,
      reason: "Ride is not closed yet",
    };
  }

  return {
    allowed: true,
  };
};
