"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

const SIDEBAR_STORAGE_KEY = "amt-sidebar-collapsed";

interface SidebarContextValue {
	collapsed: boolean;
	toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function getStoredCollapsed(): boolean {
	if (typeof window === "undefined") return false;
	try {
		return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
	} catch {
		return false;
	}
}

function setStoredCollapsed(value: boolean) {
	try {
		localStorage.setItem(SIDEBAR_STORAGE_KEY, value ? "true" : "false");
	} catch {
		// ignore
	}
}

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [collapsed, setCollapsed] = useState(false);

	useEffect(() => {
		setCollapsed(getStoredCollapsed());
	}, []);

	const toggle = useCallback(() => {
		setCollapsed((prev) => {
			const next = !prev;
			setStoredCollapsed(next);
			return next;
		});
	}, []);

	return (
		<SidebarContext.Provider value={{ collapsed, toggle }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar(): SidebarContextValue {
	const ctx = useContext(SidebarContext);
	if (!ctx) {
		throw new Error("useSidebar must be used within SidebarProvider");
	}
	return ctx;
}
