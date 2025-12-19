import { getGroups } from "@/lib/db/groups";
import { dbGroupToGroupStateMapper } from "@/lib/domain/groupMapper";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let groups = await getGroups();

  const response = groups.map((group) => ({
    id: group.id,
    name: group.name,
    state: dbGroupToGroupStateMapper(group),
  }));

  return NextResponse.json(response);
};
