#!/usr/bin/env node
/**
 * Builds the Rust pitch detector WASM module and copies it to public/wasm/.
 * Requires: Rust (rustup) and wasm32 target (rustup target add wasm32-unknown-unknown)
 *
 * Run: bun run build:wasm
 */

import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const wasmDir = join(root, "wasm", "pitch-detector");
const targetDir = join(wasmDir, "target", "wasm32-unknown-unknown", "release");
const outDir = join(root, "public", "wasm");
const wasmFile = "pitch_detector_bg.wasm";
const srcFile = "pitch_detector.wasm";

console.log("[build-wasm] Building Rust pitch detector...");
try {
	execSync("rustup target add wasm32-unknown-unknown", { stdio: "inherit" });
	execSync("cargo build --target wasm32-unknown-unknown --release", {
		cwd: wasmDir,
		stdio: "inherit",
	});
} catch (e) {
	console.error(
		"\n[build-wasm] Failed. Ensure Rust is installed:\n  https://rustup.rs\n",
	);
	process.exit(1);
}

const src = join(targetDir, srcFile);
if (!existsSync(src)) {
	console.error(`[build-wasm] Expected ${srcFile} in ${targetDir}`);
	process.exit(1);
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
cpSync(src, join(outDir, wasmFile));
console.log(`[build-wasm] Copied to public/wasm/${wasmFile}`);
