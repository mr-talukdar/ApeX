import { UserState, UserStatus } from "../types/user";
import { Decision } from "../types/decision";

export function isValidApexUser(userState: UserState): Decision {
  if (!userState.exists) {
    return {
      allowed: false,
      reason: "User does not exist",
    };
  }
  if (userState.status === UserStatus.SUSPENDED) {
    return {
      allowed: false,
      reason: "User is suspended",
    };
  }
  return {
    allowed: true,
  };
}
