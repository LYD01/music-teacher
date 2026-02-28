import { AppShell } from "@_components";
import { auth } from "@_lib";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
	const { data: session } = await auth.getSession();

	if (!session?.user) {
		redirect("/auth/sign-in");
	}

	const role = session.user.role === "admin" ? "admin" : "student";

	return (
		<AppShell user={session.user} role={role}>
			{children}
		</AppShell>
	);
}
