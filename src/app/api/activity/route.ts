import { auth } from "@_lib/auth-server";
import { getRecentActivity } from "@_lib/db/queries/activity";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);

	const activity = await getRecentActivity(session.user.id, limit);
	return NextResponse.json(activity);
}
