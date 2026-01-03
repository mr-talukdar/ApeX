export type ApiGroup = {
  id: string;
  name: string;
  state: {
    isActive: boolean;
    joinPolicy: "OPEN" | "APPROVAL_REQUIRED";
  };
  membershipStatus: "NONE" | "PENDING" | "ACTIVE" | "REJECTED";
};

export async function getGroups(): Promise<ApiGroup[]> {
  const res = await fetch("/api/groups", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load groups");
  return res.json();
}

export async function joinGroup(groupId: string) {
  const res = await fetch(`/api/groups/${groupId}/join`, { method: "POST" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.reason ?? "Failed to join group");
  }

  return data;
}

export async function getMyGroups() {
  const res = await fetch("/api/groups", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load groups");
  return res.json();
}
