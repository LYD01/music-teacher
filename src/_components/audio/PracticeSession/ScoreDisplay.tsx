"use client";

import type { NoteComparison, PerformanceComparison } from "@_lib/music/comparison";
import type { AccuracyReport } from "@_types";
import { useState } from "react";

export interface ProgressInfo {
	bestScore: number;
	avgScore: number;
	totalSessions: number;
	masteryLevel: string;
	isNewBest?: boolean;
}

interface ScoreDisplayProps {
	report: AccuracyReport;
	comparison: PerformanceComparison;
	isSaving?: boolean;
	progress?: ProgressInfo | null;
	/** Compact bar layout for placement above sheet music */
	compact?: boolean;
}

function scoreColor(score: number): string {
	if (score >= 90) return "text-emerald-500";
	if (score >= 70) return "text-amber-500";
	return "text-red-500";
}

function barColor(score: number): string {
	if (score >= 90) return "bg-emerald-500";
	if (score >= 70) return "bg-amber-500";
	return "bg-red-500";
}

function ScoreBar({ label, value }: { label: string; value: number }) {
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<span className={`font-semibold tabular-nums ${scoreColor(value)}`}>{value}%</span>
			</div>
			<div className="h-2 overflow-hidden rounded-full bg-muted">
				<div
					className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(value)}`}
					style={{ width: `${Math.min(value, 100)}%` }}
				/>
			</div>
		</div>
	);
}

const MASTERY_LABELS: Record<string, { label: string; color: string }> = {
	learning: { label: "Learning", color: "text-blue-500" },
	practicing: { label: "Practicing", color: "text-amber-500" },
	comfortable: { label: "Comfortable", color: "text-emerald-500" },
	mastered: { label: "Mastered", color: "text-purple-500" },
};

export function ScoreDisplay({
	report,
	comparison,
	isSaving,
	progress,
	compact = false,
}: ScoreDisplayProps) {
	const { noteComparisons, extraNotes } = comparison;

	if (compact) {
		return (
			<CompactScoreBar
				report={report}
				comparison={comparison}
				extraNotesCount={extraNotes.length}
				isSaving={isSaving}
				progress={progress}
			/>
		);
	}

	return (
		<div className="space-y-6">
			{/* Overall score */}
			<div className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center">
				<p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Overall Score
				</p>
				<p className={`text-5xl font-extrabold tabular-nums ${scoreColor(report.overallScore)}`}>
					{report.overallScore}
					<span className="text-xl font-medium text-muted-foreground">%</span>
				</p>
			</div>

			{/* Accuracy bars */}
			<div className="space-y-3 rounded-xl border border-border bg-card p-4">
				<ScoreBar label="Pitch Accuracy" value={report.pitchAccuracy} />
				<ScoreBar label="Rhythm Accuracy" value={report.rhythmAccuracy} />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-2">
				<StatCard
					label="Notes Hit"
					value={report.notesHit}
					total={report.totalNotes}
					variant="hit"
				/>
				<StatCard
					label="Missed"
					value={report.notesMissed}
					total={report.totalNotes}
					variant="missed"
				/>
				<StatCard label="Extra" value={extraNotes.length} variant="extra" />
			</div>

			{/* Per-note breakdown */}
			{noteComparisons.length > 0 && (
				<div className="rounded-xl border border-border bg-card p-4">
					<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Note-by-Note
					</h3>
					<NoteChipsWithToggle noteComparisons={noteComparisons} compact={false} />
					<div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] text-muted-foreground">
						<span className="flex items-center gap-1">
							<span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
							Perfect
						</span>
						<span className="flex items-center gap-1">
							<span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
							Timing off / Wrong note
						</span>
						<span className="flex items-center gap-1">
							<span className="inline-block h-2 w-2 rounded-full bg-red-500" />
							Missed
						</span>
					</div>
				</div>
			)}

			{/* Progress / saving state */}
			{isSaving && (
				<div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
					<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<title>Saving</title>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
						/>
					</svg>
					Saving session...
				</div>
			)}

			{progress && !isSaving && (
				<div className="rounded-xl border border-border bg-card p-4">
					<h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Your Progress
					</h3>

					{progress.isNewBest && progress.totalSessions > 1 && (
						<p className="mb-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-center text-xs font-semibold text-emerald-500">
							New personal best!
						</p>
					)}

					<div className="grid grid-cols-3 gap-3 text-center">
						<div>
							<p className="text-lg font-bold tabular-nums text-foreground">
								{progress.bestScore}%
							</p>
							<p className="text-[10px] uppercase tracking-wider text-muted-foreground">Best</p>
						</div>
						<div>
							<p className="text-lg font-bold tabular-nums text-foreground">{progress.avgScore}%</p>
							<p className="text-[10px] uppercase tracking-wider text-muted-foreground">Average</p>
						</div>
						<div>
							<p className="text-lg font-bold tabular-nums text-foreground">
								{progress.totalSessions}
							</p>
							<p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sessions</p>
						</div>
					</div>

					{progress.masteryLevel && (
						<div className="mt-3 border-t border-border pt-3 text-center">
							<span className="text-[10px] uppercase tracking-wider text-muted-foreground">
								Mastery:{" "}
							</span>
							<span
								className={`text-xs font-semibold ${MASTERY_LABELS[progress.masteryLevel]?.color ?? "text-foreground"}`}
							>
								{MASTERY_LABELS[progress.masteryLevel]?.label ?? progress.masteryLevel}
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

/** Minimal compact score bar for placement above sheet music */
function CompactScoreBar({
	report,
	comparison,
	extraNotesCount,
	isSaving,
	progress,
}: {
	report: AccuracyReport;
	comparison: PerformanceComparison;
	extraNotesCount: number;
	isSaving?: boolean;
	progress?: ProgressInfo | null;
}) {
	const { noteComparisons } = comparison;

	return (
		<div className="flex flex-wrap items-center gap-y-2 py-2">
			{/* Overall score */}
			<div className="flex items-baseline gap-1 pr-4 border-r border-border/50">
				<span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
					Score
				</span>
				<span className={`text-xl font-bold tabular-nums ${scoreColor(report.overallScore)}`}>
					{report.overallScore}%
				</span>
			</div>

			{/* Mini accuracy bars */}
			<div className="flex items-center gap-4 pl-4 pr-4 border-r border-border/50">
				<MiniBar label="Pitch" value={report.pitchAccuracy} />
				<MiniBar label="Rhythm" value={report.rhythmAccuracy} />
			</div>

			{/* Stats */}
			<div className="flex items-center gap-3 pl-4 pr-4 text-xs border-r border-border/50">
				<span className="tabular-nums text-emerald-500">
					{report.notesHit}/{report.totalNotes} hit
				</span>
				<span className="tabular-nums text-red-500">
					{report.notesMissed}/{report.totalNotes} missed
				</span>
				<span className="tabular-nums text-amber-500">{extraNotesCount} extra</span>
			</div>

			{/* Note-by-note chips */}
			{noteComparisons.length > 0 && (
				<div className="pl-4 pr-4 border-r border-border/50">
					<NoteChipsWithToggle noteComparisons={noteComparisons} compact />
				</div>
			)}

			{/* Progress */}
			{progress && !isSaving && (
				<div className="flex items-center gap-3 pl-4 text-[11px] text-muted-foreground">
					{progress.isNewBest && progress.totalSessions > 1 && (
						<span className="font-medium text-emerald-500">New best!</span>
					)}
					<span className="tabular-nums">Best {progress.bestScore}%</span>
					<span className="tabular-nums">Avg {progress.avgScore}%</span>
					<span className="tabular-nums">{progress.totalSessions} sessions</span>
					{progress.masteryLevel && (
						<span
							className={`font-medium ${MASTERY_LABELS[progress.masteryLevel]?.color ?? "text-foreground"}`}
						>
							{MASTERY_LABELS[progress.masteryLevel]?.label ?? progress.masteryLevel}
						</span>
					)}
				</div>
			)}
		</div>
	);
}

function MiniBar({ label, value }: { label: string; value: number }) {
	return (
		<div className="flex w-16 flex-col gap-0.5">
			<div className="flex justify-between text-[10px]">
				<span className="text-muted-foreground">{label}</span>
				<span className={`font-medium tabular-nums ${scoreColor(value)}`}>{value}%</span>
			</div>
			<div className="h-1 w-full overflow-hidden rounded-full bg-muted">
				<div
					className={`h-full rounded-full ${barColor(value)}`}
					style={{ width: `${Math.min(value, 100)}%` }}
				/>
			</div>
		</div>
	);
}

function NoteChipsWithToggle({
	noteComparisons,
	compact,
}: {
	noteComparisons: NoteComparison[];
	compact?: boolean;
}) {
	const [showMissed, setShowMissed] = useState(false);
	const hits = noteComparisons.filter((c) => c.status === "hit");
	const missed = noteComparisons.filter((c) => c.status === "missed");
	const visible = showMissed ? noteComparisons : hits;

	return (
		<div className={`flex flex-wrap items-center ${compact ? "gap-1" : "gap-1.5"}`}>
			{visible.map((c) => (
				<NoteChip key={c.noteIndex} comparison={c} compact={compact} />
			))}
			{missed.length > 0 && (
				<button
					type="button"
					onClick={() => setShowMissed(!showMissed)}
					className={`rounded border border-dashed border-muted-foreground/40 font-medium text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:text-foreground ${
						compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]"
					}`}
				>
					{showMissed ? "Hide missed" : `See missed (${missed.length})`}
				</button>
			)}
		</div>
	);
}

function NoteChip({ comparison, compact }: { comparison: NoteComparison; compact?: boolean }) {
	const c = comparison;
	let classes: string;
	let tooltip: string;

	if (c.status === "missed") {
		classes = compact
			? "bg-red-500/20 text-red-500"
			: "border-red-500/30 bg-red-500/10 text-red-500";
		tooltip = `Missed: ${c.expected.noteName}${c.expected.octave}`;
	} else if (c.pitchCorrect) {
		const absOffset = Math.abs(c.timingOffsetSec);
		if (absOffset <= 0.15) {
			classes = compact
				? "bg-emerald-500/20 text-emerald-500"
				: "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
			tooltip = `Perfect: ${c.expected.noteName}${c.expected.octave}`;
		} else {
			classes = compact
				? "bg-amber-500/20 text-amber-500"
				: "border-amber-500/30 bg-amber-500/10 text-amber-500";
			const dir = c.timingOffsetSec > 0 ? "late" : "early";
			tooltip = `${c.expected.noteName}${c.expected.octave} (${dir} ${absOffset.toFixed(2)}s)`;
		}
	} else {
		classes = compact
			? "bg-amber-500/20 text-amber-500"
			: "border-amber-500/30 bg-amber-500/10 text-amber-500";
		const played = c.detected ? `${c.detected.noteName}${c.detected.octave}` : "?";
		tooltip = `Expected ${c.expected.noteName}${c.expected.octave}, played ${played}`;
	}

	return (
		<span
			title={tooltip}
			className={`group relative inline-flex cursor-help items-baseline gap-0.5 rounded font-medium ${classes} ${
				compact ? "border-0 px-1.5 py-0.5 text-[10px]" : "rounded-md border px-2 py-1 text-xs"
			}`}
		>
			<span>{c.expected.noteName}</span>
			<span className={compact ? "opacity-70" : "text-[10px] opacity-60"}>{c.expected.octave}</span>
			{/* Custom tooltip (shows ~150ms after hover, faster than native title) */}
			<span
				role="tooltip"
				className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-card px-2 py-1 text-[10px] text-card-foreground shadow-md opacity-0 transition-opacity duration-150 delay-150 group-hover:opacity-100"
			>
				{tooltip}
			</span>
		</span>
	);
}

function StatCard({
	label,
	value,
	total,
	variant,
}: {
	label: string;
	value: number;
	total?: number;
	variant: "hit" | "missed" | "extra";
}) {
	const colors = {
		hit: "text-emerald-500",
		missed: "text-red-500",
		extra: "text-amber-500",
	};

	return (
		<div className="flex flex-col items-center rounded-lg border border-border bg-card p-3 text-center">
			<span className={`text-xl font-bold tabular-nums ${colors[variant]}`}>{value}</span>
			{total !== undefined && (
				<span className="text-[10px] tabular-nums text-muted-foreground">/ {total}</span>
			)}
			<span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
				{label}
			</span>
		</div>
	);
}
