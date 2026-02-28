// Instrument registry: configs for supported instruments
// Each instrument defines tuning, note range, and display properties

import type { Instrument } from "@_types";

export const INSTRUMENTS: Record<string, Instrument> = {
	"acoustic-guitar": {
		id: "acoustic-guitar",
		name: "Acoustic Guitar",
		type: "string",
		tuning: [329.63, 246.94, 196.0, 146.83, 110.0, 82.41], // E4 B3 G3 D3 A2 E2
		noteRange: { low: "E2", high: "E6" },
	},
};

export function getInstrument(id: string): Instrument | undefined {
	return INSTRUMENTS[id];
}
