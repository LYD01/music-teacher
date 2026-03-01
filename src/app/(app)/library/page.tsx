import { GenreFilter, PieceCard } from "@_components/library";
import { getAllPieces, getAvailableGenres } from "@_lib/db/queries/pieces";
import type { Piece } from "@_types";

export default async function LibraryPage() {
	const [rawPieces, genres] = await Promise.all([getAllPieces(), getAvailableGenres()]);

	const pieces = rawPieces as Piece[];

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-foreground">Library</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Browse sheet music and find your next piece to practice.
				</p>
			</div>

			<GenreFilter genres={genres} />

			{pieces.length === 0 ? (
				<div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
					<svg
						className="mx-auto h-10 w-10 text-muted-foreground/50"
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
					<p className="mt-3 text-sm font-medium text-muted-foreground">No pieces yet</p>
					<p className="mt-1 text-xs text-muted-foreground">
						Run the seed script to populate the library.
					</p>
				</div>
			) : (
				<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{pieces.map((piece) => (
						<PieceCard key={piece.id} piece={piece} />
					))}
				</div>
			)}
		</div>
	);
}
