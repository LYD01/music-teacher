import { checkOllamaHealth, generateFeedback } from "@_lib/ai/ollama-client";
import { buildFeedbackPrompt, MUSIC_TEACHER_SYSTEM_PROMPT } from "@_lib/ai/prompts";
import type { AccuracyReport, FeedbackResponse } from "@_types";
import { NextResponse } from "next/server";

interface FeedbackRequestBody {
	pieceTitle: string;
	report: AccuracyReport;
}

const FALLBACK: FeedbackResponse = {
	message: "Great effort! Keep practicing and you'll keep improving.",
	suggestions: [
		"Try playing more slowly to nail the tricky passages",
		"Focus on the notes you missed and repeat those measures",
	],
	encouragement: "Every practice session makes you better!",
	focusAreas: ["pitch accuracy", "steady rhythm"],
};

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as FeedbackRequestBody;
		if (!body.pieceTitle || !body.report) {
			return NextResponse.json({ error: "Missing pieceTitle or report" }, { status: 400 });
		}

		const healthy = await checkOllamaHealth();
		if (!healthy) {
			return NextResponse.json(buildScoreFallback(body.report));
		}

		const prompt = buildFeedbackPrompt(body.pieceTitle, body.report);
		const raw = await generateFeedback(prompt, MUSIC_TEACHER_SYSTEM_PROMPT);

		try {
			const jsonMatch = raw.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				const parsed = JSON.parse(jsonMatch[0]) as FeedbackResponse;
				return NextResponse.json(parsed);
			}
		} catch {}

		return NextResponse.json({
			...FALLBACK,
			message: raw.slice(0, 500),
		});
	} catch {
		return NextResponse.json(buildScoreFallback(null));
	}
}

function buildScoreFallback(report: AccuracyReport | null): FeedbackResponse {
	if (!report) return FALLBACK;

	const score = report.overallScore;
	if (score >= 90) {
		return {
			message: "Outstanding performance! You nailed it!",
			suggestions: ["Try increasing the tempo for an extra challenge"],
			encouragement: "You're playing at a mastery level!",
			focusAreas: [],
		};
	}
	if (score >= 70) {
		return {
			message: "Nice work! You're getting the hang of this piece.",
			suggestions: [
				"Work on the passages where you missed notes",
				"Try playing along with a metronome for tighter rhythm",
			],
			encouragement: "You're making real progress!",
			focusAreas: report.pitchAccuracy < report.rhythmAccuracy ? ["pitch accuracy"] : ["rhythm"],
		};
	}
	return {
		...FALLBACK,
		message: `Good effort on this practice session! You hit ${report.notesHit} out of ${report.totalNotes} notes.`,
	};
}
