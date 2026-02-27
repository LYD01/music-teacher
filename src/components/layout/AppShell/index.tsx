"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PracticeHeader } from "@/components/layout/PracticeHeader";

interface AppShellProps {
	children: ReactNode;
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	role?: "student" | "admin";
}

function isPracticePage(pathname: string | null): boolean {
	return pathname?.includes("/practice") ?? false;
}

function AppShellInner({ children, user, role = "student" }: AppShellProps) {
	const pathname = usePathname();
	const practiceMode = isPracticePage(pathname);

	if (practiceMode) {
		return (
			<div className="flex h-screen flex-col">
				<PracticeHeader pieceTitle="Practice Session" />
				<main
					id="main-content"
					className="flex-1 overflow-y-auto p-4 md:p-6"
				>
					{children}
				</main>
			</div>
		);
	}

	return (
		<div className="flex h-screen">
			<Sidebar role={role} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header user={user} role={role} />
				<main
					id="main-content"
					className="flex-1 overflow-y-auto p-4 pb-20 md:pb-6 md:pt-6"
				>
					{children}
				</main>
			</div>
			<MobileBottomNav role={role} />
		</div>
	);
}

export function AppShell({ children, user, role = "student" }: AppShellProps) {
	return (
		<SidebarProvider>
			<AppShellInner user={user} role={role}>
				{children}
			</AppShellInner>
		</SidebarProvider>
	);
}
