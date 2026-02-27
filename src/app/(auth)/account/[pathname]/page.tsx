"use client";

import "@neondatabase/neon-js/ui/css";
import { AccountView } from "@neondatabase/neon-js/auth/react/ui";
import { useParams } from "next/navigation";

export default function AccountPage() {
	const { pathname } = useParams<{ pathname: string }>();
	return (
		<div className="flex min-h-screen items-center justify-center">
			<AccountView pathname={pathname} />
		</div>
	);
}
