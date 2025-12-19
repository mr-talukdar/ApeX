import { UserStatus, UserState } from "@/apex/types/user";

export function mapDbUserToUserState(dbUser: {
  id: string;
  status: string;
}): UserState {
  return {
    exists: true,
    status:
      dbUser.status === "ACTIVE" ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
  };
}
