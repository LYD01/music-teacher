"use client";

import {
	type AudioPipeline,
	createAudioPipeline,
	destroyAudioPipeline,
	getFrequencyData,
	getTimeDomainData,
} from "@_lib/audio/capture";
import type { AudioCaptureState, AudioPipelineConfig } from "@_types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseMicrophoneReturn extends AudioCaptureState {
	analyser: AnalyserNode | null;
	sampleRate: number;
	start: () => Promise<void>;
	stop: () => void;
	getTimeDomain: () => Float32Array | null;
	getFrequency: () => Float32Array | null;
}

export function useMicrophone(config?: Partial<AudioPipelineConfig>): UseMicrophoneReturn {
	const [state, setState] = useState<AudioCaptureState>({
		isCapturing: false,
		stream: null,
		error: null,
	});

	const pipelineRef = useRef<AudioPipeline | null>(null);
	const configRef = useRef(config);
	configRef.current = config;

	const start = useCallback(async () => {
		if (pipelineRef.current) return;

		setState({ isCapturing: false, stream: null, error: null });

		try {
			const pipeline = await createAudioPipeline(configRef.current);
			pipelineRef.current = pipeline;
			setState({
				isCapturing: true,
				stream: pipeline.stream,
				error: null,
			});
		} catch (err) {
			const message =
				err instanceof DOMException && err.name === "NotAllowedError"
					? "Microphone access was denied. Please allow microphone access in your browser settings."
					: err instanceof DOMException && err.name === "NotFoundError"
						? "No microphone found. Please connect a microphone and try again."
						: err instanceof Error
							? err.message
							: "Failed to access microphone";

			setState({ isCapturing: false, stream: null, error: message });
		}
	}, []);

	const stop = useCallback(() => {
		if (!pipelineRef.current) return;

		destroyAudioPipeline(pipelineRef.current);
		pipelineRef.current = null;
		setState({ isCapturing: false, stream: null, error: null });
	}, []);

	const getTimeDomain = useCallback((): Float32Array | null => {
		if (!pipelineRef.current) return null;
		return getTimeDomainData(pipelineRef.current.analyser);
	}, []);

	const getFrequency = useCallback((): Float32Array | null => {
		if (!pipelineRef.current) return null;
		return getFrequencyData(pipelineRef.current.analyser);
	}, []);

	useEffect(() => {
		return () => {
			if (pipelineRef.current) {
				destroyAudioPipeline(pipelineRef.current);
				pipelineRef.current = null;
			}
		};
	}, []);

	return {
		...state,
		analyser: pipelineRef.current?.analyser ?? null,
		sampleRate: pipelineRef.current?.context.sampleRate ?? 0,
		start,
		stop,
		getTimeDomain,
		getFrequency,
	};
}
