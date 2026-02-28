// YIN pitch detection algorithm — Rust → WebAssembly
//
// Build: bun run build:wasm (from project root)
//
// The TypeScript wrapper in src/_lib/audio/pitch-detector.ts loads this
// WASM module automatically when /wasm/pitch_detector_bg.wasm is present.
// Otherwise it falls back to the pure-JS YIN implementation.

use std::alloc::{alloc as rust_alloc, dealloc as rust_dealloc, Layout};

/// Allocate `size` bytes of memory for use by the JS host.
#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut u8 {
    let layout = Layout::from_size_align(size, 4).unwrap();
    unsafe { rust_alloc(layout) }
}

/// Deallocate `size` bytes starting at `ptr`.
#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut u8, size: usize) {
    let layout = Layout::from_size_align(size, 4).unwrap();
    unsafe { rust_dealloc(ptr, layout) }
}

/// Result struct stored on the heap, accessed by the JS host via getters.
#[repr(C)]
pub struct PitchResult {
    pub frequency: f32,
    pub clarity: f32,
    pub detected: u32, // 0 = no pitch, 1 = pitch detected
}

/// Run YIN pitch detection on `len` f32 samples starting at `ptr`.
/// Returns a heap pointer to a PitchResult (caller must call free_result).
#[no_mangle]
pub extern "C" fn detect_pitch(
    ptr: *const f32,
    len: usize,
    sample_rate: f32,
    threshold: f32,
) -> *mut PitchResult {
    let samples = unsafe { std::slice::from_raw_parts(ptr, len) };
    let half = len / 2;
    let mut yin_buf = vec![0.0f32; half];

    // Step 1: Squared difference function
    for tau in 0..half {
        let mut sum = 0.0f32;
        for i in 0..half {
            let d = samples[i] - samples[i + tau];
            sum += d * d;
        }
        yin_buf[tau] = sum;
    }

    // Step 2: Cumulative mean normalized difference
    yin_buf[0] = 1.0;
    let mut running_sum = 0.0f32;
    for tau in 1..half {
        running_sum += yin_buf[tau];
        yin_buf[tau] = yin_buf[tau] * (tau as f32) / running_sum;
    }

    // Step 3: Absolute threshold
    let mut tau_estimate: Option<usize> = None;
    let mut tau = 2usize;
    while tau < half {
        if yin_buf[tau] < threshold {
            while tau + 1 < half && yin_buf[tau + 1] < yin_buf[tau] {
                tau += 1;
            }
            tau_estimate = Some(tau);
            break;
        }
        tau += 1;
    }

    let result = match tau_estimate {
        None => PitchResult {
            frequency: 0.0,
            clarity: 0.0,
            detected: 0,
        },
        Some(te) => {
            // Step 4: Parabolic interpolation
            let refined = if te > 0 && te < half - 1 {
                let s0 = yin_buf[te - 1];
                let s1 = yin_buf[te];
                let s2 = yin_buf[te + 1];
                let shift = (s0 - s2) / (2.0 * (s0 - 2.0 * s1 + s2));
                if shift.is_finite() {
                    te as f32 + shift
                } else {
                    te as f32
                }
            } else {
                te as f32
            };

            PitchResult {
                frequency: sample_rate / refined,
                clarity: 1.0 - yin_buf[te],
                detected: 1,
            }
        }
    };

    Box::into_raw(Box::new(result))
}

#[no_mangle]
pub extern "C" fn get_frequency(ptr: *const PitchResult) -> f32 {
    unsafe { (*ptr).frequency }
}

#[no_mangle]
pub extern "C" fn get_clarity(ptr: *const PitchResult) -> f32 {
    unsafe { (*ptr).clarity }
}

#[no_mangle]
pub extern "C" fn get_detected(ptr: *const PitchResult) -> u32 {
    unsafe { (*ptr).detected }
}

#[no_mangle]
pub extern "C" fn free_result(ptr: *mut PitchResult) {
    if !ptr.is_null() {
        unsafe {
            drop(Box::from_raw(ptr));
        }
    }
}
