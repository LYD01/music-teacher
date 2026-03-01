"use client";

import { AudioControls } from "@_components/audio/AudioControls";
import { AudioVisualizer } from "@_components/audio/AudioVisualizer";
import { PitchDisplay } from "@_components/audio/PitchDisplay";
import { Badge } from "@_components/common/Badge";
import { NoteOverlay } from "@_components/sheet-music/NoteOverlay";
import { PracticeSheetMusicViewer } from "@_components/sheet-music/PracticeSheetMusicViewer";
import type { SheetMusicViewerHandle } from "@_components/sheet-music/SheetMusicViewer";
import { useComparison } from "@_hooks/use-comparison";
import { useMicrophone } from "@_hooks/use-microphone";
import { useNoteDetection } from "@_hooks/use-note-detection";
import { usePitchDetection } from "@_hooks/use-pitch-detection";
import type { AccuracyReport, DetectedNote, Piece } from "@_types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { type ProgressInfo, ScoreDisplay } from "./ScoreDisplay";

const difficultyVariant = {
	beginner: "accent" as const,
	intermediate: "default" as const,
	advanced: "destructive" as const,
};

interface PracticeSessionProps {
	piece: Piece;
}

async function saveSessionToDb(
	pieceId: string,
	startedAt: Date,
	report: AccuracyReport,
	detectedNotes: DetectedNote[]
): Promise<{ progress: ProgressInfo } | null> {
	try {
		const res = await fetch("/api/sessions", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				pieceId,
				startedAt: startedAt.toISOString(),
				endedAt: new Date().toISOString(),
				overallScore: report.overallScore,
				pitchAccuracy: report.pitchAccuracy,
				rhythmAccuracy: report.rhythmAccuracy,
				detectedNotes,
			}),
		});
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
}

