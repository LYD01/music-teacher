"use client";

import { authClient } from "@_lib/auth";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import type { ReactNode } from "react";

export function NeonAuthProvider({ children }: { children: ReactNode }) {
	return (
		<NeonAuthUIProvider emailOTP authClient={authClient}>
			{children}
		</NeonAuthUIProvider>
	);
}
