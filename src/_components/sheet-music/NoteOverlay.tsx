"use client";

// Overlays correct (green) / incorrect (red) indicators on the rendered sheet music
// Positioned relative to the OSMD SVG output after analysis

import type { ComparisonResult } from "@/lib/music/comparison";

interface NoteOverlayProps {
	results: ComparisonResult[];
	className?: string;
}

export function NoteOverlay({ results, className = "" }: NoteOverlayProps) {
	void results;

	return (
		<div className={`pointer-events-none absolute inset-0 ${className}`}>
			{/* TODO: Render colored overlays on OSMD note positions */}
		</div>
	);
}
