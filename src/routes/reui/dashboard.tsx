import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowDownRight,
	ArrowUpRight,
	CheckCircle2,
	Clock,
	Download,
	MoreHorizontal,
	Plus,
	Sparkles,
	Wallet,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { ReChartTooltip, Sparkline } from "@/components/reui/charts";
import { REUI_ACTIVITY, REUI_PROJECTS } from "@/components/reui/data";
import {
	ReAvatarStack,
	ReBadge,
	ReButton,
	ReCard,
	ReCardContent,
	ReCardHeader,
	ReCardTitle,
	ReEmptyState,
	ReIconTile,
	RePageHeader,
	ReProgress,
} from "@/components/reui/ui";
import { MODEL_USAGE, STATS, TREND_DATA } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/dashboard")({
	component: DashboardPage,
});

const RANGES = ["7 天", "14 天", "30 天"] as const;

const KPI_ICONS = [Zap, Clock, CheckCircle2, Wallet] as const;
const KPI_TONES = ["dark", "blue", "emerald", "amber"] as const;
const KPI_COLORS = ["var(--chart-cat-1)", "var(--chart-cat-6)", "var(--chart-cat-4)", "var(--chart-cat-5)"] as const;

function Delta({ value, positive }: { value: string; positive: boolean }) {
	const Icon = value.startsWith("-") ? ArrowDownRight : ArrowUpRight;
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
				positive ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/14 text-amber-700 dark:text-amber-300",
			)}
		>
			<Icon className="size-3" />
			{value}
		</span>
	);
}

