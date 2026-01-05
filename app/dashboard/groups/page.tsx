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
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  const [pendingGroups, setPendingGroups] = useState<Set<string>>(new Set());

  const [selectedGroup, setSelectedGroup] = useState<ApiGroup | null>(null);
  const [members, setMembers] = useState<GroupMembership[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe);
  }, [mounted]);

  async function openGroup(group: ApiGroup) {
    setSelectedGroup(group);
    const data = await getGroupMembers(group.id);
    setMembers(data);
  }

  function renderAction(group: ApiGroup) {
    const justJoined = joinedGroups.has(group.id);
    const justPending = pendingGroups.has(group.id);
    const isOpenGroup = group.state.joinPolicy === "OPEN";

    // Show immediate feedback for just joined groups
    if (justJoined && isOpenGroup) {
      return <span className="text-sm text-green-600">Joined</span>;
    }

    if (justPending && !isOpenGroup) {
      return <span className="text-sm text-yellow-600">Request sent</span>;
    }

    // Check API state after refresh
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
      <Button size="sm" onClick={() => handleJoin(group.id, isOpenGroup)}>
        Join
      </Button>
    );
  }

  useEffect(() => {
    if (!mounted) return;

    async function loadGroups() {
      try {
        setLoading(true);
        const data = await getGroups();
        setGroups(data);
        // Clear local state after refresh since server state is now synced
        setJoinedGroups(new Set());
        setPendingGroups(new Set());
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, [mounted]);

  async function handleJoin(groupId: string, isOpenGroup: boolean) {
    try {
      setError(null);
      await joinGroup(groupId);

      // Immediately update local state based on group type for instant feedback
      if (isOpenGroup) {
        setJoinedGroups((prev) => new Set(prev).add(groupId));
      } else {
        setPendingGroups((prev) => new Set(prev).add(groupId));
      }

      // Refresh groups to sync with server state
      const data = await getGroups();
      setGroups(data);
      // Clear local state after refresh since server state is now synced
      setJoinedGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setPendingGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
    } catch (e: any) {
      // Remove from local state on error
      setJoinedGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setPendingGroups((prev) => {
        const next = new Set(prev);
        next.delete(groupId);
        return next;
      });
      setError(e.message || "Failed to join group");
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-4 border border-destructive/50 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
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

                  {group.membershipStatus === "ACTIVE" &&
                    me?.role === "ADMIN" && (
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
        </>
      )}

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
