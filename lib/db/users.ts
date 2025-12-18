import { supabase } from "@/lib/db/supabase";

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error && error.code === "PGRST116") {
    throw error;
  }

  return data ?? null;
}

export async function createUser({
  email,
  name,
  avatarUrl,
}: {
  email: string;
  name: string;
  avatarUrl: string;
}) {
  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      name,
      avatar_url: avatarUrl,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
