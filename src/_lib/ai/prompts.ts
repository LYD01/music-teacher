import type { AccuracyReport } from "@_types";

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
