// Login page: GitHub OAuth one-click sign in

export default function LoginPage() {
	return (
		<div className="rounded-xl border border-border bg-card p-8 shadow-lg">
			<h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
			<p className="mt-2 text-sm text-muted-foreground">Sign in to continue your music journey.</p>

			<div className="mt-8">
				{/* TODO: Wire up Auth.js signIn("github") */}
				<button
					type="button"
					className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
				>
					Sign in with GitHub
				</button>
			</div>
		</div>
	);
}
