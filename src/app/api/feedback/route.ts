// POST: Proxy to local Ollama instance for AI teacher feedback
// Accepts practice session data, returns encouragement + suggestions

import { NextResponse } from "next/server";

export async function POST() {
	// TODO: Parse request body, build prompt, call Ollama, return response
	return NextResponse.json(
		{ message: "Ollama feedback endpoint not implemented yet" },
		{ status: 501 },
	);
}
