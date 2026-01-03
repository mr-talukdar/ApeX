import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getUserByEmail } from "@/lib/db/users";
import { getMembershipById, updateMembershipStatus } from "@/lib/db/membership";
import { getGroupById } from "@/lib/db/groups";

import { mapDbUserToUserState } from "@/lib/domain/userMapper";
import { dbMembershipToMembershipMapper } from "@/lib/domain/membershipMapper";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";

import { canResolveMembersips } from "@/apex/core/canResolveMembership";
import { MembershipStatus } from "@/apex/types/group";
import { resolveMembership } from "@/apex/core/resolveMembership";

export const POST = async (
  req: Request,
  context: { params: Promise<{ membershipId: string }> }
) => {
  const { membershipId } = await context.params;

  console.log("looking for membership with id:", membershipId);
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;
  console.log("Resolve action:", action);

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json(
      { allowed: false, reason: "User does not exist" },
      { status: 400 }
    );
  }

  const membership = await getMembershipById(membershipId);

  if (!membership) {
    return NextResponse.json(
      { allowed: false, reason: "Membership not found" },
      { status: 404 }
    );
  }

  const group = await getGroupById(membership.group_id);
  if (!group) {
    return NextResponse.json(
      { allowed: false, reason: "Group not found" },
      { status: 404 }
    );
  }

  const apexUser = mapDbUserToUserState(user);
  const apexMembershipStatus = dbMembershipToMembershipMapper(membership);
  const apexGroup = dbGroupToGroupStateMapper(group);

  const decision = canResolveMembersips(
    apexUser,
    apexMembershipStatus,
    apexGroup
  );

  if (!decision.allowed) {
    return NextResponse.json(decision, { status: 400 });
  }

  if (action !== "APPROVE" && action !== "REJECT") {
    return NextResponse.json(
      { allowed: false, reason: "Invalid action" },
      { status: 400 }
    );
  }

  const nextStatus =
    action === "APPROVE" ? MembershipStatus.ACTIVE : MembershipStatus.REJECTED;

  const resolveDecision = resolveMembership(apexMembershipStatus, nextStatus);

  if (!resolveDecision.allowed) {
    return NextResponse.json(resolveDecision, { status: 400 });
  }
  console.log("Next status being written:", nextStatus);

  await updateMembershipStatus(membershipId, nextStatus);

  return NextResponse.json({ allowed: true });
};
