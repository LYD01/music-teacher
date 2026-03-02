"use client";

import { useRef } from "react";

interface ModelUploaderProps {
	modelName: string;
	isLoading: boolean;
	error: string | null;
	onUpload: (file: File) => Promise<void>;
	onRemove: () => void;
}

export function ModelUploader({
	modelName,
	isLoading,
	error,
	onUpload,
	onRemove,
}: ModelUploaderProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) onUpload(file);
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<div className="flex items-center gap-2">
			<div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5">
				<span className="truncate text-xs text-muted-foreground">
					{isLoading ? "Loading..." : modelName}
				</span>
			</div>

			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={isLoading}
				className="shrink-0 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
			>
				Upload .glb
			</button>

			{modelName !== "Default" && (
				<button
					type="button"
					onClick={onRemove}
					className="shrink-0 rounded-lg border border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
					title="Remove custom model"
				>
					✕
				</button>
			)}

			<input
				ref={inputRef}
				type="file"
				accept=".glb,.gltf"
				onChange={handleChange}
				className="hidden"
			/>

			{error && <p className="text-xs text-destructive">{error}</p>}
		</div>
	);
}
