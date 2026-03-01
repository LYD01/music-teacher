"use client";

import type { ExpectedNote } from "@_lib/audio/analyzer";
import { elapsedToNoteIndex, syncCursorToNoteIndex } from "@_lib/music/cursor-sync";
import { noteNameToMidi } from "@_lib/music/theory";
import type { DetectedNote } from "@_types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SheetMusicViewerHandle } from "./SheetMusicViewer";
import { SheetMusicViewer } from "./SheetMusicViewer";

const CURSOR_SYNC_INTERVAL_MS = 80;
const TIMING_TOLERANCE_SEC = 1.0;
const HIT_COLOR = "#22c55e";
const MISS_COLOR = "#ef4444";

interface PracticeSheetMusicViewerProps {
	musicxmlUrl: string;
	expectedNotes: ExpectedNote[];
	tempo: number;
	/** Epoch ms when the session started recording, or null if not recording. */
	sessionStartTime: number | null;
	/** Live detected notes from the mic pipeline. */
	detectedNotes: DetectedNote[];
	/** Whether the session is actively recording. */
	isRecording: boolean;
	/** Ref to expose OSMD instance to parent (e.g. for NoteOverlay post-session coloring). */
	viewerRef?: React.RefObject<SheetMusicViewerHandle | null>;
	/**
	 * "time" = cursor/scroll advances with elapsed time (default).
	 * "hit" = cursor/scroll only advances when the user plays the correct note (Guitar Hero style).
	 */
	scrollMode?: "time" | "hit";
	className?: string;
}

/**
 * Wraps SheetMusicViewer with practice-specific behavior:
 * - Auto-scrolling cursor synced to elapsed time
 * - Live SVG note coloring when notes are hit/missed
 */
