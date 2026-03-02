"use client";

import { lerpTransforms, REACTION_PRESETS, type ReactionTransforms } from "@_lib/three/animations";
import type { AvatarMood } from "@_types";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface DefaultAvatarProps {
	mood: AvatarMood;
}

const LERP_SPEED = 6;

export function DefaultAvatar({ mood }: DefaultAvatarProps) {
	const groupRef = useRef<THREE.Group>(null);
	const leftEyeRef = useRef<THREE.Mesh>(null);
	const rightEyeRef = useRef<THREE.Mesh>(null);
	const bodyRef = useRef<THREE.Mesh>(null);
	const currentTransforms = useRef<ReactionTransforms>({
		...REACTION_PRESETS.idle,
	});

	useFrame((state, delta) => {
		const target = REACTION_PRESETS[mood];
		const t = Math.min(1, delta * LERP_SPEED);
		const cur = lerpTransforms(currentTransforms.current, target, t);
		currentTransforms.current = cur;

		const elapsed = state.clock.elapsedTime;
		const group = groupRef.current;
		if (!group) return;

		group.position.y = Math.sin(elapsed * cur.bounceSpeed) * cur.bounceAmplitude;

		const wobble = cur.wobbleIntensity > 0 ? Math.sin(elapsed * 12) * cur.wobbleIntensity : 0;
		group.rotation.z = wobble;
		group.rotation.x = cur.tiltX;

		if (cur.rotationSpeed > 0) {
			group.rotation.y += cur.rotationSpeed * delta;
		}

		const pulse = cur.scalePulse > 0 ? 1 + Math.sin(elapsed * 8) * cur.scalePulse : cur.scaleBase;
		group.scale.setScalar(pulse);

		if (bodyRef.current) {
			const mat = bodyRef.current.material as THREE.MeshStandardMaterial;
			mat.emissive.lerp(new THREE.Color(...cur.emissiveColor), t);
			mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, cur.emissiveIntensity, t);
		}

		const blinkPhase = Math.sin(elapsed * 0.3) > 0.97;
		const eyeScaleY = blinkPhase ? 0.1 : 1;
		leftEyeRef.current?.scale.set(1, eyeScaleY, 1);
		rightEyeRef.current?.scale.set(1, eyeScaleY, 1);
	});

	return (
		<group ref={groupRef}>
			{/* Body */}
			<mesh ref={bodyRef} position={[0, 0.6, 0]}>
				<capsuleGeometry args={[0.5, 0.6, 8, 16]} />
				<meshStandardMaterial color="#6366f1" roughness={0.3} metalness={0.1} />
			</mesh>

			{/* Left eye */}
			<mesh ref={leftEyeRef} position={[-0.18, 0.85, 0.42]}>
				<sphereGeometry args={[0.1, 16, 16]} />
				<meshStandardMaterial color="#ffffff" />
			</mesh>
			<mesh position={[-0.18, 0.85, 0.5]}>
				<sphereGeometry args={[0.055, 16, 16]} />
				<meshStandardMaterial color="#1e1b4b" />
			</mesh>

			{/* Right eye */}
			<mesh ref={rightEyeRef} position={[0.18, 0.85, 0.42]}>
				<sphereGeometry args={[0.1, 16, 16]} />
				<meshStandardMaterial color="#ffffff" />
			</mesh>
			<mesh position={[0.18, 0.85, 0.5]}>
				<sphereGeometry args={[0.055, 16, 16]} />
				<meshStandardMaterial color="#1e1b4b" />
			</mesh>

			{/* Smile */}
			<mesh position={[0, 0.6, 0.48]} rotation={[0.2, 0, 0]}>
				<torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
				<meshStandardMaterial color="#1e1b4b" />
			</mesh>
		</group>
	);
}
