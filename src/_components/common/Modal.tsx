"use client";

import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	className?: string;
}

export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [open]);

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose}
			className={`backdrop:bg-black/50 rounded-xl border border-border bg-card p-0 shadow-xl ${className}`}
		>
			<div className="flex min-w-80 flex-col gap-4 p-6">
				{title && (
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">{title}</h2>
						<button
							type="button"
							onClick={onClose}
							className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
						>
							&times;
						</button>
					</div>
				)}
				{children}
			</div>
		</dialog>
	);
}
