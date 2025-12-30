import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getUserByEmail } from "@/lib/db/users";
import { getGroupById } from "@/lib/db/groups";
import { getMembership } from "@/lib/db/membership";
import { createRide } from "@/lib/db/rides";

import { mapDbUserToUserState } from "@/lib/domain/userMapper";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";
import { dbMembershipToMembershipMapper } from "@/lib/domain/membershipMapper";

import { canCreateRide } from "@/apex/core/canCreateRide";
import { RideStatus } from "@/apex/types/ride";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { groupId, title, description, startTime } = body;

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const group = await getGroupById(groupId);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const membership = await getMembership(user.id, group.id);

  const apexUser = mapDbUserToUserState(user);
  const apexGroup = dbGroupToGroupStateMapper(group);
  const apexMembershipStatus = membership
    ? dbMembershipToMembershipMapper(membership)
    : null;

  console.log("DB membership status:", membership?.status);
  console.log("Mapped membership status:", apexMembershipStatus);

  const decision = canCreateRide(apexUser, apexGroup, apexMembershipStatus);

  if (!decision.allowed) {
    return NextResponse.json(decision, { status: 403 });
  }

  const ride = await createRide(
    groupId,
    title,
    description ?? null,
    startTime,
    RideStatus.OPEN,
    user.id
  );

  return NextResponse.json(ride);
}
