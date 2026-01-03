import { supabase } from "./supabase";

export const createRide = async (
  groupId: string,
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

export const getRidesByGroup = async (groupId: string) => {
  if (!groupId) return [];

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .eq("group_id", groupId)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
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
export const getRidesByUserGroups = async (groupIds: string[]) => {
  if (!groupIds.length) return [];

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .in("group_id", groupIds)
    .order("start_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

// lib/db/rides.ts
export const getRidesWithParticipation = async (
  userId: string,
  groupIds: string[]
) => {
  if (!groupIds.length) return [];

  const { data, error } = await supabase
    .from("rides")
    .select(
      `
      id,
      title,
      description,
      status,
      start_time,
      group_id,
      participants:ride_participants(status)
    `
    )
    .in("group_id", groupIds)
    .eq("ride_participants.user_id", userId);

  if (error) throw error;

  return data.map((ride) => ({
    ...ride,
    isJoined: ride.participants.length > 0,
  }));
};
