import type { AccuracyReport } from "@_types";
import type { PerformanceComparison } from "../music/comparison";

export interface ExpectedNote {
	noteName: string;
	octave: number;
	startBeat: number;
	duration: number;
}

const PITCH_WEIGHT = 0.6;
const RHYTHM_WEIGHT = 0.4;
const PERFECT_TIMING_SEC = 0.15;
const MAX_TIMING_SEC = 0.75;

/**
 * Computes an AccuracyReport from a PerformanceComparison.
 *
 * - pitchAccuracy: % of expected notes detected with correct pitch.
 * - rhythmAccuracy: average timing score (100 if within PERFECT_TIMING_SEC,
 *   linear decay to 0 at MAX_TIMING_SEC). Missed notes count as 0.
 * - overallScore: weighted combination (60% pitch, 40% rhythm).
 */
export function computeAccuracy(comparison: PerformanceComparison): AccuracyReport {
	const { noteComparisons, totalExpected } = comparison;

	if (totalExpected === 0) {
		return {
			overallScore: 0,
			pitchAccuracy: 0,
			rhythmAccuracy: 0,
			notesHit: 0,
			notesMissed: 0,
			totalNotes: 0,
		};
	}

	const correctPitch = noteComparisons.filter((c) => c.pitchCorrect).length;
	const pitchAccuracy = (correctPitch / totalExpected) * 100;

	let rhythmScoreSum = 0;
	for (const note of noteComparisons) {
		if (note.status === "missed") continue;

		const absOffset = Math.abs(note.timingOffsetSec);
		if (absOffset <= PERFECT_TIMING_SEC) {
			rhythmScoreSum += 100;
		} else if (absOffset < MAX_TIMING_SEC) {
			const range = MAX_TIMING_SEC - PERFECT_TIMING_SEC;
			rhythmScoreSum += (1 - (absOffset - PERFECT_TIMING_SEC) / range) * 100;
		}
	}
	const rhythmAccuracy = rhythmScoreSum / totalExpected;

	const overallScore = pitchAccuracy * PITCH_WEIGHT + rhythmAccuracy * RHYTHM_WEIGHT;

	return {
		overallScore: Math.round(overallScore * 10) / 10,
		pitchAccuracy: Math.round(pitchAccuracy * 10) / 10,
		rhythmAccuracy: Math.round(rhythmAccuracy * 10) / 10,
		notesHit: comparison.notesHit,
		notesMissed: comparison.notesMissed,
		totalNotes: totalExpected,
	};
}
