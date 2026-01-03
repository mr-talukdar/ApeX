import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-background">
        <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-semibold">
              APEX
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/dashboard/rides"
                className="text-muted-foreground hover:text-foreground"
              >
                Rides
              </Link>
              <Link
                href="/dashboard/groups"
                className="text-muted-foreground hover:text-foreground"
              >
                Groups
              </Link>
              <Link
                href="/dashboard/profile"
                className="text-muted-foreground hover:text-foreground"
              >
                Profile
              </Link>
            </nav>
          </div>

          <form action="/api/auth/signout" method="post">
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 bg-background">{children}</main>
    </div>
  );
}
