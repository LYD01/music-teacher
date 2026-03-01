import { env } from "../env";

export interface OllamaRequest {
	model: string;
	prompt: string;
	system?: string;
	stream?: boolean;
}

export interface OllamaResponse {
	response: string;
	done: boolean;
}

const DEFAULT_MODEL = "llama3.2";
const TIMEOUT_MS = 30_000;

export async function generateFeedback(prompt: string, systemPrompt?: string): Promise<string> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

	try {
		const res = await fetch(`${env.ollamaUrl}/api/generate`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: DEFAULT_MODEL,
				prompt,
				system: systemPrompt,
				stream: false,
			} satisfies OllamaRequest),
			signal: controller.signal,
		});

		if (!res.ok) {
			throw new Error(`Ollama responded with ${res.status}`);
		}

		const data = (await res.json()) as OllamaResponse;
		return data.response;
	} finally {
		clearTimeout(timer);
	}
}

export async function checkOllamaHealth(): Promise<boolean> {
	try {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 3_000);
		const res = await fetch(`${env.ollamaUrl}/api/tags`, {
			signal: controller.signal,
		});
		clearTimeout(timer);
		return res.ok;
	} catch {
		return false;
	}
}
