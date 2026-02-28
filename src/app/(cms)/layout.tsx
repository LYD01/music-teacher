import type { ReactNode } from "react";
import { PublicNav } from "@_components";

export default function CmsLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<PublicNav />
			{children}
		</>
	);
}
