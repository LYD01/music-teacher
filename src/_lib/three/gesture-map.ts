import type { AvatarMood } from "@_types";

export function scoreToMood(score: number): AvatarMood {
	if (score >= 90) return "celebrating";
	if (score >= 70) return "encouraging";
	if (score >= 50) return "thinking";
	return "encouraging";
}

export function noteResultToMood(isCorrect: boolean, consecutiveHits: number): AvatarMood {
	if (!isCorrect) return "bad_note";
	if (consecutiveHits >= 5) return "great_streak";
	return "good_note";
}

const REACTION_DURATION_MS: Partial<Record<AvatarMood, number>> = {
	good_note: 600,
	bad_note: 800,
	great_streak: 1000,
	celebrating: 3000,
};

export function getReactionDuration(mood: AvatarMood): number {
	return REACTION_DURATION_MS[mood] ?? Number.POSITIVE_INFINITY;
}
