export interface AccuracyReport {
	overallScore: number;
	pitchAccuracy: number;
	rhythmAccuracy: number;
	notesHit: number;
	notesMissed: number;
	totalNotes: number;
}

export interface FeedbackResponse {
	message: string;
	suggestions: string[];
	encouragement: string;
	focusAreas: string[];
}

export type AvatarMood =
	| "idle"
	| "listening"
	| "good_note"
	| "bad_note"
	| "great_streak"
	| "encouraging"
	| "celebrating"
	| "thinking";

export interface ReactionEvent {
	mood: AvatarMood;
	intensity: number;
	timestamp: number;
}

export interface AvatarConfig {
	modelUrl: string | null;
	modelName: string;
}

// ── Live feedback (streaming, during practice) ──────────────────────

export type FeedbackTrigger = "periodic" | "good_streak" | "bad_streak" | "section_end";

export type LiveFeedbackType = "encouragement" | "coaching" | "celebration" | "tip";

export interface LiveFeedbackMessage {
	id: string;
	text: string;
	type: LiveFeedbackType;
	timestamp: number;
}

export interface LiveFeedbackRequest {
	trigger: FeedbackTrigger;
	pieceTitle: string;
	recentCorrect: number;
	recentIncorrect: number;
	runningAccuracy: number;
	consecutiveHits: number;
	consecutiveMisses: number;
	previousMessage: string;
}
