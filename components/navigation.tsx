"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:text-accent transition-colors"
          >
            Apex System
          </Link>
          <div className="flex gap-8">
            <Link
              href="/"
              className={`text-sm ${
                pathname === "/"
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              } transition-colors`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm ${
                pathname === "/about"
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              } transition-colors`}
            >
              About
            </Link>
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
          </div>
        </div>
      </div>
    </nav>
  );
}
