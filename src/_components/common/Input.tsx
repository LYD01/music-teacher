import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
	const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");

	return (
		<div className="space-y-2">
			{label && (
				<label htmlFor={inputId} className="block text-sm font-medium text-foreground">
					{label}
				</label>
			)}
			<input
				id={inputId}
				className={`flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-base transition-colors placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-destructive" : ""} ${className}`}
				{...props}
			/>
			{error && <p className="text-sm text-destructive">{error}</p>}
		</div>
	);
}
