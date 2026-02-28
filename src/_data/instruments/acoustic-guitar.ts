// Acoustic guitar instrument configuration
// Used by the instrument registry and audio analysis pipeline

import type { Instrument } from "@/types/music";

export const acousticGuitar: Instrument = {
  id: "acoustic-guitar",
  name: "Acoustic Guitar",
  type: "string",
  tuning: [329.63, 246.94, 196.0, 146.83, 110.0, 82.41],
  noteRange: { low: "E2", high: "E6" },
};
