// Auth layout: centered card layout, no sidebar
// Used by login and signup pages

import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-4">
			<div className="w-full max-w-md">{children}</div>
		</div>
	);
}