export function PracticeSession({ piece }: PracticeSessionProps) {
	const mic = useMicrophone();
	const pitch = usePitchDetection(mic.getTimeDomain, mic.isCapturing);
	const { notes, count: noteCount } = useNoteDetection(pitch, mic.isCapturing);
	const {
		expectedNotes,
		comparison,
		report,
		analyze,
		reset: resetComparison,
	} = useComparison(piece.musicxmlPath, piece.tempo || 120);

	const [isStarting, setIsStarting] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [progress, setProgress] = useState<ProgressInfo | null>(null);
	const notesRef = useRef<DetectedNote[]>([]);
	notesRef.current = notes;
	const sessionStartRef = useRef<Date | null>(null);
	const viewerRef = useRef<SheetMusicViewerHandle | null>(null);

	const handleStart = useCallback(async () => {
		setShowResults(false);
		resetComparison();
		setProgress(null);
		sessionStartRef.current = new Date();
		setIsStarting(true);
		await mic.start();
		setIsStarting(false);
	}, [mic.start, resetComparison]);

	const handleStop = useCallback(() => {
		mic.stop();
		if (notesRef.current.length > 0) {
			analyze(notesRef.current);
			setShowResults(true);
		}
	}, [mic.stop, analyze]);

	useEffect(() => {
		if (!showResults || !report || !sessionStartRef.current) return;

		setIsSaving(true);
		saveSessionToDb(piece.id, sessionStartRef.current, report, notesRef.current).then((result) => {
			if (result?.progress) setProgress(result.progress);
			setIsSaving(false);
		});
	}, [showResults, report, piece.id]);

	const sessionStartTime = sessionStartRef.current ? sessionStartRef.current.getTime() : null;

	return (
		<div className="space-y-4">
			{/* Header bar */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link
						href={`/piece/${piece.id}`}
						className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<title>Back</title>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
						Back
					</Link>

					<div>
						<h1 className="text-lg font-bold text-foreground sm:text-xl">{piece.title}</h1>
						<p className="text-xs text-muted-foreground">{piece.composer}</p>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge variant={difficultyVariant[piece.difficulty] ?? "secondary"}>
						{piece.difficulty}
					</Badge>
					{piece.tempo > 0 && <Badge variant="secondary">{piece.tempo} BPM</Badge>}
				</div>
			</div>

			{/* Compact score bar + sheet music (closer together) */}
			<div className="space-y-2">
				{showResults && report && comparison && (
					<ScoreDisplay
						report={report}
						comparison={comparison}
						isSaving={isSaving}
						progress={progress}
						compact
					/>
				)}

				{/* Main layout */}
				<div className="grid gap-4 lg:grid-cols-3">
					{/* Left: sheet music + audio controls */}
					<div className="space-y-4 lg:col-span-2">
						<div className="relative">
							<PracticeSheetMusicViewer
								musicxmlUrl={piece.musicxmlPath}
								expectedNotes={expectedNotes}
								tempo={piece.tempo || 120}
								sessionStartTime={mic.isCapturing ? sessionStartTime : null}
								detectedNotes={notes}
								isRecording={mic.isCapturing}
								viewerRef={viewerRef}
							/>

							{showResults && comparison && (
								<NoteOverlay noteComparisons={comparison.noteComparisons} viewerRef={viewerRef} />
							)}
						</div>

						{/* Audio control bar */}
						<div className="rounded-xl border border-border bg-card p-4">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
								<AudioControls
									isRecording={mic.isCapturing}
									isLoading={isStarting}
									onStartRecording={handleStart}
									onStopRecording={handleStop}
									error={mic.error}
								/>

								<AudioVisualizer
									isActive={mic.isCapturing}
									getTimeDomain={mic.getTimeDomain}
									className="flex-1"
								/>
							</div>
						</div>
					</div>

					{/* Right sidebar */}
					<div className="space-y-4">
						{/* Live pitch display & note log when practicing (score moved to top bar) */}
						{!showResults && (
							<>
								<PitchDisplay pitch={pitch} isListening={mic.isCapturing} />
								{mic.isCapturing && <NoteLog notes={notes} count={noteCount} />}
							</>
						)}

						{/* Avatar placeholder */}
						<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
							<svg
								className="mb-2 h-10 w-10 text-muted-foreground/40"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								aria-hidden="true"
							>
								<title>Avatar</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
							<p className="text-sm font-medium text-muted-foreground">3D Avatar</p>
							<p className="mt-1 text-xs text-muted-foreground/60">Coming in Phase 4</p>
						</div>

						{/* Feedback placeholder */}
						<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
							<svg
								className="mb-2 h-10 w-10 text-muted-foreground/40"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.5}
								aria-hidden="true"
							>
								<title>Feedback</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
								/>
							</svg>
							<p className="text-sm font-medium text-muted-foreground">AI Feedback</p>
							<p className="mt-1 text-xs text-muted-foreground/60">Coming in Phase 4</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Compact note log ──────────────────────────────────────────────────

const MAX_VISIBLE_NOTES = 8;

function NoteLog({ notes, count }: { notes: DetectedNote[]; count: number }) {
	const visible = notes.slice(-MAX_VISIBLE_NOTES);

	return (
		<div className="rounded-xl border border-border bg-card p-4">
			<div className="mb-2 flex items-center justify-between">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Detected Notes
				</h3>
				<span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-primary">
					{count}
				</span>
			</div>

			{visible.length === 0 ? (
				<p className="text-xs text-muted-foreground/60">Notes will appear here as you play...</p>
			) : (
				<div className="flex flex-wrap gap-1.5">
					{visible.map((note, i) => (
						<span
							key={`${note.startTime}-${note.pitch}`}
							className={`inline-flex items-baseline gap-0.5 rounded-md border px-2 py-1 text-xs font-medium transition-all ${
								i === visible.length - 1
									? "border-primary/30 bg-primary/10 text-primary"
									: "border-border bg-muted/50 text-muted-foreground"
							}`}
						>
							<span>{note.noteName}</span>
							<span className="text-[10px] opacity-60">{note.octave}</span>
							<span className="ml-1 text-[10px] tabular-nums opacity-40">
								{(note.endTime - note.startTime).toFixed(1)}s
							</span>
						</span>
					))}
				</div>
			)}
		</div>
	);
}