function DashboardPage() {
	const [range, setRange] = useState<(typeof RANGES)[number]>("14 天");

	return (
		<>
			<RePageHeader
				eyebrow="Overview"
				title="概览"
				description="陈晓，下午好。这是 Nova Gateway 最近 14 天的运行情况。"
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
										range === option
											? "bg-card text-foreground font-medium shadow-sm"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{option}
								</button>
							))}
						</div>
						<ReButton
							variant="outline"
							className="gap-1.5"
							onClick={() => toast.success("演示模式：报表已导出为 CSV")}
						>
							<Download className="size-3.5" />
							导出
						</ReButton>
						<ReButton className="gap-1.5" asChild>
							<Link to="/reui/projects">
								<Plus className="size-3.5" />
								新建项目
							</Link>
						</ReButton>
					</>
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{STATS.map((stat, index) => {
					const Icon = KPI_ICONS[index];
					return (
						<ReCard key={stat.label} className="overflow-hidden p-5">
							<div className="flex items-start justify-between gap-3">
								<div className="flex items-center gap-2.5">
									<ReIconTile icon={Icon} tone={KPI_TONES[index]} />
									<div>
										<p className="text-muted-foreground text-xs">{stat.label}</p>
										<p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
									</div>
								</div>
								<Delta value={stat.delta} positive={stat.positive} />
							</div>
							<div className="-mx-5 mt-4 -mb-2 opacity-80">
								<Sparkline points={stat.spark} color={KPI_COLORS[index]} />
							</div>
							<p className="text-muted-foreground mt-1 text-[10px]">较上一个周期</p>
						</ReCard>
					);
				})}
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				<ReCard className="lg:col-span-2">
					<ReCardHeader className="border-b pb-4">
						<div>
							<ReCardTitle>请求量趋势</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">按天统计的成功与失败请求 · {range}</p>
						</div>
						<div className="flex items-center gap-4 text-[11px]">
							<span className="text-muted-foreground flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-[var(--chart-cat-1)]" />
								成功
							</span>
							<span className="text-muted-foreground flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-[var(--chart-error)]" />
								失败
							</span>
						</div>
					</ReCardHeader>
					<ReCardContent className="pt-4 pb-3">
						<div className="h-[268px] w-full">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={TREND_DATA} margin={{ top: 6, right: 12, left: -8, bottom: 0 }}>
									<defs>
										<linearGradient id="reui-success" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="var(--chart-cat-1)" stopOpacity={0.3} />
											<stop offset="100%" stopColor="var(--chart-cat-1)" stopOpacity={0.02} />
										</linearGradient>
										<linearGradient id="reui-error" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="var(--chart-error)" stopOpacity={0.3} />
											<stop offset="100%" stopColor="var(--chart-error)" stopOpacity={0.02} />
										</linearGradient>
									</defs>
									<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" />
									<XAxis
										dataKey="date"
										tickLine={false}
										axisLine={false}
										tickMargin={10}
										tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
									/>
									<YAxis
										width={46}
										tickLine={false}
										axisLine={false}
										tickMargin={4}
										tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
										tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
									/>
									<Tooltip
										cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
										content={<ReChartTooltip labels={{ success: "成功", error: "失败" }} />}
									/>
									<Area
										type="monotone"
										dataKey="success"
										stackId="a"
										stroke="var(--chart-cat-1)"
										strokeWidth={2}
										fill="url(#reui-success)"
										isAnimationActive={false}
										activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
									/>
									<Area
										type="monotone"
										dataKey="error"
										stackId="a"
										stroke="var(--chart-error)"
										strokeWidth={1.5}
										fill="url(#reui-error)"
										isAnimationActive={false}
										activeDot={{ r: 3.5, strokeWidth: 2, stroke: "var(--card)" }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</ReCardContent>
				</ReCard>

				<ReCard>
					<ReCardHeader className="pb-4">
						<div>
							<ReCardTitle>模型使用占比</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">按请求数统计 · 最近 14 天</p>
						</div>
						<ReBadge tone="outline">5 个模型</ReBadge>
					</ReCardHeader>
					<ReCardContent className="pt-0">
						<ul className="space-y-4">
							{MODEL_USAGE.map((model) => (
								<li key={model.name}>
									<div className="mb-1.5 flex items-baseline justify-between gap-2">
										<div className="flex min-w-0 items-center gap-2">
											<span className="size-2 shrink-0 rounded-full" style={{ background: model.color }} />
											<span className="truncate text-xs font-medium">{model.name}</span>
											<span className="text-muted-foreground hidden text-[10px] sm:inline">{model.provider}</span>
										</div>
										<span className="font-mono text-xs tabular-nums">{model.share}%</span>
									</div>
									<div className="bg-secondary h-1.5 overflow-hidden rounded-full">
										<div
											className="h-full rounded-full transition-[width] duration-500"
											style={{ width: `${model.share}%`, background: model.color }}
										/>
									</div>
								</li>
							))}
						</ul>
						<div className="mt-5 rounded-xl border bg-secondary/40 p-3">
							<p className="flex items-center gap-1.5 text-xs font-medium">
								<Sparkles className="size-3.5 text-violet-500" />
								GPT-4o 与 Claude 贡献 65%
							</p>
							<p className="text-muted-foreground mt-1 text-[11px] leading-5">
								考虑为低频调用配置成本更低的路由策略，预计每月节省 $420。
							</p>
						</div>
					</ReCardContent>
				</ReCard>
			</div>

			<div className="mt-4 grid gap-4 lg:grid-cols-3">
				<ReCard className="lg:col-span-2">
					<ReCardHeader className="pb-4">
						<div>
							<ReCardTitle>最近动态</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">团队在这个工作区中的最新操作</p>
						</div>
						<Link to="/reui/kanban" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs">
							查看看板
							<ArrowUpRight className="size-3.5" />
						</Link>
					</ReCardHeader>
					<ReCardContent className="pt-0">
						<ul className="divide-y">
							{REUI_ACTIVITY.map((item) => (
								<li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
									<span
										className={cn(
											"mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold",
											item.tone === "blue" && "bg-blue-500/15 text-blue-700 dark:text-blue-300",
											item.tone === "violet" && "bg-violet-500/15 text-violet-700 dark:text-violet-300",
											item.tone === "emerald" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
											item.tone === "amber" && "bg-amber-500/15 text-amber-700 dark:text-amber-300",
											item.tone === "neutral" && "bg-secondary text-secondary-foreground",
										)}
									>
										{item.actor.slice(0, 1)}
									</span>
									<div className="min-w-0 flex-1">
										<p className="text-xs leading-5">
											<span className="font-medium">{item.actor}</span>{" "}
											<span className="text-muted-foreground">{item.action}</span>
										</p>
										<p className="text-muted-foreground/70 mt-0.5 text-[10px]">{item.time}</p>
									</div>
								</li>
							))}
						</ul>
					</ReCardContent>
				</ReCard>

				<ReCard className="flex flex-col">
					<ReCardHeader className="pb-4">
						<div>
							<ReCardTitle>本月预算</ReCardTitle>
							<p className="text-muted-foreground mt-0.5 text-xs">团队共享成本池</p>
						</div>
						<MoreHorizontal className="text-muted-foreground size-4" />
					</ReCardHeader>
					<ReCardContent className="flex flex-1 flex-col pt-0">
						<div className="flex items-end justify-between">
							<p className="text-3xl font-semibold tracking-tight tabular-nums">$5,280</p>
							<p className="text-muted-foreground text-xs">/ $8,000</p>
						</div>
						<ReProgress value={66} className="mt-3 h-2" />
						<p className="text-muted-foreground mt-2 text-[11px]">
							已使用 66%，预计月底剩余 <span className="text-foreground font-medium">$1,120</span>。
						</p>
						<div className="mt-5 space-y-3 border-t pt-4">
							{[
								{ label: "Anthropic", value: "$2,840", share: 54, color: "var(--chart-cat-2)" },
								{ label: "OpenAI", value: "$1,480", share: 28, color: "var(--chart-cat-4)" },
								{ label: "其他", value: "$960", share: 18, color: "var(--chart-cat-5)" },
							].map((item) => (
								<div key={item.label} className="flex items-center gap-2.5">
									<span className="size-2 rounded-full" style={{ background: item.color }} />
									<span className="text-muted-foreground flex-1 text-xs">{item.label}</span>
									<span className="font-mono text-xs tabular-nums">{item.value}</span>
									<span className="text-muted-foreground w-8 text-right text-[10px] tabular-nums">{item.share}%</span>
								</div>
							))}
						</div>
						<ReButton
							variant="outline"
							className="mt-auto w-full"
							onClick={() => toast.info("演示模式：预算设置不可用")}
						>
							管理预算
						</ReButton>
					</ReCardContent>
				</ReCard>
			</div>

			<ReCard className="mt-4 overflow-hidden">
				<ReCardHeader className="border-b pb-4">
					<div>
						<ReCardTitle>进行中的项目</ReCardTitle>
						<p className="text-muted-foreground mt-0.5 text-xs">按最近请求量排序</p>
					</div>
					<ReButton variant="ghost" size="sm" className="gap-1" asChild>
						<Link to="/reui/projects">
							全部项目
							<ArrowUpRight className="size-3.5" />
						</Link>
					</ReButton>
				</ReCardHeader>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-muted-foreground bg-secondary/50 text-left text-[11px]">
								<th className="px-5 py-2.5 font-medium">项目</th>
								<th className="px-5 py-2.5 font-medium">状态</th>
								<th className="px-5 py-2.5 font-medium">请求量</th>
								<th className="min-w-40 px-5 py-2.5 font-medium">预算使用</th>
								<th className="px-5 py-2.5 font-medium">成员</th>
								<th className="px-5 py-2.5" />
							</tr>
						</thead>
						<tbody>
							{REUI_PROJECTS.filter((project) => project.status !== "草稿")
								.slice(0, 4)
								.map((project) => (
									<tr key={project.id} className="hover:bg-secondary/40 border-t transition-colors">
										<td className="px-5 py-3">
											<p className="text-xs font-medium">{project.name}</p>
											<p className="text-muted-foreground mt-0.5 text-[10px]">{project.providers.join(" · ")}</p>
										</td>
										<td className="px-5 py-3">
											<ReBadge dot tone={project.status === "运行中" ? "success" : "neutral"}>
												{project.status}
											</ReBadge>
										</td>
										<td className="px-5 py-3 font-mono text-xs tabular-nums">{project.requests}</td>
										<td className="px-5 py-3">
											<div className="flex items-center gap-2">
												<ReProgress
													value={project.used}
													tone={project.used >= 90 ? "bg-destructive" : project.used >= 70 ? "bg-amber-500" : "bg-primary"}
													className="w-24"
												/>
												<span className="text-muted-foreground text-[10px] tabular-nums">{project.used}%</span>
											</div>
										</td>
										<td className="px-5 py-3">
											<ReAvatarStack people={project.members} max={3} />
										</td>
										<td className="px-5 py-3 text-right">
											<ReButton variant="ghost" size="icon" className="size-7" aria-label="更多操作">
												<MoreHorizontal className="size-3.5" />
											</ReButton>
										</td>
									</tr>
								))}
						</tbody>
					</table>
				</div>
				{REUI_PROJECTS.length === 0 && <ReEmptyState icon={Sparkles} title="还没有项目" />}
			</ReCard>
		</>
	);
}
