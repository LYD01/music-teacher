"use client";

interface AudioControlsProps {
	isRecording: boolean;
	isLoading?: boolean;
	onStartRecording: () => void;
	onStopRecording: () => void;
	onPause?: () => void;
	error?: string | null;
	className?: string;
}

export function AudioControls({
	isRecording,
	isLoading = false,
	onStartRecording,
	onStopRecording,
	onPause,
	error,
	className = "",
}: AudioControlsProps) {
	void onPause;

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<div className="flex items-center gap-3">
				<button
					type="button"
					disabled={isLoading}
					onClick={isRecording ? onStopRecording : onStartRecording}
					className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
						isRecording
							? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
							: "bg-primary text-primary-foreground hover:bg-primary/90"
					}`}
				>
					{isLoading ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							<span>Connecting...</span>
						</>
					) : isRecording ? (
						<>
							<span className="relative flex h-3 w-3">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
								<span className="relative inline-flex h-3 w-3 rounded-full bg-current" />
							</span>
							<span>Stop</span>
						</>
					) : (
						<>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={2}
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
							<span>Start Listening</span>
						</>
					)}
				</button>

				{isRecording && (
					<span className="text-xs text-green-600 dark:text-green-400">Listening...</span>
				)}
			</div>

			{error && (
				<div className="flex items-center gap-1.5 text-xs text-destructive">
					<svg
						className="h-3.5 w-3.5 shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<title>Error</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v2m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
						/>
					</svg>
					<span>{error}</span>
				</div>
			)}
		</div>
	);
}
