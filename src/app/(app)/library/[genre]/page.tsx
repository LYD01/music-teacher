// Dynamic route: filter library by genre

interface GenrePageProps {
	params: Promise<{ genre: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
	const { genre } = await params;

	return (
		<div>
			<h1 className="text-2xl font-bold capitalize text-foreground">{genre}</h1>
			<p className="mt-1 text-sm text-muted-foreground">Browsing pieces in the {genre} genre.</p>

			<div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{/* TODO: Fetch and render pieces filtered by genre */}
				<div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
					Filtered pieces will appear here.
				</div>
			</div>
		</div>
	);
}
