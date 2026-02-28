/**
 * Note onset/offset detector.
 *
 * Converts a continuous stream of pitch readings into discrete DetectedNote
 * objects. Uses a 4-state machine:
 *
 *   IDLE → PENDING → ACTIVE → ENDING → (emit note) → IDLE
 *
 * - IDLE:    no pitch; waiting for signal.
 * - PENDING: pitch detected; accumulating readings to confirm onset.
 *            Requires `onsetConfirmCount` consecutive readings on the same
 *            MIDI note before promoting to ACTIVE.
 * - ACTIVE:  note confirmed; accumulating frequency/cents/clarity averages.
 * - ENDING:  signal dropped or changed; if the same pitch returns within
 *            `gapToleranceMs` the note resumes, otherwise it's finalized.
 */

import type { DetectedNote } from "@_types";
import { frequencyToMidi, frequencyToNote } from "../music/theory";

// ── Public types ──────────────────────────────────────────────────────

export interface PitchReading {
	frequency: number;
	clarity: number;
}

export interface NoteDetectorConfig {
	/** Consecutive readings required to confirm onset (default 3 → ~150 ms at 20 fps). */
	onsetConfirmCount: number;
	/** Notes shorter than this are discarded as noise (ms, default 80). */
	minDurationMs: number;
	/** Max silent gap tolerated inside a note before offset (ms, default 150). */
	gapToleranceMs: number;
}

const DEFAULT_CONFIG: NoteDetectorConfig = {
	onsetConfirmCount: 3,
	minDurationMs: 80,
	gapToleranceMs: 150,
};

// ── Internal types ────────────────────────────────────────────────────

type State = "idle" | "pending" | "active" | "ending";

interface NoteAccumulator {
	midiNote: number;
	startMs: number;
	lastActiveMs: number;
	freqSum: number;
	centsSum: number;
	claritySum: number;
	count: number;
}

// ── NoteDetector class ────────────────────────────────────────────────

export class NoteDetector {
	private cfg: NoteDetectorConfig;
	private state: State = "idle";
	private pending: { readings: PitchReading[]; startMs: number } | null = null;
	private acc: NoteAccumulator | null = null;
	private sessionStartMs = -1;

	constructor(config?: Partial<NoteDetectorConfig>) {
		this.cfg = { ...DEFAULT_CONFIG, ...config };
	}

	/**
	 * Feed a single pitch reading (or `null` when silence is detected).
	 * Returns a finalized `DetectedNote` when a note boundary is crossed,
	 * otherwise returns `null`.
	 *
	 * @param reading  Current pitch reading, or null if no pitch detected.
	 * @param timeMs   Monotonic timestamp in milliseconds (e.g. performance.now()).
	 */
	feed(reading: PitchReading | null, timeMs: number): DetectedNote | null {
		if (this.sessionStartMs < 0) this.sessionStartMs = timeMs;

		const midi = reading ? Math.round(frequencyToMidi(reading.frequency)) : -1;

		switch (this.state) {
			case "idle":
				return this.onIdle(reading, midi, timeMs);
			case "pending":
				return this.onPending(reading, midi, timeMs);
			case "active":
				return this.onActive(reading, midi, timeMs);
			case "ending":
				return this.onEnding(reading, midi, timeMs);
		}
	}

	/** Force-close any in-progress note and return it (or null). */
	flush(): DetectedNote | null {
		if (this.acc) {
			const note = this.finalize(this.acc);
			this.acc = null;
			this.state = "idle";
			return note;
		}
		return null;
	}

	reset(): void {
		this.state = "idle";
		this.pending = null;
		this.acc = null;
		this.sessionStartMs = -1;
	}

	// ── State handlers ────────────────────────────────────────────────

	private onIdle(reading: PitchReading | null, _midi: number, timeMs: number): null {
		if (reading) {
			this.pending = { readings: [reading], startMs: timeMs };
			this.state = "pending";
		}
		return null;
	}

