export interface DetectedNote {
  pitch: number;
  frequency: number;
  noteName: string;
  octave: number;
  cents: number;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface PitchDetectionConfig {
  sampleRate: number;
  bufferSize: number;
  minConfidence: number;
  minFrequency: number;
  maxFrequency: number;
}

export interface AudioCaptureState {
  isCapturing: boolean;
  stream: MediaStream | null;
  error: string | null;
}
