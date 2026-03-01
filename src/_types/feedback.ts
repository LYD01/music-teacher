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
