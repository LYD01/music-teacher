// Parallel route: progress summary cards (default slot)
// Loads independently alongside @history

export default function ProgressSlot() {
	// TODO: Fetch user piece progress from DB
	return (
		<div className="rounded-lg border border-border bg-card p-4">
			<h3 className="mb-3 text-sm font-semibold text-foreground">Your Progress</h3>
			<p className="text-sm text-muted-foreground">Start practicing to see your progress here.</p>
		</div>
	);
}
