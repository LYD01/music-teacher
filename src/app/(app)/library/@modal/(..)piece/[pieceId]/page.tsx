import { Badge } from "@_components/common/Badge";
import { getPieceById } from "@_lib/db/queries/pieces";
import type { Piece } from "@_types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ModalCloseButton, ModalOverlay } from "./ModalOverlay";

interface PieceModalProps {
	params: Promise<{ pieceId: string }>;
}

const difficultyVariant = {
	beginner: "accent" as const,
	intermediate: "default" as const,
	advanced: "destructive" as const,
};

export default async function PieceModal({ params }: PieceModalProps) {
	const { pieceId } = await params;
	const raw = await getPieceById(pieceId);
	if (!raw) notFound();
	const piece = raw as Piece;

	return (
		<ModalOverlay>
			<div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<h2 className="truncate text-xl font-bold text-foreground">{piece.title}</h2>
						<p className="mt-0.5 text-sm text-muted-foreground">{piece.composer}</p>
					</div>
					<ModalCloseButton />
				</div>

				<div className="mt-4 flex flex-wrap gap-2">
					<Badge variant={difficultyVariant[piece.difficulty] ?? "secondary"}>
						{piece.difficulty}
					</Badge>
					<Badge variant="secondary" className="capitalize">
						{piece.genre}
					</Badge>
					{piece.style && <Badge variant="outline">{piece.style}</Badge>}
				</div>

				<div className="mt-4 grid grid-cols-3 gap-3">
					{piece.tempo && (
						<div className="rounded-md bg-secondary p-3 text-center">
							<p className="text-xs text-muted-foreground">Tempo</p>
							<p className="mt-0.5 text-sm font-semibold text-secondary-foreground">
								{piece.tempo} BPM
							</p>
						</div>
					)}
					{piece.measureCount && (
						<div className="rounded-md bg-secondary p-3 text-center">
							<p className="text-xs text-muted-foreground">Measures</p>
							<p className="mt-0.5 text-sm font-semibold text-secondary-foreground">
								{piece.measureCount}
							</p>
						</div>
					)}
					<div className="rounded-md bg-secondary p-3 text-center">
						<p className="text-xs text-muted-foreground">Instrument</p>
						<p className="mt-0.5 text-sm font-semibold capitalize text-secondary-foreground">
							Guitar
						</p>
					</div>
				</div>

				<div className="mt-5 flex gap-3">
					<Link
						href={`/piece/${piece.id}/practice`}
						className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Start Practice
					</Link>
					<a
						href={`/piece/${piece.id}`}
						className="flex-1 rounded-lg border-2 border-border bg-transparent px-4 py-2.5 text-center text-sm font-medium text-foreground transition-colors hover:bg-muted"
					>
						View Details
					</a>
				</div>
			</div>
		</ModalOverlay>
	);
}
