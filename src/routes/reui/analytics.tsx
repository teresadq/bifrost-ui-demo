import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	Coins,
	Download,
	Sparkles,
	Timer,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { ReChartTooltip, Sparkline } from "@/components/reui/charts";
import { COST_BREAKDOWN, LATENCY_TREND, MONTHLY_COST } from "@/components/reui/data";
import {
	ReBadge,
	ReButton,
	ReCard,
	ReCardContent,
	ReCardHeader,
	ReCardTitle,
	ReIconTile,
	RePageHeader,
	ReProgress,
} from "@/components/reui/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/analytics")({
	component: AnalyticsPage,
});

const RANGES = ["7 天", "30 天", "本季度"] as const;

const KPIS = [
	{ label: "总成本", value: "$7,410", delta: "+8.2%", positive: false, icon: Coins, tone: "dark", spark: [40, 44, 42, 50, 48, 56, 54, 62, 60, 68], color: "var(--chart-cat-1)" },
	{ label: "请求量", value: "967K", delta: "+12.6%", positive: true, icon: Zap, tone: "blue", spark: [32, 38, 36, 44, 48, 46, 54, 58, 62, 70], color: "var(--chart-cat-6)" },
	{ label: "平均延迟", value: "214 ms", delta: "-6.4%", positive: true, icon: Timer, tone: "emerald", spark: [64, 62, 60, 58, 56, 52, 50, 48, 46, 43], color: "var(--chart-cat-4)" },
	{ label: "缓存命中率", value: "38.4%", delta: "+4.1%", positive: true, icon: Activity, tone: "violet", spark: [28, 30, 34, 32, 38, 40, 42, 46, 45, 50], color: "var(--chart-cat-2)" },
] as const;

const COST_SERIES = [
	{ key: "anthropic", label: "Anthropic", color: "var(--chart-cat-2)" },
	{ key: "openai", label: "OpenAI", color: "var(--chart-cat-4)" },
	{ key: "deepseek", label: "DeepSeek", color: "var(--chart-cat-5)" },
	{ key: "google", label: "Google", color: "var(--chart-cat-1)" },
];

const PIE_DATA = COST_BREAKDOWN.map((item, index) => ({
	name: item.model,
	value: item.cost,
	color: ["var(--chart-cat-2)", "var(--chart-cat-4)", "var(--chart-cat-5)", "var(--chart-cat-1)", "var(--chart-cat-other)"][index],
}));

