import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";
import {
	Area,
	AreaChart,
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
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nova/analytics")({
	component: AnalyticsPage,
});

const RANGES = ["7 天", "14 天", "30 天"] as const;

const COST_TREND = [
	{ date: "10-05", openai: 112, anthropic: 84, google: 32, deepseek: 18 },
	{ date: "10-06", openai: 124, anthropic: 92, google: 36, deepseek: 21 },
	{ date: "10-07", openai: 98, anthropic: 76, google: 30, deepseek: 16 },
	{ date: "10-08", openai: 138, anthropic: 104, google: 41, deepseek: 24 },
	{ date: "10-09", openai: 156, anthropic: 118, google: 47, deepseek: 27 },
	{ date: "10-10", openai: 132, anthropic: 101, google: 39, deepseek: 22 },
	{ date: "10-11", openai: 121, anthropic: 94, google: 35, deepseek: 20 },
	{ date: "10-12", openai: 168, anthropic: 129, google: 52, deepseek: 30 },
	{ date: "10-13", openai: 192, anthropic: 148, google: 58, deepseek: 33 },
	{ date: "10-14", openai: 186, anthropic: 143, google: 55, deepseek: 31 },
	{ date: "10-15", openai: 204, anthropic: 158, google: 63, deepseek: 36 },
	{ date: "10-16", openai: 226, anthropic: 174, google: 69, deepseek: 39 },
	{ date: "10-17", openai: 248, anthropic: 191, google: 74, deepseek: 43 },
	{ date: "10-18", openai: 238, anthropic: 183, google: 71, deepseek: 41 },
];

const LATENCY_TREND = [
	{ date: "10-05", p50: 198, p95: 1120, p99: 1840 },
	{ date: "10-06", p50: 204, p95: 1180, p99: 1910 },
	{ date: "10-07", p50: 226, p95: 1320, p99: 2140 },
	{ date: "10-08", p50: 195, p95: 1080, p99: 1760 },
	{ date: "10-09", p50: 188, p95: 1020, p99: 1680 },
	{ date: "10-10", p50: 192, p95: 1050, p99: 1720 },
	{ date: "10-11", p50: 201, p95: 1140, p99: 1860 },
	{ date: "10-12", p50: 231, p95: 1380, p99: 2260 },
	{ date: "10-13", p50: 244, p95: 1460, p99: 2380 },
	{ date: "10-14", p50: 219, p95: 1280, p99: 2050 },
	{ date: "10-15", p50: 208, p95: 1190, p99: 1930 },
	{ date: "10-16", p50: 214, p95: 1250, p99: 2010 },
	{ date: "10-17", p50: 209, p95: 1210, p99: 1960 },
	{ date: "10-18", p50: 214, p95: 1284, p99: 2080 },
];

const TOKEN_TREND = [
	{ date: "10-05", input: 620, output: 218, cached: 142 },
	{ date: "10-06", input: 668, output: 236, cached: 158 },
	{ date: "10-07", input: 540, output: 191, cached: 121 },
	{ date: "10-08", input: 731, output: 258, cached: 176 },
	{ date: "10-09", input: 812, output: 289, cached: 201 },
	{ date: "10-10", input: 706, output: 251, cached: 168 },
	{ date: "10-11", input: 648, output: 229, cached: 152 },
	{ date: "10-12", input: 884, output: 312, cached: 219 },
	{ date: "10-13", input: 962, output: 341, cached: 244 },
	{ date: "10-14", input: 918, output: 325, cached: 231 },
	{ date: "10-15", input: 1042, output: 369, cached: 268 },
	{ date: "10-16", input: 1128, output: 401, cached: 289 },
	{ date: "10-17", input: 1204, output: 428, cached: 308 },
	{ date: "10-18", input: 1168, output: 414, cached: 298 },
];

const MODEL_COST = [
	{ name: "GPT-4o", value: 4820, color: "var(--chart-cat-1)" },
	{ name: "Claude Sonnet 4.5", value: 3410, color: "var(--chart-cat-2)" },
	{ name: "DeepSeek V3", value: 1260, color: "var(--chart-cat-5)" },
	{ name: "Gemini 2.5 Pro", value: 940, color: "var(--chart-cat-3)" },
	{ name: "其他", value: 510, color: "var(--chart-cat-other)" },
];

