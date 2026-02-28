// Activity log queries
// - logActivity, getRecentActivity, getActivityByUser, getActivityPaginated

export type ActivityType =
	| "practice_started"
	| "practice_completed"
	| "new_best_score"
	| "piece_started"
	| "mastery_reached";
