"use client";

import type { PitchInfo } from "@_hooks/use-pitch-detection";

interface PitchDisplayProps {
	pitch: PitchInfo | null;
	isListening: boolean;
	className?: string;
}

function tuningColor(absCents: number): string {
	if (absCents <= 5) return "text-green-500";
	if (absCents <= 15) return "text-yellow-500";
	return "text-red-400";
}

function meterColor(absCents: number): string {
	if (absCents <= 5) return "bg-green-500";
	if (absCents <= 15) return "bg-yellow-500";
	return "bg-red-400";
}

export function PitchDisplay({ pitch, isListening, className = "" }: PitchDisplayProps) {
	if (!isListening) {
		return (
			<div
				className={`flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 ${className}`}
			>
				<svg
					className="mb-2 h-8 w-8 text-muted-foreground/40"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={1.5}
					aria-hidden="true"
				>
					<title>Microphone</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
					/>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2" />
					<line x1="12" y1="19" x2="12" y2="23" />
					<line x1="8" y1="23" x2="16" y2="23" />
				</svg>
				<p className="text-sm font-medium text-muted-foreground">Pitch Detection</p>
				<p className="mt-1 text-xs text-muted-foreground/60">Start listening to detect notes</p>
			</div>
		);
	}

	if (!pitch) {
		return (
			<div
				className={`flex flex-col items-center justify-center rounded-xl border border-border bg-card p-6 ${className}`}
			>
				<span className="text-4xl font-bold text-muted-foreground/30">--</span>

				<Meter cents={0} active={false} />

				<p className="mt-2 text-xs text-muted-foreground">Play a note...</p>
			</div>
		);
	}

	const absCents = Math.abs(pitch.cents);
	const color = tuningColor(absCents);

	return (
		<div
			className={`flex flex-col items-center rounded-xl border border-border bg-card p-6 ${className}`}
		>
			{/* Note name */}
			<div className={`font-bold leading-none ${color}`}>
				<span className="text-5xl">{pitch.noteName}</span>
				<span className="text-2xl align-sub">{pitch.octave}</span>
			</div>

			{/* Frequency */}
			<p className="mt-1 text-sm tabular-nums text-muted-foreground">
				{pitch.frequency.toFixed(1)} Hz
			</p>

			{/* Tuning meter */}
			<Meter cents={pitch.cents} active />

			{/* Cents readout */}
			<p className={`mt-1 text-xs font-medium tabular-nums ${color}`}>
				{pitch.cents > 0 ? "+" : ""}
				{pitch.cents} cents
			</p>

			{/* Confidence bar */}
			<div className="mt-3 flex w-full items-center gap-2">
				<span className="text-[10px] text-muted-foreground/60">Confidence</span>
				<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
					<div
						className="h-full rounded-full bg-primary/60 transition-all duration-100"
						style={{
							width: `${Math.round(pitch.clarity * 100)}%`,
						}}
					/>
				</div>
				<span className="text-[10px] tabular-nums text-muted-foreground/60">
					{Math.round(pitch.clarity * 100)}%
				</span>
			</div>
		</div>
	);
}

function Meter({ cents, active }: { cents: number; active: boolean }) {
	const clamped = Math.max(-50, Math.min(50, cents));
	const position = ((clamped + 50) / 100) * 100;
	const absCents = Math.abs(cents);

	return (
		<div className="relative mt-4 mb-1 h-6 w-full max-w-[200px]">
			{/* Track */}
			<div className="absolute top-2.5 left-0 right-0 h-[3px] rounded-full bg-muted" />

			{/* Green zone highlight around center */}
			<div className="absolute top-2.5 left-[45%] h-[3px] w-[10%] rounded-full bg-green-500/20" />

			{/* Center tick */}
			<div className="absolute top-1.5 left-1/2 h-3 w-px -translate-x-1/2 bg-muted-foreground/30" />

			{/* Quarter ticks */}
			<div className="absolute top-2 left-1/4 h-2 w-px bg-muted-foreground/15" />
			<div className="absolute top-2 left-3/4 h-2 w-px bg-muted-foreground/15" />

			{/* Flat / Sharp labels */}
			<span className="absolute top-0 left-0 text-[10px] leading-none text-muted-foreground/40">
				&#9837;
			</span>
			<span className="absolute top-0 right-0 text-[10px] leading-none text-muted-foreground/40">
				&#9839;
			</span>

			{/* Needle */}
			{active && (
				<div
					className={`absolute top-1 h-4 w-2 rounded-sm transition-all duration-75 ${meterColor(absCents)}`}
					style={{
						left: `${position}%`,
						transform: "translateX(-50%)",
					}}
				/>
			)}
		</div>
	);
}
