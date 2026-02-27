// Full piece detail page (direct URL)
// Shows piece info, sheet music preview, and link to start practice

import Link from "next/link";

interface PiecePageProps {
	params: Promise<{ pieceId: string }>;
}

export default async function PiecePage({ params }: PiecePageProps) {
	const { pieceId } = await params;

	// TODO: Fetch piece data from DB by pieceId

	return (
		<div className="mx-auto max-w-3xl">
			<h1 className="text-2xl font-bold text-foreground">Piece Detail</h1>
			<p className="mt-1 text-sm text-muted-foreground">Piece ID: {pieceId}</p>

			<div className="mt-6 rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
				Sheet music preview will render here via OSMD.
			</div>

			<div className="mt-6">
				<Link
					href={`/piece/${pieceId}/practice`}
					className="inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Start Practice
				</Link>
			</div>
		</div>
	);
}
