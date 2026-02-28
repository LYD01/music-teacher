"use client";

import type { ExpectedNote } from "@_lib/audio/analyzer";
import { computeAccuracy } from "@_lib/audio/analyzer";
import { comparePerformance, type PerformanceComparison } from "@_lib/music/comparison";
import { loadMusicXMLFile, parseMusicXML } from "@_lib/music/musicxml-parser";
import type { AccuracyReport, DetectedNote } from "@_types";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseComparisonReturn {
	expectedNotes: ExpectedNote[];
	comparison: PerformanceComparison | null;
	report: AccuracyReport | null;
	isLoading: boolean;
	error: string | null;
	analyze: (detectedNotes: DetectedNote[]) => void;
	reset: () => void;
}

export function useComparison(musicxmlPath: string, tempo: number): UseComparisonReturn {
	const [expectedNotes, setExpectedNotes] = useState<ExpectedNote[]>([]);
	const [comparison, setComparison] = useState<PerformanceComparison | null>(null);
	const [report, setReport] = useState<AccuracyReport | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const tempoRef = useRef(tempo);
	tempoRef.current = tempo;

	useEffect(() => {
		let cancelled = false;

		(async () => {
			setIsLoading(true);
			setError(null);

			try {
				const xmlContent = await loadMusicXMLFile(musicxmlPath);
				if (cancelled) return;

				const notes = parseMusicXML(xmlContent);
				setExpectedNotes(notes);
			} catch (err) {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : "Failed to load sheet music");
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [musicxmlPath]);

	const analyze = useCallback(
		(detectedNotes: DetectedNote[]) => {
			if (expectedNotes.length === 0) return;

			const comp = comparePerformance(detectedNotes, expectedNotes, tempoRef.current);
			setComparison(comp);

			const acc = computeAccuracy(comp);
			setReport(acc);
		},
		[expectedNotes]
	);

	const reset = useCallback(() => {
		setComparison(null);
		setReport(null);
	}, []);

	return {
		expectedNotes,
		comparison,
		report,
		isLoading,
		error,
		analyze,
		reset,
	};
}
