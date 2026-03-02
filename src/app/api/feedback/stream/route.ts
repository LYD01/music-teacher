import { checkOllamaHealth, generateFeedbackStream } from "@_lib/ai/ollama-client";
import { buildLiveFeedbackPrompt, LIVE_FEEDBACK_SYSTEM_PROMPT } from "@_lib/ai/prompts";
import type { FeedbackTrigger, LiveFeedbackRequest } from "@_types";

const TRIGGER_FALLBACKS: Record<FeedbackTrigger, string[]> = {
	good_streak: [
		"Nice streak, keep it going!",
		"You're on a roll right now!",
		"Those notes are sounding great!",
		"Smooth playing, well done!",
	],
	bad_streak: [
		"Take it slow, you've got this.",
		"Try that passage one more time.",
		"Breathe and reset — no rush.",
		"Slow it down a touch, then build back up.",
	],
	periodic: [
		"Sounding good, keep going!",
		"Your timing is improving.",
		"Focus on keeping it steady.",
		"Good practice — stay with it.",
	],
	section_end: [
		"Nice work on that section!",
		"That passage is coming together.",
		"Good run through that part!",
		"Solid effort on that section.",
	],
};

function getRandomFallback(trigger: FeedbackTrigger): string {
	const pool = TRIGGER_FALLBACKS[trigger] ?? TRIGGER_FALLBACKS.periodic;
	return pool[Math.floor(Math.random() * pool.length)];
}

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as LiveFeedbackRequest;
		if (!body.trigger || !body.pieceTitle) {
			return new Response("Missing trigger or pieceTitle", { status: 400 });
		}

		const healthy = await checkOllamaHealth();
		if (!healthy) {
			const fallback = getRandomFallback(body.trigger);
			return new Response(fallback, {
				headers: { "Content-Type": "text/plain; charset=utf-8" },
			});
		}

		const prompt = buildLiveFeedbackPrompt(body);
		const stream = await generateFeedbackStream(prompt, LIVE_FEEDBACK_SYSTEM_PROMPT);

		return new Response(stream, {
			headers: {
				"Content-Type": "text/plain; charset=utf-8",
				"Transfer-Encoding": "chunked",
				"Cache-Control": "no-cache",
			},
		});
	} catch {
		return new Response("Keep going, you're doing great!", {
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}
}
