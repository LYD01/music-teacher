import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
	primary:
		"bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring",
	secondary:
		"bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-ring",
	outline:
		"border-2 border-border bg-transparent hover:bg-muted focus-visible:ring-ring",
	ghost: "hover:bg-muted focus-visible:ring-ring",
	destructive:
		"bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "h-8 px-3 text-sm",
	md: "h-10 px-4 text-base",
	lg: "h-12 px-6 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

export function Button({
	className = "",
	variant = "primary",
	size = "md",
	disabled,
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			disabled={disabled}
			{...props}
		/>
	);
}
