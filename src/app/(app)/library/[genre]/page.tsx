import { GenreFilter, PieceCard } from "@_components/library";
import { getAvailableGenres, getPiecesByGenre } from "@_lib/db/queries/pieces";
import type { Piece } from "@_types";

interface GenrePageProps {
	params: Promise<{ genre: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
	const { genre } = await params;

	const [rawPieces, genres] = await Promise.all([getPiecesByGenre(genre), getAvailableGenres()]);

	const pieces = rawPieces as Piece[];

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-bold capitalize text-foreground">{genre}</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Browsing {pieces.length} {pieces.length === 1 ? "piece" : "pieces"} in the {genre} genre.
				</p>
			</div>

			<GenreFilter genres={genres} />

			{pieces.length === 0 ? (
				<div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center">
					<p className="text-sm font-medium text-muted-foreground">
						No pieces found in this genre.
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
