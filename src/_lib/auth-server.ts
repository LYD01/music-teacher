import { createNeonAuth } from "@neondatabase/neon-js/auth/next/server";
import { env } from "./env";

export const auth = createNeonAuth({
	baseUrl: env.neonAuthBaseUrl,
	cookies: {
		secret: env.neonAuthCookieSecret,
		// Re-validate session with auth server every 24 hours
		sessionDataTtl: 24 * 60 * 60, // 24 hours in seconds
	},
});
