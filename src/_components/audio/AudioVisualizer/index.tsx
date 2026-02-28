"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
	isActive: boolean;
	getTimeDomain?: () => Float32Array | null;
	className?: string;
}

const ACTIVE_COLOR = "#22c55e";
const IDLE_COLOR = "#6b7280";

export function AudioVisualizer({ isActive, getTimeDomain, className = "" }: AudioVisualizerProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animFrameRef = useRef(0);
	const dimsRef = useRef({ w: 0, h: 0 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.resetTransform();
			ctx.scale(dpr, dpr);
			dimsRef.current = { w: rect.width, h: rect.height };
		};

		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(canvas);

		const draw = () => {
			const { w, h } = dimsRef.current;
			ctx.clearRect(0, 0, w, h);

			if (isActive && getTimeDomain) {
				const data = getTimeDomain();

				if (data) {
					ctx.beginPath();
					ctx.strokeStyle = ACTIVE_COLOR;
					ctx.lineWidth = 2;
					ctx.lineJoin = "round";

					const step = w / data.length;
					for (let i = 0; i < data.length; i++) {
						const x = i * step;
						const y = ((data[i] + 1) / 2) * h;
						if (i === 0) ctx.moveTo(x, y);
						else ctx.lineTo(x, y);
					}
					ctx.stroke();
				}
			} else {
				ctx.beginPath();
				ctx.strokeStyle = IDLE_COLOR;
				ctx.lineWidth = 1;
				ctx.setLineDash([4, 4]);
				ctx.moveTo(0, h / 2);
				ctx.lineTo(w, h / 2);
				ctx.stroke();
				ctx.setLineDash([]);
			}

			animFrameRef.current = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			cancelAnimationFrame(animFrameRef.current);
			observer.disconnect();
		};
	}, [isActive, getTimeDomain]);

	return (
		<div className={`overflow-hidden rounded-lg border border-border bg-background ${className}`}>
			<canvas ref={canvasRef} className="h-20 w-full" />
		</div>
	);
}
