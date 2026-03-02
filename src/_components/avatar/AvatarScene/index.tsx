"use client";

import type { AvatarMood } from "@_types";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import { AvatarModel } from "../AvatarModel";
import { DefaultAvatar } from "../DefaultAvatar";
import { ReactionParticles } from "../ReactionParticles";

interface AvatarSceneProps {
	mood: AvatarMood;
	modelUrl: string | null;
	className?: string;
}

function SceneFallback() {
	return (
		<mesh>
			<boxGeometry args={[0.5, 0.5, 0.5]} />
			<meshStandardMaterial color="#6366f1" wireframe />
		</mesh>
	);
}

export function AvatarScene({ mood, modelUrl, className = "" }: AvatarSceneProps) {
	const moodColor = useMemo(() => {
		switch (mood) {
			case "good_note":
			case "great_streak":
				return "#d1fae5";
			case "bad_note":
				return "#fee2e2";
			case "celebrating":
				return "#fef3c7";
			default:
				return "#f0f0f0";
		}
	}, [mood]);

	return (
		<div
			className={`relative overflow-hidden rounded-xl border border-border bg-card ${className}`}
			style={{ minHeight: 220 }}
		>
			<Canvas
				camera={{ position: [0, 1.5, 3.5], fov: 40 }}
				shadows
				gl={{ antialias: true, alpha: true }}
				style={{ background: "transparent" }}
			>
				<Suspense fallback={<SceneFallback />}>
					<ambientLight intensity={0.5} />
					<directionalLight position={[3, 5, 4]} intensity={1} castShadow />
					<pointLight position={[-3, 2, -2]} intensity={0.3} color={moodColor} />

					<Environment preset="studio" />

					{modelUrl ? <AvatarModel url={modelUrl} mood={mood} /> : <DefaultAvatar mood={mood} />}

					<ReactionParticles mood={mood} />

					<ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={5} blur={2} />

					<OrbitControls
						enablePan={false}
						enableZoom={false}
						minPolarAngle={Math.PI / 4}
						maxPolarAngle={Math.PI / 2}
						target={[0, 0.8, 0]}
					/>
				</Suspense>
			</Canvas>

			<MoodIndicator mood={mood} />
		</div>
	);
}

function MoodIndicator({ mood }: { mood: AvatarMood }) {
	const labels: Partial<Record<AvatarMood, { emoji: string; text: string }>> = {
		good_note: { emoji: "✓", text: "Nice!" },
		bad_note: { emoji: "✗", text: "Try again" },
		great_streak: { emoji: "🔥", text: "On fire!" },
		celebrating: { emoji: "★", text: "Amazing!" },
	};

	const label = labels[mood];
	if (!label) return null;

	const colorClass =
		mood === "bad_note"
			? "bg-red-500/90 text-white"
			: mood === "great_streak" || mood === "celebrating"
				? "bg-amber-500/90 text-white"
				: "bg-emerald-500/90 text-white";

	return (
		<div className="pointer-events-none absolute top-3 right-3">
			<span
				className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-lg ${colorClass}`}
			>
				{label.emoji} {label.text}
			</span>
		</div>
	);
}
