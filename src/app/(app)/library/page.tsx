// Browse all pieces (grid/list view)
// Links to individual pieces; clicking opens intercepting modal

export default function LibraryPage() {
	// TODO: Fetch all pieces from DB
	return (
		<div>
			<h1 className="text-2xl font-bold text-foreground">Library</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Browse sheet music and find your next piece to practice.
			</p>

			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* TODO: Map over pieces and render PieceCard components */}
				<div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
					Pieces will appear here once the database is seeded.
				</div>
			</div>
		</div>
	);
}