function AnalyticsPage() {
	const [range, setRange] = useState<(typeof RANGES)[number]>("30 天");

	return (
		<>
			<RePageHeader
				eyebrow="Analytics"
				title="分析报表"
				description="成本、延迟与 token 用量的跨模型视图。"
				actions={
					<>
						<div className="bg-secondary flex items-center rounded-lg p-0.5" role="group" aria-label="时间范围">
							{RANGES.map((option) => (
								<button
									key={option}
									type="button"
									onClick={() => setRange(option)}
									aria-pressed={range === option}
									className={cn(
										"h-7 cursor-pointer rounded-md px-2.5 text-[11px] transition-all",
										range === option ? "bg-card text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
									)}
								>
									{option}
								</button>
							))}
						</div>
						<ReButton variant="outline" className="gap-1.5" onClick={() => toast.success("报表已导出为 CSV")}>
							<Download className="size-3.5" />
							导出报表
						</ReButton>
					</>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{KPIS.map((kpi) => {
					const Icon = kpi.icon;
					const DeltaIcon = kpi.positive ? ArrowUpRight : ArrowDownRight;
					return (
						<ReCard key={kpi.label} className="p-5">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<ReIconTile icon={Icon} tone={kpi.tone} />
									<div>
										<p className="text-muted-foreground text-xs">{kpi.label}</p>
										<p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{kpi.value}</p>
									</div>
								</div>
								<ReBadge tone={kpi.positive ? "success" : "warning"}>
									<DeltaIcon className="size-3" />
									{kpi.delta}
								</ReBadge>
							</div>
							<div className="-mx-5 mt-3 -mb-2">
								<Sparkline points={[...kpi.spark]} color={kpi.color} />
							</div>
						</ReCard>
					);
				})}
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				<ReCard className="lg:col-span-2">
					<ReCardHeader className="border-b pb-4">
						<div>
							<ReCardTitle>月度成本拆分</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">按提供商堆叠 · 单位：美元</p>
						</div>
						<div className="flex flex-wrap items-center gap-3 text-[10px]">
							{COST_SERIES.map((series) => (
								<span key={series.key} className="text-muted-foreground flex items-center gap-1.5">
									<span className="size-2 rounded-full" style={{ background: series.color }} />
									{series.label}
								</span>
							))}
						</div>
					</ReCardHeader>
					<ReCardContent className="pt-4 pb-3">
						<div className="h-[280px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={MONTHLY_COST} margin={{ top: 4, right: 8, left: -12, bottom: 0 }} barSize={30}>
									<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
									<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<YAxis
										tickLine={false}
										axisLine={false}
										tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
										tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
									/>
									<Tooltip cursor={{ fill: "var(--secondary)", opacity: 0.5 }} content={<ReChartTooltip suffix=" USD" />} />
									{COST_SERIES.map((series, index) => (
										<Bar
											key={series.key}
											dataKey={series.key}
											stackId="cost"
											fill={series.color}
											radius={index === COST_SERIES.length - 1 ? [4, 4, 0, 0] : 0}
											isAnimationActive={false}
										/>
									))}
								</BarChart>
							</ResponsiveContainer>
						</div>
					</ReCardContent>
				</ReCard>

				<ReCard>
					<ReCardHeader className="pb-2">
						<div>
							<ReCardTitle>成本占比</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">本月各模型成本</p>
						</div>
						<ReBadge tone="outline">$7,410</ReBadge>
					</ReCardHeader>
					<ReCardContent className="pt-0">
						<div className="relative h-[190px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={PIE_DATA}
										dataKey="value"
										nameKey="name"
										innerRadius={56}
										outerRadius={78}
										paddingAngle={3}
										stroke="var(--card)"
										strokeWidth={2}
										isAnimationActive={false}
									>
										{PIE_DATA.map((entry) => (
											<Cell key={entry.name} fill={entry.color} />
										))}
									</Pie>
									<Tooltip content={<ReChartTooltip suffix=" USD" />} />
								</PieChart>
							</ResponsiveContainer>
							<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
								<p className="text-xl font-semibold tabular-nums">$7.4k</p>
								<p className="text-muted-foreground text-[10px]">本月成本</p>
							</div>
						</div>
						<ul className="mt-2 space-y-2">
							{PIE_DATA.map((item) => (
								<li key={item.name} className="flex items-center gap-2">
									<span className="size-2 rounded-full" style={{ background: item.color }} />
									<span className="text-muted-foreground flex-1 truncate text-[11px]">{item.name}</span>
									<span className="font-mono text-[11px] tabular-nums">${item.value.toLocaleString("en-US")}</span>
								</li>
							))}
						</ul>
					</ReCardContent>
				</ReCard>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				<ReCard className="lg:col-span-2">
					<ReCardHeader className="border-b pb-4">
						<div>
							<ReCardTitle>延迟分位数</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">最近 7 天 · 毫秒</p>
						</div>
						<div className="flex items-center gap-3 text-[10px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<span className="h-0.5 w-3 rounded bg-[var(--chart-cat-1)]" /> p50
							</span>
							<span className="text-muted-foreground flex items-center gap-1.5">
								<span className="h-0.5 w-3 rounded bg-[var(--chart-cat-2)]" /> p95
							</span>
							<span className="text-muted-foreground flex items-center gap-1.5">
								<span className="h-0.5 w-3 rounded bg-[var(--chart-cat-5)]" /> p99
							</span>
						</div>
					</ReCardHeader>
					<ReCardContent className="pt-4 pb-3">
						<div className="h-[240px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={LATENCY_TREND} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
									<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
									<XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<YAxis
										tickLine={false}
										axisLine={false}
										tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
										tickFormatter={(value) => `${value}ms`}
										width={52}
									/>
									<Tooltip cursor={{ stroke: "var(--border)" }} content={<ReChartTooltip suffix=" ms" labels={{ p50: "p50", p95: "p95", p99: "p99" }} />} />
									<Line type="monotone" dataKey="p50" stroke="var(--chart-cat-1)" strokeWidth={2} dot={false} isAnimationActive={false} />
									<Line type="monotone" dataKey="p95" stroke="var(--chart-cat-2)" strokeWidth={2} dot={false} isAnimationActive={false} />
									<Line type="monotone" dataKey="p99" stroke="var(--chart-cat-5)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} isAnimationActive={false} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</ReCardContent>
				</ReCard>

				<ReCard>
					<ReCardHeader className="pb-4">
						<div>
							<ReCardTitle>优化建议</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">基于最近 30 天用量</p>
						</div>
						<Sparkles className="size-4 text-violet-500" />
					</ReCardHeader>
					<ReCardContent className="space-y-3 pt-0">
						{[
							{ title: "启用 Prompt Caching", desc: "Claude 请求的重复系统提示词可缓存，预计节省 18%。", gain: "-$510/月", icon: TrendingUp, tone: "emerald" as const },
							{ title: "低频路由到 DeepSeek", desc: "23% 的 GPT-4o 请求可由 V3 承接，质量损失小于 2%。", gain: "-$340/月", icon: Zap, tone: "blue" as const },
							{ title: "缩短 p99 尾部延迟", desc: "us-east-1 的冷启动是主要来源，建议预热连接池。", gain: "-42 ms", icon: Timer, tone: "amber" as const },
						].map((item) => {
							const Icon = item.icon;
							return (
								<div key={item.title} className="rounded-xl border bg-secondary/40 p-3">
									<div className="flex items-center gap-2">
										<ReIconTile icon={Icon} tone={item.tone} className="size-7 rounded-md" />
										<p className="text-xs font-medium">{item.title}</p>
										<ReBadge tone="success" className="ml-auto">{item.gain}</ReBadge>
									</div>
									<p className="text-muted-foreground mt-2 text-[11px] leading-5">{item.desc}</p>
								</div>
							);
						})}
					</ReCardContent>
				</ReCard>
			</div>

			<ReCard className="mt-4 overflow-hidden">
				<ReCardHeader className="border-b pb-4">
					<div>
						<ReCardTitle>成本明细</ReCardTitle>
						<p className="text-muted-foreground mt-0.5 text-xs">按模型聚合 · 本月</p>
					</div>
				</ReCardHeader>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-muted-foreground bg-secondary/40 text-left text-[11px]">
								<th className="px-5 py-2.5 font-medium">模型</th>
								<th className="px-5 py-2.5 font-medium">提供商</th>
								<th className="px-5 py-2.5 text-right font-medium">请求数</th>
								<th className="px-5 py-2.5 text-right font-medium">Token</th>
								<th className="px-5 py-2.5 text-right font-medium">成本</th>
								<th className="min-w-32 px-5 py-2.5 font-medium">占比</th>
							</tr>
						</thead>
						<tbody>
							{COST_BREAKDOWN.map((row) => (
								<tr key={row.model} className="hover:bg-secondary/40 border-t">
									<td className="px-5 py-3 text-xs font-medium">{row.model}</td>
									<td className="text-muted-foreground px-5 py-3 text-xs">{row.provider}</td>
									<td className="px-5 py-3 text-right font-mono text-xs tabular-nums">{row.requests.toLocaleString("en-US")}</td>
									<td className="px-5 py-3 text-right font-mono text-xs tabular-nums">{row.tokens}</td>
									<td className="px-5 py-3 text-right font-mono text-xs font-medium tabular-nums">${row.cost.toLocaleString("en-US")}</td>
									<td className="px-5 py-3">
										<div className="flex items-center gap-2">
											<ReProgress value={row.share} className="w-20" />
											<span className="text-muted-foreground text-[10px] tabular-nums">{row.share}%</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</ReCard>
		</>
	);
}
