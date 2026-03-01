// GET: Fetch user's piece progress
// POST: Update progress after a practice session (handled via sessions API)

import { auth } from "@_lib/auth-server";
import { getProgressByUser, getProgressForPiece } from "@_lib/db/queries/progress";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const pieceId = searchParams.get("pieceId");

	if (pieceId) {
		const progress = await getProgressForPiece(session.user.id, pieceId);
		return NextResponse.json(progress ?? { message: "No progress yet" });
	}

	const progress = await getProgressByUser(session.user.id);
	return NextResponse.json(progress);
}
