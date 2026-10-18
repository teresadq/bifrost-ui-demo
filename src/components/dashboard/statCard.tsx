import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useId } from "react";

import { cn } from "@/lib/utils";

function Sparkline({ points, positive }: { points: number[]; positive: boolean }) {
	const gradientId = `spark-${useId().replace(/[:]/g, "")}`;
	const width = 120;
	const height = 36;
	const min = Math.min(...points);
	const max = Math.max(...points);
	const span = max - min || 1;
	const step = width / (points.length - 1);
	const coords = points.map((value, index) => [index * step, height - 4 - ((value - min) / span) * (height - 8)]);
	const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
	const area = `0,${height} ${line} ${width},${height}`;
	const stroke = positive ? "var(--chart-cat-1)" : "var(--chart-warning)";

	return (
		<svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-9 w-full" aria-hidden>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
					<stop offset="100%" stopColor={stroke} stopOpacity="0" />
				</linearGradient>
			</defs>
			<polygon points={area} fill={`url(#${gradientId})`} />
			<polyline
				points={line}
				fill="none"
				stroke={stroke}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	);
}

export function StatCard({
	label,
	value,
	delta,
	positive,
	spark,
}: {
	label: string;
	value: string;
	delta: string;
	positive: boolean;
	spark: number[];
}) {
	const DeltaIcon = delta.startsWith("-") ? ArrowDownRight : ArrowUpRight;

	return (
		<div className="bg-card group relative overflow-hidden rounded-sm border p-4 shadow-sm transition-shadow hover:shadow-md">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-muted-foreground text-xs">{label}</p>
					<p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
				</div>
				<span
					className={cn(
						"inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
						positive ? "bg-secondary text-secondary-foreground" : "bg-chart-warning/10 text-chart-warning-ink",
					)}
				>
					<DeltaIcon className="size-3" />
					{delta}
				</span>
			</div>
			<div className="mt-3 opacity-70 transition-opacity group-hover:opacity-100">
				<Sparkline points={spark} positive={positive} />
			</div>
			<p className="text-muted-foreground/70 mt-1 text-[10px]">较上一个周期</p>
		</div>
	);
}
