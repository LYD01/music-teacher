import { eq } from "drizzle-orm";
import { db } from "../client";
import { pieces } from "../schema";

export async function getStarterPieces(limit = 5) {
	return db
		.select()
		.from(pieces)
		.where(eq(pieces.difficulty, "beginner"))
		.orderBy(pieces.title)
		.limit(limit);
}

export async function getAllPieces() {
	return db.select().from(pieces).orderBy(pieces.title);
}

export async function getPieceById(id: string) {
	const rows = await db.select().from(pieces).where(eq(pieces.id, id)).limit(1);
	return rows[0] ?? null;
}

export async function getPiecesByGenre(genre: string) {
	return db.select().from(pieces).where(eq(pieces.genre, genre)).orderBy(pieces.title);
}

export async function getAvailableGenres() {
	const rows = await db.selectDistinct({ genre: pieces.genre }).from(pieces).orderBy(pieces.genre);
	return rows.map((r) => r.genre);
}
