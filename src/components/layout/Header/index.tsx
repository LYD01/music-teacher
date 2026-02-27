// App header bar with user info and settings
// Sits at the top of the (app) layout

interface HeaderProps {
	className?: string;
}

export function Header({ className = "" }: HeaderProps) {
	return (
		<header className={`flex h-14 items-center justify-between border-b border-border bg-card px-6 ${className}`}>
			<div />
			<div className="flex items-center gap-4">
				{/* TODO: User avatar, settings dropdown, sign out */}
				<div className="h-8 w-8 rounded-full bg-muted" />
			</div>
		</header>
	);
}
