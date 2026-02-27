// Optional signup page
// May redirect to login since GitHub OAuth handles account creation automatically

export default function SignupPage() {
	return (
		<div className="rounded-xl border border-border bg-card p-8 shadow-lg">
			<h1 className="text-2xl font-bold text-foreground">Get Started</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				Create an account to track your progress and practice history.
			</p>

			<div className="mt-8">
				{/* TODO: Wire up Auth.js signIn("github") */}
				<button
					type="button"
					className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
				>
					Continue with GitHub
				</button>
			</div>
		</div>
	);
}
