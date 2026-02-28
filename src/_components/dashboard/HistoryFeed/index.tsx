// Compact recent activity feed for the dashboard parallel route

interface ActivityItem {
	id: string;
	type: string;
	message: string;
	createdAt: Date;
}

interface HistoryFeedProps {
	activities: ActivityItem[];
	className?: string;
}

export function HistoryFeed({ activities, className = "" }: HistoryFeedProps) {
	return (
		<div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
			<h3 className="mb-3 text-sm font-semibold text-foreground">Recent Activity</h3>
			{activities.length === 0 ? (
				<p className="text-sm text-muted-foreground">No activity yet. Start practicing!</p>
			) : (
				<ul className="space-y-2">
					{activities.map((item) => (
						<li key={item.id} className="text-sm text-muted-foreground">
							{item.message}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
