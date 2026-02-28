import type { Piece } from "@_types";
import Link from "next/link";

interface SheetMusicTileProps {
	piece: Piece;
}

function formatInstrument(instrumentId: string): string {
	return instrumentId
		.split("-")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

export function SheetMusicTile({ piece }: SheetMusicTileProps) {
	return (
		<Link
			href={`/piece/${piece.id}/practice`}
			className="group block overflow-hidden rounded-lg border border-border bg-[#fdfbf7] shadow-sm transition-all hover:border-primary/50 hover:shadow-md dark:bg-[#1a1814]"
		>
			{/* Sheet music visual: staff lines */}
			<div className="relative aspect-[3/4] p-4">
				<div className="absolute inset-4 flex flex-col justify-center gap-3">
					{["a", "b", "c", "d", "e"].map((id) => (
						<div key={id} className="h-px w-full bg-foreground/25" />
					))}
				</div>
				{/* Treble clef decoration */}
				<div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/15">
					<svg viewBox="0 0 40 80" className="h-16 w-10" aria-hidden="true">
						<title>Treble clef</title>
						<path
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M8 70c0-8 4-14 12-14s12 6 12 14-4 10-12 10-12-4-12-10zm0 0V10c0-6 4-10 12-10s12 4 12 10v60M8 10c0 6 4 10 12 10s12-4 12-10-4-10-12-10-12 4-12 10zm12 10v50M20 20c4 0 8-2 12-6M20 30c4 0 8 2 12 6"
						/>
					</svg>
				</div>
				{/* Note heads hint */}
				<div className="absolute right-4 top-1/2 flex -translate-y-1/2 gap-1">
					{["n1", "n2", "n3", "n4"].map((id, i) => (
						<div
							key={id}
							className="h-2 w-2 rounded-full bg-foreground/25"
							style={{ marginTop: `${(i - 1.5) * 4}px` }}
						/>
					))}
				</div>
			</div>

			{/* Metadata */}
			<div className="border-t border-border bg-card px-4 py-3">
				<p className="truncate font-medium text-card-foreground group-hover:text-primary transition-colors">
					{piece.title}
				</p>
				<p className="mt-0.5 text-xs text-muted-foreground">
					{formatInstrument(piece.instrumentId)}
				</p>
			</div>
		</Link>
	);
}
