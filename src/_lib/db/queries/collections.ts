import { eq } from "drizzle-orm";
import { db } from "../client";
import { collectionPieces, pieceCollections, pieces } from "../schema";

export async function getAllCollections() {
	return db
		.select()
		.from(pieceCollections)
		.orderBy(pieceCollections.sortOrder, pieceCollections.name);
}

export async function getCollectionById(id: string) {
	const rows = await db.select().from(pieceCollections).where(eq(pieceCollections.id, id)).limit(1);
	return rows[0] ?? null;
}

export async function getPiecesInCollection(collectionId: string) {
	return db
		.select({
			piece: pieces,
			sortOrder: collectionPieces.sortOrder,
		})
		.from(collectionPieces)
		.innerJoin(pieces, eq(collectionPieces.pieceId, pieces.id))
		.where(eq(collectionPieces.collectionId, collectionId))
		.orderBy(collectionPieces.sortOrder);
}
