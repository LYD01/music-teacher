"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMobileNavItems } from "@_lib";

interface MobileBottomNavProps {
	role?: "student" | "admin";
}

export function MobileBottomNav({ role = "student" }: MobileBottomNavProps) {
	const pathname = usePathname();
	const items = getMobileNavItems(role);

	return (
		<nav
			className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card pb-[env(safe-area-inset-bottom)] pt-2 md:hidden"
			aria-label="Mobile navigation"
		>
			{items.map(({ href, label, icon: Icon }) => {
				const isActive = pathname === href || pathname?.startsWith(`${href}/`);
				return (
					<Link
						key={href}
						href={href}
						aria-current={isActive ? "page" : undefined}
						aria-label={label}
						className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${
							isActive
								? "text-primary"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						<Icon
							className="h-6 w-6"
							aria-hidden
							strokeWidth={isActive ? 2.5 : 2}
						/>
						<span className="text-xs font-medium">{label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
