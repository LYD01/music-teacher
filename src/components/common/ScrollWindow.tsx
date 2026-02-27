import type { HTMLAttributes } from "react";

interface ScrollWindowProps extends HTMLAttributes<HTMLDivElement> {
	/** Maximum height before scrolling kicks in */
	maxHeight?: string | number;
	/** Gradient colors for the scrollbar (default: primary → accent) */
	gradientFrom?: string;
	gradientTo?: string;
}

export function ScrollWindow({
	children,
	className = "",
	maxHeight = "20rem",
	gradientFrom = "var(--primary)",
	gradientTo = "var(--accent)",
	style,
	...props
}: ScrollWindowProps) {
	const maxHeightValue =
		typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight;

	return (
		<div
			className={`scroll-window overflow-y-auto overflow-x-hidden rounded-lg border border-border bg-card ${className}`}
			style={{
				maxHeight: maxHeightValue,
				// Custom scrollbar gradient via CSS variables
				["--scroll-gradient-from" as string]: gradientFrom,
				["--scroll-gradient-to" as string]: gradientTo,
				...style,
			}}
			{...props}
		>
			{children}
		</div>
	);
}
