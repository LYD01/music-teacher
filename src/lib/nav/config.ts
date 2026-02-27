import type { NavItem } from "./types";
import {
	ClockIcon,
	FolderIcon,
	GearIcon,
	HomeIcon,
	MusicIcon,
} from "./icons";

export const navItems: NavItem[] = [
	{
		href: "/dashboard",
		label: "Dashboard",
		icon: HomeIcon,
		roles: ["student", "admin"],
		showOnMobile: true,
		section: "primary",
	},
	{
		href: "/library",
		label: "Library",
		icon: MusicIcon,
		roles: ["student", "admin"],
		showOnMobile: true,
		section: "primary",
	},
	{
		href: "/history",
		label: "History",
		icon: ClockIcon,
		roles: ["student", "admin"],
		showOnMobile: true,
		section: "primary",
	},
	{
		href: "/manage",
		label: "Manage Pieces",
		icon: FolderIcon,
		roles: ["admin"],
		showOnMobile: false,
		section: "admin",
	},
	{
		href: "/settings",
		label: "Settings",
		icon: GearIcon,
		roles: ["student", "admin"],
		showOnMobile: true,
		section: "bottom",
	},
];

export function getNavItemsForRole(role: "student" | "admin"): NavItem[] {
	return navItems.filter((item) => item.roles.includes(role));
}

export function getMobileNavItems(role: "student" | "admin"): NavItem[] {
	return navItems.filter(
		(item) => item.roles.includes(role) && item.showOnMobile,
	);
}
