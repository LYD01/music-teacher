"use client";

import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth";

export function NeonAuthProvider({ children }: { children: ReactNode }) {
	return (
		<NeonAuthUIProvider emailOTP authClient={authClient}>
			{children}
		</NeonAuthUIProvider>
	);
}
