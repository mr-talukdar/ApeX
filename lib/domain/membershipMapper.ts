import { MembershipStatus } from "@/apex/types/group";

export const dbMembershipToMembershipMapper = (dbMembership: {
  id: string;
  user_id: string;
  group_id: string;
  status: string;
}): MembershipStatus => {
  switch (dbMembership.status) {
    case "ACCEPTED":
      return MembershipStatus.ACCEPTED;
    case "PENDING":
      return MembershipStatus.PENDING;
    case "REJECTED":
      return MembershipStatus.REJECTED;
    default:
      return MembershipStatus.REJECTED;
  }
};
