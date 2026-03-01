import { Badge } from "@_components/common/Badge";
import { SheetMusicViewer } from "@_components/sheet-music/SheetMusicViewer";
import { getPieceById } from "@_lib/db/queries/pieces";
import type { Piece } from "@_types";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PiecePageProps {
	params: Promise<{ pieceId: string }>;
}

const difficultyVariant = {
	beginner: "accent" as const,
	intermediate: "default" as const,
	advanced: "destructive" as const,
};

export default async function PiecePage({ params }: PiecePageProps) {
	const { pieceId } = await params;
	const raw = await getPieceById(pieceId);
	if (!raw) notFound();
	const piece = raw as Piece;

	return (
		<div className="mx-auto max-w-4xl">
			<Link
				href="/library"
				className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					aria-hidden="true"
				>
					<title>Back arrow</title>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Library
			</Link>

			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold text-foreground">{piece.title}</h1>
					<p className="mt-1 text-muted-foreground">{piece.composer}</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Badge variant={difficultyVariant[piece.difficulty] ?? "secondary"}>
						{piece.difficulty}
					</Badge>
					<Badge variant="secondary" className="capitalize">
						{piece.genre}
					</Badge>
					{piece.style && <Badge variant="outline">{piece.style}</Badge>}
				</div>
			</div>

			<div className="mt-4 grid gap-4 sm:grid-cols-3">
				{piece.tempo && (
					<div className="rounded-lg border border-border bg-card p-4">
						<p className="text-xs text-muted-foreground">Tempo</p>
						<p className="mt-1 text-lg font-semibold text-card-foreground">{piece.tempo} BPM</p>
					</div>
				)}
				{piece.measureCount && (
					<div className="rounded-lg border border-border bg-card p-4">
						<p className="text-xs text-muted-foreground">Measures</p>
						<p className="mt-1 text-lg font-semibold text-card-foreground">{piece.measureCount}</p>
					</div>
				)}
				<div className="rounded-lg border border-border bg-card p-4">
					<p className="text-xs text-muted-foreground">Instrument</p>
					<p className="mt-1 text-lg font-semibold capitalize text-card-foreground">
						{piece.instrumentId.replace("-", " ")}
					</p>
				</div>
			</div>

			<div className="mt-6">
				<h2 className="mb-3 text-lg font-semibold text-foreground">Sheet Music</h2>
				<SheetMusicViewer musicxmlUrl={piece.musicxmlPath} scrollHeight="60vh" />
			</div>

			<div className="mt-6 flex gap-3">
				<Link
					href={`/piece/${piece.id}/practice`}
					className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<svg
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<title>Play</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
						/>
					</svg>
					Start Practice
				</Link>
			</div>
		</div>
	);
}
