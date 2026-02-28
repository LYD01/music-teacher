/**
 * Client-safe exports only. Use this in "use client" components to avoid
 * pulling in auth-server (which requires server-only env vars).
 */
export { authClient } from "./auth";
export {
	ChevronLeftIcon,
	ChevronRightIcon,
	LogOutIcon,
	MoonIcon,
	SunIcon,
} from "./nav/icons";
