import { Footer, NeonAuthProvider, RouteAnnouncer, SkipLink } from "@_components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AI Music Teacher",
	description: "Learn guitar with AI-powered feedback",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const theme = cookieStore.get("amt-theme")?.value;
	const themeClass = theme === "dark" ? "dark" : theme === "light" ? "light" : undefined;

	return (
		<html lang="en" className={themeClass} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
			>
				<SkipLink />
				<RouteAnnouncer />
				<NeonAuthProvider>
					<div className="flex-1">{children}</div>
					<Footer />
				</NeonAuthProvider>
			</body>
		</html>
	);
}
