import { and, desc, eq } from "drizzle-orm";
import { db } from "../client";
import { pieces, userPieceProgress } from "../schema";

function computeMasteryLevel(totalSessions: number, avgScore: number): string {
	if (totalSessions <= 3) return "learning";
	if (avgScore < 70) return "practicing";
	if (avgScore < 90) return "comfortable";
	return "mastered";
}

export async function getProgressForPiece(userId: string, pieceId: string) {
	const rows = await db
		.select()
		.from(userPieceProgress)
		.where(and(eq(userPieceProgress.userId, userId), eq(userPieceProgress.pieceId, pieceId)))
		.limit(1);
	return rows[0] ?? null;
}

export async function getProgressByUser(userId: string) {
	return db.select().from(userPieceProgress).where(eq(userPieceProgress.userId, userId));
}

/**
 * Returns top N pieces by best score for a user, with piece details.
 * Excludes pieces with no bestScore.
 */
export async function getTopScoresByUser(userId: string, limit = 3) {
	const rows = await db
		.select({
			pieceId: userPieceProgress.pieceId,
			bestScore: userPieceProgress.bestScore,
			avgScore: userPieceProgress.avgScore,
			totalSessions: userPieceProgress.totalSessions,
			masteryLevel: userPieceProgress.masteryLevel,
			lastPracticed: userPieceProgress.lastPracticed,
			pieceTitle: pieces.title,
			pieceComposer: pieces.composer,
		})
		.from(userPieceProgress)
		.innerJoin(pieces, eq(userPieceProgress.pieceId, pieces.id))
		.where(eq(userPieceProgress.userId, userId))
		.orderBy(desc(userPieceProgress.bestScore))
		.limit(limit);
	return rows.filter((r) => r.bestScore != null);
}

/**
 * Upserts progress for a user+piece after a practice session.
 * Recalculates running average, checks for new best, updates mastery level.
 * Returns the updated progress and whether this was a new personal best.
 */
export async function updateProgressAfterSession(userId: string, pieceId: string, score: number) {
	const existing = await getProgressForPiece(userId, pieceId);

	if (existing) {
		const prevTotal = existing.totalSessions ?? 0;
		const newTotal = prevTotal + 1;
		const newAvg = ((existing.avgScore ?? 0) * prevTotal + score) / newTotal;
		const newBest = Math.max(existing.bestScore ?? 0, score);
		const masteryLevel = computeMasteryLevel(newTotal, newAvg);

		await db
			.update(userPieceProgress)
			.set({
				bestScore: newBest,
				avgScore: Math.round(newAvg * 10) / 10,
				totalSessions: newTotal,
				masteryLevel,
				lastPracticed: new Date(),
			})
			.where(and(eq(userPieceProgress.userId, userId), eq(userPieceProgress.pieceId, pieceId)));

		return {
			bestScore: newBest,
			avgScore: Math.round(newAvg * 10) / 10,
			totalSessions: newTotal,
			masteryLevel,
			isNewBest: score > (existing.bestScore ?? 0),
		};
	}

	const masteryLevel = computeMasteryLevel(1, score);

	await db.insert(userPieceProgress).values({
		userId,
		pieceId,
		bestScore: score,
		avgScore: score,
		totalSessions: 1,
		masteryLevel,
		lastPracticed: new Date(),
	});

	return {
		bestScore: score,
		avgScore: score,
		totalSessions: 1,
		masteryLevel,
		isNewBest: true,
	};
}
