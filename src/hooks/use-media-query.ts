"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport matches the given media query.
 * Uses window.matchMedia for SSR-safe behavior (returns false until hydrated).
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		setMatches(media.matches);

		const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
		media.addEventListener("change", handler);
		return () => media.removeEventListener("change", handler);
	}, [query]);

	return matches;
}
