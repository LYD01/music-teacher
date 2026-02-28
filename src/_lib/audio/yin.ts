/**
 * YIN pitch detection algorithm.
 *
 * Based on "YIN, a fundamental frequency estimator for speech and music"
 * (de Cheveigné & Kawahara, 2002).
 *
 * This implementation pre-allocates all working buffers at construction time
 * so the detect() hot path triggers zero garbage collection.
 *
 * When a Rust/WASM build is available, the PitchDetector wrapper in
 * pitch-detector.ts will delegate to the WASM module instead.
 */

export interface YinResult {
	frequency: number;
	clarity: number;
}

export class YinDetector {
	private readonly halfSize: number;
	private readonly sampleRate: number;
	private readonly threshold: number;
	private readonly yinBuffer: Float32Array;

	constructor(bufferSize: number, sampleRate: number, threshold = 0.15) {
		this.halfSize = bufferSize >>> 1;
		this.sampleRate = sampleRate;
		this.threshold = threshold;
		this.yinBuffer = new Float32Array(this.halfSize);
	}

	detect(audioBuffer: Float32Array): YinResult | null {
		const n = this.halfSize;
		const yb = this.yinBuffer;

		// Step 1 — Squared difference function
		for (let tau = 0; tau < n; tau++) {
			let sum = 0;
			for (let i = 0; i < n; i++) {
				const d = audioBuffer[i] - audioBuffer[i + tau];
				sum += d * d;
			}
			yb[tau] = sum;
		}

		// Step 2 — Cumulative mean normalized difference
		yb[0] = 1.0;
		let runningSum = 0.0;
		for (let tau = 1; tau < n; tau++) {
			runningSum += yb[tau];
			yb[tau] = (yb[tau] * tau) / runningSum;
		}

		// Step 3 — Absolute threshold: find first dip below threshold,
		// then walk to the local minimum
		let tauEstimate = -1;
		for (let tau = 2; tau < n; tau++) {
			if (yb[tau] < this.threshold) {
				while (tau + 1 < n && yb[tau + 1] < yb[tau]) {
					tau++;
				}
				tauEstimate = tau;
				break;
			}
		}

		if (tauEstimate === -1) return null;

		// Step 4 — Parabolic interpolation for sub-sample accuracy
		let refinedTau: number;

		if (tauEstimate > 0 && tauEstimate < n - 1) {
			const s0 = yb[tauEstimate - 1];
			const s1 = yb[tauEstimate];
			const s2 = yb[tauEstimate + 1];
			const shift = (s0 - s2) / (2 * (s0 - 2 * s1 + s2));
			refinedTau = Number.isFinite(shift) ? tauEstimate + shift : tauEstimate;
		} else {
			refinedTau = tauEstimate;
		}

		return {
			frequency: this.sampleRate / refinedTau,
			clarity: 1 - yb[tauEstimate],
		};
	}
}
