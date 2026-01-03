import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getUserByEmail } from "@/lib/db/users";
import { getRideById } from "@/lib/db/rides";
import { getGroupById } from "@/lib/db/groups";
import { getMembership } from "@/lib/db/membership";

import { mapDbUserToUserState } from "@/lib/domain/userMapper";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";
import { dbMembershipToMembershipMapper } from "@/lib/domain/membershipMapper";

import { canRateRider } from "@/apex/core/canRateRider";
import { validateRideRating } from "@/apex/core/validateRideRating";
import { calculateRideScore } from "@/apex/core/calculateRideScore";
import { updateUserStats } from "@/apex/core/updateUserStats";
import { MembershipStatus } from "@/apex/types/group";

import { supabase } from "@/lib/db/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ rideId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { riderId, ratings } = body;

  // Fetch facts
  const actor = await getUserByEmail(session.user.email);
  if (!actor)
    return NextResponse.json({ error: "Actor not found" }, { status: 400 });

  const rideIdlocal = (await params).rideId;
  const ride = await getRideById(rideIdlocal);
  const group = await getGroupById(ride.group_id);

  const targetMembership = await getMembership(riderId, group.id);

  // Map to domain
  const apexActor = mapDbUserToUserState(actor);
  const apexGroup = dbGroupToGroupStateMapper(group);
  const apexTargetMembershipStatus = targetMembership
    ? dbMembershipToMembershipMapper(targetMembership)
    : null;

  const rideState = {
    id: ride.id,
    groupId: ride.group_id,
    status: ride.status,
    startTime: new Date(ride.start_time),
  };

  // Domain validation
  const ratingDecision = validateRideRating({
    riderId,
    rideId: ride.id,
    ratings,
  });
  if (!ratingDecision.allowed) {
    return NextResponse.json(ratingDecision, { status: 400 });
  }

  const permissionDecision = canRateRider(
    apexActor,
    apexGroup,
    rideState,
    apexTargetMembershipStatus ?? MembershipStatus.NONE
  );

  if (!permissionDecision.allowed) {
    return NextResponse.json(permissionDecision, { status: 403 });
  }

  // Calculate score
  const score = calculateRideScore({ riderId, rideId: ride.id, ratings });

  // Persist rating
  await supabase.from("ride_ratings").insert([
    {
      ride_id: ride.id,
      rider_id: riderId,
      rated_by: actor.id,
      ratings,
      score,
    },
  ]);

  // Update user stats
  const { data: currentStats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", riderId)
    .maybeSingle();

  const nextStats = currentStats
    ? updateUserStats(currentStats, score)
    : {
        userId: riderId,
        totalPoints: score,
        ridesCompleted: 1,
        averageScore: score,
      };

  await supabase.from("user_stats").upsert([
    {
      user_id: nextStats.userId,
      total_points: nextStats.totalPoints,
      rides_completed: nextStats.ridesCompleted,
      average_score: nextStats.averageScore,
    },
  ]);

  return NextResponse.json({ allowed: true, score });
}
