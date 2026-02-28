"use client";

import { ThemeToggle, UserMenu } from "@_components/layout";
import { getPageTitle } from "@_lib/client";
import { usePathname } from "next/navigation";

interface HeaderProps {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	role?: "student" | "admin";
	className?: string;
}

export function Header({ user, role = "student", className = "" }: HeaderProps) {
	const pathname = usePathname();
	const pageTitle = getPageTitle(pathname);

	return (
		<header
			className={`flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 md:px-6 ${className}`}
		>
			<h2 className="truncate text-base font-semibold text-foreground md:text-lg">{pageTitle}</h2>
			<div className="flex items-center gap-2">
				<ThemeToggle />
				<UserMenu user={user} role={role} />
			</div>
		</header>
	);
}
