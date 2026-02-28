// Top 3 best scores with podium-style design
// Distinct visual treatment: gold/silver/bronze tiers

import type { MasteryLevel } from "@_types";
import Link from "next/link";

export interface TopScoreItem {
	pieceId: string;
	pieceTitle: string;
	pieceComposer: string | null;
	bestScore: number;
	avgScore: number | null;
	totalSessions: number | null;
	masteryLevel: MasteryLevel | null;
	lastPracticed: Date | null;
}

interface TopScoresCardProps {
	scores: TopScoreItem[];
	className?: string;
}

const RANK_STYLES = [
	{
		ring: "ring-amber-400/60 dark:ring-amber-500/40",
		bg: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30",
		badge: "bg-amber-500 text-amber-950",
		label: "1st",
	},
	{
		ring: "ring-slate-300/60 dark:ring-slate-500/40",
		bg: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/30",
		badge: "bg-slate-400 text-slate-900",
		label: "2nd",
	},
	{
		ring: "ring-amber-700/50 dark:ring-amber-800/40",
		bg: "bg-gradient-to-br from-amber-100 to-amber-200/80 dark:from-amber-900/40 dark:to-amber-800/30",
		badge: "bg-amber-700 text-amber-50",
		label: "3rd",
	},
] as const;

function MasteryBadge({ level }: { level: MasteryLevel | null }) {
	if (!level) return null;
	const styles: Record<MasteryLevel, string> = {
		learning: "bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200",
		practicing: "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
		comfortable: "bg-emerald-200 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-200",
		mastered: "bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-200",
	};
	return (
		<span
			className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[level]}`}
		>
			{level}
		</span>
	);
}

export function TopScoresCard({ scores, className = "" }: TopScoresCardProps) {
	return (
		<div
			className={`overflow-hidden rounded-xl border border-border bg-card shadow-sm ${className}`}
		>
			<div className="border-b border-border bg-muted/30 px-4 py-3">
				<h3 className="text-sm font-semibold text-foreground">Top Scores</h3>
				<p className="mt-0.5 text-xs text-muted-foreground">Your best performances by piece</p>
			</div>

			{scores.length === 0 ? (
				<div className="p-6 text-center">
					<p className="text-sm text-muted-foreground">
						No scores yet. Complete a practice session to see your top performances here.
					</p>
				</div>
			) : (
				<div className="divide-y divide-border">
					{scores.map((item, index) => {
						const style = RANK_STYLES[index] ?? RANK_STYLES[2];
						return (
							<Link
								key={item.pieceId}
								href={`/piece/${item.pieceId}/practice`}
								className={`group block px-4 py-3 transition-colors hover:bg-muted/50 ${style.bg}`}
							>
								<div className="flex items-start gap-3">
									{/* Rank badge */}
									<div
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 ${style.ring} ${style.badge} text-xs font-bold`}
									>
										{style.label}
									</div>

									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-foreground group-hover:text-primary transition-colors">
											{item.pieceTitle}
										</p>
										{item.pieceComposer && (
											<p className="mt-0.5 truncate text-xs text-muted-foreground">
												{item.pieceComposer}
											</p>
										)}
										<div className="mt-2 flex flex-wrap items-center gap-2">
											<span className="text-lg font-bold tabular-nums text-foreground">
												{Math.round(item.bestScore)}%
											</span>
											<MasteryBadge level={item.masteryLevel} />
											{item.totalSessions != null && item.totalSessions > 0 && (
												<span className="text-xs text-muted-foreground">
													{item.totalSessions} session
													{item.totalSessions !== 1 ? "s" : ""}
												</span>
											)}
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
