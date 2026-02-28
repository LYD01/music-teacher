# WASM pitch detector

The Rust pitch detector (`pitch_detector_bg.wasm`) is built from source. To build it:

1. Install [Rust](https://rustup.rs)
2. On Windows: Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the "Desktop development with C++" workload
3. Run: `bun run build:wasm`

The built file will be placed here. Until then, the app falls back to the pure-JS YIN implementation.
