import { getGroups } from "@/lib/db/groups";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getMembership } from "@/lib/db/membership";
import { getUserByEmail } from "@/lib/db/users";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const groups = await getGroups();

  const response = await Promise.all(
    groups.map(async (group) => {
      const membership = await getMembership(user.id, group.id);

      return {
        id: group.id,
        name: group.name,
        state: dbGroupToGroupStateMapper(group),
        membershipStatus: membership?.status ?? "NONE",
      };
    })
  );

  return NextResponse.json(response);
};
