import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserByEmail } from "@/lib/db/users";
import { getGroupById } from "@/lib/db/groups";
import { mapDbUserToUserState } from "@/lib/domain/userMapper";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";

import { getGroupMembersWithUser } from "@/lib/db/membership";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const { groupId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const actor = await getUserByEmail(session.user.email);
  const group = await getGroupById(groupId);
  if (!actor || !group) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const apexActor = mapDbUserToUserState(actor);
  const apexGroup = dbGroupToGroupStateMapper(group);

  const members = await getGroupMembersWithUser(groupId);

  // Only admins can see this
  if (apexActor.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(members);
}
