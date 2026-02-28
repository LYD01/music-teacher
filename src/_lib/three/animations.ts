// Load and manage Mixamo animation clips for the 3D avatar
// Handles preloading, caching, and crossfade transitions

export type AnimationName =
  | "idle"
  | "listening"
  | "nodding"
  | "clapping"
  | "thinking"
  | "waving";

export const ANIMATION_PATHS: Record<AnimationName, string> = {
  idle: "/animations/idle.glb",
  listening: "/animations/listening.glb",
  nodding: "/animations/nodding.glb",
  clapping: "/animations/clapping.glb",
  thinking: "/animations/thinking.glb",
  waving: "/animations/waving.glb",
};

export function preloadAnimations(): void {
  // TODO: Preload all animation .glb files using useGLTF.preload
}
