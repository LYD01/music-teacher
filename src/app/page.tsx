import {
	Accordion,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	ScrollWindow,
	Separator,
} from "@/components/common";

const colorPalette = [
	{ name: "Background", token: "--background", class: "bg-background", sample: true },
	{ name: "Foreground", token: "--foreground", class: "text-foreground", sample: false },
	{ name: "Card", token: "--card", class: "bg-card", sample: true },
	{
		name: "Card Foreground",
		token: "--card-foreground",
		class: "text-card-foreground",
		sample: false,
	},
	{ name: "Primary", token: "--primary", class: "bg-primary", sample: true },
	{
		name: "Primary Foreground",
		token: "--primary-foreground",
		class: "text-primary-foreground",
		sample: false,
	},
	{ name: "Secondary", token: "--secondary", class: "bg-secondary", sample: true },
	{
		name: "Secondary Foreground",
		token: "--secondary-foreground",
		class: "text-secondary-foreground",
		sample: false,
	},
	{ name: "Muted", token: "--muted", class: "bg-muted", sample: true },
	{
		name: "Muted Foreground",
		token: "--muted-foreground",
		class: "text-muted-foreground",
		sample: false,
	},
	{ name: "Accent", token: "--accent", class: "bg-accent", sample: true },
	{
		name: "Accent Foreground",
		token: "--accent-foreground",
		class: "text-accent-foreground",
		sample: false,
	},
	{ name: "Destructive", token: "--destructive", class: "bg-destructive", sample: true },
	{
		name: "Destructive Foreground",
		token: "--destructive-foreground",
		class: "text-destructive-foreground",
		sample: false,
	},
	{ name: "Border", token: "--border", class: "bg-border", sample: true },
	{ name: "Ring", token: "--ring", class: "bg-ring", sample: true },
] as const;

export default function Home() {
	return (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-4xl space-y-16">
				<header>
					<h1 className="text-3xl font-bold text-foreground">
						AI Music Teacher — Component Library
					</h1>
					<p className="mt-2 text-muted-foreground">
						Reusable UI components and design tokens for the app.
					</p>
				</header>

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Color Palette</h2>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{colorPalette.map((color) => (
							<div
								key={color.token}
								className="overflow-hidden rounded-lg border border-border bg-card"
							>
								{color.sample ? (
									<div
										className={`h-20 ${color.class}`}
										style={{ backgroundColor: `var(${color.token})` }}
									/>
								) : (
									<div
										className={`flex h-20 items-center justify-center ${color.class}`}
										style={{ color: `var(${color.token})` }}
									>
										Aa
									</div>
								)}
								<div className="p-3">
									<p className="text-sm font-medium text-foreground">{color.name}</p>
									<p className="font-mono text-xs text-muted-foreground">{color.token}</p>
								</div>
							</div>
						))}
					</div>
				</section>

				<Separator />

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Buttons</h2>
					<div className="flex flex-wrap gap-4">
						<Button variant="primary">Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
					</div>
					<div className="mt-4 flex flex-wrap items-center gap-4">
						<Button size="sm">Small</Button>
						<Button size="md">Medium</Button>
						<Button size="lg">Large</Button>
						<Button disabled>Disabled</Button>
					</div>
				</section>

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Cards</h2>
					<div className="grid gap-6 sm:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Card Title</CardTitle>
								<CardDescription>
									A brief description of the card content goes here.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									This is the main content area. You can put any content here.
								</p>
							</CardContent>
							<CardFooter>
								<Button size="sm">Action</Button>
							</CardFooter>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Another Card</CardTitle>
								<CardDescription>With different content.</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Cards are great for grouping related information.
								</p>
							</CardContent>
						</Card>
					</div>
				</section>

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Accordion</h2>
					<Accordion
						items={[
							{
								title: "What is the AI Music Teacher?",
								content:
									"A web app that helps you learn guitar by listening to you play, comparing your performance to sheet music, and providing feedback through a 3D avatar and AI-generated guidance.",
								defaultOpen: true,
							},
							{
								title: "Which instruments are supported?",
								content:
									"The MVP focuses on acoustic classical guitar. The architecture is designed to extend to other instruments, genres, and styles in the future.",
							},
							{
								title: "How does the feedback work?",
								content:
									"After you play, the app analyzes your performance (pitch, rhythm, timing) and displays a score. A 3D avatar reacts with gestures, and an AI (Ollama) generates text guidance for improvement.",
							},
						]}
					/>
				</section>

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Inputs</h2>
					<div className="max-w-md space-y-4">
						<Input label="Email" placeholder="you@example.com" type="email" />
						<Input label="Password" placeholder="••••••••" type="password" />
						<Input label="With error" placeholder="Invalid input" error="This field is required" />
						<Input placeholder="No label" />
					</div>
				</section>

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Badges</h2>
					<div className="flex flex-wrap gap-2">
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="accent">Accent</Badge>
						<Badge variant="destructive">Destructive</Badge>
						<Badge variant="outline">Outline</Badge>
					</div>
				</section>

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Scroll Window</h2>
					<div className="space-y-6">
						<div>
							<p className="mb-2 text-sm text-muted-foreground">
								Scrollable container with gradient scrollbar (primary → accent):
							</p>
							<ScrollWindow className="p-4">
								<div className="space-y-4">
									{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
										<div
											key={i}
											className="rounded-lg border border-border bg-muted/50 p-4"
										>
											<p className="font-medium">Item {i}</p>
											<p className="text-sm text-muted-foreground">
												Scroll down to see more content. The scrollbar thumb has a
												gradient from primary to accent.
											</p>
										</div>
									))}
								</div>
							</ScrollWindow>
						</div>
						<div>
							<p className="mb-2 text-sm text-muted-foreground">
								Custom gradient (teal → amber):
							</p>
							<ScrollWindow
								gradientFrom="#0d9488"
								gradientTo="#f59e0b"
								className="p-4"
							>
								<div className="space-y-3">
									{["C", "D", "E", "F", "G", "A", "B"].map((note) => (
										<div
											key={note}
											className="flex items-center gap-3 rounded-md bg-muted/30 px-3 py-2"
										>
											<span className="font-mono font-semibold text-primary">
												{note}
											</span>
											<span className="text-sm text-muted-foreground">
												Musical note
											</span>
										</div>
									))}
								</div>
							</ScrollWindow>
						</div>
					</div>
				</section>

				<Separator />

				<section>
					<h2 className="mb-6 text-2xl font-semibold text-foreground">Separator</h2>
					<div className="space-y-4">
						<div>
							<p className="text-sm text-muted-foreground">Horizontal separator below:</p>
							<Separator className="my-4" />
							<p className="text-sm text-muted-foreground">Content continues here.</p>
						</div>
						<div className="flex h-12 items-center gap-4">
							<span className="text-sm">Item 1</span>
							<Separator orientation="vertical" />
							<span className="text-sm">Item 2</span>
							<Separator orientation="vertical" />
							<span className="text-sm">Item 3</span>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
