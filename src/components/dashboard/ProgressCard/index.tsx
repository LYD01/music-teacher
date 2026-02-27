// Progress summary card for the dashboard parallel route
// Shows mastery level, best score, and session count for a piece

import type { MasteryLevel } from "@/types/music";

interface ProgressCardProps {
	pieceTitle: string;
	masteryLevel: MasteryLevel;
	bestScore: number;
	totalSessions: number;
	className?: string;
}

export function ProgressCard({ pieceTitle, masteryLevel, bestScore, totalSessions, className = "" }: ProgressCardProps) {
	return (
		<div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
			<h4 className="font-medium text-foreground">{pieceTitle}</h4>
			<div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
				<span className="capitalize">{masteryLevel}</span>
				<span>Best: {bestScore}%</span>
				<span>{totalSessions} sessions</span>
			</div>
		</div>
	);
}
