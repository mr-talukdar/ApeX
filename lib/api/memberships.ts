export type GroupMembership = {
  id: string;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export async function getGroupMembers(
  groupId: string
): Promise<GroupMembership[]> {
  const res = await fetch(`/api/groups/${groupId}/members`);
  if (!res.ok) throw new Error("Failed to load members");
  return res.json();
}

export async function resolveMembership(
  membershipId: string,
  action: "APPROVE" | "REJECT"
) {
  const res = await fetch(`/api/memberships/${membershipId}/resolve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.reason ?? "Failed to resolve membership");
  }

  return data;
}
