"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  email: string;
  fullName: string;
  joinDate: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("currentUser");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <div className="space-y-8">
          <div className="border border-border rounded-lg p-8 bg-card">
            <div className="mb-6">
              <p className="text-muted-foreground text-sm mb-1">Welcome,</p>
              <h2 className="text-2xl font-semibold text-foreground">
                {user.fullName}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <p className="text-muted-foreground text-sm">Email Address</p>
                  <p className="text-foreground font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <p className="text-muted-foreground text-sm">Member Since</p>
                  <p className="text-foreground font-medium">
                    {new Date(user.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-border rounded-lg p-8 bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/"
                className="px-4 py-3 rounded-md border border-border text-foreground hover:bg-muted transition-colors text-center text-sm font-medium"
              >
                View Home
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 rounded-md border border-border text-foreground hover:bg-muted transition-colors text-center text-sm font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
