"use client";

import type { AvatarMood } from "@_types";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface ReactionParticlesProps {
	mood: AvatarMood;
}

const PARTICLE_COUNT = 30;
const PARTICLE_MOODS: AvatarMood[] = ["good_note", "great_streak", "celebrating"];

export function ReactionParticles({ mood }: ReactionParticlesProps) {
	const meshRef = useRef<THREE.InstancedMesh>(null);
	const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
	const lifetimes = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT));
	const active = PARTICLE_MOODS.includes(mood);
	const dummy = useMemo(() => new THREE.Object3D(), []);

	const color = useMemo(() => {
		if (mood === "good_note") return new THREE.Color(0.1, 0.9, 0.3);
		if (mood === "great_streak") return new THREE.Color(1, 0.85, 0);
		if (mood === "celebrating") return new THREE.Color(1, 0.6, 0);
		return new THREE.Color(1, 1, 1);
	}, [mood]);

	useEffect(() => {
		if (!active) return;
		const vel = velocities.current;
		const life = lifetimes.current;
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			vel[i * 3] = (Math.random() - 0.5) * 2;
			vel[i * 3 + 1] = Math.random() * 3 + 1;
			vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
			life[i] = Math.random();
		}
	}, [active]);

	useFrame((_, delta) => {
		if (!active || !meshRef.current) return;

		const vel = velocities.current;
		const life = lifetimes.current;

		for (let i = 0; i < PARTICLE_COUNT; i++) {
			life[i] -= delta * 0.8;
			if (life[i] <= 0) {
				life[i] = 1;
				vel[i * 3] = (Math.random() - 0.5) * 2;
				vel[i * 3 + 1] = Math.random() * 3 + 1;
				vel[i * 3 + 2] = (Math.random() - 0.5) * 2;
				dummy.position.set((Math.random() - 0.5) * 0.5, 0.5, (Math.random() - 0.5) * 0.5);
			} else {
				dummy.position.x += vel[i * 3] * delta;
				dummy.position.y += vel[i * 3 + 1] * delta;
				dummy.position.z += vel[i * 3 + 2] * delta;
				vel[i * 3 + 1] -= 2 * delta;
			}

			const scale = life[i] * 0.08;
			dummy.scale.setScalar(scale);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i, dummy.matrix);
		}

		meshRef.current.instanceMatrix.needsUpdate = true;
	});

	if (!active) return null;

	return (
		<instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
			<sphereGeometry args={[1, 8, 8]} />
			<meshStandardMaterial
				color={color}
				emissive={color}
				emissiveIntensity={2}
				toneMapped={false}
			/>
		</instancedMesh>
	);
}
