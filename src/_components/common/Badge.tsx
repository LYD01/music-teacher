import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "secondary" | "accent" | "destructive" | "outline";

const variantStyles: Record<BadgeVariant, string> = {
	default: "bg-primary text-primary-foreground",
	secondary: "bg-secondary text-secondary-foreground",
	accent: "bg-accent text-accent-foreground",
	destructive: "bg-destructive text-destructive-foreground",
	outline: "border border-border bg-transparent",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: BadgeVariant;
}

export function Badge({
	className = "",
	variant = "default",
	...props
}: BadgeProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
			{...props}
		/>
	);
}
