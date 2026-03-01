import type { AudioPipelineConfig } from "@_types";

export interface AudioPipeline {
	context: AudioContext;
	stream: MediaStream;
	source: MediaStreamAudioSourceNode;
	analyser: AnalyserNode;
}

const DEFAULT_CONFIG: AudioPipelineConfig = {
	sampleRate: 44100,
	fftSize: 2048,
	smoothingTimeConstant: 0.8,
};

/**
 * Creates the full audio capture pipeline:
 * Microphone → MediaStreamSource → AnalyserNode
 *
 * Audio processing constraints (echoCancellation, noiseSuppression, autoGainControl)
 * are disabled to preserve the raw signal for accurate pitch detection.
 * The pipeline does NOT connect to the audio destination — no playback feedback loop.
 */
export async function createAudioPipeline(
	config?: Partial<AudioPipelineConfig>
): Promise<AudioPipeline> {
	const { sampleRate, fftSize, smoothingTimeConstant } = {
		...DEFAULT_CONFIG,
		...config,
	};

	const stream = await navigator.mediaDevices.getUserMedia({
		audio: {
			echoCancellation: false,
			noiseSuppression: false,
			autoGainControl: false,
			sampleRate: { ideal: sampleRate },
		},
	});

	const context = new AudioContext({ sampleRate });

	if (context.state === "suspended") {
		await context.resume();
	}

	const source = context.createMediaStreamSource(stream);

	const analyser = context.createAnalyser();
	analyser.fftSize = fftSize;
	analyser.smoothingTimeConstant = smoothingTimeConstant;

	source.connect(analyser);

	return { context, stream, source, analyser };
}

export function destroyAudioPipeline(pipeline: AudioPipeline): void {
	pipeline.source.disconnect();

	for (const track of pipeline.stream.getTracks()) {
		track.stop();
	}

	if (pipeline.context.state !== "closed") {
		pipeline.context.close();
	}
}

/** Reads the current time-domain waveform from the analyser into a Float32Array. */
export function getTimeDomainData(analyser: AnalyserNode): Float32Array {
	const buffer = new Float32Array(analyser.fftSize);
	analyser.getFloatTimeDomainData(buffer);
	return buffer;
}

/** Reads the current frequency-domain data (dB values) from the analyser. */
export function getFrequencyData(analyser: AnalyserNode): Float32Array {
	const buffer = new Float32Array(analyser.frequencyBinCount);
	analyser.getFloatFrequencyData(buffer);
	return buffer;
}
