import type { AccuracyReport, DetectedNote } from "@_types";
import { create } from "zustand";

export interface SessionState {
	isActive: boolean;
	isPaused: boolean;
	currentPieceId: string | null;
	elapsedTime: number;
	detectedNotes: DetectedNote[];
	currentReport: AccuracyReport | null;

	startSession: (pieceId: string) => void;
	pauseSession: () => void;
	resumeSession: () => void;
	endSession: () => void;
	addDetectedNote: (note: DetectedNote) => void;
	setReport: (report: AccuracyReport) => void;
	reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
	isActive: false,
	isPaused: false,
	currentPieceId: null,
	elapsedTime: 0,
	detectedNotes: [],
	currentReport: null,

	startSession: (pieceId) =>
		set({
			isActive: true,
			isPaused: false,
			currentPieceId: pieceId,
			elapsedTime: 0,
			detectedNotes: [],
			currentReport: null,
		}),

	pauseSession: () => set({ isPaused: true }),

	resumeSession: () => set({ isPaused: false }),

	endSession: () => set({ isActive: false, isPaused: false }),

	addDetectedNote: (note) =>
		set((state) => ({
			detectedNotes: [...state.detectedNotes, note],
		})),

	setReport: (report) => set({ currentReport: report }),

	reset: () =>
		set({
			isActive: false,
			isPaused: false,
			currentPieceId: null,
			elapsedTime: 0,
			detectedNotes: [],
			currentReport: null,
		}),
}));
