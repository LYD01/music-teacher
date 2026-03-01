import type { ExpectedNote } from "@_lib/audio/analyzer";
import type { DetectedNote } from "@_types";
import { noteNameToMidi } from "./theory";

export type NoteStatus = "hit" | "missed";

/** @deprecated Use NoteComparison instead. */
export type ComparisonResult = NoteComparison;

export interface NoteComparison {
	noteIndex: number;
	expected: ExpectedNote;
	detected: DetectedNote | null;
	pitchCorrect: boolean;
	/** Seconds between detected onset and expected onset (positive = late, negative = early). */
	timingOffsetSec: number;
	status: NoteStatus;
}

export interface PerformanceComparison {
	noteComparisons: NoteComparison[];
	extraNotes: DetectedNote[];
	totalExpected: number;
	notesHit: number;
	notesMissed: number;
	totalExtra: number;
}

interface TimedExpectedNote extends ExpectedNote {
	startTimeSec: number;
	endTimeSec: number;
}

const TIMING_TOLERANCE_SEC = 1.0;

function beatsToSeconds(expected: ExpectedNote[], tempo: number): TimedExpectedNote[] {
	const secPerBeat = 60 / tempo;
	return expected.map((note) => ({
		...note,
		startTimeSec: note.startBeat * secPerBeat,
		endTimeSec: (note.startBeat + note.duration) * secPerBeat,
	}));
}

/**
 * Estimates the playback start offset by finding the first pitch-matched
 * detected note for the first expected note. Falls back to aligning the
 * first detected note with the first expected note.
 */
function estimateStartOffset(detected: DetectedNote[], expected: TimedExpectedNote[]): number {
	if (detected.length === 0 || expected.length === 0) return 0;

	const firstExpected = expected[0];
	const expectedMidi = noteNameToMidi(firstExpected.noteName, firstExpected.octave);

	const searchWindow = detected.slice(0, 5);
	for (const d of searchWindow) {
		if (d.pitch === expectedMidi) {
			return d.startTime - firstExpected.startTimeSec;
		}
	}

	return detected[0].startTime - firstExpected.startTimeSec;
}

/**
 * Aligns detected notes against expected notes and produces a per-note
 * comparison. Uses greedy best-match: for each expected note, finds the
 * best unclaimed detected note within `TIMING_TOLERANCE_SEC`, preferring
 * pitch matches then closest timing.
 */
export function comparePerformance(
	detected: DetectedNote[],
	expected: ExpectedNote[],
	tempo: number
): PerformanceComparison {
	if (expected.length === 0) {
		return {
			noteComparisons: [],
			extraNotes: [...detected],
			totalExpected: 0,
			notesHit: 0,
			notesMissed: 0,
			totalExtra: detected.length,
		};
	}

	const timed = beatsToSeconds(expected, tempo);
	const offset = estimateStartOffset(detected, timed);
	const claimed = new Set<number>();
	const noteComparisons: NoteComparison[] = [];

	for (let i = 0; i < timed.length; i++) {
		const exp = timed[i];
		const expectedStart = exp.startTimeSec + offset;
		const expectedMidi = noteNameToMidi(exp.noteName, exp.octave);

		let bestIdx = -1;
		let bestScore = -Infinity;

		for (let j = 0; j < detected.length; j++) {
			if (claimed.has(j)) continue;

			const d = detected[j];
			const timeDiff = Math.abs(d.startTime - expectedStart);
			if (timeDiff > TIMING_TOLERANCE_SEC) continue;

			const pitchMatch = d.pitch === expectedMidi;
			const timingScore = 1 - timeDiff / TIMING_TOLERANCE_SEC;
			const score = (pitchMatch ? 1000 : 0) + timingScore;

			if (score > bestScore) {
				bestScore = score;
				bestIdx = j;
			}
		}

		if (bestIdx >= 0) {
			claimed.add(bestIdx);
			const d = detected[bestIdx];
			noteComparisons.push({
				noteIndex: i,
				expected: exp,
				detected: d,
				pitchCorrect: d.pitch === expectedMidi,
				timingOffsetSec: d.startTime - expectedStart,
				status: "hit",
			});
		} else {
			noteComparisons.push({
				noteIndex: i,
				expected: exp,
				detected: null,
				pitchCorrect: false,
				timingOffsetSec: 0,
				status: "missed",
			});
		}
	}

	const extraNotes = detected.filter((_, i) => !claimed.has(i));
	const notesHit = noteComparisons.filter((c) => c.status === "hit").length;

	return {
		noteComparisons,
		extraNotes,
		totalExpected: expected.length,
		notesHit,
		notesMissed: expected.length - notesHit,
		totalExtra: extraNotes.length,
	};
}
