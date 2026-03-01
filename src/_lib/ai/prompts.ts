import type { AccuracyReport, LiveFeedbackRequest } from "@_types";

export const MUSIC_TEACHER_SYSTEM_PROMPT = `You are a friendly, encouraging music teacher avatar. You give concise, constructive feedback on a student's practice session.

Rules:
- Be warm and supportive — always start with something positive
- Give 1-2 specific, actionable suggestions
- Keep it brief (3-4 sentences max)
- Use simple language, no jargon
- If the score is high (>85%), celebrate their achievement
- If the score is low (<50%), be extra encouraging and focus on one improvement
- Respond in valid JSON with this exact shape: { "message": "...", "suggestions": ["...", "..."], "encouragement": "...", "focusAreas": ["...", "..."] }`;

export function buildFeedbackPrompt(pieceTitle: string, report: AccuracyReport): string {
	return `The student just finished practicing "${pieceTitle}".

Results:
- Overall score: ${report.overallScore}%
- Pitch accuracy: ${report.pitchAccuracy}%
- Rhythm accuracy: ${report.rhythmAccuracy}%
- Notes hit: ${report.notesHit}/${report.totalNotes}
- Notes missed: ${report.notesMissed}

Give your feedback as the JSON object described in your system prompt.`;
}

// ── Live micro-feedback (streaming, during practice) ─────────────────

export const LIVE_FEEDBACK_SYSTEM_PROMPT = `You are a music teacher watching a student practice in real-time. Give ONE short reaction sentence (15 words max). Plain text only, no JSON, no quotes, no formatting.

Tone rules:
- "good_streak" trigger → celebrate, be excited
- "bad_streak" trigger → gentle, encourage them to slow down or breathe
- "periodic" trigger → observe what's going well or give a quick tip
- "section_end" trigger → comment on the passage they just finished
- Never repeat the previous message
- Vary your vocabulary — don't always start with the same word
- Sound natural, like a real person coaching beside them`;

const TRIGGER_LABELS: Record<string, string> = {
	good_streak: "The student just hit a streak of correct notes!",
	bad_streak: "The student just missed several notes in a row.",
	periodic: "Checking in on the student's progress.",
	section_end: "The student just finished a section of the piece.",
};

export function buildLiveFeedbackPrompt(req: LiveFeedbackRequest): string {
	const triggerDesc = TRIGGER_LABELS[req.trigger] ?? "Checking in.";
	const parts = [
		`Piece: "${req.pieceTitle}"`,
		triggerDesc,
		`Recent notes: ${req.recentCorrect} correct, ${req.recentIncorrect} wrong.`,
		`Running accuracy: ${Math.round(req.runningAccuracy)}%.`,
	];

	if (req.consecutiveHits >= 5) {
		parts.push(`They're on a ${req.consecutiveHits}-note streak!`);
	}
	if (req.consecutiveMisses >= 3) {
		parts.push(`They've missed ${req.consecutiveMisses} in a row.`);
	}
	if (req.previousMessage) {
		parts.push(`Your last message was: "${req.previousMessage}" — say something different.`);
	}

	return parts.join("\n");
}
