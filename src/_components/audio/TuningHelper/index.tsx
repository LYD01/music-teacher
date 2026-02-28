"use client";

// Displays a tuning indicator showing current detected pitch
// Helps the student tune their instrument before a practice session

interface TuningHelperProps {
	detectedFrequency: number | null;
	targetFrequency: number | null;
	className?: string;
}

export function TuningHelper({
	detectedFrequency,
	targetFrequency,
	className = "",
}: TuningHelperProps) {
	void detectedFrequency;
	void targetFrequency;

	return (
		<div
			className={`flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 ${className}`}
		>
			<p className="text-sm text-muted-foreground">Tuning helper placeholder</p>
		</div>
	);
}
