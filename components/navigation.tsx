"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";

export default function Navigation() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `relative text-sm transition-colors ${
      pathname === path
        ? "text-foreground font-medium after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-accent"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight hover:text-accent transition-colors"
          >
            ApeX System
          </Link>

          <div className="flex items-center gap-8">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>

            <Link href="/about" className={linkClass("/about")}>
              About
            </Link>

            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
