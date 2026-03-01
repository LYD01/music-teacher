// Full history log page with "See more" pagination
// Initial 10 on load, fetches next 20 per click

import { HistoryList } from "@_components";
import { auth } from "@_lib/auth-server";
import { getActivityPaginatedWithPieces } from "@_lib/db/queries/activity";
import { formatActivityMessage } from "@_utils/activity";

export default async function HistoryPage() {
	const { data: session } = await auth.getSession();
	if (!session?.user?.id) {
		return (
			<div>
				<h1 className="text-2xl font-bold text-foreground">Practice History</h1>
				<p className="mt-1 text-sm text-muted-foreground">Sign in to view your practice history.</p>
			</div>
		);
	}

	const rows = await getActivityPaginatedWithPieces(session.user.id, 10, 0);
	const initialActivities = rows.map((row) => ({
		id: row.id,
		type: row.activityType,
		message: formatActivityMessage(
			row.activityType,
			row.pieceTitle,
			row.metadata as Record<string, unknown> | null
		),
		createdAt: row.createdAt.toISOString(),
	}));

	return (
		<div>
			<h1 className="text-2xl font-bold text-foreground">Practice History</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Review all your past practice sessions and milestones.
			</p>

			<div className="mt-6">
				<HistoryList initialActivities={initialActivities} />
			</div>
		</div>
	);
}
