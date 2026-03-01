// Compact recent activity feed for the dashboard parallel route
// Shows top 5 activities with type-specific icons and relative time

import Link from "next/link";

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

function formatRelativeTime(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	const diffHours = Math.floor(diffMs / 3_600_000);
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (diffMins < 1) return "Just now";
	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays}d ago`;
	return date.toLocaleDateString();
}

const TYPE_CONFIG: Record<string, { icon: string; bg: string; label: string }> = {
	practice_completed: {
		icon: "♪",
		bg: "bg-accent/20 text-accent",
		label: "Practice",
	},
	new_best_score: {
		icon: "🏆",
		bg: "bg-amber-500/20 text-amber-600 dark:text-amber-400",
		label: "New best",
	},
	piece_started: {
		icon: "▶",
		bg: "bg-primary/20 text-primary",
		label: "Started",
	},
	mastery_reached: {
		icon: "★",
		bg: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
		label: "Mastered",
	},
};

function getTypeConfig(type: string) {
	return (
		TYPE_CONFIG[type] ?? {
			icon: "•",
			bg: "bg-muted text-muted-foreground",
			label: type,
		}
	);
}

export function HistoryFeed({ activities, className = "" }: HistoryFeedProps) {
	return (
		<div
			className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}
		>
			<div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
				<div>
					<h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
					<p className="mt-0.5 text-xs text-muted-foreground">
						Last 5 activities from your practice
					</p>
				</div>
				<Link href="/history" className="text-xs font-medium text-primary hover:text-primary/90">
					View all
				</Link>
			</div>

			{activities.length === 0 ? (
				<div className="p-6 text-center">
					<p className="text-sm text-muted-foreground">No activity yet. Start practicing!</p>
				</div>
			) : (
				<ul className="divide-y divide-border">
					{activities.map((item) => {
						const config = getTypeConfig(item.type);
						return (
							<li
								key={item.id}
								className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
							>
								<div
									className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium ${config.bg}`}
									title={config.label}
								>
									{config.icon}
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm text-foreground">{item.message}</p>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{formatRelativeTime(item.createdAt)}
									</p>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
