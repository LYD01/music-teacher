import { Badge } from "@_components/common/Badge";
import type { Piece } from "@_types";
import Link from "next/link";

const difficultyVariant = {
	beginner: "accent" as const,
	intermediate: "default" as const,
	advanced: "destructive" as const,
};

interface PieceCardProps {
	piece: Piece;
}

export function PieceCard({ piece }: PieceCardProps) {
	return (
		<Link
			href={`/piece/${piece.id}`}
			className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
		>
			<div className="mb-3 flex items-start justify-between gap-2">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<svg
						className="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
						aria-hidden="true"
					>
						<title>Music note</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V4.846a2.25 2.25 0 00-1.956-2.234l-6.75-.97A2.25 2.25 0 007.5 3.867v11.21"
						/>
					</svg>
				</div>
				<div className="flex gap-1.5">
					<Badge variant={difficultyVariant[piece.difficulty] ?? "secondary"}>
						{piece.difficulty}
					</Badge>
				</div>
			</div>

			<h3 className="text-base font-semibold text-card-foreground group-hover:text-primary transition-colors">
				{piece.title}
			</h3>

			<p className="mt-0.5 text-sm text-muted-foreground">{piece.composer}</p>

			<div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
				<span className="capitalize">{piece.genre}</span>
				{piece.style && (
					<>
						<span className="text-border">|</span>
						<span>{piece.style}</span>
					</>
				)}
				{piece.tempo && (
					<>
						<span className="text-border">|</span>
						<span>{piece.tempo} BPM</span>
					</>
				)}
			</div>
		</Link>
	);
}
