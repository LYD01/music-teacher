const routeTitles: Record<string, string> = {
	"/dashboard": "Dashboard",
	"/library": "Library",
	"/history": "History",
	"/settings": "Settings",
	"/manage": "Manage Pieces",
};

export function getPageTitle(pathname: string | null): string {
	if (!pathname) return "App";
	for (const [path, title] of Object.entries(routeTitles)) {
		if (pathname === path || pathname.startsWith(`${path}/`)) {
			return title;
		}
	}
	if (pathname.startsWith("/piece/")) {
		// Could be /piece/123 or /piece/123/practice
		return pathname.includes("/practice") ? "Practice" : "Piece";
	}
	return "App";
}
