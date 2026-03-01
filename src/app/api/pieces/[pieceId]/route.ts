import { getPieceById } from "@_lib/db/queries/pieces";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ pieceId: string }> }) {
	const { pieceId } = await params;
	const piece = await getPieceById(pieceId);
	if (!piece) {
		return NextResponse.json({ error: "Piece not found" }, { status: 404 });
	}
	return NextResponse.json(piece);
}
