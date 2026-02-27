import Link from "next/link";

const pageLinks = [
	{ href: "/blog", label: "Blog" },
	{ href: "/community", label: "Community" },
	{ href: "/docs", label: "Docs" },
] as const;

const socialLinks = [
	{ href: "https://github.com", label: "GitHub", external: true },
	{ href: "https://twitter.com", label: "Twitter", external: true },
] as const;

export function Footer() {
	return (
		<footer className="border-t border-border bg-card/30">
			<div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-12">
				<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
					<p className="text-sm text-muted-foreground">© {new Date().getFullYear()} AMT</p>
					<nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
						{pageLinks.map(({ href, label }) => (
							<Link
								key={href}
								href={href}
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						))}
						<span className="text-border" aria-hidden>
							·
						</span>
						{socialLinks.map(({ href, label, external }) => (
							<Link
								key={label}
								href={href}
								target={external ? "_blank" : undefined}
								rel={external ? "noopener noreferrer" : undefined}
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{label}
							</Link>
						))}
					</nav>
				</div>
			</div>
		</footer>
	);
}
