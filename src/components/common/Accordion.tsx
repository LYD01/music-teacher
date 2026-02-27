"use client";

import type { HTMLAttributes } from "react";
import { useState } from "react";

interface AccordionItemProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="border-b border-border last:border-b-0">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex w-full items-center justify-between py-4 text-left font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			>
				{title}
				<svg
					aria-hidden="true"
					className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>
			<div
				className={`grid transition-all duration-200 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
			>
				<div className="overflow-hidden">
					<div className="pb-4 pt-0 text-sm text-muted-foreground">{children}</div>
				</div>
			</div>
		</div>
	);
}

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
	items: Array<{ title: string; content: React.ReactNode; defaultOpen?: boolean }>;
}

export function Accordion({ items, className = "", ...props }: AccordionProps) {
	return (
		<div
			className={`divide-y divide-border rounded-lg border border-border bg-card ${className}`}
			{...props}
		>
			{items.map((item, index) => (
				<div key={item.title} className="px-4">
					<AccordionItem title={item.title} defaultOpen={item.defaultOpen ?? index === 0}>
						{item.content}
					</AccordionItem>
				</div>
			))}
		</div>
	);
}
