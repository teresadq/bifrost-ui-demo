import { CircleAlert, Clock } from "lucide-react";
import type { ReactNode } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ComposedChart,
	Line,
	LineChart,
	Pie,
	PieChart,
	RadialBar,
	RadialBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { ReChartTooltip, Sparkline } from "@/components/reui/charts";
import { BlockCard, DemoHeader, DemoSurface, GalleryGrid, MiniSpark } from "@/components/reui/gallery";
import { ReBadge } from "@/components/reui/ui";
import { cn } from "@/lib/utils";

const AREA_DATA = [
	{ day: "10-12", success: 58_000, error: 620 },
	{ day: "10-13", success: 63_000, error: 540 },
	{ day: "10-14", success: 55_000, error: 710 },
	{ day: "10-15", success: 71_000, error: 580 },
	{ day: "10-16", success: 76_000, error: 490 },
	{ day: "10-17", success: 82_000, error: 430 },
	{ day: "10-18", success: 79_000, error: 380 },
];

const BAR_DATA = [
	{ provider: "OpenAI", q2: 1720, q3: 2210 },
	{ provider: "Anthropic", q2: 1480, q3: 2840 },
	{ provider: "DeepSeek", q2: 520, q3: 1180 },
	{ provider: "Google", q2: 310, q3: 720 },
];

const COMPOSED_DATA = [
	{ month: "5 月", cost: 4030, requests: 620 },
	{ month: "6 月", cost: 4400, requests: 690 },
	{ month: "7 月", cost: 4970, requests: 760 },
	{ month: "8 月", cost: 5540, requests: 840 },
	{ month: "9 月", cost: 6240, requests: 910 },
	{ month: "10 月", cost: 6950, requests: 967 },
];

const LINE_DATA = [
	{ day: "周一", p50: 142, p95: 318, p99: 612 },
	{ day: "周二", p50: 138, p95: 301, p99: 588 },
	{ day: "周三", p50: 151, p95: 342, p99: 664 },
	{ day: "周四", p50: 146, p95: 322, p99: 631 },
	{ day: "周五", p50: 134, p95: 296, p99: 574 },
	{ day: "周六", p50: 128, p95: 281, p99: 542 },
	{ day: "周日", p50: 122, p95: 268, p99: 517 },
];

const PIE_DATA = [
	{ name: "Claude", value: 2840, color: "var(--chart-cat-2)" },
	{ name: "GPT-4o", value: 2210, color: "var(--chart-cat-4)" },
	{ name: "DeepSeek", value: 1180, color: "var(--chart-cat-5)" },
	{ name: "Gemini", value: 720, color: "var(--chart-cat-1)" },
	{ name: "其他", value: 460, color: "var(--chart-cat-other)" },
];

const RADIAL_DATA = [
	{ name: "请求", value: 92, fill: "var(--chart-cat-1)" },
	{ name: "缓存", value: 68, fill: "var(--chart-cat-2)" },
	{ name: "成功率", value: 99, fill: "var(--chart-cat-4)" },
];

function ChartFrame({ children }: { children: ReactNode }) {
	return <div className="h-[190px] w-full">{children}</div>;
}

function AreaDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="请求趋势" meta="Area · 成功 / 失败" action={<ReBadge tone="success">+12.4%</ReBadge>} />
			<ChartFrame>
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart data={AREA_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
						<defs>
							<linearGradient id="gallery-area" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stopColor="var(--chart-cat-1)" stopOpacity={0.28} />
								<stop offset="100%" stopColor="var(--chart-cat-1)" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
						<XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickMargin={6} />
						<YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`} width={36} />
						<Tooltip content={<ReChartTooltip labels={{ success: "成功", error: "失败" }} />} />
						<Area type="monotone" dataKey="success" stroke="var(--chart-cat-1)" strokeWidth={1.5} fill="url(#gallery-area)" isAnimationActive={false} />
						<Area type="monotone" dataKey="error" stroke="var(--chart-error)" strokeWidth={1} fill="transparent" isAnimationActive={false} />
					</AreaChart>
				</ResponsiveContainer>
			</ChartFrame>
		</DemoSurface>
	);
}

function BarDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="季度成本对比" meta="Bar · Q2 / Q3" action={<ReBadge tone="outline">USD</ReBadge>} />
			<ChartFrame>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={BAR_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={14}>
						<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
						<XAxis dataKey="provider" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickMargin={6} />
						<YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} width={36} />
						<Tooltip content={<ReChartTooltip labels={{ q2: "Q2", q3: "Q3" }} suffix=" USD" />} />
						<Bar dataKey="q2" fill="var(--chart-cat-other)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
						<Bar dataKey="q3" fill="var(--chart-cat-1)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
					</BarChart>
				</ResponsiveContainer>
			</ChartFrame>
		</DemoSurface>
	);
}

function ComposedDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="成本与请求量" meta="Composed · Bar + Line" action={<ReBadge tone="outline">6 个月</ReBadge>} />
			<ChartFrame>
				<ResponsiveContainer width="100%" height="100%">
					<ComposedChart data={COMPOSED_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={16}>
						<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
						<XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickMargin={6} />
						<YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} width={36} />
						<YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} width={28} />
						<Tooltip content={<ReChartTooltip labels={{ cost: "成本", requests: "请求" }} />} />
						<Bar yAxisId="left" dataKey="cost" fill="var(--chart-cat-1)" radius={[3, 3, 0, 0]} isAnimationActive={false} />
						<Line yAxisId="right" type="monotone" dataKey="requests" stroke="var(--chart-cat-5)" strokeWidth={2} dot={false} isAnimationActive={false} />
					</ComposedChart>
				</ResponsiveContainer>
			</ChartFrame>
		</DemoSurface>
	);
}

function LineDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="延迟分位数" meta="Line · p50 / p95 / p99" action={<ReBadge tone="success">-6.4%</ReBadge>} />
			<ChartFrame>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={LINE_DATA} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
						<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
						<XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} tickMargin={6} />
						<YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 8 }} width={40} tickFormatter={(value) => `${value}ms`} />
						<Tooltip content={<ReChartTooltip suffix=" ms" />} />
						<Line type="monotone" dataKey="p50" stroke="var(--chart-cat-1)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
						<Line type="monotone" dataKey="p95" stroke="var(--chart-cat-2)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
						<Line type="monotone" dataKey="p99" stroke="var(--chart-cat-5)" strokeWidth={1} strokeDasharray="3 2" dot={false} isAnimationActive={false} />
					</LineChart>
				</ResponsiveContainer>
			</ChartFrame>
		</DemoSurface>
	);
}

function PieDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="成本占比" meta="Pie · 本月" action={<ReBadge tone="outline">$7,410</ReBadge>} />
			<div className="relative h-[190px]">
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie data={PIE_DATA} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={3} stroke="var(--card)" strokeWidth={2} isAnimationActive={false}>
							{PIE_DATA.map((item) => <Cell key={item.name} fill={item.color} />)}
						</Pie>
						<Tooltip content={<ReChartTooltip suffix=" USD" />} />
					</PieChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<p className="text-sm font-semibold tabular-nums">$7.4k</p>
					<p className="text-muted-foreground text-[7px]">总成本</p>
				</div>
			</div>
		</DemoSurface>
	);
}

function RadialDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="健康度" meta="Radial · 3 项指标" action={<ReBadge tone="success" dot>正常</ReBadge>} />
			<div className="relative h-[190px]">
				<ResponsiveContainer width="100%" height="100%">
					<RadialBarChart data={RADIAL_DATA} innerRadius="28%" outerRadius="95%" startAngle={90} endAngle={-270}>
						<RadialBar dataKey="value" background={{ fill: "var(--secondary)" }} cornerRadius={4} isAnimationActive={false} />
						<Tooltip content={<ReChartTooltip suffix="%" />} />
					</RadialBarChart>
				</ResponsiveContainer>
				<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
					<p className="text-lg font-semibold tabular-nums">99%</p>
					<p className="text-muted-foreground text-[7px]">综合健康度</p>
				</div>
			</div>
			<div className="mt-1 flex justify-center gap-3 text-[7px]">
				{RADIAL_DATA.map((item) => (
					<span key={item.name} className="text-muted-foreground flex items-center gap-1">
						<span className="size-1.5 rounded-full" style={{ background: item.fill }} />
						{item.name} {item.value}%
					</span>
				))}
			</div>
		</DemoSurface>
	);
}

function SankeyDemo() {
	return (
		<DemoSurface>
			<DemoHeader title="请求流向" meta="Sankey · 模型路由" action={<ReBadge tone="outline">967K</ReBadge>} />
			<svg viewBox="0 0 280 190" className="h-[190px] w-full" aria-hidden>
				<rect x="8" y="70" width="10" height="50" rx="3" fill="var(--primary)" />
				<text x="24" y="92" fontSize="7" fill="var(--foreground)">全部请求</text>
				<text x="24" y="102" fontSize="7" fill="var(--muted-foreground)">967K</text>

				<path d="M18,70 C80,70 90,36 160,36" stroke="var(--chart-cat-2)" strokeWidth="22" fill="none" opacity="0.35" />
				<path d="M18,88 C80,88 90,88 160,88" stroke="var(--chart-cat-4)" strokeWidth="14" fill="none" opacity="0.35" />
				<path d="M18,112 C80,112 90,142 160,142" stroke="var(--chart-cat-5)" strokeWidth="8" fill="none" opacity="0.35" />

				<rect x="160" y="22" width="8" height="28" rx="2" fill="var(--chart-cat-2)" />
				<text x="174" y="34" fontSize="7" fill="var(--foreground)">Claude</text>
				<text x="174" y="43" fontSize="6" fill="var(--muted-foreground)">368K · 38%</text>
				<rect x="160" y="78" width="8" height="20" rx="2" fill="var(--chart-cat-4)" />
				<text x="174" y="88" fontSize="7" fill="var(--foreground)">GPT-4o</text>
				<text x="174" y="97" fontSize="6" fill="var(--muted-foreground)">261K · 27%</text>
				<rect x="160" y="134" width="8" height="14" rx="2" fill="var(--chart-cat-5)" />
				<text x="174" y="143" fontSize="7" fill="var(--foreground)">DeepSeek</text>
				<text x="174" y="152" fontSize="6" fill="var(--muted-foreground)">174K · 18%</text>

				<path d="M242,36 C254,36 258,52 262,60" stroke="var(--border)" strokeWidth="1" fill="none" />
				<circle cx="263" cy="62" r="2" fill="var(--chart-cat-6)" />
				<text x="250" y="80" fontSize="6" fill="var(--muted-foreground)">缓存命中</text>
			</svg>
		</DemoSurface>
	);
}

function SlopeDemo() {
	const series = [
		{ name: "Claude", from: 32, to: 38, color: "var(--chart-cat-2)" },
		{ name: "GPT-4o", from: 30, to: 27, color: "var(--chart-cat-4)" },
		{ name: "DeepSeek", from: 16, to: 18, color: "var(--chart-cat-5)" },
		{ name: "Gemini", from: 12, to: 11, color: "var(--chart-cat-1)" },
	];
	const y = (value: number) => 160 - (value / 45) * 140;
	return (
		<DemoSurface>
			<DemoHeader title="份额变化" meta="Slope · Q2 → Q3" action={<ReBadge tone="success">Claude +6</ReBadge>} />
			<svg viewBox="0 0 280 190" className="h-[190px] w-full" aria-hidden>
				<line x1="70" y1="16" x2="70" y2="172" stroke="var(--border)" strokeDasharray="3 3" />
				<line x1="210" y1="16" x2="210" y2="172" stroke="var(--border)" strokeDasharray="3 3" />
				<text x="70" y="184" textAnchor="middle" fontSize="7" fill="var(--muted-foreground)">Q2</text>
				<text x="210" y="184" textAnchor="middle" fontSize="7" fill="var(--muted-foreground)">Q3</text>
				{series.map((item) => (
					<g key={item.name}>
						<line x1="70" y1={y(item.from)} x2="210" y2={y(item.to)} stroke={item.color} strokeWidth="2" opacity="0.8" />
						<circle cx="70" cy={y(item.from)} r="3" fill={item.color} />
						<circle cx="210" cy={y(item.to)} r="3" fill={item.color} />
						<text x="62" y={y(item.from) + 2} textAnchor="end" fontSize="7" fill="var(--muted-foreground)">{item.name} {item.from}%</text>
						<text x="218" y={y(item.to) + 2} fontSize="7" fill="var(--foreground)">{item.to}%</text>
					</g>
				))}
			</svg>
		</DemoSurface>
	);
}

function SparklineDemo() {
	const items = [
		{ label: "请求数", value: "1.28M", delta: "+12.4%", points: [30, 34, 32, 42, 46, 44, 52, 58, 62], color: "var(--chart-cat-1)" },
		{ label: "延迟", value: "214ms", delta: "-6.4%", points: [62, 58, 60, 54, 52, 48, 46, 42, 40], color: "var(--chart-cat-4)" },
		{ label: "成功率", value: "99.94%", delta: "+0.02%", points: [54, 56, 55, 58, 60, 59, 63, 65, 67], color: "var(--chart-cat-2)" },
		{ label: "成本", value: "$7.4K", delta: "+8.2%", points: [32, 36, 35, 40, 44, 48, 46, 52, 56], color: "var(--chart-cat-5)" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="指标迷你图" meta="Sparkline · 4 指标" action={<ReBadge tone="outline">14 天</ReBadge>} />
			<div className="grid grid-cols-2 gap-2">
				{items.map((item) => (
					<div key={item.label} className="rounded-lg border p-2">
						<div className="flex items-center justify-between">
							<span className="text-muted-foreground text-[7px]">{item.label}</span>
							<span className="text-muted-foreground font-mono text-[6px]">{item.delta}</span>
						</div>
						<p className="text-xs font-semibold tabular-nums">{item.value}</p>
						<Sparkline points={item.points} color={item.color} className="h-6" />
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function StatusTrackerDemo() {
	const days = Array.from({ length: 30 }, (_, index) => (index === 21 ? "warning" : index === 27 ? "error" : "success"));
	return (
		<DemoSurface>
			<DemoHeader title="30 天可用性" meta="Status tracker · us-east-1" action={<ReBadge tone="success" dot>99.94%</ReBadge>} />
			<div className="flex h-16 items-end gap-0.5">
				{days.map((status, index) => (
					<div
						key={index}
						title={`第 ${index + 1} 天`}
						className={cn(
							"flex-1 rounded-sm",
							status === "success" && "bg-emerald-500/75",
							status === "warning" && "bg-amber-400",
							status === "error" && "bg-rose-500",
						)}
						style={{ height: status === "success" ? "100%" : status === "warning" ? "72%" : "46%" }}
					/>
				))}
			</div>
			<div className="mt-2 flex items-center justify-between text-[7px] text-muted-foreground">
				<span>9 月 19 日</span>
				<span className="flex items-center gap-2">
					<span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-emerald-500" />正常</span>
					<span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-amber-400" />延迟</span>
					<span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-rose-500" />中断</span>
				</span>
				<span>10 月 18 日</span>
			</div>
			<div className="mt-3 space-y-1.5 border-t pt-2">
				<div className="flex items-center gap-1.5 text-[7px]">
					<CircleAlert className="size-2.5 text-amber-500" />
					<span className="flex-1">us-west-2 延迟升高（42 分钟）</span>
					<span className="text-muted-foreground">10-14</span>
				</div>
				<div className="flex items-center gap-1.5 text-[7px]">
					<Clock className="size-2.5 text-muted-foreground" />
					<span className="flex-1">网关版本发布，无中断</span>
					<span className="text-muted-foreground">10-09</span>
				</div>
			</div>
		</DemoSurface>
	);
}

export function ChartBlocks() {
	return (
		<GalleryGrid>
			<BlockCard title="Area Chart" category="chart" description="堆叠面积图表达请求成功与失败。" badge="area-chart"><AreaDemo /></BlockCard>
			<BlockCard title="Bar Chart" category="chart" description="分组柱状图对比季度提供商成本。" badge="bar-chart"><BarDemo /></BlockCard>
			<BlockCard title="Composed Chart" category="chart" description="柱状 + 折线双轴组合。" badge="composed-chart"><ComposedDemo /></BlockCard>
			<BlockCard title="Line Chart" category="chart" description="多分位延迟折线与虚线 p99。" badge="line-chart"><LineDemo /></BlockCard>
			<BlockCard title="Pie Chart" category="chart" description="环形图展示模型成本占比。" badge="pie-chart"><PieDemo /></BlockCard>
			<BlockCard title="Radial Chart" category="chart" description="径向进度条展示健康度指标。" badge="radial-chart"><RadialDemo /></BlockCard>
			<BlockCard title="Sankey Chart" category="chart" description="请求流向的桑基图。" badge="sankey-chart"><SankeyDemo /></BlockCard>
			<BlockCard title="Slope Chart" category="chart" description="两个季度的份额变化斜率图。" badge="slope-chart"><SlopeDemo /></BlockCard>
			<BlockCard title="Sparkline" category="chart" description="轻量趋势线与指标组合。" badge="sparkline"><SparklineDemo /></BlockCard>
			<BlockCard title="Status Tracker" category="chart" description="可用性条与事件记录。" badge="status-tracker"><StatusTrackerDemo /></BlockCard>
		</GalleryGrid>
	);
}
