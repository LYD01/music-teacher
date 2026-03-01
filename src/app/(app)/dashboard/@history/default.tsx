// Parallel route: recent activity feed (top 5)
// Loads independently alongside @progress

import { HistoryFeed } from "@_components";
import { auth } from "@_lib/auth-server";
import { getRecentActivityWithPieces } from "@_lib/db/queries/activity";
import { formatActivityMessage } from "@_utils/activity";

export default async function HistorySlot() {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return (
			<div className="rounded-xl border border-border bg-card p-6">
				<p className="text-sm text-muted-foreground">Sign in to see your activity.</p>
			</div>
		);
	}

	const rows = await getRecentActivityWithPieces(session.user.id, 5);
	const activities = rows.map((row) => ({
		id: row.id,
		type: row.activityType,
		message: formatActivityMessage(
			row.activityType,
			row.pieceTitle,
			row.metadata as Record<string, unknown> | null
		),
		createdAt: row.createdAt,
	}));

	return <HistoryFeed activities={activities} />;
}
