"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@_lib";

const navLinks = [
	{ href: "/blog", label: "Blog" },
	{ href: "/community", label: "Community" },
	{ href: "/docs", label: "Docs" },
	{ href: "/sample", label: "Components" },
] as const;

function UserAvatar({ name, image }: { name: string; image?: string | null }) {
	const initials = name
		.split(" ")
		.map((s) => s[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-muted text-xs font-medium text-foreground">
			{image ? (
				<img src={image} alt="" className="h-full w-full rounded-full object-cover" />
			) : (
				initials
			)}
		</span>
	);
}

export function PublicNav() {
	const pathname = usePathname();
	const { data: session, isPending } = authClient.useSession();
	const [mobileOpen, setMobileOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const toggleRef = useRef<HTMLButtonElement>(null);

	const isSignedIn = !isPending && !!session?.user;

	// biome-ignore lint/correctness/useExhaustiveDependencies: close menu on route change
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	useEffect(() => {
		if (!mobileOpen) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setMobileOpen(false);
				toggleRef.current?.focus();
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setMobileOpen(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [mobileOpen]);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
			<div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-12">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
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
					<span className="text-lg font-bold text-foreground">AMT</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
					{navLinks.map(({ href, label }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								aria-current={isActive ? "page" : undefined}
								className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								{label}
							</Link>
						);
					})}
				</nav>

				{/* Desktop auth area */}
				<div className="hidden items-center gap-3 md:flex">
					{isPending ? (
						<div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
					) : isSignedIn ? (
						<>
							<Link
								href="/dashboard"
								className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								Dashboard
							</Link>
							<Link href="/dashboard" className="transition-opacity hover:opacity-80">
								<UserAvatar
									name={session.user.name || session.user.email}
									image={session.user.image}
								/>
							</Link>
						</>
					) : (
						<>
							<Link
								href="/auth/sign-in"
								className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
							>
								Sign in
							</Link>
							<Link
								href="/auth/sign-up"
								className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
							>
								Get started
							</Link>
						</>
					)}
				</div>

				{/* Mobile hamburger */}
				<button
					ref={toggleRef}
					type="button"
					onClick={() => setMobileOpen((prev) => !prev)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
					aria-expanded={mobileOpen}
					aria-controls="mobile-nav-menu"
					aria-label={mobileOpen ? "Close menu" : "Open menu"}
				>
					<svg
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						{mobileOpen ? (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						) : (
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						)}
					</svg>
				</button>
			</div>

			{/* Mobile menu */}
			<section
				ref={menuRef}
				id="mobile-nav-menu"
				aria-label="Mobile navigation"
				className={`overflow-hidden border-t border-border transition-[max-height,opacity] duration-200 ease-in-out md:hidden ${
					mobileOpen ? "max-h-96 opacity-100" : "max-h-0 border-t-transparent opacity-0"
				}`}
			>
				<nav className="space-y-1 px-6 py-4 sm:px-8">
					{navLinks.map(({ href, label }) => {
						const isActive = pathname === href;
						return (
							<Link
								key={href}
								href={href}
								aria-current={isActive ? "page" : undefined}
								className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								{label}
							</Link>
						);
					})}
					<div className="my-3 h-px bg-border" />
					{isSignedIn ? (
						<>
							<Link
								href="/dashboard"
								className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<UserAvatar
									name={session.user.name || session.user.email}
									image={session.user.image}
								/>
								<span>Dashboard</span>
							</Link>
						</>
					) : (
						<>
							<Link
								href="/auth/sign-in"
								className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								Sign in
							</Link>
							<Link
								href="/auth/sign-up"
								className="mt-2 block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
							>
								Get started
							</Link>
						</>
					)}
				</nav>
			</section>
		</header>
	);
}
