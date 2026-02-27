import type { AccuracyReport } from "@/types/feedback";

interface ScoreBreakdownProps {
	report: AccuracyReport | null;
	className?: string;
}

export function ScoreBreakdown({ report, className = "" }: ScoreBreakdownProps) {
	if (!report) return null;

	return (
		<div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
			<h3 className="font-semibold text-foreground">Score Breakdown</h3>
			<div className="mt-4 grid grid-cols-3 gap-4 text-center">
				<div>
					<p className="text-2xl font-bold text-foreground">{report.overallScore}%</p>
					<p className="text-xs text-muted-foreground">Overall</p>
				</div>
				<div>
					<p className="text-2xl font-bold text-foreground">{report.pitchAccuracy}%</p>
					<p className="text-xs text-muted-foreground">Pitch</p>
				</div>
				<div>
					<p className="text-2xl font-bold text-foreground">{report.rhythmAccuracy}%</p>
					<p className="text-xs text-muted-foreground">Rhythm</p>
				</div>
			</div>
		</div>
	);
}
