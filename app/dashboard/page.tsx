import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;
  const firstName = user?.name?.split(" ")[0] ?? "User";

  console.log(user?.image);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center space-y-3">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.image?.toString()} alt={user?.name ?? ""} />
            <AvatarFallback>{firstName.charAt(0)}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl">Welcome, {firstName}</CardTitle>

          <CardDescription className="text-sm">{user?.email}</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4 pt-6">
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="outline" className="w-full">
              Logout
            </Button>
          </form>

          <Button asChild className="w-full">
            <Link href="/">Go to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
