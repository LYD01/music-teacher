import type { AvatarMood } from "@_types";

export interface ReactionTransforms {
	bounceAmplitude: number;
	bounceSpeed: number;
	wobbleIntensity: number;
	scaleBase: number;
	scalePulse: number;
	rotationSpeed: number;
	emissiveColor: [number, number, number];
	emissiveIntensity: number;
	tiltX: number;
}

const BASE: ReactionTransforms = {
	bounceAmplitude: 0.05,
	bounceSpeed: 1.5,
	wobbleIntensity: 0,
	scaleBase: 1,
	scalePulse: 0,
	rotationSpeed: 0,
	emissiveColor: [0, 0, 0],
	emissiveIntensity: 0,
	tiltX: 0,
};

export const REACTION_PRESETS: Record<AvatarMood, ReactionTransforms> = {
	idle: {
		...BASE,
		bounceAmplitude: 0.04,
		bounceSpeed: 1.2,
	},
	listening: {
		...BASE,
		bounceAmplitude: 0.02,
		bounceSpeed: 1.0,
		tiltX: -0.1,
	},
	good_note: {
		...BASE,
		bounceAmplitude: 0.12,
		bounceSpeed: 4,
		scalePulse: 0.08,
		emissiveColor: [0.1, 0.9, 0.3],
		emissiveIntensity: 0.4,
	},
	bad_note: {
		...BASE,
		bounceAmplitude: 0.02,
		bounceSpeed: 1,
		wobbleIntensity: 0.15,
		emissiveColor: [0.9, 0.15, 0.1],
		emissiveIntensity: 0.3,
	},
	great_streak: {
		...BASE,
		bounceAmplitude: 0.18,
		bounceSpeed: 5,
		scalePulse: 0.12,
		rotationSpeed: 0.5,
		emissiveColor: [1, 0.85, 0],
		emissiveIntensity: 0.6,
	},
	encouraging: {
		...BASE,
		bounceAmplitude: 0.08,
		bounceSpeed: 2.5,
		scalePulse: 0.04,
		emissiveColor: [0.2, 0.6, 1],
		emissiveIntensity: 0.2,
	},
	celebrating: {
		...BASE,
		bounceAmplitude: 0.25,
		bounceSpeed: 6,
		scalePulse: 0.15,
		rotationSpeed: 2,
		emissiveColor: [1, 0.85, 0],
		emissiveIntensity: 0.8,
	},
	thinking: {
		...BASE,
		bounceAmplitude: 0.03,
		bounceSpeed: 0.8,
		rotationSpeed: 0.15,
		tiltX: 0.08,
	},
};

export function lerpTransforms(
	from: ReactionTransforms,
	to: ReactionTransforms,
	t: number
): ReactionTransforms {
	const l = (a: number, b: number) => a + (b - a) * t;
	return {
		bounceAmplitude: l(from.bounceAmplitude, to.bounceAmplitude),
		bounceSpeed: l(from.bounceSpeed, to.bounceSpeed),
		wobbleIntensity: l(from.wobbleIntensity, to.wobbleIntensity),
		scaleBase: l(from.scaleBase, to.scaleBase),
		scalePulse: l(from.scalePulse, to.scalePulse),
		rotationSpeed: l(from.rotationSpeed, to.rotationSpeed),
		emissiveColor: [
			l(from.emissiveColor[0], to.emissiveColor[0]),
			l(from.emissiveColor[1], to.emissiveColor[1]),
			l(from.emissiveColor[2], to.emissiveColor[2]),
		],
		emissiveIntensity: l(from.emissiveIntensity, to.emissiveIntensity),
		tiltX: l(from.tiltX, to.tiltX),
	};
}
