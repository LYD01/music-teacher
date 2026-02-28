// Maps score ranges and feedback states to avatar animation names
// Drives the avatar's emotional response to student performance

import type { AnimationName } from "./animations";
import type { AvatarMood } from "@_types";

export function moodToAnimation(mood: AvatarMood): AnimationName {
  const map: Record<AvatarMood, AnimationName> = {
    idle: "idle",
    listening: "listening",
    encouraging: "nodding",
    celebrating: "clapping",
    thinking: "thinking",
  };
  return map[mood];
}

export function scoreToMood(score: number): AvatarMood {
  if (score >= 90) return "celebrating";
  if (score >= 70) return "encouraging";
  if (score >= 50) return "thinking";
  return "encouraging";
}
