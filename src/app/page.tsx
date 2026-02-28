import Link from "next/link";
import { PublicNav } from "@_components";

export default function Home() {
	return (
		<>
			<PublicNav />
			<main className="min-h-screen bg-background">
			{/* Hero */}
			<section className="relative overflow-hidden px-6 py-20 sm:px-8 md:py-28 lg:px-12">
				{/* Subtle background pattern */}
				<div
					className="pointer-events-none absolute inset-0 opacity-[0.03]"
					aria-hidden
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%231c1917' fill-opacity='1'/%3E%3C/svg%3E")`,
					}}
				/>
				<div className="relative mx-auto max-w-6xl">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
						<div className="space-y-8">
							<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								Learn guitar with{" "}
								<span className="text-primary">AI-powered</span> feedback
							</h1>
							<p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
								Play. Listen. Improve. AI Music Teacher listens to you play, compares
								your performance to sheet music, and guides you with personalized
								feedback—all in your browser.
							</p>
							<div className="flex flex-wrap gap-4">
								<Link
									href="/sample"
									className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									Explore the app
								</Link>
								<Link
									href="/sample"
									className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-border bg-transparent px-6 font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
								>
									View components
								</Link>
							</div>
						</div>
						{/* Hero image placeholder */}
						<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted/50 lg:aspect-[16/10]">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center text-muted-foreground">
									<svg
										className="mx-auto mb-2 h-16 w-16 opacity-40"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden
										role="img"
									>
										<title>Music note icon</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
										/>
									</svg>
									<p className="text-sm font-medium">Hero image</p>
									<p className="text-xs">Practice session or guitar illustration</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* What it is */}
			<section className="border-t border-border bg-card/50 px-6 py-16 sm:px-8 lg:px-12">
				<div className="mx-auto max-w-6xl">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						<div>
							<h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
								What is AI Music Teacher?
							</h2>
							<p className="mt-4 text-muted-foreground">
								A web app that helps you learn acoustic classical guitar by
								listening to you play in real time. Choose a piece from the
								library, follow the sheet music, and play into your microphone.
								The app analyzes your pitch and rhythm, compares it to the score,
								and gives you an accuracy score. A 3D avatar reacts to your
								performance, and an AI assistant (Ollama) generates personalized
								guidance to help you improve.
							</p>
						</div>
						{/* Image placeholder */}
						<div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted/30">
							<div className="flex h-full items-center justify-center text-muted-foreground">
								<p className="text-sm">App screenshot: sheet music + practice view</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section className="px-6 py-16 sm:px-8 lg:px-12">
				<div className="mx-auto max-w-6xl">
					<h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
						Why use it?
					</h2>
					<div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
									role="img"
								>
									<title>Lightning bolt icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-foreground">Real-time feedback</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Get instant pitch and rhythm analysis as you play. See exactly where
								you hit or miss each note.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
									role="img"
								>
									<title>Lightbulb icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-foreground">AI guidance</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Personalized tips from an AI teacher. Learn at your own pace,
								without scheduling lessons.
							</p>
						</div>
						<div className="rounded-xl border border-border bg-card p-6 sm:col-span-2 lg:col-span-1">
							<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
									role="img"
								>
									<title>Chart icon</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-foreground">Track progress</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Save sessions, view history, and watch your scores improve over time.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Future roadmap */}
			<section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-8 lg:px-12">
				<div className="mx-auto max-w-6xl">
					<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
						<div>
							<h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
								Where we&apos;re headed
							</h2>
							<p className="mt-4 text-muted-foreground">
								The MVP focuses on acoustic classical guitar with single-note
								melodies. The architecture is built to grow.
							</p>
							<ul className="mt-6 space-y-3 text-muted-foreground">
								<li className="flex items-start gap-3">
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
									<span>More instruments: piano, violin, ukulele</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
									<span>Chord detection and polyphonic support</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
									<span>Community uploads and a piece CMS</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
									<span>Gamification: streaks, XP, achievements</span>
								</li>
							</ul>
						</div>
						{/* Image placeholder */}
						<div className="aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted/20">
							<div className="flex h-full items-center justify-center text-muted-foreground">
								<p className="text-sm">Roadmap illustration or feature preview</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="border-t border-border px-6 py-16 sm:px-8 lg:px-12">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
						Ready to practice?
					</h2>
					<p className="mt-3 text-muted-foreground">
						Explore the component library or sign in to get started.
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<Link
							href="/sample"
							className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Explore the app
						</Link>
					</div>
				</div>
			</section>
		</main>
		</>
	);
}
