"use client";

import { useEffect, useState } from "react";
import { ApiRide, getRides, joinRide } from "@/lib/api/rides";
import { Button } from "@/components/ui/button";
import { getMyGroups } from "@/lib/api/groups";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function RideCard({ ride, onUpdate }: { ride: ApiRide; onUpdate: () => void }) {
  const [joining, setJoining] = useState(false);

  async function handleJoin() {
    try {
      setJoining(true);
      await joinRide(ride.id);
      await onUpdate();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">{ride.title}</h3>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            ride.status === "OPEN"
              ? "bg-accent/10 text-accent"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {ride.status}
        </span>
      </div>

      <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
        {ride.description}
      </p>

      <div className="mb-6 space-y-1 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium">📅</span>
          <span>{formatDate(ride.start_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">🕐</span>
          <span>{formatTime(ride.start_time)}</span>
        </div>
      </div>

      <button
        onClick={handleJoin}
        disabled={ride.status !== "OPEN" || joining || ride.isJoined}
        className={`w-full px-4 py-2.5 rounded-md font-medium transition-colors ${
          ride.status === "OPEN"
            ? "bg-accent text-accent-foreground hover:opacity-90"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        {ride.isJoined
          ? "Joined"
          : ride.status === "OPEN"
          ? "Join Ride"
          : "Ride Closed"}
      </button>
    </div>
  );
}

export default function RidesPage() {
  const [rides, setRides] = useState<ApiRide[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe);
    getMyGroups().then(setGroups);
  }, []);

  const canCreate =
    me?.role === "ADMIN" && groups.some((g) => g.membershipStatus === "ACTIVE");

  async function loadRides() {
    const data = await getRides();
    setRides(data);
  }

  useEffect(() => {
    loadRides();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Upcoming Rides
          </h1>
          <p className="text-muted-foreground">
            Join your community for exciting group rides
          </p>
        </div>

        {canCreate && (
          <Button onClick={() => setShowForm(true)}>Create Ride</Button>
        )}
        {showForm && (
          <CreateRideForm
            onClose={() => setShowForm(false)}
            onCreated={loadRides}
          />
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} onUpdate={loadRides} />
          ))}
        </div>
      </div>
    </main>
  );
}

function CreateRideForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [groupId, setGroupId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    getMyGroups().then(setGroups);
  }, []);

  async function submit() {
    try {
      setLoading(true);

      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, groupId, startTime }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.reason ?? "Failed to create ride");
      if (!groupId) {
        alert("Select a group");
        return;
      }

      onCreated();
      onClose();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-10 border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4">Create Ride</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Ride title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="border rounded px-3 py-2"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        >
          <option value="">Select group</option>
          {groups
            .filter((g) => g.membershipStatus === "ACTIVE")
            .map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
        </select>

        <input
          type="datetime-local"
          className="border rounded px-3 py-2"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />

        <textarea
          className="border rounded px-3 py-2 md:col-span-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button onClick={submit} disabled={loading}>
          Create
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
