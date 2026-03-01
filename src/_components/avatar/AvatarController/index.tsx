"use client";

import { useAvatar } from "@_hooks/use-avatar";
import type { ExpectedNote } from "@_lib/audio/analyzer";
import { noteNameToMidi } from "@_lib/music/theory";
import { noteResultToMood, scoreToMood } from "@_lib/three/gesture-map";
import type { AccuracyReport, AvatarMood, DetectedNote } from "@_types";
import { useCallback, useEffect, useRef, useState } from "react";
import { AvatarScene } from "../AvatarScene";
import { ModelUploader } from "../ModelUploader";

interface AvatarControllerProps {
	isRecording: boolean;
	notes: DetectedNote[];
	expectedNotes: ExpectedNote[];
	report: AccuracyReport | null;
	showResults: boolean;
}

const REACTION_DECAY_MS = 800;

export function AvatarController({
	isRecording,
	notes,
	expectedNotes,
	report,
	showResults,
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

	return (
		<div className="space-y-2">
			<AvatarScene mood={mood} modelUrl={avatar.modelUrl} className="aspect-square w-full" />
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
