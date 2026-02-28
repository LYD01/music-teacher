"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@_lib";

const THEME_KEY = "amt-theme";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

type Theme = "light" | "dark" | "system";

function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "system";
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === "light" || stored === "dark" || stored === "system") {
		return stored;
	}
	return "system";
}

function persistTheme(theme: Theme) {
	localStorage.setItem(THEME_KEY, theme);
	if (theme === "system") {
		// biome-ignore lint: intentional cookie management for SSR theme
		document.cookie = `${THEME_KEY}=; path=/; max-age=0`;
	} else {
		// biome-ignore lint: intentional cookie management for SSR theme
		document.cookie = `${THEME_KEY}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
	}
}

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.classList.remove("light", "dark");
	if (theme !== "system") {
		root.classList.add(theme);
	}
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("system");

	useEffect(() => {
		setTheme(getStoredTheme());
	}, []);

	useEffect(() => {
		applyTheme(theme);
		persistTheme(theme);
	}, [theme]);

	const cycle = () => {
		setTheme((prev) => {
			if (prev === "light") return "dark";
			if (prev === "dark") return "system";
			return "light";
		});
	};

	const label =
		theme === "light"
			? "Switch to dark mode"
			: theme === "dark"
				? "Switch to system theme"
				: "Switch to light mode";

	return (
		<button
			type="button"
			onClick={cycle}
			className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			aria-label={label}
			title={label}
		>
			{theme === "dark" ? (
				<MoonIcon className="text-foreground" />
			) : (
				<SunIcon />
			)}
		</button>
	);
}
