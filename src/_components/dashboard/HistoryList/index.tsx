"use client";

// Full history list with "See more" pagination
// Initial 10 on load, fetches next 20 per click

import { formatActivityMessage } from "@_utils/activity";
import { useCallback, useState } from "react";

export interface ActivityItem {
	id: string;
	type: string;
	message: string;
	createdAt: string;
}

interface HistoryListProps {
	initialActivities: ActivityItem[];
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

function formatRelativeTime(dateStr: string): string {
	const date = new Date(dateStr);
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

interface ApiActivityRow {
	id: string;
	activityType: string;
	pieceId: string | null;
	metadata: Record<string, unknown> | null;
	createdAt: string;
	pieceTitle: string | null;
}

function toActivityItem(row: ApiActivityRow): ActivityItem {
	return {
		id: row.id,
		type: row.activityType,
		message: formatActivityMessage(row.activityType, row.pieceTitle, row.metadata),
		createdAt: row.createdAt,
	};
}

export function HistoryList({ initialActivities }: HistoryListProps) {
	const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
	const [hasMore, setHasMore] = useState(initialActivities.length >= 10);
	const [loading, setLoading] = useState(false);

	const loadMore = useCallback(async () => {
		if (loading) return;
		setLoading(true);
		try {
			const offset = activities.length;
			const res = await fetch(`/api/activity?limit=20&offset=${offset}`);
			if (!res.ok) throw new Error("Failed to fetch");
			const rows: ApiActivityRow[] = await res.json();
			const newItems = rows.map(toActivityItem);
			setActivities((prev) => [...prev, ...newItems]);
			if (newItems.length < 20) {
				setHasMore(false);
			}
		} catch (err) {
			console.error("Failed to load more activity:", err);
			setHasMore(false);
		} finally {
			setLoading(false);
		}
	}, [activities.length, loading]);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
				<div className="border-b border-border bg-muted/30 px-4 py-3">
					<h2 className="text-sm font-semibold text-foreground">All Activity</h2>
					<p className="mt-0.5 text-xs text-muted-foreground">Your complete practice history</p>
				</div>

				{activities.length === 0 ? (
					<div className="p-8 text-center">
						<p className="text-sm text-muted-foreground">
							No activity yet. Start practicing to see your history here.
						</p>
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

			{hasMore && (
				<div className="flex justify-center">
					<button
						type="button"
						onClick={loadMore}
						disabled={loading}
						className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
					>
						{loading ? "Loading…" : "See more"}
					</button>
				</div>
			)}
		</div>
	);
}
