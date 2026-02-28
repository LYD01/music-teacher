import { and, desc, eq } from "drizzle-orm";
import { db } from "../client";
import { practiceSessions } from "../schema";

export async function createSession(data: {
	userId: string;
	pieceId: string;
	startedAt: Date;
	endedAt: Date;
	overallScore: number;
	pitchAccuracy: number;
	rhythmAccuracy: number;
	detectedNotes: unknown;
}) {
	const [session] = await db.insert(practiceSessions).values(data).returning();
	return session;
}

export async function getRecentSessions(userId: string, limit = 10) {
	return db
		.select()
		.from(practiceSessions)
		.where(eq(practiceSessions.userId, userId))
		.orderBy(desc(practiceSessions.startedAt))
		.limit(limit);
}

export async function getSessionsByPiece(userId: string, pieceId: string) {
	return db
		.select()
		.from(practiceSessions)
		.where(and(eq(practiceSessions.userId, userId), eq(practiceSessions.pieceId, pieceId)))
		.orderBy(desc(practiceSessions.startedAt));
}
