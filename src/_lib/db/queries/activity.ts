import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { activityLog, pieces } from "../schema";

export type ActivityType =
	| "practice_started"
	| "practice_completed"
	| "new_best_score"
	| "piece_started"
	| "mastery_reached";

export async function logActivity(
	userId: string,
	activityType: ActivityType,
	pieceId: string | null,
	metadata?: Record<string, unknown>
) {
	await db.insert(activityLog).values({
		userId,
		activityType,
		pieceId,
		metadata: metadata ?? null,
	});
}

export async function getRecentActivity(userId: string, limit = 10) {
	return db
		.select()
		.from(activityLog)
		.where(eq(activityLog.userId, userId))
		.orderBy(desc(activityLog.createdAt))
		.limit(limit);
}

/**
 * Returns recent activity with piece title for display.
 * Left joins pieces since pieceId can be null.
 */
export async function getRecentActivityWithPieces(userId: string, limit = 5) {
	return db
		.select({
			id: activityLog.id,
			activityType: activityLog.activityType,
			pieceId: activityLog.pieceId,
			metadata: activityLog.metadata,
			createdAt: activityLog.createdAt,
			pieceTitle: pieces.title,
		})
		.from(activityLog)
		.leftJoin(pieces, eq(activityLog.pieceId, pieces.id))
		.where(eq(activityLog.userId, userId))
		.orderBy(desc(activityLog.createdAt))
		.limit(limit);
}

export async function getActivityPaginated(userId: string, limit = 20, offset = 0) {
	return db
		.select()
		.from(activityLog)
		.where(eq(activityLog.userId, userId))
		.orderBy(desc(activityLog.createdAt))
		.limit(limit)
		.offset(offset);
}
