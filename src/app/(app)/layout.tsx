// Authenticated app layout: wraps all main app pages with AppShell (sidebar + header)
// TODO: Add auth guard (redirect to /login if not authenticated)

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: ReactNode }) {
	return <AppShell>{children}</AppShell>;
}
