"use client";

import { useSidebar } from "@_hooks";
import { ChevronLeftIcon, ChevronRightIcon, getNavItemsForRole } from "@_lib/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
	role?: "student" | "admin";
	className?: string;
}

export function Sidebar({ role = "student", className = "" }: SidebarProps) {
	const pathname = usePathname();
	const { collapsed, toggle } = useSidebar();
	const items = getNavItemsForRole(role);
	const primaryItems = items.filter((i) => i.section === "primary");
	const adminItems = items.filter((i) => i.section === "admin");
	const bottomItems = items.filter((i) => i.section === "bottom");

	const linkBase =
		"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
	const linkActive = "bg-primary/10 text-primary";
	const linkInactive = "text-muted-foreground hover:bg-muted hover:text-foreground";

	return (
		<aside
			className={`hidden flex-col border-r border-border bg-card md:flex ${collapsed ? "w-16" : "w-60"} ${className}`}
		>
			{/* Logo */}
			<div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3">
				<Link href="/dashboard" className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
						<svg
							className="h-5 w-5 text-primary"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M9 18V5l12-3v13" />
							<circle cx="6" cy="18" r="3" />
							<circle cx="18" cy="15" r="3" />
						</svg>
					</span>
					{!collapsed && (
						<span className="truncate text-lg font-bold text-foreground">Music Teacher</span>
					)}
				</Link>
			</div>

			{/* Primary nav */}
			<nav
				className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3"
				aria-label="Main navigation"
			>
				{primaryItems.map(({ href, label, icon: Icon }) => {
					const isActive = pathname === href || pathname?.startsWith(`${href}/`);
					return (
						<Link
							key={href}
							href={href}
							aria-current={isActive ? "page" : undefined}
							title={collapsed ? label : undefined}
							className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
						>
							<Icon className="h-5 w-5 shrink-0" aria-hidden />
							{!collapsed && <span className="truncate">{label}</span>}
						</Link>
					);
				})}

				{adminItems.length > 0 && (
					<>
						<div className="my-2 h-px bg-border" aria-hidden />
						{adminItems.map(({ href, label, icon: Icon }) => {
							const isActive = pathname === href || pathname?.startsWith(`${href}/`);
							return (
								<Link
									key={href}
									href={href}
									aria-current={isActive ? "page" : undefined}
									title={collapsed ? label : undefined}
									className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
								>
									<Icon className="h-5 w-5 shrink-0" aria-hidden />
									{!collapsed && <span className="truncate">{label}</span>}
								</Link>
							);
						})}
					</>
				)}
				{bottomItems.length > 0 && (
					<>
						<div className="my-2 h-px bg-border" aria-hidden />
						{bottomItems.map(({ href, label, icon: Icon }) => {
							const isActive = pathname === href || pathname?.startsWith(`${href}/`);
							return (
								<Link
									key={href}
									href={href}
									aria-current={isActive ? "page" : undefined}
									title={collapsed ? label : undefined}
									className={`${linkBase} ${isActive ? linkActive : linkInactive}`}
								>
									<Icon className="h-5 w-5 shrink-0" aria-hidden />
									{!collapsed && <span className="truncate">{label}</span>}
								</Link>
							);
						})}
					</>
				)}
			</nav>

			{/* Bottom: collapse toggle */}
			<div className="border-t border-border p-2">
				<button
					type="button"
					onClick={toggle}
					className={`${linkBase} w-full justify-center text-muted-foreground`}
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? (
						<ChevronRightIcon className="h-5 w-5" aria-hidden />
					) : (
						<>
							<ChevronLeftIcon className="h-5 w-5" aria-hidden />
							<span>Collapse</span>
						</>
					)}
				</button>
			</div>
		</aside>
	);
}
