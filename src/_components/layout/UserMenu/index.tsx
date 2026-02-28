"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient, LogOutIcon } from "@_lib";

interface UserMenuProps {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
	role?: "student" | "admin";
}

export function UserMenu({ user, role = "student" }: UserMenuProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!open) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setOpen(false);
				triggerRef.current?.focus();
			}
		}

		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	const displayName = user?.name ?? user?.email ?? "User";
	const initials = displayName
		.split(" ")
		.map((s) => s[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div className="relative" ref={menuRef}>
			<button
				ref={triggerRef}
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-muted text-sm font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				aria-expanded={open}
				aria-haspopup="true"
				aria-label="Open user menu"
			>
				{user?.image ? (
					<img
						src={user.image}
						alt=""
						className="h-full w-full rounded-full object-cover"
					/>
				) : (
					<span>{initials}</span>
				)}
			</button>

			{open && (
				<div
					className="absolute right-0 top-full z-50 mt-2 w-56 min-w-max rounded-lg border border-border bg-card py-1 shadow-lg"
					role="menu"
				>
					<div className="border-b border-border px-4 py-3">
						<p className="truncate text-sm font-medium text-foreground">
							{displayName}
						</p>
						{user?.email && (
							<p className="truncate text-xs text-muted-foreground">
								{user.email}
							</p>
						)}
					</div>
					<div className="py-1">
						<Link
							href="/settings"
							className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
							role="menuitem"
							onClick={() => setOpen(false)}
						>
							Settings
						</Link>
						{role === "admin" && (
							<Link
								href="/manage"
								className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
								role="menuitem"
								onClick={() => setOpen(false)}
							>
								Manage Pieces
							</Link>
						)}
					</div>
					<div className="border-t border-border py-1">
						<button
							type="button"
							className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							role="menuitem"
							onClick={async () => {
								setOpen(false);
								await authClient.signOut();
								router.push("/");
								router.refresh();
							}}
						>
							<LogOutIcon className="opacity-70" />
							Sign out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
