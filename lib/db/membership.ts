import { supabase } from "@/lib/db/supabase";
import { DbMembership } from "@/apex/types/membership";

export const getMembership = async (
  userId: string,
  groupId: string
): Promise<DbMembership | null> => {
  const { data, error } = await supabase
    .from("group_memberships")
    .select("id, user_id, group_id, status")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data ?? null;
};

export const createMembership = async (
  userId: string,
  groupId: string,
  status: string
): Promise<void> => {
  const { error } = await supabase.from("group_memberships").insert({
    user_id: userId,
    group_id: groupId,
    status: status,
  });
  if (error) {
    throw error;
  }
};
