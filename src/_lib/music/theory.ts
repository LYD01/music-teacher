const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

const A4_FREQUENCY = 440;
const A4_MIDI = 69;
const SEMITONES = 12;

/** Converts a frequency in Hz to the nearest note name, octave, and cents offset from that note. */
export function frequencyToNote(frequency: number): {
	name: NoteName;
	octave: number;
	cents: number;
} {
	if (frequency <= 0) {
		throw new RangeError("Frequency must be positive");
	}

	const midiFloat = SEMITONES * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI;
	const midi = Math.round(midiFloat);
	const cents = Math.round((midiFloat - midi) * 100);

	const noteIndex = ((midi % SEMITONES) + SEMITONES) % SEMITONES;
	const octave = Math.floor(midi / SEMITONES) - 1;

	return { name: NOTE_NAMES[noteIndex], octave, cents };
}

/** Converts a note name + octave to its frequency in Hz (A4 = 440 Hz, equal temperament). */
export function noteToFrequency(name: NoteName, octave: number): number {
	const noteIndex = NOTE_NAMES.indexOf(name);
	const midi = (octave + 1) * SEMITONES + noteIndex;
	return A4_FREQUENCY * 2 ** ((midi - A4_MIDI) / SEMITONES);
}

/**
 * Returns the ascending semitone distance between two pitch classes.
 * Accepts note names like "C", "F#", etc. (octave-agnostic).
 */
export function intervalBetween(note1: string, note2: string): number {
	const i1 = NOTE_NAMES.indexOf(note1 as NoteName);
	const i2 = NOTE_NAMES.indexOf(note2 as NoteName);

	if (i1 === -1 || i2 === -1) {
		throw new Error(`Invalid note name: ${i1 === -1 ? note1 : note2}`);
	}

	return (((i2 - i1) % SEMITONES) + SEMITONES) % SEMITONES;
}

/** Returns the full chromatic note name list. */
export function getNoteNames(): readonly NoteName[] {
	return NOTE_NAMES;
}

/** Converts a MIDI note number (0-127) to a frequency in Hz. */
export function midiToFrequency(midi: number): number {
	return A4_FREQUENCY * 2 ** ((midi - A4_MIDI) / SEMITONES);
}

/** Converts a frequency in Hz to a (fractional) MIDI note number. */
export function frequencyToMidi(frequency: number): number {
	if (frequency <= 0) {
		throw new RangeError("Frequency must be positive");
	}
	return SEMITONES * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI;
}
