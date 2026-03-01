// Shared activity formatting for dashboard and history page

export function formatActivityMessage(
	activityType: string,
	pieceTitle: string | null,
	metadata: Record<string, unknown> | null
): string {
	const piece = pieceTitle ?? "a piece";
	const score = metadata?.score as number | undefined;
	const scoreStr = score != null ? ` ${Math.round(score)}%` : "";

	switch (activityType) {
		case "practice_completed":
			return `Practiced ${piece}${scoreStr ? ` - Score:${scoreStr}` : ""}`;
		case "new_best_score":
			return `New personal best on ${piece}!${scoreStr}`;
		case "piece_started":
			return `Started learning ${piece}`;
		case "mastery_reached":
			return `Mastered ${piece}`;
		default:
			return `Activity: ${piece}`;
	}
}
