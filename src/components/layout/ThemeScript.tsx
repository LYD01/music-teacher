"use client";

import { useEffect } from "react";

export function ThemeScript() {
	useEffect(() => {
		const stored = localStorage.getItem("amt-theme");
		if (stored === "light" || stored === "dark") {
			document.documentElement.classList.add(stored);
		}
	}, []);
	return null;
}
