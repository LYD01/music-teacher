import type { FeedbackResponse } from "@_types";

interface FeedbackPanelProps {
	feedback: FeedbackResponse | null;
	isLoading: boolean;
	className?: string;
}

export function FeedbackPanel({ feedback, isLoading, className = "" }: FeedbackPanelProps) {
	if (isLoading) {
		return (
			<div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
				<div className="flex items-center gap-2">
					<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<span className="text-sm text-muted-foreground">Getting feedback...</span>
				</div>
				<div className="mt-3 space-y-2">
					<div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
					<div className="h-3 w-3/5 animate-pulse rounded bg-muted" />
				</div>
			</div>
		);
	}

	if (!feedback) return null;

	return (
		<div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
			<h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
				<svg
					className="h-4 w-4 text-primary"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					aria-hidden="true"
				>
					<title>Feedback</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
					/>
				</svg>
				Teacher Feedback
			</h3>

			<p className="text-sm leading-relaxed text-muted-foreground">{feedback.message}</p>

			{feedback.suggestions.length > 0 && (
				<div className="mt-3">
					<p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
						Suggestions
					</p>
					<ul className="space-y-1">
						{feedback.suggestions.map((s) => (
							<li key={s} className="flex items-start gap-1.5 text-xs text-muted-foreground">
								<span className="mt-0.5 text-primary">•</span>
								{s}
							</li>
						))}
					</ul>
				</div>
			)}

			{feedback.encouragement && (
				<p className="mt-3 rounded-lg bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
					{feedback.encouragement}
				</p>
			)}

			{feedback.focusAreas.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{feedback.focusAreas.map((area) => (
						<span
							key={area}
							className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
						>
							{area}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
