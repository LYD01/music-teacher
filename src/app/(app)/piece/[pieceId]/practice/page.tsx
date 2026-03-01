import { PracticeSession } from "@_components/audio/PracticeSession";
import { getPieceById } from "@_lib/db/queries/pieces";
import type { Piece } from "@_types";
import { notFound } from "next/navigation";

interface PracticePageProps {
	params: Promise<{ pieceId: string }>;
}

export default async function PracticePage({ params }: PracticePageProps) {
	const { pieceId } = await params;
	const raw = await getPieceById(pieceId);
	if (!raw) notFound();
	const piece = raw as Piece;

	return <PracticeSession piece={piece} />;
}
