"use client";

import { lerpTransforms, REACTION_PRESETS, type ReactionTransforms } from "@_lib/three/animations";
import type { AvatarMood } from "@_types";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface AvatarModelProps {
	url: string;
	mood: AvatarMood;
}

const LERP_SPEED = 6;

export function AvatarModel({ url, mood }: AvatarModelProps) {
	const { scene } = useGLTF(url);
	const groupRef = useRef<THREE.Group>(null);
	const currentTransforms = useRef<ReactionTransforms>({
		...REACTION_PRESETS.idle,
	});
	const baseY = useRef(0);

	const cloned = useMemo(() => {
		const clone = scene.clone(true);
		const box = new THREE.Box3().setFromObject(clone);
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		const scale = 2 / maxDim;
		clone.scale.setScalar(scale);

		const center = box.getCenter(new THREE.Vector3());
		clone.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);

		return clone;
	}, [scene]);

	useEffect(() => {
		baseY.current = 0;
	}, []);

	useFrame((state, delta) => {
		const target = REACTION_PRESETS[mood];
		const t = Math.min(1, delta * LERP_SPEED);
		const cur = lerpTransforms(currentTransforms.current, target, t);
		currentTransforms.current = cur;

		const elapsed = state.clock.elapsedTime;
		const group = groupRef.current;
		if (!group) return;

		group.position.y = baseY.current + Math.sin(elapsed * cur.bounceSpeed) * cur.bounceAmplitude;

		const wobble = cur.wobbleIntensity > 0 ? Math.sin(elapsed * 12) * cur.wobbleIntensity : 0;
		group.rotation.z = wobble;
		group.rotation.x = cur.tiltX;

		if (cur.rotationSpeed > 0) {
			group.rotation.y += cur.rotationSpeed * delta;
		}

		const pulse = cur.scalePulse > 0 ? 1 + Math.sin(elapsed * 8) * cur.scalePulse : cur.scaleBase;
		group.scale.setScalar(pulse);

		group.traverse((child) => {
			if (child instanceof THREE.Mesh && child.material) {
				const mat = child.material as THREE.MeshStandardMaterial;
				if (mat.emissive) {
					mat.emissive.lerp(new THREE.Color(...cur.emissiveColor), t);
					mat.emissiveIntensity = THREE.MathUtils.lerp(
						mat.emissiveIntensity,
						cur.emissiveIntensity,
						t
					);
				}
			}
		});
	});

	return (
		<group ref={groupRef}>
			<primitive object={cloned} />
		</group>
	);
}
