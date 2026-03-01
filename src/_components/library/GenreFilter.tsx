"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface GenreFilterProps {
	genres: string[];
}

export function GenreFilter({ genres }: GenreFilterProps) {
	const pathname = usePathname();
	const activeGenre = pathname.startsWith("/library/") ? pathname.split("/")[2] : null;

	return (
		<nav className="flex flex-wrap gap-2" aria-label="Filter by genre">
			<Link
				href="/library"
				className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
					!activeGenre
						? "bg-primary text-primary-foreground"
						: "bg-secondary text-secondary-foreground hover:bg-muted"
				}`}
			>
				All
			</Link>
			{genres.map((genre) => (
				<Link
					key={genre}
					href={`/library/${genre}`}
					className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
						activeGenre === genre
							? "bg-primary text-primary-foreground"
							: "bg-secondary text-secondary-foreground hover:bg-muted"
					}`}
				>
					{genre}
				</Link>
			))}
		</nav>
	);
}
