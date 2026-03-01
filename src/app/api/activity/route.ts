import { auth } from "@_lib/auth-server";
import { getActivityPaginatedWithPieces } from "@_lib/db/queries/activity";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
	const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10));

	const activity = await getActivityPaginatedWithPieces(session.user.id, limit, offset);
	return NextResponse.json(activity);
}
