import { supabase } from "@/lib/db/supabase";

export const getGroups = async () => {
  const { data, error } = await supabase
    .from("groups")
    .select("id, name, is_active, join_policy");
  if (error) {
    throw error;
  }
  return data ?? null;
};

export const getGroupById = async (id: string) => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  return data ?? null;
};
