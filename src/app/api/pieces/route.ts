import { getAllPieces, getAvailableGenres, getPiecesByGenre } from "@_lib/db/queries/pieces";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const genre = searchParams.get("genre");

	if (genre) {
		const pieces = await getPiecesByGenre(genre);
		return NextResponse.json(pieces);
	}

	const pieces = await getAllPieces();
	const genres = await getAvailableGenres();
	return NextResponse.json({ pieces, genres });
}
