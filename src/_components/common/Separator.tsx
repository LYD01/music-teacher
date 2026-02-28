import type { HTMLAttributes } from "react";

interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
}

export function Separator({
	orientation = "horizontal",
	className = "",
	...props
}: SeparatorProps) {
	return (
		<div
			role="presentation"
			className={`shrink-0 bg-border ${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"} ${className}`}
			{...props}
		/>
	);
}
