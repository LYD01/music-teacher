"use client";

import type { ExpectedNote } from "@_lib/audio/analyzer";
import { noteNameToMidi } from "@_lib/music/theory";
import type {
	DetectedNote,
	FeedbackTrigger,
	LiveFeedbackMessage,
	LiveFeedbackRequest,
	LiveFeedbackType,
} from "@_types";
import { useCallback, useEffect, useRef, useState } from "react";

const PERIODIC_INTERVAL_MS = 15_000;
const COOLDOWN_MS = 8_000;
const GOOD_STREAK_THRESHOLD = 5;
const BAD_STREAK_THRESHOLD = 3;
const MAX_MESSAGES = 8;
const RECENT_WINDOW = 10;
const TOLERANCE_SEMITONES = 1;

interface UseLiveFeedbackOptions {
	pieceTitle: string;
	isRecording: boolean;
	notes: DetectedNote[];
	expectedNotes: ExpectedNote[];
}

export interface UseLiveFeedbackReturn {
	messages: LiveFeedbackMessage[];
	streamingText: string;
	isStreaming: boolean;
}

function triggerToType(trigger: FeedbackTrigger): LiveFeedbackType {
	switch (trigger) {
		case "good_streak":
			return "celebration";
		case "bad_streak":
			return "coaching";
		case "section_end":
			return "tip";
		default:
			return "encouragement";
	}
}

function isNoteCorrect(detected: DetectedNote, expected: ExpectedNote[]): boolean {
	if (expected.length === 0) return true;
	return expected.some((exp) => {
		try {
			const midi = noteNameToMidi(exp.noteName, exp.octave);
			return Math.abs(detected.pitch - midi) <= TOLERANCE_SEMITONES;
		} catch {
			return false;
		}
	});
}

let idCounter = 0;

export function useLiveFeedback({
	pieceTitle,
	isRecording,
	notes,
	expectedNotes,
}: UseLiveFeedbackOptions): UseLiveFeedbackReturn {
	const [messages, setMessages] = useState<LiveFeedbackMessage[]>([]);
	const [streamingText, setStreamingText] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);

	const lastTriggerTime = useRef(0);
	const inFlight = useRef(false);
	const lastNoteCount = useRef(0);
	const consecutiveHits = useRef(0);
	const consecutiveMisses = useRef(0);
	const recentCorrect = useRef(0);
	const recentIncorrect = useRef(0);
	const periodicTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
	const abortRef = useRef<AbortController | null>(null);
	const lastMessageText = useRef("");

	const pushMessage = useCallback((text: string, trigger: FeedbackTrigger) => {
		const msg: LiveFeedbackMessage = {
			id: `lfm-${++idCounter}`,
			text: text.trim(),
			type: triggerToType(trigger),
			timestamp: Date.now(),
		};
		lastMessageText.current = msg.text;
		setMessages((prev) => [...prev.slice(-(MAX_MESSAGES - 1)), msg]);
	}, []);

	const requestFeedback = useCallback(
		async (trigger: FeedbackTrigger) => {
			const now = Date.now();
			if (inFlight.current || now - lastTriggerTime.current < COOLDOWN_MS) return;

			inFlight.current = true;
			lastTriggerTime.current = now;
			setIsStreaming(true);
			setStreamingText("");

			const totalRecent = recentCorrect.current + recentIncorrect.current;
			const body: LiveFeedbackRequest = {
				trigger,
				pieceTitle,
				recentCorrect: recentCorrect.current,
				recentIncorrect: recentIncorrect.current,
				runningAccuracy: totalRecent > 0 ? (recentCorrect.current / totalRecent) * 100 : 0,
				consecutiveHits: consecutiveHits.current,
				consecutiveMisses: consecutiveMisses.current,
				previousMessage: lastMessageText.current,
			};

			const controller = new AbortController();
			abortRef.current = controller;

			try {
				const res = await fetch("/api/feedback/stream", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(body),
					signal: controller.signal,
				});

				if (!res.ok || !res.body) {
					pushMessage("Keep it up, you're doing great!", trigger);
					return;
				}

				const reader = res.body.getReader();
				const decoder = new TextDecoder();
				let accumulated = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					const chunk = decoder.decode(value, { stream: true });
					accumulated += chunk;
					setStreamingText(accumulated);
				}

				if (accumulated.trim()) {
					pushMessage(accumulated, trigger);
				}
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") return;
				pushMessage("Keep going, you've got this!", trigger);
			} finally {
				setStreamingText("");
				setIsStreaming(false);
				inFlight.current = false;
				abortRef.current = null;
			}
		},
		[pieceTitle, pushMessage]
	);

	// Track note correctness and detect streak triggers
	useEffect(() => {
		if (!isRecording) return;
		if (notes.length <= lastNoteCount.current) return;

		const newNotes = notes.slice(lastNoteCount.current);
		lastNoteCount.current = notes.length;

		for (const note of newNotes) {
			const correct = isNoteCorrect(note, expectedNotes);
			if (correct) {
				consecutiveHits.current++;
				consecutiveMisses.current = 0;
				recentCorrect.current++;
			} else {
				consecutiveMisses.current++;
				consecutiveHits.current = 0;
				recentIncorrect.current++;
			}

			// Keep recent window bounded
			if (recentCorrect.current + recentIncorrect.current > RECENT_WINDOW) {
				const excess = recentCorrect.current + recentIncorrect.current - RECENT_WINDOW;
				const correctRatio =
					recentCorrect.current / (recentCorrect.current + recentIncorrect.current);
				recentCorrect.current -= Math.round(excess * correctRatio);
				recentIncorrect.current = RECENT_WINDOW - recentCorrect.current;
			}

			if (consecutiveHits.current === GOOD_STREAK_THRESHOLD) {
				requestFeedback("good_streak");
			} else if (consecutiveMisses.current === BAD_STREAK_THRESHOLD) {
				requestFeedback("bad_streak");
			}
		}
	}, [notes, isRecording, expectedNotes, requestFeedback]);

	// Periodic trigger
	useEffect(() => {
		if (!isRecording) {
			if (periodicTimer.current) clearTimeout(periodicTimer.current);
			return;
		}

		const schedule = () => {
			periodicTimer.current = setTimeout(() => {
				requestFeedback("periodic");
				schedule();
			}, PERIODIC_INTERVAL_MS);
		};
		schedule();

		return () => {
			if (periodicTimer.current) clearTimeout(periodicTimer.current);
		};
	}, [isRecording, requestFeedback]);

	// Reset on recording stop
	useEffect(() => {
		if (!isRecording) {
			lastNoteCount.current = 0;
			consecutiveHits.current = 0;
			consecutiveMisses.current = 0;
			recentCorrect.current = 0;
			recentIncorrect.current = 0;
			lastTriggerTime.current = 0;
			lastMessageText.current = "";

			if (abortRef.current) {
				abortRef.current.abort();
				abortRef.current = null;
			}
			inFlight.current = false;
			setStreamingText("");
			setIsStreaming(false);
		}
	}, [isRecording]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortRef.current) abortRef.current.abort();
			if (periodicTimer.current) clearTimeout(periodicTimer.current);
		};
	}, []);

	return { messages, streamingText, isStreaming };
}
