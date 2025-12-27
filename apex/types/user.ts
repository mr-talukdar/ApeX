export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export type UserState = {
  exists: boolean;
  status: UserStatus;
  role: UserRole;
};

export enum UserRole {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}
