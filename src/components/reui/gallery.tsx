import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import type { ReuiPath } from "@/components/reui/navigation";
import { ReBadge } from "@/components/reui/ui";
import { cn } from "@/lib/utils";

export function BlockCard({
	title,
	category,
	description,
	badge,
	children,
	className,
	tall = false,
}: {
	title: string;
	category: string;
	description?: string;
	badge?: string;
	children: ReactNode;
	className?: string;
	tall?: boolean;
}) {
	return (
		<section className={cn("bg-card flex min-w-0 flex-col overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgb(0_0_0/0.03)]", className)}>
			<header className="flex items-start justify-between gap-3 border-b px-4 py-3">
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<h3 className="truncate text-[13px] font-semibold tracking-tight">{title}</h3>
						{badge && (
							<ReBadge tone="outline" className="shrink-0 font-mono text-[9px]">
								{badge}
							</ReBadge>
						)}
					</div>
					{description && <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-5">{description}</p>}
				</div>
				<span className="text-muted-foreground/70 shrink-0 font-mono text-[9px] tracking-[0.12em] uppercase">{category}</span>
			</header>
			<div className={cn("bg-secondary/30 flex-1 p-3.5", tall && "min-h-[360px]")}>{children}</div>
		</section>
	);
}

export function DemoSurface({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("bg-card rounded-xl border p-3.5", className)}>{children}</div>;
}

export function DemoHeader({
	title,
	meta,
	action,
}: {
	title: string;
	meta?: string;
	action?: ReactNode;
}) {
	return (
		<div className="mb-3 flex items-center justify-between gap-2">
			<div className="min-w-0">
				<p className="truncate text-xs font-medium">{title}</p>
				{meta && <p className="text-muted-foreground mt-0.5 truncate text-[10px]">{meta}</p>}
			</div>
			{action}
		</div>
	);
}

export function MiniAvatar({ name, className }: { name: string; className?: string }) {
	return (
		<span className={cn("grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-[9px] font-semibold", className)}>
			{name.slice(0, 1)}
		</span>
	);
}

export function MiniBar({ value, tone = "bg-primary", className }: { value: number; tone?: string; className?: string }) {
	return (
		<div className={cn("bg-secondary h-1.5 w-full overflow-hidden rounded-full", className)}>
			<div className={cn("h-full rounded-full", tone)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
		</div>
	);
}

export function MiniSpark({ points, color = "var(--chart-cat-1)" }: { points: number[]; color?: string }) {
	const width = 100;
	const height = 26;
	const min = Math.min(...points);
	const max = Math.max(...points);
	const span = max - min || 1;
	const coords = points.map((value, index) => {
		const x = (index / Math.max(1, points.length - 1)) * width;
		const y = height - 3 - ((value - min) / span) * (height - 6);
		return `${x.toFixed(1)},${y.toFixed(1)}`;
	});
	return (
		<svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-7 w-full" aria-hidden>
			<polyline points={coords.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
		</svg>
	);
}

export function CatalogTabs({
	tabs,
	active,
}: {
	tabs: { label: string; to: ReuiPath; count?: string }[];
	active: string;
}) {
	return (
		<div className="custom-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
			{tabs.map((tab) => (
				<Link
					key={tab.to}
					to={tab.to}
					aria-current={active === tab.to ? "page" : undefined}
					className={cn(
						"flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs transition-colors",
						active === tab.to
							? "bg-primary text-primary-foreground font-medium"
							: "text-muted-foreground hover:bg-accent hover:text-foreground",
					)}
				>
					{tab.label}
					{tab.count && (
						<span
							className={cn(
								"rounded px-1 py-0.5 font-mono text-[9px]",
								active === tab.to ? "bg-primary-foreground/15" : "bg-secondary",
							)}
						>
							{tab.count}
						</span>
					)}
				</Link>
			))}
		</div>
	);
}

export function GalleryGrid({ children, className }: { children: ReactNode; className?: string }) {
	return <div className={cn("grid gap-4 md:grid-cols-2 xl:grid-cols-3", className)}>{children}</div>;
}
