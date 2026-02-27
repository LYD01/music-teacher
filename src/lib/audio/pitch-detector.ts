// Pitchy wrapper for real-time pitch detection
// Converts raw audio buffer → frequency + clarity values

import type { PitchDetectionConfig } from "@/types/audio";

export const DEFAULT_CONFIG: PitchDetectionConfig = {
  sampleRate: 44100,
  bufferSize: 2048,
  minConfidence: 0.9,
  minFrequency: 60,
  maxFrequency: 1500,
};

export function detectPitch(
  _buffer: Float32Array,
  _config?: Partial<PitchDetectionConfig>,
): { frequency: number; clarity: number } | null {
  // TODO: Use Pitchy's PitchDetector to analyze buffer
  throw new Error("Not implemented");
}