const COST_TABLE = [
	{ model: "gpt-4o", provider: "OpenAI", requests: 428_100, tokens: "842.1M", cost: 4820.32, share: 44 },
	{ model: "claude-sonnet-4-5", provider: "Anthropic", requests: 312_840, tokens: "611.4M", cost: 3410.18, share: 31 },
	{ model: "deepseek-v3", provider: "DeepSeek", requests: 208_320, tokens: "402.8M", cost: 1260.44, share: 12 },
	{ model: "gemini-2.5-pro", provider: "Google", requests: 128_460, tokens: "248.2M", cost: 940.12, share: 9 },
	{ model: "gpt-4o-mini", provider: "OpenAI", requests: 96_210, tokens: "182.6M", cost: 410.55, share: 4 },
];

const TOOLTIP_STYLE = {
	background: "var(--popover)",
	border: "1px solid var(--border)",
	borderRadius: 6,
	fontSize: 12,
	color: "var(--popover-foreground)",
} as const;

function AnalyticsPage() {
	const [range, setRange] = useState<(typeof RANGES)[number]>("14 天");

	return (
		<AppShell>
			<PageHeader
				title="分析报表"
				description="按提供商、模型和时间维度分析请求量、成本、延迟与 Token 使用情况。"
				actions={
					<>
						<div className="bg-card flex items-center rounded-md border p-0.5" role="group" aria-label="时间范围">
							{RANGES.map((option) => (
								<button
									key={option}
									type="button"
									onClick={() => setRange(option)}
									aria-pressed={range === option}
									className={cn(
										"cursor-pointer rounded-[4px] px-2.5 py-1 text-xs transition-colors",
										range === option
											? "bg-secondary text-foreground font-medium"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{option}
								</button>
							))}
						</div>
						<Button variant="outline" onClick={() => toast.success("报表已导出（演示）")}>
							<Download className="size-4" />
							导出
						</Button>
					</>
				}
			/>

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="总请求数" value="1,284,392" trend="+12.4%" hint={`最近 ${range}`} />
				<Metric label="总成本" value="$10,941" trend="+6.8%" hint="预计月底 $13,200" />
				<Metric label="平均延迟" value="214 ms" trend="-8.1%" hint="P95 · 1,284 ms" />
				<Metric label="缓存命中率" value="28.6%" trend="+3.2%" hint="节省约 $1,240" />
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="text-sm">成本趋势</CardTitle>
						<CardDescription className="mt-1 text-xs">按提供商拆分 · 单位 USD</CardDescription>
					</CardHeader>
					<CardContent className="px-2 pt-5 pb-3">
						<div className="h-[260px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={COST_TREND} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
									<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
									<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<YAxis width={40} tickLine={false} axisLine={false} tickMargin={6} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickFormatter={(value) => `$${value}`} />
									<Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} contentStyle={TOOLTIP_STYLE} />
									<Bar dataKey="openai" name="OpenAI" stackId="cost" fill="var(--chart-cat-1)" radius={[0, 0, 0, 0]} isAnimationActive={false} />
									<Bar dataKey="anthropic" name="Anthropic" stackId="cost" fill="var(--chart-cat-2)" isAnimationActive={false} />
									<Bar dataKey="google" name="Google" stackId="cost" fill="var(--chart-cat-3)" isAnimationActive={false} />
									<Bar dataKey="deepseek" name="DeepSeek" stackId="cost" fill="var(--chart-cat-5)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className="text-muted-foreground flex flex-wrap items-center gap-4 px-3 pb-2 text-[11px]">
							{[
								["OpenAI", "var(--chart-cat-1)"],
								["Anthropic", "var(--chart-cat-2)"],
								["Google", "var(--chart-cat-3)"],
								["DeepSeek", "var(--chart-cat-5)"],
							].map(([label, color]) => (
								<span key={label} className="flex items-center gap-1.5">
									<span className="size-2 rounded-full" style={{ background: color }} />
									{label}
								</span>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="text-sm">模型成本占比</CardTitle>
						<CardDescription className="mt-1 text-xs">最近 14 天</CardDescription>
					</CardHeader>
					<CardContent className="px-5 py-4">
						<div className="h-[180px]">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie data={MODEL_COST} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="var(--card)" strokeWidth={2} isAnimationActive={false}>
										{MODEL_COST.map((entry) => (
											<Cell key={entry.name} fill={entry.color} />
										))}
									</Pie>
									<Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`$${Number(value).toLocaleString("en-US")}`, ""]} />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<ul className="mt-2 space-y-2">
							{MODEL_COST.map((entry) => (
								<li key={entry.name} className="flex items-center gap-2 text-xs">
									<span className="size-2 rounded-full" style={{ background: entry.color }} />
									<span className="flex-1 truncate">{entry.name}</span>
									<span className="text-muted-foreground font-mono tabular-nums">${entry.value.toLocaleString("en-US")}</span>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="text-sm">延迟分位</CardTitle>
						<CardDescription className="mt-1 text-xs">P50 / P95 / P99 · 单位 ms</CardDescription>
					</CardHeader>
					<CardContent className="px-2 pt-5 pb-3">
						<div className="h-[220px]">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={LATENCY_TREND} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
									<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
									<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<YAxis width={44} tickLine={false} axisLine={false} tickMargin={6} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<Tooltip contentStyle={TOOLTIP_STYLE} />
									<Line type="monotone" dataKey="p50" name="P50" stroke="var(--chart-cat-1)" strokeWidth={2} dot={false} isAnimationActive={false} />
									<Line type="monotone" dataKey="p95" name="P95" stroke="var(--chart-cat-2)" strokeWidth={2} dot={false} isAnimationActive={false} />
									<Line type="monotone" dataKey="p99" name="P99" stroke="var(--chart-warning)" strokeWidth={2} dot={false} isAnimationActive={false} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="text-sm">Token 用量</CardTitle>
						<CardDescription className="mt-1 text-xs">输入 / 输出 / 缓存命中 · 单位 M</CardDescription>
					</CardHeader>
					<CardContent className="px-2 pt-5 pb-3">
						<div className="h-[220px]">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={TOKEN_TREND} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
									<defs>
										<linearGradient id="fill-input" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="var(--chart-cat-1)" stopOpacity={0.25} />
											<stop offset="100%" stopColor="var(--chart-cat-1)" stopOpacity={0.02} />
										</linearGradient>
										<linearGradient id="fill-output" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="var(--chart-cat-2)" stopOpacity={0.25} />
											<stop offset="100%" stopColor="var(--chart-cat-2)" stopOpacity={0.02} />
										</linearGradient>
									</defs>
									<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
									<XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<YAxis width={44} tickLine={false} axisLine={false} tickMargin={6} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
									<Tooltip contentStyle={TOOLTIP_STYLE} />
									<Area type="monotone" dataKey="input" name="输入" stroke="var(--chart-cat-1)" strokeWidth={2} fill="url(#fill-input)" isAnimationActive={false} />
									<Area type="monotone" dataKey="output" name="输出" stroke="var(--chart-cat-2)" strokeWidth={2} fill="url(#fill-output)" isAnimationActive={false} />
									<Area type="monotone" dataKey="cached" name="缓存" stroke="var(--chart-seq-3)" strokeWidth={1.5} fill="none" strokeDasharray="4 3" isAnimationActive={false} />
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="mt-4 gap-0 py-0">
				<CardHeader className="border-b px-5 py-4">
					<CardTitle className="text-sm">成本明细</CardTitle>
					<CardDescription className="mt-1 text-xs">按模型汇总的请求量、Token 与成本</CardDescription>
				</CardHeader>
				<CardContent className="px-0">
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className="pl-5">模型</TableHead>
								<TableHead>提供商</TableHead>
								<TableHead className="text-right">请求数</TableHead>
								<TableHead className="text-right">Token</TableHead>
								<TableHead className="text-right">成本</TableHead>
								<TableHead className="pr-5 text-right">占比</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{COST_TABLE.map((row) => (
								<TableRow key={row.model}>
									<TableCell className="pl-5 font-mono text-xs">{row.model}</TableCell>
									<TableCell className="text-[13px]">{row.provider}</TableCell>
									<TableCell className="text-right font-mono text-xs tabular-nums">{row.requests.toLocaleString("en-US")}</TableCell>
									<TableCell className="text-right font-mono text-xs tabular-nums">{row.tokens}</TableCell>
									<TableCell className="text-right font-mono text-xs tabular-nums">${row.cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}</TableCell>
									<TableCell className="pr-5">
										<div className="flex items-center justify-end gap-2">
											<div className="bg-chart-track h-1.5 w-16 overflow-hidden rounded-full">
												<div className="bg-foreground/70 h-full rounded-full" style={{ width: `${row.share}%` }} />
											</div>
											<span className="text-muted-foreground w-8 text-right font-mono text-[11px] tabular-nums">{row.share}%</span>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</AppShell>
	);
}
