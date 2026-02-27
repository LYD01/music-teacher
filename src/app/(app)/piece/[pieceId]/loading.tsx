// Piece loading skeleton

export default function PieceLoading() {
	return (
		<div className="mx-auto max-w-3xl animate-pulse space-y-6">
			<div className="h-8 w-64 rounded bg-muted" />
			<div className="h-4 w-40 rounded bg-muted" />
			<div className="h-64 rounded-lg bg-muted" />
			<div className="h-12 w-36 rounded-lg bg-muted" />
		</div>
	);
}
