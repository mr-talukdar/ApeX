import { GroupState, GroupJoinPolicy } from "@/apex/types/group";

export const dbGroupToGroupStateMapper = (dbGroup: {
  name: string;
  is_active: boolean;
  join_policy: string;
}): GroupState => {
  return {
    isActive: dbGroup.is_active,
    joinPolicy:
      dbGroup.join_policy === "OPEN"
        ? GroupJoinPolicy.OPEN
        : GroupJoinPolicy.APPROVAL_REQUIRED,
  };
};
