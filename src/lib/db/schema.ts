// Drizzle ORM schema for Neon Postgres
// Tables: users, pieces, piece_collections, collection_pieces,
//         practice_sessions, user_piece_progress, activity_log

import {
	integer,
	jsonb,
	pgTable,
	primaryKey,
	real,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// Test table — remove after verifying drizzle-kit push works
export const testTable = pgTable("test_table", {
	id: uuid("id").primaryKey().defaultRandom(),
	message: text("message").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	name: text("name"),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pieces = pgTable("pieces", {
	id: uuid("id").primaryKey().defaultRandom(),
	title: text("title").notNull(),
	composer: text("composer").notNull(),
	difficulty: text("difficulty").notNull(),
	genre: text("genre").notNull(),
	style: text("style"),
	instrumentId: text("instrument_id").notNull(),
	musicxmlPath: text("musicxml_path").notNull(),
	tempo: integer("tempo"),
	measureCount: integer("measure_count"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pieceCollections = pgTable("piece_collections", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	description: text("description"),
	difficulty: text("difficulty"),
	genre: text("genre"),
	sortOrder: integer("sort_order").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const collectionPieces = pgTable(
	"collection_pieces",
	{
		collectionId: uuid("collection_id")
			.notNull()
			.references(() => pieceCollections.id),
		pieceId: uuid("piece_id")
			.notNull()
			.references(() => pieces.id),
		sortOrder: integer("sort_order").default(0),
	},
	(t) => [primaryKey({ columns: [t.collectionId, t.pieceId] })]
);

export const practiceSessions = pgTable("practice_sessions", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	pieceId: uuid("piece_id")
		.notNull()
		.references(() => pieces.id),
	startedAt: timestamp("started_at").notNull(),
	endedAt: timestamp("ended_at"),
	overallScore: real("overall_score"),
	pitchAccuracy: real("pitch_accuracy"),
	rhythmAccuracy: real("rhythm_accuracy"),
	aiFeedback: text("ai_feedback"),
	detectedNotes: jsonb("detected_notes"),
});

export const userPieceProgress = pgTable("user_piece_progress", {
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	pieceId: uuid("piece_id")
		.notNull()
		.references(() => pieces.id),
	bestScore: real("best_score"),
	avgScore: real("avg_score"),
	totalSessions: integer("total_sessions").default(0),
	masteryLevel: text("mastery_level"),
	lastPracticed: timestamp("last_practiced"),
});

export const activityLog = pgTable("activity_log", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	activityType: text("activity_type").notNull(),
	pieceId: uuid("piece_id").references(() => pieces.id),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
