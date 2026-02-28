// Music theory utilities: note math, frequencies, intervals, transposition

const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export function frequencyToNote(_frequency: number): {
  name: NoteName;
  octave: number;
  cents: number;
} {
  // TODO: Convert Hz to nearest note name + octave + cents offset
  throw new Error("Not implemented");
}

export function noteToFrequency(_name: NoteName, _octave: number): number {
  // TODO: Convert note name + octave to Hz (A4 = 440Hz)
  throw new Error("Not implemented");
}

export function intervalBetween(
  _note1: string,
  _note2: string,
): number {
  // TODO: Return semitone distance between two notes
  throw new Error("Not implemented");
}
