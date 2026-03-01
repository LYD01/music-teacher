"use client";

import { AudioControls } from "@_components/audio/AudioControls";
import { AudioVisualizer } from "@_components/audio/AudioVisualizer";
import { PitchDisplay } from "@_components/audio/PitchDisplay";
import { AvatarController } from "@_components/avatar/AvatarController";
import { Badge } from "@_components/common/Badge";
import { NoteOverlay } from "@_components/sheet-music/NoteOverlay";
import { PracticeSheetMusicViewer } from "@_components/sheet-music/PracticeSheetMusicViewer";
import type { SheetMusicViewerHandle } from "@_components/sheet-music/SheetMusicViewer";
import { useComparison } from "@_hooks/use-comparison";
import { useLiveFeedback } from "@_hooks/use-live-feedback";
import { useMicrophone } from "@_hooks/use-microphone";
import { useNoteDetection } from "@_hooks/use-note-detection";
import { usePitchDetection } from "@_hooks/use-pitch-detection";
import type { AccuracyReport, DetectedNote, FeedbackResponse, Piece } from "@_types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { type ProgressInfo, ScoreDisplay } from "./ScoreDisplay";

function formatFeedbackAsBubble(fb: FeedbackResponse): string {
	const parts = [fb.message];
	if (fb.suggestions.length > 0) {
		parts.push(fb.suggestions[0]);
	}
	if (fb.encouragement) {
		parts.push(fb.encouragement);
	}
	return parts.join(" ");
}

const difficultyVariant = {
	beginner: "accent" as const,
	intermediate: "default" as const,
	advanced: "destructive" as const,
};

interface PracticeSessionProps {
	piece: Piece;
}

async function fetchFeedback(
	pieceTitle: string,
	report: AccuracyReport
): Promise<FeedbackResponse | null> {
	try {
		const res = await fetch("/api/feedback", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ pieceTitle, report }),
		});
		if (!res.ok) return null;
		return res.json();
	} catch {
		return null;
	}
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

	const liveFeedback = useLiveFeedback({
		pieceTitle: piece.title,
		isRecording: mic.isCapturing,
		notes,
		expectedNotes,
	});

	const [isStarting, setIsStarting] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [progress, setProgress] = useState<ProgressInfo | null>(null);
	const [sessionFeedbackText, setSessionFeedbackText] = useState<string | null>(null);
	const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
	const notesRef = useRef<DetectedNote[]>([]);
	notesRef.current = notes;
	const sessionStartRef = useRef<Date | null>(null);
	const viewerRef = useRef<SheetMusicViewerHandle | null>(null);

	const handleStart = useCallback(async () => {
		setShowResults(false);
		resetComparison();
		setProgress(null);
		setSessionFeedbackText(null);
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

	const handleRequestFeedback = useCallback(() => {
		if (!report || isFeedbackLoading) return;
		setIsFeedbackLoading(true);
		fetchFeedback(piece.title, report)
			.then((fb) => {
				if (fb) setSessionFeedbackText(formatFeedbackAsBubble(fb));
			})
			.finally(() => setIsFeedbackLoading(false));
	}, [report, piece.title, isFeedbackLoading]);

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
						{/* Live pitch display & note log when practicing */}
						{!showResults && (
							<>
								<PitchDisplay pitch={pitch} isListening={mic.isCapturing} />
								{mic.isCapturing && <NoteLog notes={notes} count={noteCount} />}
							</>
						)}

						{/* 3D Avatar teacher with speech bubble feedback */}
						<AvatarController
							isRecording={mic.isCapturing}
							notes={notes}
							expectedNotes={expectedNotes}
							report={report}
							showResults={showResults}
							feedbackMessages={liveFeedback.messages}
							feedbackStreamingText={liveFeedback.streamingText}
							isFeedbackStreaming={liveFeedback.isStreaming}
							sessionFeedbackText={sessionFeedbackText}
							isSessionFeedbackLoading={isFeedbackLoading}
							onRequestFeedback={handleRequestFeedback}
						/>
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
