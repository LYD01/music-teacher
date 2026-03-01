"use client";

import type { NoteComparison } from "@_lib/music/comparison";
import { useEffect, useRef } from "react";
import type { SheetMusicViewerHandle } from "./SheetMusicViewer";

const HIT_CORRECT_COLOR = "#22c55e";
const HIT_WRONG_PITCH_COLOR = "#f59e0b";
const MISSED_COLOR = "#ef4444";

interface NoteOverlayProps {
	noteComparisons: NoteComparison[];
	viewerRef: React.RefObject<SheetMusicViewerHandle | null>;
	className?: string;
}

/**
 * After a practice session ends, applies green/amber/red coloring
 * to the OSMD SVG elements based on the comparison results.
 *
 * - Green: note hit with correct pitch
 * - Amber: note hit but wrong pitch
 * - Red: note missed entirely
 */
export function NoteOverlay({ noteComparisons, viewerRef, className = "" }: NoteOverlayProps) {
	const appliedRef = useRef(false);

	useEffect(() => {
		if (noteComparisons.length === 0) {
			appliedRef.current = false;
			return;
		}

		appliedRef.current = false;
		let cancelled = false;
		const timers: ReturnType<typeof setTimeout>[] = [];

		const tryApply = (attempt = 0) => {
			if (cancelled) return;
			const osmd = viewerRef.current?.getOsmd();
			if (osmd) {
				applyPostSessionColors(osmd, noteComparisons);
				appliedRef.current = true;
				return;
			}
			if (attempt < 10) {
				const t = setTimeout(() => tryApply(attempt + 1), 80);
				timers.push(t);
			}
		};

		timers.push(setTimeout(() => tryApply(0), 50));

		return () => {
			cancelled = true;
			for (const t of timers) clearTimeout(t);
		};
	}, [noteComparisons, viewerRef]);

	return <div className={`pointer-events-none ${className}`} />;
}

function applyPostSessionColors(osmd: unknown, comparisons: NoteComparison[]): void {
	try {
		// biome-ignore lint/suspicious/noExplicitAny: OSMD's `graphic` is protected
		const graphic = (osmd as Record<string, any>).graphic as {
			measureList?: {
				staffEntries?: {
					graphicalVoiceEntries?: {
						notes?: {
							getSVGGElement?: () => SVGGElement | null;
							sourceNote?: { isRestNote?: boolean };
						}[];
					}[];
				}[];
			}[][];
		};
		if (!graphic?.measureList) return;

		const compMap = new Map<number, NoteComparison>();
		for (const c of comparisons) {
			compMap.set(c.noteIndex, c);
		}

		let noteCounter = 0;

		for (const measureRow of graphic.measureList) {
			if (!measureRow) continue;
			for (const measure of measureRow) {
				if (!measure?.staffEntries) continue;
				for (const entry of measure.staffEntries) {
					if (!entry?.graphicalVoiceEntries) continue;
					for (const voiceEntry of entry.graphicalVoiceEntries) {
						if (!voiceEntry?.notes) continue;
						for (const note of voiceEntry.notes) {
							if (note.sourceNote?.isRestNote) continue;

							const comp = compMap.get(noteCounter);
							if (comp) {
								let color: string;
								let cssClass: string;

								if (comp.status === "hit" && comp.pitchCorrect) {
									color = HIT_CORRECT_COLOR;
									cssClass = "note-hit";
								} else if (comp.status === "hit") {
									color = HIT_WRONG_PITCH_COLOR;
									cssClass = "note-hit-wrong";
								} else {
									color = MISSED_COLOR;
									cssClass = "note-miss";
								}

								const svgEl = note.getSVGGElement?.();
								if (svgEl) {
									const shapes = svgEl.querySelectorAll(
										"path, circle, line, rect, polygon, ellipse"
									);
									for (const el of shapes) {
										(el as SVGElement).style.fill = color;
										(el as SVGElement).style.stroke = color;
										(el as SVGElement).style.transition = "fill 0.3s ease, stroke 0.3s ease";
									}
									svgEl.classList.add("note-colored", cssClass);
								}
							}

							noteCounter++;
						}
					}
				}
			}
		}
	} catch {
		// Structure traversal is best-effort
	}
}
