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

export type AvatarMood = "idle" | "listening" | "encouraging" | "celebrating" | "thinking";
