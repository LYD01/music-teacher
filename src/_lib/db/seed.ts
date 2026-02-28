import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: "src/.env.local" });

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { collectionPieces, pieceCollections, pieces } from "./schema";

const db = drizzle(sql);

const SEED_PIECES = [
	{
		title: "Ode to Joy",
		composer: "Ludwig van Beethoven",
		difficulty: "beginner",
		genre: "classical",
		style: "Melody",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/ode-to-joy.musicxml",
		tempo: 100,
		measureCount: 8,
	},
	{
		title: "Romanza (Spanish Romance)",
		composer: "Anonymous",
		difficulty: "beginner",
		genre: "classical",
		style: "Melody",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/romanza.musicxml",
		tempo: 80,
		measureCount: 8,
	},
	{
		title: "Greensleeves",
		composer: "Traditional English",
		difficulty: "beginner",
		genre: "folk",
		style: "Melody",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/greensleeves.musicxml",
		tempo: 100,
		measureCount: 8,
	},
	{
		title: "Lágrima",
		composer: "Francisco Tárrega",
		difficulty: "intermediate",
		genre: "classical",
		style: "Study",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/lagrima.musicxml",
		tempo: 72,
		measureCount: 8,
	},
	{
		title: "Estudio in A minor",
		composer: "Francisco Tárrega",
		difficulty: "intermediate",
		genre: "classical",
		style: "Study",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/estudio-am.musicxml",
		tempo: 90,
		measureCount: 8,
	},
	{
		title: "Malagueña",
		composer: "Traditional Spanish",
		difficulty: "beginner",
		genre: "latin",
		style: "Dance",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/malaguena.musicxml",
		tempo: 100,
		measureCount: 8,
	},
	{
		title: "Adelita",
		composer: "Francisco Tárrega",
		difficulty: "intermediate",
		genre: "classical",
		style: "Mazurka",
		instrumentId: "acoustic-guitar",
		musicxmlPath: "/pieces/adelita.musicxml",
		tempo: 88,
		measureCount: 8,
	},
] as const;

const SEED_COLLECTIONS = [
	{
		name: "Beginner Classical",
		description: "Simple single-note melodies perfect for getting started with classical guitar.",
		difficulty: "beginner",
		genre: "classical",
		sortOrder: 1,
	},
	{
		name: "Intermediate Studies",
		description: "Tárrega studies and pieces for developing technique and musicality.",
		difficulty: "intermediate",
		genre: "classical",
		sortOrder: 2,
	},
	{
		name: "World Folk & Latin",
		description: "Traditional melodies from around the world, arranged for solo guitar.",
		difficulty: "beginner",
		genre: "folk",
		sortOrder: 3,
	},
] as const;

async function seed() {
	console.log("Seeding pieces...");

	const insertedPieces = await db
		.insert(pieces)
		.values([...SEED_PIECES])
		.onConflictDoNothing()
		.returning({
			id: pieces.id,
			title: pieces.title,
			difficulty: pieces.difficulty,
			genre: pieces.genre,
		});

	console.log(`  Inserted ${insertedPieces.length} pieces`);

	console.log("Seeding collections...");

	const insertedCollections = await db
		.insert(pieceCollections)
		.values([...SEED_COLLECTIONS])
		.onConflictDoNothing()
		.returning({ id: pieceCollections.id, name: pieceCollections.name });

	console.log(`  Inserted ${insertedCollections.length} collections`);

	const beginnerClassical = insertedCollections.find((c) => c.name === "Beginner Classical");
	const intermediateStudies = insertedCollections.find((c) => c.name === "Intermediate Studies");
	const worldFolk = insertedCollections.find((c) => c.name === "World Folk & Latin");

	const collectionMappings: { collectionId: string; pieceTitle: string; sortOrder: number }[] = [];

	for (const p of insertedPieces) {
		if (p.difficulty === "beginner" && p.genre === "classical" && beginnerClassical) {
			collectionMappings.push({
				collectionId: beginnerClassical.id,
				pieceTitle: p.title,
				sortOrder: collectionMappings.length,
			});
		}
		if (p.difficulty === "intermediate" && intermediateStudies) {
			collectionMappings.push({
				collectionId: intermediateStudies.id,
				pieceTitle: p.title,
				sortOrder: collectionMappings.length,
			});
		}
		if ((p.genre === "folk" || p.genre === "latin") && worldFolk) {
			collectionMappings.push({
				collectionId: worldFolk.id,
				pieceTitle: p.title,
				sortOrder: collectionMappings.length,
			});
		}
	}

	if (collectionMappings.length > 0) {
		const mappingValues = collectionMappings
			.map((m) => {
				const piece = insertedPieces.find((p) => p.title === m.pieceTitle);
				if (!piece) return null;
				return { collectionId: m.collectionId, pieceId: piece.id, sortOrder: m.sortOrder };
			})
			.filter((v): v is NonNullable<typeof v> => v !== null);

		if (mappingValues.length > 0) {
			await db.insert(collectionPieces).values(mappingValues).onConflictDoNothing();
			console.log(`  Inserted ${mappingValues.length} collection-piece mappings`);
		}
	}

	console.log("Seed complete!");
	process.exit(0);
}

seed().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
