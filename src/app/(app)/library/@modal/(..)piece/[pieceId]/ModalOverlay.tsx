"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect } from "react";

export function ModalCloseButton() {
	const router = useRouter();
	return (
		<button
			type="button"
			onClick={() => router.back()}
			className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			aria-label="Close"
		>
			<svg
				className="h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
				aria-hidden="true"
			>
				<title>Close</title>
				<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	);
}

function Overlay({ children }: { children: ReactNode }) {
	const router = useRouter();

	const onDismiss = useCallback(() => {
		router.back();
	}, [router]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onDismiss();
		}
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onDismiss]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onDismiss}
				aria-label="Close modal"
			/>
			<div className="relative z-10">{children}</div>
		</div>
	);
}

export { Overlay as ModalOverlay };
