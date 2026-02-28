// WASM pitch detector wrapper
// Loads a Rust-compiled WASM module (YIN algorithm) and exposes a JS-friendly API.
// The WASM module is built with wasm-pack (bundler target) and imported as an ES module.
//
// Audio data flow:
//   AnalyserNode.getFloatTimeDomainData() → Float32Array → detectPitch() → { frequency, clarity }

import type { PitchDetectionConfig } from "@_types";

export const DEFAULT_CONFIG: PitchDetectionConfig = {
	sampleRate: 44100,
	bufferSize: 2048,
	minConfidence: 0.9,
	minFrequency: 60,
	maxFrequency: 1500,
};

export function detectPitch(
	_buffer: Float32Array,
	_config?: Partial<PitchDetectionConfig>
): { frequency: number; clarity: number } | null {
	// TODO: Load and call WASM pitch detector module (Rust YIN algorithm)
	// Will be implemented when we build the WASM module in the next phase step
	throw new Error("Not implemented — awaiting WASM module build");
}
