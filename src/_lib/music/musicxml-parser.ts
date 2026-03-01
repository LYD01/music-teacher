import type { ExpectedNote } from "@_lib/audio/analyzer";

interface MusicXMLAttributes {
	divisions: number;
	beats: number;
	beatType: number;
}

function getTextContent(el: Element, tag: string): string | null {
	const child = el.getElementsByTagName(tag)[0];
	return child?.textContent ?? null;
}

function parseAttributes(measure: Element, prev: MusicXMLAttributes): MusicXMLAttributes {
	const attrs = measure.getElementsByTagName("attributes")[0];
	if (!attrs) return prev;

	const divisions = getTextContent(attrs, "divisions");
	const beats = getTextContent(attrs, "beats");
	const beatType = getTextContent(attrs, "beat-type");

	return {
		divisions: divisions ? Number.parseInt(divisions, 10) : prev.divisions,
		beats: beats ? Number.parseInt(beats, 10) : prev.beats,
		beatType: beatType ? Number.parseInt(beatType, 10) : prev.beatType,
	};
}

export function parseMusicXML(xmlContent: string): ExpectedNote[] {
	const parser = new DOMParser();
	const doc = parser.parseFromString(xmlContent, "application/xml");
	const parserError = doc.querySelector("parsererror");
	if (parserError) {
		throw new Error(`MusicXML parse error: ${parserError.textContent}`);
	}

	const notes: ExpectedNote[] = [];
	const measures = doc.getElementsByTagName("measure");

	let attrs: MusicXMLAttributes = { divisions: 1, beats: 4, beatType: 4 };
	let currentBeat = 0;

	for (let i = 0; i < measures.length; i++) {
		const measure = measures[i];
		attrs = parseAttributes(measure, attrs);

		const noteElements = measure.getElementsByTagName("note");
		for (let j = 0; j < noteElements.length; j++) {
			const noteEl = noteElements[j];
			const isRest = noteEl.getElementsByTagName("rest").length > 0;
			if (isRest) {
				const dur = getTextContent(noteEl, "duration");
				if (dur) {
					currentBeat += Number.parseInt(dur, 10) / attrs.divisions;
				}
				continue;
			}

			const isChord = noteEl.getElementsByTagName("chord").length > 0;
			const pitch = noteEl.getElementsByTagName("pitch")[0];
			if (!pitch) continue;

			const step = getTextContent(pitch, "step");
			const octaveStr = getTextContent(pitch, "octave");
			const alterStr = getTextContent(pitch, "alter");
			const durationStr = getTextContent(noteEl, "duration");

			if (!step || !octaveStr || !durationStr) continue;

			const octave = Number.parseInt(octaveStr, 10);
			const alter = alterStr ? Number.parseInt(alterStr, 10) : 0;
			const duration = Number.parseInt(durationStr, 10) / attrs.divisions;

			let noteName = step;
			if (alter === 1) noteName += "#";
			else if (alter === -1) noteName += "b";

			if (!isChord) {
				notes.push({ noteName, octave, startBeat: currentBeat, duration });
				currentBeat += duration;
			} else {
				const prevStart = notes.length > 0 ? notes[notes.length - 1].startBeat : currentBeat;
				notes.push({ noteName, octave, startBeat: prevStart, duration });
			}
		}
	}

	return notes;
}

export async function loadMusicXMLFile(path: string): Promise<string> {
	const res = await fetch(path);
	if (!res.ok) {
		throw new Error(`Failed to load MusicXML file: ${path} (${res.status})`);
	}
	return res.text();
}
