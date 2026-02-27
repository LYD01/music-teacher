"use client";

// Practice session page: sheet music + audio capture + 3D avatar + feedback
// This is the core interactive experience of the app

interface PracticePageProps {
	params: Promise<{ pieceId: string }>;
}

export default function PracticePage({ params }: PracticePageProps) {
	void params;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-foreground">Practice Session</h1>
				<p className="mt-1 text-sm text-muted-foreground">Follow the sheet music and play along.</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* Sheet music area */}
				<div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground lg:col-span-2">
					Sheet music + audio controls will render here.
				</div>

				{/* Avatar + feedback area */}
				<div className="space-y-4">
					<div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
						3D Avatar placeholder
					</div>
					<div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
						Feedback panel placeholder
					</div>
				</div>
			</div>
		</div>
	);
}
