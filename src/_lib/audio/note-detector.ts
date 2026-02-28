// Onset/offset detection: converts raw pitch stream into discrete notes
// Handles debouncing, minimum duration thresholds, and note boundaries

import type { DetectedNote } from "@/types/audio";

export function processNoteStream(
  _pitchHistory: Array<{ frequency: number; time: number; clarity: number }>,
): DetectedNote[] {
  // TODO: Group consecutive similar pitches into discrete notes
  throw new Error("Not implemented");
}
