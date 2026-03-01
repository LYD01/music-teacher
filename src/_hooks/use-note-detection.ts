"use client";

import type { PitchInfo } from "@_hooks/use-pitch-detection";
import { NoteDetector, type NoteDetectorConfig } from "@_lib/audio/note-detector";
import type { DetectedNote } from "@_types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseNoteDetectionReturn {
	/** All finalized notes detected so far in this session. */
	notes: DetectedNote[];
	/** The most recently completed note, for quick reference. */
	latestNote: DetectedNote | null;
	/** Total count of detected notes. */
	count: number;
	/** Clear all detected notes and reset the detector. */
	clear: () => void;
}

export function useNoteDetection(
	pitch: PitchInfo | null,
	isActive: boolean,
	config?: Partial<NoteDetectorConfig>
): UseNoteDetectionReturn {
	const [notes, setNotes] = useState<DetectedNote[]>([]);
	const detectorRef = useRef<NoteDetector | null>(null);
	const configRef = useRef(config);
	configRef.current = config;

	// Create / tear down detector with session lifecycle
	useEffect(() => {
		if (isActive) {
			detectorRef.current = new NoteDetector(configRef.current);
			setNotes([]);
		} else {
			if (detectorRef.current) {
				const last = detectorRef.current.flush();
				if (last) {
					setNotes((prev) => [...prev, last]);
				}
			}
			detectorRef.current = null;
		}
	}, [isActive]);

	// Feed each pitch change into the detector
	useEffect(() => {
		if (!isActive || !detectorRef.current) return;

		const reading = pitch ? { frequency: pitch.frequency, clarity: pitch.clarity } : null;

		const completed = detectorRef.current.feed(reading, performance.now());

		if (completed) {
			setNotes((prev) => [...prev, completed]);
		}
	}, [pitch, isActive]);

	const clear = useCallback(() => {
		detectorRef.current?.reset();
		setNotes([]);
	}, []);

	const latestNote = notes.length > 0 ? notes[notes.length - 1] : null;

	return { notes, latestNote, count: notes.length, clear };
}
