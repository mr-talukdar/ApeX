"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function AuthNavLink() {
  const pathname = usePathname();
  const { status, data: session } = useSession();

  // While session is loading, render nothing (prevents flicker)
  if (status === "loading") return null;

  // If NOT logged in → show Login
  if (status === "unauthenticated") {
    return (
      <Link
        href="/login"
        className={`text-sm ${
          pathname === "/login"
            ? "text-accent"
            : "text-muted-foreground hover:text-foreground"
        } transition-colors`}
      >
        Login
      </Link>
    );
  }

  // If logged in → show Logout
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <span className="px-2 py-0.5 rounded-full bg-muted text-foreground font-medium">
        {session?.user?.name?.split(" ")[0]}
      </span>
      <span className="opacity-70 hover:opacity-100">Logout</span>
    </button>
  );
}
