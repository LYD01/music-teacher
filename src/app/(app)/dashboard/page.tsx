import { SheetMusicTile } from "@_components/library";
import { getStarterPieces } from "@_lib/db/queries/pieces";
import type { Piece } from "@_types";
import Link from "next/link";

export default async function DashboardPage() {
	const starterPieces = (await getStarterPieces(5)) as Piece[];

	return (
		<div>
			<h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				Welcome back! Here&apos;s your practice overview.
			</p>

			{/* Your library - starter pieces for new users */}
			<section className="mt-8">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-foreground">Your library</h2>
					<Link href="/library" className="text-sm font-medium text-primary hover:text-primary/90">
						Browse all
					</Link>
				</div>
				<p className="mt-1 text-sm text-muted-foreground">
					Start practicing with these beginner pieces. Click any tile to begin a session with your
					AI teacher.
				</p>

				{starterPieces.length === 0 ? (
					<div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
						<p className="text-sm text-muted-foreground">
							No pieces yet. Run the seed script to populate your library.
						</p>
					</div>
				) : (
					<div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{starterPieces.map((piece) => (
							<SheetMusicTile key={piece.id} piece={piece} />
						))}
					</div>
				)}
			</section>
		</div>
	);
}
