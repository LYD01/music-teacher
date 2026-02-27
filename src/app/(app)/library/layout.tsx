// Library layout with modal parallel route slot

import type { ReactNode } from "react";

export default function LibraryLayout({
	children,
	modal,
}: {
	children: ReactNode;
	modal: ReactNode;
}) {
	return (
		<>
			{children}
			{modal}
		</>
	);
}
