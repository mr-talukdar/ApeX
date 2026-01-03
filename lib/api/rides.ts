export type ApiRide = {
  id: string;
  title: string;
  description: string | null;
  status: "OPEN" | "CLOSED";
  start_time: string;
  group_id: string;
  isJoined: boolean;
};

export async function getRides(): Promise<ApiRide[]> {
  const res = await fetch("/api/rides", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch rides");
  }

  return res.json();
}

export async function joinRide(rideId: string) {
  const res = await fetch(`/api/rides/${rideId}/join`, {
    method: "POST",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.reason ?? "Failed to join ride");
  }

  return data;
}
