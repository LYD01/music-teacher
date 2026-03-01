// Parallel route: top 3 scores (default slot)
// Loads independently alongside @history

import { TopScoresCard } from "@_components";
import { auth } from "@_lib/auth-server";
import { getTopScoresByUser } from "@_lib/db/queries/progress";

export default async function ProgressSlot() {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return (
			<div className="rounded-xl border border-border bg-card p-6">
				<p className="text-sm text-muted-foreground">Sign in to see your top scores.</p>
			</div>
		);
	}

	const rows = await getTopScoresByUser(session.user.id, 3);
	const scores = rows.map((row) => ({
		pieceId: row.pieceId,
		pieceTitle: row.pieceTitle,
		pieceComposer: row.pieceComposer,
		bestScore: row.bestScore ?? 0,
		avgScore: row.avgScore,
		totalSessions: row.totalSessions,
		masteryLevel: row.masteryLevel as "learning" | "practicing" | "comfortable" | "mastered" | null,
		lastPracticed: row.lastPracticed,
	}));

	return <TopScoresCard scores={scores} />;
}
