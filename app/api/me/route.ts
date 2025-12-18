import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getUserByEmail, createUser } from "@/lib/db/users";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user?.email!;
  const name = session.user?.name!;
  const avatarUrl = session.user?.image!;

  let user = await getUserByEmail(email);

  if (!user) {
    user = await createUser({ email, name, avatarUrl });
  }

  return NextResponse.json(user);
}
