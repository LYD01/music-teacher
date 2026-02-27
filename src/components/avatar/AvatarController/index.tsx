"use client";

// Controls avatar animation state based on practice session events
// Bridges the session store mood → R3F animation crossfade

import type { AvatarMood } from "@/types/feedback";

interface AvatarControllerProps {
	mood: AvatarMood;
}

export function AvatarController({ mood }: AvatarControllerProps) {
	void mood;

	// TODO: useFrame loop that drives animation mixer transitions
	return null;
}
