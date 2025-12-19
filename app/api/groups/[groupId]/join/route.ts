import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getUserByEmail } from "@/lib/db/users";
import { getGroupById } from "@/lib/db/groups";
import { getMembership, createMembership } from "@/lib/db/membership";

import { mapDbUserToUserState } from "@/lib/domain/userMapper";
import { dbGroupToGroupStateMapper as mapDbGroupToGroupState } from "@/lib/domain/groupMapper";
import { dbMembershipToMembershipMapper as mapDbMembershipToMembershipStatus } from "@/lib/domain/membershipMapper";

import { canJoinGroup } from "@/apex/core/canJoinGroup";
import { GroupJoinPolicy, MembershipStatus } from "@/apex/types/group";

export async function POST(
  _req: Request,
  context: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { groupId } = await context.params;
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json(
      { allowed: false, reason: "User does not exist" },
      { status: 400 }
    );
  }

  const group = await getGroupById(groupId);
  if (!group) {
    return NextResponse.json(
      { allowed: false, reason: "Group not found" },
      { status: 404 }
    );
  }

  const membership = await getMembership(user.id, group.id);

  const apexUser = mapDbUserToUserState(user);
  const apexGroup = mapDbGroupToGroupState(group);

  const apexMembershipStatus = membership
    ? mapDbMembershipToMembershipStatus(membership)
    : MembershipStatus.NONE;

  const decision = canJoinGroup(apexUser, apexGroup, apexMembershipStatus);

  if (!decision.allowed) {
    return NextResponse.json(decision, { status: 400 });
  }

  await createMembership(
    user.id,
    group.id,
    apexGroup.joinPolicy === GroupJoinPolicy.OPEN
      ? MembershipStatus.ACTIVE
      : MembershipStatus.PENDING
  );

  return NextResponse.json({ allowed: true });
}
