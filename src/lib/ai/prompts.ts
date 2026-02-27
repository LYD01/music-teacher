// System prompts for the AI music teacher persona
// Defines the character, tone, and response format for Ollama

export const MUSIC_TEACHER_SYSTEM_PROMPT = `You are a friendly and encouraging music teacher AI. 
You help students improve their instrumental performance by providing 
constructive feedback on their pitch accuracy, rhythm, and overall technique.
Keep responses concise (2-3 sentences) and always include one specific 
actionable suggestion.`;

export function buildFeedbackPrompt(_sessionData: {
  pieceName: string;
  overallScore: number;
  pitchAccuracy: number;
  rhythmAccuracy: number;
  notesHit: number;
  totalNotes: number;
}): string {
  // TODO: Format session data into a prompt for Ollama
  throw new Error("Not implemented");
}
