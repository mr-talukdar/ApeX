"use client";

import { useEffect, useState } from "react";
import { ApiGroup, getGroups, joinGroup } from "@/lib/api/groups";
import { Button } from "@/components/ui/button";
import {
  GroupMembership,
  getGroupMembers,
  resolveMembership,
} from "@/lib/api/memberships";

export default function GroupsPage() {
  const [groups, setGroups] = useState<ApiGroup[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<ApiGroup | null>(null);
  const [members, setMembers] = useState<GroupMembership[]>([]);

  async function openGroup(group: ApiGroup) {
    setSelectedGroup(group);
    const data = await getGroupMembers(group.id);
    setMembers(data);
  }

  function renderAction(group: ApiGroup) {
    if (group.membershipStatus === "ACTIVE") {
      return <span className="text-sm text-green-600">Member</span>;
    }

    if (group.membershipStatus === "PENDING") {
      return <span className="text-sm text-yellow-600">Pending approval</span>;
    }

    if (group.membershipStatus === "REJECTED") {
      return <span className="text-sm text-destructive">Rejected</span>;
    }

    return (
      <Button size="sm" onClick={() => handleJoin(group.id)}>
        Join
      </Button>
    );
  }

  useEffect(() => {
    getGroups().then(setGroups);
  }, []);

  async function handleJoin(groupId: string) {
    try {
      await joinGroup(groupId);
      alert("Request sent!");
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function reloadMembers() {
    if (!selectedGroup) return;
    const data = await getGroupMembers(selectedGroup.id);
    setMembers(data);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Groups</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold">{group.name}</h2>
              <p className="text-sm text-muted-foreground">
                {group.state.joinPolicy === "OPEN"
                  ? "Open membership"
                  : "Approval required"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {renderAction(group)}

              {group.membershipStatus === "ACTIVE" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openGroup(group)}
                >
                  Manage
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedGroup && (
        <div className="mt-10 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Members of {selectedGroup.name}
          </h2>

          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {m.user?.name ?? "Unknown user"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {m.user?.email ?? ""}
                  </span>
                </div>

                {m.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        await resolveMembership(m.id, "APPROVE");
                        await reloadMembers();
                      }}
                    >
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        await resolveMembership(m.id, "REJECT");
                        await reloadMembers();
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {m.status !== "PENDING" && (
                  <span className="text-sm text-muted-foreground">
                    {m.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
