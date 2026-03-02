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
const STREAM_TIMEOUT_MS = 15_000;

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

/**
 * Streams a response from Ollama as a ReadableStream of text chunks.
 * Each Ollama NDJSON line contains { response: "token", done: bool }.
 * We extract the token text and re-emit it as plain text chunks.
 */
export async function generateFeedbackStream(
	prompt: string,
	systemPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), STREAM_TIMEOUT_MS);

	const res = await fetch(`${env.ollamaUrl}/api/generate`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model: DEFAULT_MODEL,
			prompt,
			system: systemPrompt,
			stream: true,
		} satisfies OllamaRequest),
		signal: controller.signal,
	});

	if (!res.ok || !res.body) {
		clearTimeout(timer);
		throw new Error(`Ollama responded with ${res.status}`);
	}

	const reader = res.body.getReader();
	const decoder = new TextDecoder();
	const encoder = new TextEncoder();
	let buffer = "";

	return new ReadableStream<Uint8Array>({
		async pull(ctrl) {
			try {
				const { done, value } = await reader.read();
				if (done) {
					if (buffer.trim()) {
						const token = extractToken(buffer);
						if (token) ctrl.enqueue(encoder.encode(token));
					}
					clearTimeout(timer);
					ctrl.close();
					return;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() ?? "";

				for (const line of lines) {
					const token = extractToken(line);
					if (token) ctrl.enqueue(encoder.encode(token));
				}
			} catch (err) {
				clearTimeout(timer);
				ctrl.error(err);
			}
		},
		cancel() {
			clearTimeout(timer);
			reader.cancel();
		},
	});
}

function extractToken(line: string): string | null {
	const trimmed = line.trim();
	if (!trimmed) return null;
	try {
		const parsed = JSON.parse(trimmed) as OllamaResponse;
		return parsed.response || null;
	} catch {
		return null;
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
