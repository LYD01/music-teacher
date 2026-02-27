// Detected vs expected note comparison engine
// Aligns detected notes to expected timeline and flags correct/incorrect/missed

import type { DetectedNote } from "@/types/audio";
import type { ExpectedNote } from "@/lib/audio/analyzer";

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
