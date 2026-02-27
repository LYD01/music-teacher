// Library skeleton loader for streaming SSR

export default function LibraryLoading() {
	return (
		<div className="animate-pulse space-y-6">
			<div className="h-8 w-48 rounded bg-muted" />
			<div className="h-4 w-72 rounded bg-muted" />
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div className="h-40 rounded-lg bg-muted" />
				<div className="h-40 rounded-lg bg-muted" />
				<div className="h-40 rounded-lg bg-muted" />
				<div className="h-40 rounded-lg bg-muted" />
				<div className="h-40 rounded-lg bg-muted" />
				<div className="h-40 rounded-lg bg-muted" />
			</div>
		</div>
	);
}
