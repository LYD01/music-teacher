// Live practice session state (Zustand)
// Tracks current session: playing status, detected notes, elapsed time, scores

import type { DetectedNote } from "@/types/audio";
import type { AccuracyReport } from "@/types/feedback";

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

// TODO: export const useSessionStore = create<SessionState>((set) => ({ ... }));
void ({} as SessionState);
