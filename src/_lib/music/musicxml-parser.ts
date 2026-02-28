// MusicXML parser: extracts expected note sequences from .musicxml files
// Used to build the reference sequence for comparison during practice

import type { ExpectedNote } from "@/lib/audio/analyzer";

export function parseMusicXML(_xmlContent: string): ExpectedNote[] {
  // TODO: Parse MusicXML DOM, extract <note> elements with pitch/duration
  throw new Error("Not implemented");
}

export async function loadMusicXMLFile(_path: string): Promise<string> {
  // TODO: Fetch the .musicxml file content as text
  throw new Error("Not implemented");
}
