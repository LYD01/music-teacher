"use client";

import type { LiveFeedbackMessage } from "@_types";
import { useEffect, useState } from "react";

interface LiveFeedbackChatProps {
	messages?: LiveFeedbackMessage[];
	streamingText?: string;
	isStreaming?: boolean;
	persistentText?: string | null;
	className?: string;
}

export function LiveFeedbackChat({
	messages = [],
	streamingText = "",
	isStreaming = false,
	persistentText = null,
	className = "",
}: LiveFeedbackChatProps) {
	if (persistentText) {
		return <SpeechBubble text={persistentText} className={className} />;
	}

	return (
		<LiveBubble
			messages={messages}
			streamingText={streamingText}
			isStreaming={isStreaming}
			className={className}
		/>
	);
}

function SpeechBubble({ text, className = "" }: { text: string; className?: string }) {
	return (
		<div
			className={`pointer-events-none absolute top-2 left-2 z-20 w-fit max-w-[85%] ${className}`}
		>
			<div className="pointer-events-auto w-fit rounded-lg bg-foreground/85 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-foreground/15">
				<p className="text-[11px] leading-snug text-background dark:text-foreground/90">{text}</p>
			</div>
			<BubbleTail />
		</div>
	);
}

function LiveBubble({
	messages,
	streamingText,
	isStreaming,
	className = "",
}: {
	messages: LiveFeedbackMessage[];
	streamingText: string;
	isStreaming: boolean;
	className?: string;
}) {
	const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
	const displayText = isStreaming && streamingText ? streamingText : (latestMessage?.text ?? null);

	const [visible, setVisible] = useState(false);
	const [currentText, setCurrentText] = useState<string | null>(null);
	const latestId = latestMessage?.id;

	useEffect(() => {
		if (displayText) {
			setCurrentText(displayText);
			setVisible(true);
		}
	}, [displayText]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: latestId resets the hide timer when a new message arrives
	useEffect(() => {
		if (!visible || isStreaming) return;
		const timer = setTimeout(() => setVisible(false), 6000);
		return () => clearTimeout(timer);
	}, [visible, isStreaming, latestId]);

	if (!visible || !currentText) return null;

	return (
		<div
			className={`pointer-events-none absolute top-2 left-2 z-20 w-fit max-w-[85%] ${className}`}
			style={{ transition: "opacity 300ms ease", opacity: visible ? 1 : 0 }}
		>
			<div className="pointer-events-auto w-fit rounded-lg bg-foreground/85 px-3 py-2 shadow-lg backdrop-blur-sm dark:bg-foreground/15">
				<p className="text-[11px] leading-snug text-background dark:text-foreground/90">
					{currentText}
					{isStreaming && (
						<span className="ml-0.5 inline-block h-2.5 w-px animate-pulse bg-background/60 dark:bg-foreground/50" />
					)}
				</p>
			</div>
			<BubbleTail />
		</div>
	);
}

function BubbleTail() {
	return (
		<div className="ml-6">
			<svg width="16" height="10" viewBox="0 0 16 10" className="block" aria-hidden="true">
				<path d="M0 0 L8 10 L16 0" className="fill-foreground/85 dark:fill-foreground/15" />
			</svg>
		</div>
	);
}
