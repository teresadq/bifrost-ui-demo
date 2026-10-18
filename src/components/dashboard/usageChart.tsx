import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TREND_DATA } from "@/lib/mockData";

type TooltipEntry = { dataKey?: string | number; value?: number };

function ChartTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: TooltipEntry[];
	label?: string | number;
}) {
	if (!active || !payload?.length) return null;

	return (
		<div className="bg-popover text-popover-foreground rounded-sm border px-3 py-2 shadow-md">
			<p className="text-muted-foreground mb-1.5 text-[11px]">{label}</p>
			<div className="space-y-1">
				{payload.map((entry) => (
					<div key={String(entry.dataKey)} className="flex items-center gap-2 text-xs">
						<span
							className="size-1.5 rounded-full"
							style={{ background: entry.dataKey === "error" ? "var(--chart-error)" : "var(--chart-cat-1)" }}
						/>
						<span className="text-muted-foreground">{entry.dataKey === "error" ? "错误" : "成功"}</span>
						<span className="ml-auto font-mono font-medium tabular-nums">{Number(entry.value).toLocaleString("en-US")}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export function UsageChart() {
	return (
		<Card className="gap-0 py-0">
			<CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-5 py-4">
				<div>
					<CardTitle className="text-sm">请求量趋势</CardTitle>
					<CardDescription className="mt-1 text-xs">按天统计的成功与失败请求</CardDescription>
				</div>
				<div className="flex items-center gap-4 text-[11px]">
					<span className="text-muted-foreground flex items-center gap-1.5">
						<span className="bg-chart-cat-1 size-2 rounded-full" />
						成功
					</span>
					<span className="text-muted-foreground flex items-center gap-1.5">
						<span className="bg-chart-error size-2 rounded-full" />
						错误
					</span>
				</div>
			</CardHeader>
			<CardContent className="px-2 pt-5 pb-3">
				<div className="h-[248px] w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={TREND_DATA} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
							<defs>
								<linearGradient id="fill-success" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="var(--chart-cat-1)" stopOpacity={0.28} />
									<stop offset="100%" stopColor="var(--chart-cat-1)" stopOpacity={0.02} />
								</linearGradient>
								<linearGradient id="fill-error" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="var(--chart-error)" stopOpacity={0.35} />
									<stop offset="100%" stopColor="var(--chart-error)" stopOpacity={0.05} />
								</linearGradient>
							</defs>
							<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
							<XAxis
								dataKey="date"
								tickLine={false}
								axisLine={false}
								tickMargin={10}
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
							/>
							<YAxis
								width={44}
								tickLine={false}
								axisLine={false}
								tickMargin={6}
								tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
								tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
							/>
							<Tooltip cursor={{ stroke: "var(--border)", strokeWidth: 1 }} content={<ChartTooltip />} />
							<Area
								type="monotone"
								dataKey="success"
								stackId="requests"
								stroke="var(--chart-cat-1)"
								strokeWidth={2}
								fill="url(#fill-success)"
								isAnimationActive={false}
								activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
							/>
							<Area
								type="monotone"
								dataKey="error"
								stackId="requests"
								stroke="var(--chart-error)"
								strokeWidth={1.5}
								fill="url(#fill-error)"
								isAnimationActive={false}
								activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
