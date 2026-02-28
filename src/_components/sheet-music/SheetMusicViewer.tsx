"use client";

// OpenSheetMusicDisplay (OSMD) wrapper component
// Renders MusicXML content as interactive sheet music notation
// Must be dynamically imported with ssr: false (OSMD needs the DOM)

interface SheetMusicViewerProps {
	musicxmlPath: string;
	highlightMeasure?: number;
	className?: string;
}

export function SheetMusicViewer({
	musicxmlPath,
	highlightMeasure,
	className = "",
}: SheetMusicViewerProps) {
	void musicxmlPath;
	void highlightMeasure;

	return (
		<div className={`rounded-lg border border-border bg-white p-4 ${className}`}>
			<p className="text-center text-sm text-muted-foreground">
				Sheet music viewer placeholder — OSMD integration pending
			</p>
		</div>
	);
}
