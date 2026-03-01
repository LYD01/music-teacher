/**
 * Pitch detection facade.
 *
 * Tries to load the Rust/WASM module from /wasm/pitch_detector_bg.wasm.
 * If unavailable, falls back to the TypeScript YIN implementation.
 * Consumers don't need to know which backend is active.
 */

import type { PitchDetectionConfig } from "@_types";
import { YinDetector, type YinResult } from "./yin";

export const DEFAULT_CONFIG: PitchDetectionConfig = {
	sampleRate: 44100,
	bufferSize: 2048,
	minConfidence: 0.85,
	minFrequency: 60,
	maxFrequency: 1500,
};

export type PitchResult = YinResult;

interface WasmExports {
	memory: WebAssembly.Memory;
	alloc: (bytes: number) => number;
	dealloc: (ptr: number, bytes: number) => void;
	detect_pitch: (ptr: number, len: number, sampleRate: number, threshold: number) => number;
	get_frequency: (resultPtr: number) => number;
	get_clarity: (resultPtr: number) => number;
	get_detected: (resultPtr: number) => number;
	free_result: (resultPtr: number) => void;
}

export class PitchDetector {
	private readonly config: PitchDetectionConfig;
	private readonly yin: YinDetector;
	private wasm: WasmExports | null = null;
	private wasmInitAttempted = false;

	constructor(config?: Partial<PitchDetectionConfig>) {
		this.config = { ...DEFAULT_CONFIG, ...config };
		this.yin = new YinDetector(this.config.bufferSize, this.config.sampleRate, 0.15);
	}

	/**
	 * Attempts to load the WASM backend. Non-blocking — if the .wasm file
	 * is missing, the JS fallback remains active.
	 */
	async tryInitWasm(): Promise<boolean> {
		if (this.wasmInitAttempted) return this.wasm !== null;
		this.wasmInitAttempted = true;

		try {
			const response = await fetch("/wasm/pitch_detector_bg.wasm");
			if (!response.ok) throw new Error(`HTTP ${response.status}`);

			const { instance } = await WebAssembly.instantiateStreaming(response);
			this.wasm = instance.exports as unknown as WasmExports;
			console.log("[PitchDetector] WASM backend loaded");
			return true;
		} catch {
			console.log("[PitchDetector] WASM unavailable, using JS backend");
			return false;
		}
	}

	get backend(): "wasm" | "js" {
		return this.wasm ? "wasm" : "js";
	}

	detect(buffer: Float32Array): PitchResult | null {
		const raw = this.wasm ? this.detectWasm(buffer) : this.yin.detect(buffer);

		if (!raw) return null;
		if (raw.clarity < this.config.minConfidence) return null;
		if (raw.frequency < this.config.minFrequency) return null;
		if (raw.frequency > this.config.maxFrequency) return null;

		return raw;
	}

	private detectWasm(buffer: Float32Array): PitchResult | null {
		const wasm = this.wasm as WasmExports;
		const byteLen = buffer.length * 4;
		const ptr = wasm.alloc(byteLen);

		const view = new Float32Array(wasm.memory.buffer, ptr, buffer.length);
		view.set(buffer);

		const resultPtr = wasm.detect_pitch(ptr, buffer.length, this.config.sampleRate, 0.15);
		wasm.dealloc(ptr, byteLen);

		const detected = wasm.get_detected(resultPtr) !== 0;
		if (!detected) {
			wasm.free_result(resultPtr);
			return null;
		}

		const frequency = wasm.get_frequency(resultPtr);
		const clarity = wasm.get_clarity(resultPtr);
		wasm.free_result(resultPtr);

		return { frequency, clarity };
	}
}
