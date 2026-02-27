// Full history log page with pagination and filters

export default function HistoryPage() {
	// TODO: Fetch paginated activity log from DB

	return (
		<div>
			<h1 className="text-2xl font-bold text-foreground">Practice History</h1>
			<p className="mt-1 text-sm text-muted-foreground">Review all your past practice sessions and milestones.</p>

			<div className="mt-6">
				{/* TODO: Render paginated history list with filters */}
				<div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
					Your practice history will appear here.
				</div>
			</div>
		</div>
	);
}
