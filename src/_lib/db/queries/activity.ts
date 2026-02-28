import { desc, eq } from "drizzle-orm";
import { db } from "../client";
import { activityLog } from "../schema";

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
