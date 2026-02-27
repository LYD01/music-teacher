import type { SVGProps } from "react";

const defaults = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 20,
	height: 20,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
	"aria-hidden": true as const,
	role: "img" as const,
};

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Home</title>
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
	);
}

export function MusicIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Music</title>
			<path d="M9 18V5l12-3v13" />
			<circle cx="6" cy="18" r="3" />
			<circle cx="18" cy="15" r="3" />
		</svg>
	);
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Clock</title>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Folder</title>
			<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
		</svg>
	);
}

export function GearIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Settings</title>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Chevron left</title>
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} {...props}>
			<title>Chevron right</title>
			<path d="m9 18 6-6-6-6" />
		</svg>
	);
}

export function SunIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} width={18} height={18} {...props}>
			<title>Light mode</title>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2" />
			<path d="M12 20v2" />
			<path d="m4.93 4.93 1.41 1.41" />
			<path d="m17.66 17.66 1.41 1.41" />
			<path d="M2 12h2" />
			<path d="M20 12h2" />
			<path d="m6.34 17.66-1.41 1.41" />
			<path d="m19.07 4.93-1.41 1.41" />
		</svg>
	);
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} width={18} height={18} {...props}>
			<title>Dark mode</title>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	);
}

export function LogOutIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg {...defaults} width={18} height={18} {...props}>
			<title>Sign out</title>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" x2="9" y1="12" y2="12" />
		</svg>
	);
}
