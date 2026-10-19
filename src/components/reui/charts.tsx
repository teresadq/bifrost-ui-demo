import { useId } from "react";

import { cn } from "@/lib/utils";

export function Sparkline({
	points,
	color = "var(--chart-cat-1)",
	className,
}: {
	points: number[];
	color?: string;
	className?: string;
}) {
	const gradientId = `reui-spark-${useId().replace(/[:]/g, "")}`;
	const width = 120;
	const height = 38;
	const min = Math.min(...points);
	const max = Math.max(...points);
	const span = max - min || 1;
	const step = width / Math.max(1, points.length - 1);
	const coords = points.map((value, index) => [index * step, height - 4 - ((value - min) / span) * (height - 8)]);
	const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
	const area = `0,${height} ${line} ${width},${height}`;

	return (
		<svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={cn("h-10 w-full", className)} aria-hidden>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.25" />
					<stop offset="100%" stopColor={color} stopOpacity="0" />
				</linearGradient>
			</defs>
			<polygon points={area} fill={`url(#${gradientId})`} />
			<polyline
				points={line}
				fill="none"
				stroke={color}
				strokeWidth="1.75"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

type TooltipEntry = { dataKey?: string | number; value?: number | string; color?: string; name?: string };

export function ReChartTooltip({
	active,
	payload,
	label,
	labels,
	suffix = "",
}: {
	active?: boolean;
	payload?: TooltipEntry[];
	label?: string | number;
	labels?: Record<string, string>;
	suffix?: string;
}) {
	if (!active || !payload?.length) return null;

	return (
		<div className="bg-popover text-popover-foreground min-w-32 rounded-lg border px-3 py-2 shadow-lg">
			{label !== undefined && <p className="text-muted-foreground mb-1.5 text-[10px] font-medium">{label}</p>}
			<div className="space-y-1">
				{payload.map((entry) => (
					<div key={String(entry.dataKey)} className="flex items-center gap-2 text-xs">
						<span className="size-1.5 rounded-full" style={{ background: entry.color }} />
						<span className="text-muted-foreground">
							{labels?.[String(entry.dataKey)] ?? entry.name ?? String(entry.dataKey)}
						</span>
						<span className="ml-auto pl-4 font-mono font-medium tabular-nums">
							{typeof entry.value === "number" ? entry.value.toLocaleString("en-US") : entry.value}
							{suffix}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
