// Detected vs expected note comparison engine
// Aligns detected notes to expected timeline and flags correct/incorrect/missed

import type { ExpectedNote } from "@_lib/audio/analyzer";
import type { DetectedNote } from "@_types";

export interface ComparisonResult {
  noteIndex: number;
  expected: ExpectedNote;
  detected: DetectedNote | null;
  pitchCorrect: boolean;
  timingOffset: number;
}

export function comparePerformance(
  _detected: DetectedNote[],
  _expected: ExpectedNote[],
): ComparisonResult[] {
  // TODO: Align and compare note-by-note
  throw new Error("Not implemented");
}
