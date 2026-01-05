"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "next-auth/react";

export default function ProfileClient({ session }: { session: any }) {
  const user = session.user;
  const firstName = user?.name?.split(" ")[0] ?? "User";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback>{firstName[0]}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl">Welcome, {firstName}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>

          <Button asChild className="w-full">
            <Link href="/dashboard/rides">Go to Rides</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
