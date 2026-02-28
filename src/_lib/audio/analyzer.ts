// Score computation: compares detected notes against expected notes
// Produces an AccuracyReport with overall, pitch, and rhythm scores

import type { AccuracyReport, DetectedNote } from "@_types";

export interface ExpectedNote {
	noteName: string;
	octave: number;
	startBeat: number;
	duration: number;
}

export function computeAccuracy(
	_detected: DetectedNote[],
	_expected: ExpectedNote[]
): AccuracyReport {
	// TODO: Match detected to expected notes, compute pitch/rhythm scores
	throw new Error("Not implemented");
}
