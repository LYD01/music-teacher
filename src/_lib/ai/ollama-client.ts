// HTTP client for local Ollama instance
// Sends practice session data and receives AI teacher feedback

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

import { env } from "../env";

export async function generateFeedback(_prompt: string, _systemPrompt?: string): Promise<string> {
	// TODO: POST to ${env.ollamaUrl}/api/generate
	void env.ollamaUrl;
	throw new Error("Not implemented");
}

export async function checkOllamaHealth(): Promise<boolean> {
	// TODO: GET ${env.ollamaUrl}/api/tags to verify Ollama is running
	void env.ollamaUrl;
	return false;
}
