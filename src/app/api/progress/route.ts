// GET: Fetch user's piece progress
// POST: Update progress after a practice session

import { NextResponse } from "next/server";

export async function GET() {
	// TODO: Auth check, fetch user_piece_progress from DB
	return NextResponse.json(
		{ message: "Progress endpoint not implemented yet" },
		{ status: 501 },
	);
}

export async function POST() {
	// TODO: Auth check, parse body, update user_piece_progress in DB
	return NextResponse.json(
		{ message: "Progress endpoint not implemented yet" },
		{ status: 501 },
	);
}
