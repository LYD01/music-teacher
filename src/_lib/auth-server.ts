import { createNeonAuth } from "@neondatabase/neon-js/auth/next/server";
import { env } from "./env";

export const auth = createNeonAuth({
	baseUrl: env.neonAuthBaseUrl,
	cookies: {
		secret: env.neonAuthCookieSecret,
	},
});
