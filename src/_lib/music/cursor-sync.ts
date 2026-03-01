import type { ExpectedNote } from "@_lib/audio/analyzer";

/**
 * Given elapsed seconds since session start, finds the index into
 * expectedNotes whose startBeat (converted to seconds via tempo)
 * is closest without exceeding elapsedSec.
 *
 * Returns -1 if elapsedSec is before the first note.
 */
export function elapsedToNoteIndex(
	elapsedSec: number,
	expectedNotes: ExpectedNote[],
	tempo: number
): number {
	if (expectedNotes.length === 0 || tempo <= 0) return -1;

	const secPerBeat = 60 / tempo;
	let noteIndex = -1;

	for (let i = 0; i < expectedNotes.length; i++) {
		const noteStartSec = expectedNotes[i].startBeat * secPerBeat;
		if (noteStartSec <= elapsedSec) {
			noteIndex = i;
		} else {
			break;
		}
	}

	return noteIndex;
}

/**
 * Positions the OSMD cursor at the given note index by resetting
 * to the beginning and advancing `noteIndex` times.
 *
 * Only repositions when the index actually changes vs. the previously
 * synced position (tracked by the caller via the return value).
 */
export function syncCursorToNoteIndex(
	osmd: { cursor: { reset: () => void; next: () => void; show: () => void; hide: () => void } },
	noteIndex: number
): void {
	if (noteIndex < 0) return;

	try {
		osmd.cursor.show();
		osmd.cursor.reset();
		for (let i = 0; i < noteIndex; i++) {
			osmd.cursor.next();
		}
	} catch {
		// Best-effort: OSMD cursor APIs can throw on edge cases
	}
}

/**
 * Computes the total duration of a piece in seconds from its
 * expected notes and tempo. Uses the last note's startBeat + duration.
 */
export function pieceDurationSec(expectedNotes: ExpectedNote[], tempo: number): number {
	if (expectedNotes.length === 0 || tempo <= 0) return 0;
	const last = expectedNotes[expectedNotes.length - 1];
	return ((last.startBeat + last.duration) * 60) / tempo;
}
