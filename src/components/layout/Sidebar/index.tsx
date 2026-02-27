"use client";

// App sidebar navigation for authenticated users
// Links to: Dashboard, Library, History

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ href: "/dashboard", label: "Dashboard" },
	{ href: "/library", label: "Library" },
	{ href: "/history", label: "History" },
] as const;

interface SidebarProps {
	className?: string;
}

export function Sidebar({ className = "" }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside className={`flex w-60 flex-col border-r border-border bg-card ${className}`}>
			<div className="p-6">
				<h1 className="text-lg font-bold text-foreground">Music Teacher</h1>
			</div>
			<nav className="flex flex-1 flex-col gap-1 px-3">
				{navItems.map(({ href, label }) => (
					<Link
						key={href}
						href={href}
						className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
							pathname?.startsWith(href)
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
						}`}
					>
						{label}
					</Link>
				))}
			</nav>
		</aside>
	);
}
