import type { ReactNode } from "react";
import { PublicNav } from "@/components/layout/PublicNav";

export default function CmsLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<PublicNav />
			{children}
		</>
	);
}
