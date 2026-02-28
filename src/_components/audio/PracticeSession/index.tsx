"use client";

import { AudioControls } from "@_components/audio/AudioControls";
import { AudioVisualizer } from "@_components/audio/AudioVisualizer";
import { Badge } from "@_components/common/Badge";
import { SheetMusicViewer } from "@_components/sheet-music/SheetMusicViewer";
import { useMicrophone } from "@_hooks/use-microphone";
import type { Piece } from "@_types";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const difficultyVariant = {
	beginner: "accent" as const,
	intermediate: "default" as const,
	advanced: "destructive" as const,
};

interface PracticeSessionProps {
	piece: Piece;
}

export function PracticeSession({ piece }: PracticeSessionProps) {
	const mic = useMicrophone();
	const [isStarting, setIsStarting] = useState(false);

	const handleStart = useCallback(async () => {
		setIsStarting(true);
		await mic.start();
		setIsStarting(false);
	}, [mic.start]);

	const handleStop = useCallback(() => {
		mic.stop();
		console.log("[Audio] Pipeline stopped");
	}, [mic.stop]);

	// Console-log audio levels at ~2 Hz while capturing
	const lastLogTimeRef = useRef(0);

	useEffect(() => {
		if (!mic.isCapturing) return;

		const sampleRate = mic.sampleRate;
		console.log(`[Audio] Pipeline started — sampleRate: ${sampleRate}, fftSize: 2048`);

		let frameId: number;

		const logLoop = () => {
			const now = performance.now();
			if (now - lastLogTimeRef.current >= 500) {
				const data = mic.getTimeDomain();
				if (data) {
					let rms = 0;
					let peak = 0;
					for (let i = 0; i < data.length; i++) {
						const abs = Math.abs(data[i]);
						rms += data[i] * data[i];
						if (abs > peak) peak = abs;
					}
					rms = Math.sqrt(rms / data.length);
					const dBFS = rms > 0 ? 20 * Math.log10(rms) : -Infinity;

					console.log(
						`[Audio] Level: ${dBFS.toFixed(1)} dBFS | RMS: ${rms.toFixed(4)} | Peak: ${peak.toFixed(4)}`
					);
				}
				lastLogTimeRef.current = now;
			}
			frameId = requestAnimationFrame(logLoop);
		};

		logLoop();
		return () => cancelAnimationFrame(frameId);
	}, [mic.isCapturing, mic.getTimeDomain, mic.sampleRate]);

	return (
		<div className="space-y-4">
			{/* Header bar */}
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<Link
						href={`/piece/${piece.id}`}
						className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<title>Back</title>
							<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
						</svg>
						Back
					</Link>

					<div>
						<h1 className="text-lg font-bold text-foreground sm:text-xl">{piece.title}</h1>
						<p className="text-xs text-muted-foreground">{piece.composer}</p>
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge variant={difficultyVariant[piece.difficulty] ?? "secondary"}>
						{piece.difficulty}
					</Badge>
					{piece.tempo > 0 && <Badge variant="secondary">{piece.tempo} BPM</Badge>}
				</div>
			</div>

			{/* Main layout */}
			<div className="grid gap-4 lg:grid-cols-3">
				{/* Left: sheet music + audio controls */}
				<div className="space-y-4 lg:col-span-2">
					<SheetMusicViewer musicxmlUrl={piece.musicxmlPath} />

					{/* Audio control bar */}
					<div className="rounded-xl border border-border bg-card p-4">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<AudioControls
								isRecording={mic.isCapturing}
								isLoading={isStarting}
								onStartRecording={handleStart}
								onStopRecording={handleStop}
								error={mic.error}
							/>

							<AudioVisualizer
								isActive={mic.isCapturing}
								getTimeDomain={mic.getTimeDomain}
								className="flex-1"
							/>
						</div>

						{mic.isCapturing && (
							<p className="mt-3 text-xs text-muted-foreground">
								Audio data is streaming to the browser console. Open DevTools (F12) to inspect.
							</p>
						)}
					</div>
				</div>

				{/* Right sidebar: avatar + feedback placeholders */}
				<div className="space-y-4">
					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
						<svg
							className="mb-2 h-10 w-10 text-muted-foreground/40"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
							aria-hidden="true"
						>
							<title>Avatar</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z"
							/>
						</svg>
						<p className="text-sm font-medium text-muted-foreground">3D Avatar</p>
						<p className="mt-1 text-xs text-muted-foreground/60">Coming in Phase 4</p>
					</div>

					<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
						<svg
							className="mb-2 h-10 w-10 text-muted-foreground/40"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={1.5}
							aria-hidden="true"
						>
							<title>Feedback</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
							/>
						</svg>
						<p className="text-sm font-medium text-muted-foreground">AI Feedback</p>
						<p className="mt-1 text-xs text-muted-foreground/60">Coming in Phase 4</p>
					</div>
				</div>
			</div>
		</div>
	);
}
