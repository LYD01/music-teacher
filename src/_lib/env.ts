function required(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

function optional(key: string, fallback: string): string {
	return process.env[key] ?? fallback;
}

export const env = {
	get neonAuthBaseUrl() {
		return required("NEON_AUTH_BASE_URL");
	},
	get neonAuthCookieSecret() {
		return required("NEON_AUTH_COOKIE_SECRET");
	},
	get ollamaUrl() {
		return optional("OLLAMA_URL", "http://localhost:11434");
	},
} as const;
