export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Genre = "classical" | "folk" | "latin" | "contemporary";

export type MasteryLevel = "learning" | "practicing" | "comfortable" | "mastered";

export interface Piece {
	id: string;
	title: string;
	composer: string;
	difficulty: Difficulty;
	genre: Genre;
	style: string;
	instrumentId: string;
	musicxmlPath: string;
	tempo: number;
	measureCount: number;
	createdAt: Date;
}

export interface PieceCollection {
	id: string;
	name: string;
	description: string;
	difficulty: Difficulty;
	genre: Genre;
	sortOrder: number;
	createdAt: Date;
}

export interface Instrument {
	id: string;
	name: string;
	type: "string" | "wind" | "percussion" | "keyboard";
	tuning: number[];
	noteRange: { low: string; high: string };
}
