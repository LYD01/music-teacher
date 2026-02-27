// Intercepting route: piece preview modal
// Opens when clicking a piece in the library; shows a summary in a modal
// Refreshing or navigating directly goes to /piece/[pieceId] instead

interface PieceModalProps {
	params: Promise<{ pieceId: string }>;
}

export default async function PieceModal({ params }: PieceModalProps) {
	const { pieceId } = await params;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
				<h2 className="text-xl font-bold text-foreground">Piece Preview</h2>
				<p className="mt-2 text-sm text-muted-foreground">Piece ID: {pieceId}</p>
				{/* TODO: Fetch piece data and show title, composer, difficulty, preview */}
			</div>
		</div>
	);
}
