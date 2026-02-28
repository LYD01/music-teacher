import type { FeedbackResponse } from "@_types";

interface FeedbackPanelProps {
	feedback: FeedbackResponse | null;
	isLoading: boolean;
	className?: string;
}

export function FeedbackPanel({ feedback, isLoading, className = "" }: FeedbackPanelProps) {
	if (isLoading) {
		return (
			<div className={`animate-pulse rounded-lg border border-border bg-card p-6 ${className}`}>
				<div className="h-4 w-3/4 rounded bg-muted" />
				<div className="mt-3 h-4 w-1/2 rounded bg-muted" />
			</div>
		);
	}

	if (!feedback) return null;

	return (
		<div className={`rounded-lg border border-border bg-card p-6 ${className}`}>
			<h3 className="font-semibold text-foreground">Teacher Feedback</h3>
			<p className="mt-2 text-sm text-muted-foreground">{feedback.message}</p>
		</div>
	);
}
