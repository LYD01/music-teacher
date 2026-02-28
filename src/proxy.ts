import { auth } from "@_lib";

export default auth.middleware({ loginUrl: "/auth/sign-in" });

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/library/:path*",
		"/piece/:path*",
		"/history/:path*",
		"/settings/:path*",
		"/manage/:path*",
	],
};
