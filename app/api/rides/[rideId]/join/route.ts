import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getUserByEmail } from "@/lib/db/users";
import { getGroupById } from "@/lib/db/groups";
import { getMembership } from "@/lib/db/membership";
import { getRideById } from "@/lib/db/rides";
import {
  addRideParticipant,
  getRideParticipant,
} from "@/lib/db/rideParticipants";

import { mapDbUserToUserState } from "@/lib/domain/userMapper";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";
import { dbMembershipToMembershipMapper } from "@/lib/domain/membershipMapper";

import { canJoinRide } from "@/apex/core/canJoinRide";
import { RideParticipationStatus } from "@/apex/types/ride";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ rideId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { rideId } = await params;
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);
  const ride = await getRideById(rideId);
  const group = await getGroupById(ride.group_id);
  const membership = await getMembership(user.id, group.id);

  const apexUser = mapDbUserToUserState(user);
  const apexGroup = dbGroupToGroupStateMapper(group);
  const apexMembershipStatus = membership
    ? dbMembershipToMembershipMapper(membership)
    : null;

  const decision = canJoinRide(apexUser, apexGroup, apexMembershipStatus, {
    id: ride.id,
    groupId: ride.group_id,
    status: ride.status,
    startTime: new Date(ride.start_time),
  });

  if (!decision.allowed) {
    return NextResponse.json(decision, { status: 403 });
  }

  const existing = await getRideParticipant(ride.id, user.id);
  if (existing) {
    return NextResponse.json(
      { allowed: false, reason: "Already joined" },
      { status: 400 }
    );
  }

  await addRideParticipant(ride.id, user.id, RideParticipationStatus.JOINED);

  return NextResponse.json({ allowed: true });
}
