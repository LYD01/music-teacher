import { PublicNav } from "@_components";
import type { ReactNode } from "react";

export default function CmsLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<PublicNav />
			{children}
		</>
	);
}
