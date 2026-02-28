"use client";

// React Three Fiber canvas + scene for the 3D music teacher avatar
// Lazy-loaded only on the practice page to keep bundle size small

import type { AvatarMood } from "@/types/feedback";

interface AvatarSceneProps {
	mood: AvatarMood;
	className?: string;
}

export function AvatarScene({ mood, className = "" }: AvatarSceneProps) {
	void mood;

	return (
		<div className={`flex items-center justify-center rounded-lg border border-border bg-card ${className}`}>
			<p className="p-8 text-sm text-muted-foreground">3D Avatar scene placeholder — R3F integration pending</p>
		</div>
	);
}
