import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** ReUI 圆角与高度都更宽松：按钮 36px、卡片 12px 圆角。 */
export function ReButton({
	className,
	size = "default",
	...props
}: React.ComponentProps<typeof Button> & { size?: "sm" | "default" | "lg" | "icon" }) {
	const sizes = {
		sm: "h-8 rounded-lg px-3 text-xs",
		default: "h-9 rounded-lg px-3.5 text-sm",
		lg: "h-10 rounded-xl px-5 text-sm",
		icon: "size-9 rounded-lg",
	} as const;

	return <Button size="default" className={cn(sizes[size], "shadow-none", className)} {...props} />;
}

const reBadgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
	{
		variants: {
			tone: {
				neutral: "border-transparent bg-secondary text-secondary-foreground",
				outline: "border-border bg-card text-muted-foreground",
				dark: "border-transparent bg-primary text-primary-foreground",
				success: "border-transparent bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
				warning: "border-transparent bg-amber-500/14 text-amber-700 dark:text-amber-300",
				danger: "border-transparent bg-destructive/12 text-destructive",
				info: "border-transparent bg-violet-500/12 text-violet-700 dark:text-violet-300",
				blue: "border-transparent bg-blue-500/12 text-blue-700 dark:text-blue-300",
			},
		},
		defaultVariants: { tone: "neutral" },
	},
);

export function ReBadge({
	className,
	tone,
	dot,
	...props
}: React.ComponentProps<"span"> & VariantProps<typeof reBadgeVariants> & { dot?: boolean }) {
	return (
		<span className={cn(reBadgeVariants({ tone }), className)} {...props}>
			{dot && <span className="size-1.5 rounded-full bg-current opacity-80" />}
			{props.children}
		</span>
	);
}

export function ReCard({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="re-card"
			className={cn(
				"bg-card text-card-foreground rounded-xl border shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
				className,
			)}
			{...props}
		/>
	);
}

export function ReCardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex items-start justify-between gap-3 p-5 pb-0", className)} {...props} />;
}

export function ReCardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("text-sm font-semibold tracking-tight", className)} {...props} />;
}

export function ReCardDescription({ className, ...props }: React.ComponentProps<"p">) {
	return <p className={cn("text-muted-foreground mt-0.5 text-xs", className)} {...props} />;
}

export function ReCardContent({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("p-5", className)} {...props} />;
}

export function ReCardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex items-center border-t px-5 py-3", className)} {...props} />;
}

export function RePageHeader({
	title,
	description,
	actions,
	eyebrow,
}: {
	title: string;
	description?: React.ReactNode;
	actions?: React.ReactNode;
	eyebrow?: string;
}) {
	return (
		<div className="mb-6 flex flex-wrap items-end justify-between gap-4">
			<div>
				{eyebrow && (
					<p className="text-muted-foreground mb-1 font-mono text-[10px] tracking-[0.14em] uppercase">{eyebrow}</p>
				)}
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				{description && <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{description}</p>}
			</div>
			{actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
		</div>
	);
}

const TILE_TONES = {
	dark: "bg-primary text-primary-foreground",
	blue: "bg-blue-500/12 text-blue-600 dark:text-blue-300",
	violet: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
	emerald: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
	amber: "bg-amber-500/14 text-amber-600 dark:text-amber-300",
	rose: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
	neutral: "bg-secondary text-secondary-foreground",
} as const;

export function ReIconTile({
	icon: Icon,
	tone = "neutral",
	className,
}: {
	icon: LucideIcon;
	tone?: keyof typeof TILE_TONES;
	className?: string;
}) {
	return (
		<span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", TILE_TONES[tone], className)}>
			<Icon className="size-4" strokeWidth={1.8} />
		</span>
	);
}

export function ReProgress({
	value,
	className,
	tone = "bg-primary",
}: {
	value: number;
	className?: string;
	tone?: string;
}) {
	return (
		<div className={cn("bg-secondary h-1.5 w-full overflow-hidden rounded-full", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
			<div className={cn("h-full rounded-full transition-[width] duration-500", tone)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
		</div>
	);
}

export function ReAvatarStack({
	people,
	max = 4,
	className,
}: {
	people: { name: string; color?: string }[];
	max?: number;
	className?: string;
}) {
	const shown = people.slice(0, max);
	const rest = people.length - shown.length;
	return (
		<div className={cn("flex items-center", className)}>
			{shown.map((person, index) => (
				<span
					key={person.name}
					title={person.name}
					className={cn(
						"ring-card -ml-1.5 grid size-6 place-items-center rounded-full text-[9px] font-semibold ring-2 first:ml-0",
						person.color ?? "bg-secondary text-secondary-foreground",
					)}
				>
					{person.name.slice(0, 1)}
				</span>
			))}
			{rest > 0 && (
				<span className="ring-card bg-secondary text-muted-foreground -ml-1.5 grid size-6 place-items-center rounded-full text-[9px] font-medium ring-2">
					+{rest}
				</span>
			)}
		</div>
	);
}

export function ReEmptyState({
	icon: Icon,
	title,
	description,
	action,
}: {
	icon: LucideIcon;
	title: string;
	description?: string;
	action?: React.ReactNode;
}) {
	return (
		<div className="flex flex-col items-center justify-center px-6 py-16 text-center">
			<span className="bg-secondary text-muted-foreground mb-4 grid size-12 place-items-center rounded-2xl">
				<Icon className="size-5" />
			</span>
			<p className="text-sm font-semibold">{title}</p>
			{description && <p className="text-muted-foreground mt-1 max-w-xs text-xs">{description}</p>}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}
