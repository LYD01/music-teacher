"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const routeLabels: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/library": "Library",
	"/history": "History",
	"/settings": "Settings",
	"/manage": "Manage Pieces",
};

function getPageTitle(pathname: string | null): string {
	if (!pathname) return "Page";
	for (const [path, label] of Object.entries(routeLabels)) {
		if (pathname === path || pathname.startsWith(`${path}/`)) {
			return label;
		}
	}
	if (pathname.startsWith("/piece/")) {
		return "Piece";
	}
	return "Page";
}

export function RouteAnnouncer() {
	const pathname = usePathname();
	const [announcement, setAnnouncement] = useState("");
	const prevPathRef = useRef<string | null>(null);

	useEffect(() => {
		if (pathname !== prevPathRef.current) {
			prevPathRef.current = pathname;
			setAnnouncement(`Navigated to ${getPageTitle(pathname)}`);
			const t = setTimeout(() => setAnnouncement(""), 1000);
			return () => clearTimeout(t);
		}
	}, [pathname]);

	return (
		<output
			aria-live="polite"
			aria-atomic="true"
			className="sr-only"
		>
			{announcement}
		</output>
	);
}
