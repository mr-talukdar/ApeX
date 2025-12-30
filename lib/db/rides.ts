import { supabase } from "./supabase";

export const createRide = async (
  groupId: number,
  title: string,
  description: string | null,
  startTime: string,
  status: string,
  createdBy: string
) => {
  const { data, error } = await supabase
    .from("rides")
    .insert([
      {
        group_id: groupId,
        title,
        description,
        start_time: startTime,
        status,
        created_by: createdBy,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getRidesByGroup = async (groupId: number) => {
  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("group_id", groupId)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data;
};

export const getRideById = async (rideId: string) => {
  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", rideId)
    .single();

  if (error) throw error;
  return data;
};
