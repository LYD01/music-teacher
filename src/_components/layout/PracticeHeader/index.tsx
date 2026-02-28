"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeftIcon } from "@_lib";

interface PracticeHeaderProps {
	pieceTitle?: string;
}

export function PracticeHeader({ pieceTitle = "Practice" }: PracticeHeaderProps) {
	const params = useParams();
	const pieceId = params?.pieceId as string | undefined;
	const backHref = pieceId ? `/piece/${pieceId}` : "/library";

	return (
		<header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-card px-4">
			<Link
				href={backHref}
				className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			>
				<ChevronLeftIcon className="h-5 w-5" aria-hidden />
				<span>Exit</span>
			</Link>
			<h1 className="truncate text-sm font-semibold text-foreground">
				{pieceTitle}
			</h1>
			<div className="w-14" aria-hidden />
		</header>
	);
}
