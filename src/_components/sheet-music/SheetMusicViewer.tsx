"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SheetMusicViewerProps {
	musicxmlUrl: string;
	highlightMeasure?: number;
	className?: string;
	compact?: boolean;
}

export function SheetMusicViewer({
	musicxmlUrl,
	highlightMeasure,
	className = "",
	compact = false,
}: SheetMusicViewerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const osmdRef = useRef<InstanceType<
		typeof import("opensheetmusicdisplay").OpenSheetMusicDisplay
	> | null>(null);
	const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
	const [errorMsg, setErrorMsg] = useState("");

	const initOSMD = useCallback(async () => {
		const container = containerRef.current;
		if (!container) return;

		// OSMD requires container to have non-zero width; wait for layout
		if (container.offsetWidth <= 0) return;

		try {
			setStatus("loading");
			const { OpenSheetMusicDisplay } = await import("opensheetmusicdisplay");

			const osmd = new OpenSheetMusicDisplay(container, {
				autoResize: true,
				drawTitle: !compact,
				drawComposer: !compact,
				drawCredits: false,
				drawPartNames: false,
				drawPartAbbreviations: false,
				drawMeasureNumbers: true,
				drawMetronomeMarks: !compact,
			});

			osmdRef.current = osmd;

			const res = await fetch(musicxmlUrl);
			if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
			const xml = await res.text();

			await osmd.load(xml);
			osmd.render();
			setStatus("ready");
		} catch (err) {
			setErrorMsg(err instanceof Error ? err.message : "Failed to render sheet music");
			setStatus("error");
		}
	}, [musicxmlUrl, compact]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let cancelled = false;

		const runInit = () => {
			if (cancelled || container.offsetWidth <= 0) return;
			initOSMD();
		};

		runInit();

		const observer = new ResizeObserver(() => {
			if (!cancelled && container.offsetWidth > 0 && !osmdRef.current) {
				initOSMD();
			}
		});
		observer.observe(container);

		return () => {
			cancelled = true;
			observer.disconnect();
			osmdRef.current = null;
		};
	}, [initOSMD]);

	useEffect(() => {
		const osmd = osmdRef.current;
		if (!osmd || status !== "ready" || highlightMeasure == null) return;

		// Measure highlighting via OSMD cursor will be wired up in Phase 3
		// when the practice session page drives real-time playback position
		try {
			osmd.cursor.show();
		} catch {
			// Cursor API is best-effort
		}
	}, [highlightMeasure, status]);

	return (
		<div className={`relative rounded-lg border border-border bg-white ${className}`}>
			{/* Container must stay visible with dimensions so OSMD can render */}
			<div
				ref={containerRef}
				className={`osmd-container min-h-[400px] w-full ${compact ? "p-2" : "p-4"}`}
			/>

			{status === "loading" && (
				<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90 dark:bg-card/90">
					<div className="flex flex-col items-center gap-3">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
						<p className="text-sm text-muted-foreground">Loading sheet music...</p>
					</div>
				</div>
			)}

			{status === "error" && (
				<div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90 dark:bg-card/90">
					<div className="flex flex-col items-center gap-2 text-center">
						<svg
							className="h-8 w-8 text-destructive"
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
								d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p className="text-sm font-medium text-destructive">Failed to load sheet music</p>
						<p className="text-xs text-muted-foreground">{errorMsg}</p>
						<button
							type="button"
							onClick={initOSMD}
							className="mt-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
						>
							Retry
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