	private onPending(reading: PitchReading | null, midi: number, timeMs: number): null {
		if (!reading || !this.pending) {
			this.pending = null;
			this.state = "idle";
			return null;
		}

		const pendingMidi = Math.round(frequencyToMidi(this.pending.readings[0].frequency));

		if (midi === pendingMidi) {
			this.pending.readings.push(reading);

			if (this.pending.readings.length >= this.cfg.onsetConfirmCount) {
				this.acc = this.buildAccumulator(
					this.pending.readings,
					pendingMidi,
					this.pending.startMs,
					timeMs
				);
				this.pending = null;
				this.state = "active";
			}
		} else {
			this.pending = { readings: [reading], startMs: timeMs };
		}

		return null;
	}

	private onActive(
		reading: PitchReading | null,
		midi: number,
		timeMs: number
	): DetectedNote | null {
		const acc = this.acc;
		if (!acc) return null;

		if (!reading) {
			this.state = "ending";
			return null;
		}

		if (midi === acc.midiNote) {
			this.accumulate(reading, timeMs);
			return null;
		}

		// Different note — finalize current and start new pending
		const completed = this.finalize(acc);
		this.acc = null;
		this.pending = { readings: [reading], startMs: timeMs };
		this.state = "pending";
		return completed;
	}

	private onEnding(
		reading: PitchReading | null,
		midi: number,
		timeMs: number
	): DetectedNote | null {
		const acc = this.acc;
		if (!acc) return null;

		if (reading && midi === acc.midiNote) {
			this.accumulate(reading, timeMs);
			this.state = "active";
			return null;
		}

		if (!reading && timeMs - acc.lastActiveMs < this.cfg.gapToleranceMs) {
			return null;
		}

		// Gap expired or different note — finalize
		const completed = this.finalize(acc);
		this.acc = null;

		if (reading) {
			this.pending = { readings: [reading], startMs: timeMs };
			this.state = "pending";
		} else {
			this.state = "idle";
		}

		return completed;
	}

	// ── Helpers ───────────────────────────────────────────────────────

	private buildAccumulator(
		readings: PitchReading[],
		midiNote: number,
		startMs: number,
		lastMs: number
	): NoteAccumulator {
		let freqSum = 0;
		let claritySum = 0;
		let centsSum = 0;

		for (const r of readings) {
			freqSum += r.frequency;
			claritySum += r.clarity;
			centsSum += frequencyToNote(r.frequency).cents;
		}

		return {
			midiNote,
			startMs,
			lastActiveMs: lastMs,
			freqSum,
			centsSum,
			claritySum,
			count: readings.length,
		};
	}

	private accumulate(reading: PitchReading, timeMs: number): void {
		const a = this.acc as NoteAccumulator;
		a.freqSum += reading.frequency;
		a.claritySum += reading.clarity;
		a.centsSum += frequencyToNote(reading.frequency).cents;
		a.count++;
		a.lastActiveMs = timeMs;
	}

	private finalize(a: NoteAccumulator): DetectedNote | null {
		const durationMs = a.lastActiveMs - a.startMs;
		if (durationMs < this.cfg.minDurationMs) return null;

		const avgFreq = a.freqSum / a.count;
		const note = frequencyToNote(avgFreq);

		return {
			pitch: a.midiNote,
			frequency: avgFreq,
			noteName: note.name,
			octave: note.octave,
			cents: Math.round(a.centsSum / a.count),
			startTime: (a.startMs - this.sessionStartMs) / 1000,
			endTime: (a.lastActiveMs - this.sessionStartMs) / 1000,
			confidence: a.claritySum / a.count,
		};
	}
}

// ── Batch processing (post-session analysis) ──────────────────────────

/**
 * Batch-process a pre-recorded pitch history into discrete notes.
 * Each entry needs `frequency` (Hz), `time` (ms), and `clarity` (0-1).
 */
export function processNoteStream(
	pitchHistory: Array<{ frequency: number; time: number; clarity: number }>,
	config?: Partial<NoteDetectorConfig>
): DetectedNote[] {
	const detector = new NoteDetector(config);
	const notes: DetectedNote[] = [];

	for (const entry of pitchHistory) {
		const completed = detector.feed(
			{ frequency: entry.frequency, clarity: entry.clarity },
			entry.time
		);
		if (completed) notes.push(completed);
	}

	const last = detector.flush();
	if (last) notes.push(last);

	return notes;
}
