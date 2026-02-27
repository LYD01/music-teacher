"use client";

import "@neondatabase/neon-js/ui/css";
import { AuthView } from "@neondatabase/neon-js/auth/react/ui";
import { useParams } from "next/navigation";

export default function AuthPage() {
	const { pathname } = useParams<{ pathname: string }>();
	return (
		<div className="flex min-h-screen items-center justify-center">
			<AuthView pathname={pathname} />
		</div>
	);
}
