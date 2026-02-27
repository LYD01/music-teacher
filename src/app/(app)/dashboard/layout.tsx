// Dashboard layout with parallel route slots

import type { ReactNode } from "react";

export default function DashboardLayout({
	children,
	history,
	progress,
}: {
	children: ReactNode;
	history: ReactNode;
	progress: ReactNode;
}) {
	return (
		<div className="space-y-6">
			{children}
			<div className="grid gap-6 lg:grid-cols-2">
				{history}
				{progress}
			</div>
		</div>
	);
}
