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

const OLLAMA_BASE_URL = process.env.OLLAMA_URL ?? "http://localhost:11434";

export async function generateFeedback(
  _prompt: string,
  _systemPrompt?: string,
): Promise<string> {
  // TODO: POST to ${OLLAMA_BASE_URL}/api/generate
  void OLLAMA_BASE_URL;
  throw new Error("Not implemented");
}

export async function checkOllamaHealth(): Promise<boolean> {
  // TODO: GET ${OLLAMA_BASE_URL}/api/tags to verify Ollama is running
  void OLLAMA_BASE_URL;
  return false;
}
