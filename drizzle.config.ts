// Drizzle ORM config for Vercel Neon
// Run: npx drizzle-kit push

import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });
config({ path: "src/.env.local" });

function withVerifyFullSsl(url: string): string {
	if (!url) return url;
	if (url.includes("sslmode=verify-full")) return url;
	if (url.includes("sslmode=")) return url.replace(/sslmode=[^&]+/, "sslmode=verify-full");
	const sep = url.includes("?") ? "&" : "?";
	return `${url}${sep}sslmode=verify-full`;
}

export default defineConfig({
	schema: "./src/_lib/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: withVerifyFullSsl(process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? ""),
	},
});
