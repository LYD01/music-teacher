"use client";

import { LiveFeedbackChat } from "@_components/feedback/LiveFeedbackChat";
import { useAvatar } from "@_hooks/use-avatar";
import type { ExpectedNote } from "@_lib/audio/analyzer";
import { noteNameToMidi } from "@_lib/music/theory";
import { noteResultToMood, scoreToMood } from "@_lib/three/gesture-map";
import type { AccuracyReport, AvatarMood, DetectedNote, LiveFeedbackMessage } from "@_types";
import { useCallback, useEffect, useRef, useState } from "react";
import { AvatarScene } from "../AvatarScene";
import { ModelUploader } from "../ModelUploader";

interface AvatarControllerProps {
	isRecording: boolean;
	notes: DetectedNote[];
	expectedNotes: ExpectedNote[];
	report: AccuracyReport | null;
	showResults: boolean;
	feedbackMessages?: LiveFeedbackMessage[];
	feedbackStreamingText?: string;
	isFeedbackStreaming?: boolean;
	sessionFeedbackText?: string | null;
	isSessionFeedbackLoading?: boolean;
	onRequestFeedback?: () => void;
}

const REACTION_DECAY_MS = 800;

export function AvatarController({
	isRecording,
	notes,
	expectedNotes,
	report,
	showResults,
	feedbackMessages = [],
	feedbackStreamingText = "",
	isFeedbackStreaming = false,
	sessionFeedbackText = null,
	isSessionFeedbackLoading = false,
	onRequestFeedback,
}: AvatarControllerProps) {
	const [mood, setMood] = useState<AvatarMood>("idle");
	const consecutiveHits = useRef(0);
	const lastNoteCount = useRef(0);
	const decayTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const avatar = useAvatar();

	const scheduleDecay = useCallback(() => {
		if (decayTimer.current) clearTimeout(decayTimer.current);
		decayTimer.current = setTimeout(() => {
			setMood(isRecording ? "listening" : "idle");
		}, REACTION_DECAY_MS);
	}, [isRecording]);

	useEffect(() => {
		if (showResults && report) {
			setMood(scoreToMood(report.overallScore));
			return;
		}

		if (!isRecording) {
			setMood("idle");
			consecutiveHits.current = 0;
			lastNoteCount.current = 0;
			return;
		}

		if (notes.length === 0) {
			setMood("listening");
			return;
		}

		if (notes.length <= lastNoteCount.current) return;
		lastNoteCount.current = notes.length;

		const latestNote = notes[notes.length - 1];
		const isCorrect = isNoteCorrect(latestNote, expectedNotes);

		if (isCorrect) {
			consecutiveHits.current++;
		} else {
			consecutiveHits.current = 0;
		}

		const newMood = noteResultToMood(isCorrect, consecutiveHits.current);
		setMood(newMood);
		scheduleDecay();
	}, [notes, isRecording, expectedNotes, report, showResults, scheduleDecay]);

	useEffect(() => {
		return () => {
			if (decayTimer.current) clearTimeout(decayTimer.current);
		};
	}, []);

	const showFeedbackButton =
		showResults && onRequestFeedback && !sessionFeedbackText && !isSessionFeedbackLoading;

	return (
		<div className="space-y-2">
			<div className="relative">
				<AvatarScene mood={mood} modelUrl={avatar.modelUrl} className="aspect-square w-full" />

				{/* Live micro-feedback speech bubble (during practice) */}
				{!showResults && (
					<LiveFeedbackChat
						messages={feedbackMessages}
						streamingText={feedbackStreamingText}
						isStreaming={isFeedbackStreaming}
					/>
				)}

				{/* Post-session feedback speech bubble (after clicking button) */}
				{showResults && sessionFeedbackText && (
					<LiveFeedbackChat persistentText={sessionFeedbackText} />
				)}

				{/* Loading indicator while generating feedback */}
				{showResults && isSessionFeedbackLoading && (
					<div className="pointer-events-none absolute top-2 left-2 z-20 w-fit">
						<div className="flex items-center gap-1.5 rounded-lg bg-foreground/85 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-foreground/15">
							<span className="inline-block h-3 w-3 animate-spin rounded-full border-[1.5px] border-background/80 border-t-transparent dark:border-foreground/80 dark:border-t-transparent" />
							<span className="text-[11px] text-background dark:text-foreground/90">
								Thinking...
							</span>
						</div>
						<div className="ml-6">
							<svg width="16" height="10" viewBox="0 0 16 10" className="block" aria-hidden="true">
								<path d="M0 0 L8 10 L16 0" className="fill-foreground/85 dark:fill-foreground/15" />
							</svg>
						</div>
					</div>
				)}

				{/* "Get Feedback" button (top-right of avatar) */}
				{showFeedbackButton && (
					<button
						type="button"
						onClick={onRequestFeedback}
						className="absolute top-2 right-2 z-20 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
					>
						<svg
							className="h-3.5 w-3.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<title>Get feedback</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
							/>
						</svg>
						Get Feedback
					</button>
				)}
			</div>
			<ModelUploader
				modelName={avatar.modelName}
				isLoading={avatar.isLoading}
				error={avatar.error}
				onUpload={avatar.uploadModel}
				onRemove={avatar.removeModel}
			/>
		</div>
	);
}

function isNoteCorrect(detected: DetectedNote, expected: ExpectedNote[]): boolean {
	if (expected.length === 0) return true;

	const TOLERANCE_SEMITONES = 1;
	return expected.some((exp) => {
		try {
			const expectedMidi = noteNameToMidi(exp.noteName, exp.octave);
			return Math.abs(detected.pitch - expectedMidi) <= TOLERANCE_SEMITONES;
		} catch {
			return false;
		}
	});
}
