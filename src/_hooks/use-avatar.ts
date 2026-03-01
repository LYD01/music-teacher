"use client";

import type { AvatarConfig } from "@_types";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "music-teacher-avatar";
const MAX_FILE_SIZE_MB = 25;

function loadConfig(): AvatarConfig {
	if (typeof window === "undefined") return { modelUrl: null, modelName: "Default" };
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return JSON.parse(stored);
	} catch {}
	return { modelUrl: null, modelName: "Default" };
}

function saveConfig(config: AvatarConfig) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	} catch {}
}

export interface UseAvatarReturn {
	modelUrl: string | null;
	modelName: string;
	isLoading: boolean;
	error: string | null;
	uploadModel: (file: File) => Promise<void>;
	removeModel: () => void;
}

export function useAvatar(): UseAvatarReturn {
	const [config, setConfig] = useState<AvatarConfig>({
		modelUrl: null,
		modelName: "Default",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setConfig(loadConfig());
	}, []);

	const uploadModel = useCallback(async (file: File) => {
		setError(null);

		if (!file.name.endsWith(".glb") && !file.name.endsWith(".gltf")) {
			setError("Only .glb and .gltf files are supported");
			return;
		}

		if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
			setError(`File must be under ${MAX_FILE_SIZE_MB}MB`);
			return;
		}

		setIsLoading(true);

		try {
			const url = URL.createObjectURL(file);
			const name = file.name.replace(/\.(glb|gltf)$/i, "");
			const newConfig: AvatarConfig = { modelUrl: url, modelName: name };
			setConfig(newConfig);
			saveConfig({ ...newConfig, modelUrl: `__blob__:${name}` });

			try {
				const buffer = await file.arrayBuffer();
				const db = await openAvatarDB();
				const tx = db.transaction("models", "readwrite");
				tx.objectStore("models").put(buffer, "current");
			} catch {}
		} finally {
			setIsLoading(false);
		}
	}, []);

	const removeModel = useCallback(() => {
		if (config.modelUrl?.startsWith("blob:")) {
			URL.revokeObjectURL(config.modelUrl);
		}
		const newConfig: AvatarConfig = { modelUrl: null, modelName: "Default" };
		setConfig(newConfig);
		saveConfig(newConfig);
		try {
			openAvatarDB().then((db) => {
				const tx = db.transaction("models", "readwrite");
				tx.objectStore("models").delete("current");
			});
		} catch {}
	}, [config.modelUrl]);

	useEffect(() => {
		if (config.modelUrl || !config.modelName || config.modelName === "Default") return;

		openAvatarDB()
			.then((db) => {
				const tx = db.transaction("models", "readonly");
				const req = tx.objectStore("models").get("current");
				req.onsuccess = () => {
					if (req.result) {
						const blob = new Blob([req.result], {
							type: "model/gltf-binary",
						});
						const url = URL.createObjectURL(blob);
						setConfig((prev) => ({ ...prev, modelUrl: url }));
					}
				};
			})
			.catch(() => {});
	}, [config.modelUrl, config.modelName]);

	return {
		modelUrl: config.modelUrl,
		modelName: config.modelName,
		isLoading,
		error,
		uploadModel,
		removeModel,
	};
}

function openAvatarDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open("music-teacher-avatars", 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore("models");
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
