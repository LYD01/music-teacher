import type { ComponentType, SVGProps } from "react";

export type UserRole = "student" | "admin";

export interface NavItem {
	href: string;
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	roles: UserRole[];
	showOnMobile: boolean;
	section?: "primary" | "admin" | "bottom";
}
