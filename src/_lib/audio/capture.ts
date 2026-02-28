// Mic capture: MediaStream → AudioWorklet pipeline
// Requests user microphone, creates AudioContext, connects to analyser/worklet

import type { AudioCaptureState } from "@_types";

export async function requestMicAccess(): Promise<AudioCaptureState> {
  // TODO: navigator.mediaDevices.getUserMedia({ audio: true })
  throw new Error("Not implemented");
}

export function stopCapture(_stream: MediaStream): void {
  // TODO: Stop all tracks on the stream
}