export function PracticeSheetMusicViewer({
	musicxmlUrl,
	expectedNotes,
	tempo,
	sessionStartTime,
	detectedNotes,
	isRecording,
	viewerRef: viewerRefProp,
	scrollMode = "hit",
	className = "",
}: PracticeSheetMusicViewerProps) {
	const internalRef = useRef<SheetMusicViewerHandle | null>(null);
	const viewerRef = viewerRefProp ?? internalRef;
	const lastNoteIndexRef = useRef(-1);
	const [hitIndices, setHitIndices] = useState<Set<number>>(new Set());
	const hitIndicesRef = useRef<Set<number>>(new Set());
	hitIndicesRef.current = hitIndices;
	const detectedRef = useRef<DetectedNote[]>([]);
	detectedRef.current = detectedNotes;

	const secPerBeat = useMemo(() => (tempo > 0 ? 60 / tempo : 1), [tempo]);

	const resetState = useCallback(() => {
		lastNoteIndexRef.current = -1;
		setHitIndices(new Set());

		const osmd = viewerRef.current?.getOsmd();
		if (!osmd) return;

		try {
			osmd.cursor.hide();
			osmd.cursor.reset();
		} catch {
			// best-effort
		}

		clearAllNoteColors(osmd);
	}, [viewerRef]);

	// Cursor sync loop: runs while recording
	useEffect(() => {
		if (!isRecording || sessionStartTime == null || expectedNotes.length === 0) {
			return;
		}

		const osmd = viewerRef.current?.getOsmd();
		if (!osmd) return;

		try {
			osmd.cursor.show();
		} catch {
			// best-effort
		}

		const interval = setInterval(() => {
			let noteIndex: number;

			if (scrollMode === "hit") {
				/* Guitar Hero style: only advance when correct notes are hit */
				const hits = hitIndicesRef.current;
				noteIndex = hits.size > 0 ? Math.min(Math.max(...hits) + 1, expectedNotes.length - 1) : 0;
			} else {
				/* Time-based: advance with elapsed time */
				const elapsed = (Date.now() - sessionStartTime) / 1000;
				noteIndex = elapsedToNoteIndex(elapsed, expectedNotes, tempo);
			}

			if (noteIndex !== lastNoteIndexRef.current && noteIndex >= 0) {
				lastNoteIndexRef.current = noteIndex;
				syncCursorToNoteIndex(osmd, noteIndex);

				scrollCursorIntoView(osmd, viewerRef.current?.getContainer());
			}
		}, CURSOR_SYNC_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [isRecording, sessionStartTime, expectedNotes, tempo, scrollMode, viewerRef]);

	// Live hit detection: match detected notes to expected notes
	useEffect(() => {
		if (!isRecording || sessionStartTime == null || expectedNotes.length === 0) return;

		const interval = setInterval(() => {
			const detected = detectedRef.current;
			if (detected.length === 0) return;

			const offset = sessionStartTime / 1000;
			const newHits = new Set(hitIndices);
			let changed = false;

			for (let i = 0; i < expectedNotes.length; i++) {
				if (newHits.has(i)) continue;

				const exp = expectedNotes[i];
				const expectedStartSec = exp.startBeat * secPerBeat;
				const expectedMidi = noteNameToMidi(exp.noteName, exp.octave);

				for (const d of detected) {
					const detStartSec = d.startTime - offset;
					if (Math.abs(detStartSec - expectedStartSec) > TIMING_TOLERANCE_SEC) continue;
					if (d.pitch === expectedMidi) {
						newHits.add(i);
						changed = true;
						break;
					}
				}
			}

			if (changed) {
				setHitIndices(newHits);
			}
		}, CURSOR_SYNC_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [isRecording, sessionStartTime, expectedNotes, secPerBeat, hitIndices]);

	// Apply SVG colors when hitIndices changes
	useEffect(() => {
		const osmd = viewerRef.current?.getOsmd();
		if (!osmd || !isRecording) return;

		applyNoteColors(osmd, hitIndices, lastNoteIndexRef.current);
	}, [hitIndices, isRecording, viewerRef]);

	// Reset when session ends
	useEffect(() => {
		if (!isRecording && sessionStartTime == null) {
			resetState();
		}
	}, [isRecording, sessionStartTime, resetState]);

	return (
		<SheetMusicViewer
			musicxmlUrl={musicxmlUrl}
			className={className}
			scrollHeight="60vh"
			enableFollowCursor
			handleRef={viewerRef}
		/>
	);
}

// ── SVG helpers ───────────────────────────────────────────────────────

function getGraphicalNotes(osmd: unknown): unknown[] {
	const notes: unknown[] = [];
	try {
		// biome-ignore lint/suspicious/noExplicitAny: OSMD's `graphic` is protected
		const graphic = (osmd as Record<string, any>).graphic as {
			measureList?: { staffEntries?: { graphicalVoiceEntries?: { notes?: unknown[] }[] }[] }[][];
		};
		if (!graphic?.measureList) return notes;

		for (const measureRow of graphic.measureList) {
			if (!measureRow) continue;
			for (const measure of measureRow) {
				if (!measure?.staffEntries) continue;
				for (const entry of measure.staffEntries) {
					if (!entry?.graphicalVoiceEntries) continue;
					for (const voiceEntry of entry.graphicalVoiceEntries) {
						if (!voiceEntry?.notes) continue;
						for (const note of voiceEntry.notes) {
							notes.push(note);
						}
					}
				}
			}
		}
	} catch {
		// Structure traversal is best-effort
	}
	return notes;
}

function setNoteSvgColor(note: unknown, color: string): void {
	try {
		const gNote = note as {
			getSVGGElement?: () => SVGGElement | null;
			sourceNote?: { isRestNote?: boolean };
		};

		if (gNote.sourceNote?.isRestNote) return;

		const svgEl = gNote.getSVGGElement?.();
		if (!svgEl) return;

		const elements = svgEl.querySelectorAll("path, circle, line, rect, polygon, ellipse");
		for (const el of elements) {
			(el as SVGElement).style.fill = color;
			(el as SVGElement).style.stroke = color;
			(el as SVGElement).style.transition = "fill 0.2s ease, stroke 0.2s ease";
		}

		svgEl.classList.add("note-colored");
	} catch {
		// best-effort
	}
}

function clearNoteSvgColor(note: unknown): void {
	try {
		const gNote = note as { getSVGGElement?: () => SVGGElement | null };
		const svgEl = gNote.getSVGGElement?.();
		if (!svgEl) return;

		const elements = svgEl.querySelectorAll("path, circle, line, rect, polygon, ellipse");
		for (const el of elements) {
			(el as SVGElement).style.fill = "";
			(el as SVGElement).style.stroke = "";
			(el as SVGElement).style.transition = "";
		}

		svgEl.classList.remove("note-colored", "note-hit", "note-miss");
	} catch {
		// best-effort
	}
}

function clearAllNoteColors(osmd: unknown): void {
	for (const note of getGraphicalNotes(osmd)) {
		clearNoteSvgColor(note);
	}
}

function applyNoteColors(osmd: unknown, hitIndices: Set<number>, currentNoteIndex: number): void {
	let noteCounter = 0;

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

							if (hitIndices.has(noteCounter)) {
								setNoteSvgColor(note, HIT_COLOR);
								const svgEl = note.getSVGGElement?.();
								if (svgEl) {
									svgEl.classList.add("note-hit");
									svgEl.classList.remove("note-miss");
								}
							} else if (noteCounter < currentNoteIndex) {
								setNoteSvgColor(note, MISS_COLOR);
								const svgEl = note.getSVGGElement?.();
								if (svgEl) {
									svgEl.classList.add("note-miss");
									svgEl.classList.remove("note-hit");
								}
							} else {
								clearNoteSvgColor(note);
							}
							noteCounter++;
						}
					}
				}
			}
		}
	} catch {
		// best-effort
	}
}

function scrollCursorIntoView(osmd: unknown, container?: HTMLDivElement | null): void {
	try {
		// biome-ignore lint/suspicious/noExplicitAny: access OSMD cursor internals
		const cursorEl = (osmd as Record<string, any>).cursor?.cursorElement;
		if (!cursorEl) return;

		const scrollParent = container?.closest(".scroll-window") ?? container?.parentElement;
		if (!scrollParent) return;

		const parentRect = scrollParent.getBoundingClientRect();
		const cursorRect = cursorEl.getBoundingClientRect();

		const cursorRelativeTop = cursorRect.top - parentRect.top + scrollParent.scrollTop;
		const targetScroll = cursorRelativeTop - parentRect.height / 3;

		scrollParent.scrollTo({
			top: Math.max(0, targetScroll),
			behavior: "smooth",
		});
	} catch {
		// best-effort
	}
}
