import { auth } from "@_lib/auth-server";
import { db } from "@_lib/db";
import { logActivity } from "@_lib/db/queries/activity";
import { updateProgressAfterSession } from "@_lib/db/queries/progress";
import { createSession, getRecentSessions, getSessionsByPiece } from "@_lib/db/queries/sessions";
import { users } from "@_lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function ensureUser(user: {
	id: string;
	email: string;
	name?: string | null;
	image?: string | null;
}) {
	const existing = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, user.id))
		.limit(1);

	if (existing.length > 0) return;

	await db
		.insert(users)
		.values({
			id: user.id,
			email: user.email,
			name: user.name ?? null,
			image: user.image ?? null,
		})
		.onConflictDoNothing();
}

export async function GET(request: Request) {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const pieceId = searchParams.get("pieceId");
	const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10), 50);

	const sessions = pieceId
		? await getSessionsByPiece(session.user.id, pieceId)
		: await getRecentSessions(session.user.id, limit);

	return NextResponse.json(sessions);
}

export async function POST(request: Request) {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await ensureUser(session.user);
	const userId = session.user.id;

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const {
		pieceId,
		startedAt,
		endedAt,
		overallScore,
		pitchAccuracy,
		rhythmAccuracy,
		detectedNotes,
	} = body as {
		pieceId?: string;
		startedAt?: string;
		endedAt?: string;
		overallScore?: number;
		pitchAccuracy?: number;
		rhythmAccuracy?: number;
		detectedNotes?: unknown;
	};

	if (!pieceId || !startedAt || !endedAt) {
		return NextResponse.json(
			{ error: "Missing required fields: pieceId, startedAt, endedAt" },
			{ status: 400 }
		);
	}

	try {
		const practiceSession = await createSession({
			userId,
			pieceId,
			startedAt: new Date(startedAt),
			endedAt: new Date(endedAt),
			overallScore: overallScore ?? 0,
			pitchAccuracy: pitchAccuracy ?? 0,
			rhythmAccuracy: rhythmAccuracy ?? 0,
			detectedNotes: detectedNotes ?? [],
		});

		const progress = await updateProgressAfterSession(userId, pieceId, overallScore ?? 0);

		await logActivity(userId, "practice_completed", pieceId, {
			sessionId: practiceSession.id,
			score: overallScore,
			pitchAccuracy,
			rhythmAccuracy,
		});

		if (progress.isNewBest && progress.totalSessions > 1) {
			await logActivity(userId, "new_best_score", pieceId, {
				score: overallScore,
			});
		}

		if (progress.masteryLevel === "mastered" && progress.totalSessions >= 4) {
			await logActivity(userId, "mastery_reached", pieceId, {
				score: overallScore,
			});
		}

		return NextResponse.json({
			sessionId: practiceSession.id,
			progress: {
				bestScore: progress.bestScore,
				avgScore: progress.avgScore,
				totalSessions: progress.totalSessions,
				masteryLevel: progress.masteryLevel,
				isNewBest: progress.isNewBest,
			},
		});
	} catch (err) {
		console.error("Failed to save practice session:", err);
		return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
	}
}
