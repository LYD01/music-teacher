"use client";

// Play/pause/stop controls and mic toggle for practice sessions

interface AudioControlsProps {
	isRecording: boolean;
	onStartRecording: () => void;
	onStopRecording: () => void;
	onPause: () => void;
	className?: string;
}

export function AudioControls({
	isRecording,
	onStartRecording,
	onStopRecording,
	onPause,
	className = "",
}: AudioControlsProps) {
	void onPause;

	return (
		<div className={`flex items-center gap-3 ${className}`}>
			<button
				type="button"
				onClick={isRecording ? onStopRecording : onStartRecording}
				className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
			>
				{isRecording ? "Stop" : "Record"}
			</button>
		</div>
	);
}
