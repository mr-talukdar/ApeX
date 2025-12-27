import { UserStatus, UserState, UserRole } from "@/apex/types/user";

export function mapDbUserToUserState(dbUser: {
  id: string;
  status: string;
  role: string;
}): UserState {
  return {
    exists: true,
    status:
      dbUser.status === "ACTIVE" ? UserStatus.ACTIVE : UserStatus.SUSPENDED,
    role: dbUser.role as UserRole,
  };
}
