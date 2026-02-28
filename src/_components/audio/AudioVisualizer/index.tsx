"use client";

// Real-time audio waveform / frequency visualizer using Canvas
// Displays live pitch data during practice sessions

interface AudioVisualizerProps {
	isActive: boolean;
	className?: string;
}

export function AudioVisualizer({ isActive, className = "" }: AudioVisualizerProps) {
	void isActive;

	return (
		<div className={`rounded-lg border border-border bg-card p-4 ${className}`}>
			<canvas className="h-32 w-full" />
			<p className="mt-2 text-center text-xs text-muted-foreground">Audio visualizer placeholder</p>
		</div>
	);
}
