"use client";

import { PitchDetector } from "@_lib/audio/pitch-detector";
import { frequencyToNote, type NoteName } from "@_lib/music/theory";
import type { PitchDetectionConfig } from "@_types";
import { useEffect, useRef, useState } from "react";

export interface PitchInfo {
	frequency: number;
	clarity: number;
	noteName: NoteName;
	octave: number;
	cents: number;
}

const UPDATE_INTERVAL_MS = 50; // ~20 fps state updates
const NOTE_HOLD_MS = 500; // keep last note visible briefly after signal drops

export function usePitchDetection(
	getTimeDomain: () => Float32Array | null,
	isActive: boolean,
	config?: Partial<PitchDetectionConfig>
): PitchInfo | null {
	const [pitch, setPitch] = useState<PitchInfo | null>(null);
	const detectorRef = useRef<PitchDetector | null>(null);
	const lastDetectedAtRef = useRef(0);
	const configRef = useRef(config);
	configRef.current = config;

	useEffect(() => {
		if (!isActive) {
			setPitch(null);
			return;
		}

		const detector = new PitchDetector(configRef.current);
		detectorRef.current = detector;

		detector.tryInitWasm();

		let frameId: number;
		let lastUpdate = 0;

		const loop = () => {
			const now = performance.now();

			if (now - lastUpdate >= UPDATE_INTERVAL_MS) {
				const data = getTimeDomain();

				if (data) {
					const result = detector.detect(data);

					if (result) {
						const note = frequencyToNote(result.frequency);
						lastDetectedAtRef.current = now;
						setPitch({
							frequency: result.frequency,
							clarity: result.clarity,
							noteName: note.name,
							octave: note.octave,
							cents: note.cents,
						});
					} else if (now - lastDetectedAtRef.current > NOTE_HOLD_MS) {
						setPitch(null);
					}
				}

				lastUpdate = now;
			}

			frameId = requestAnimationFrame(loop);
		};

		loop();

		return () => {
			cancelAnimationFrame(frameId);
			detectorRef.current = null;
		};
	}, [isActive, getTimeDomain]);

	return pitch;
}
