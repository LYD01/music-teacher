// Auth.js v5 catch-all API route
// Handles OAuth callbacks, session management, CSRF

// TODO: Import and export handlers from auth config
// import { handlers } from "@/lib/auth";
// export const { GET, POST } = handlers;

import { NextResponse } from "next/server";

export async function GET() {
	return NextResponse.json({ message: "Auth.js not configured yet" }, { status: 501 });
}

export async function POST() {
	return NextResponse.json({ message: "Auth.js not configured yet" }, { status: 501 });
}
