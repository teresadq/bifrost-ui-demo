import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ArrowUpRight,
	Blocks,
	ChartNoAxesCombined,
	Check,
	LayoutGrid,
	Sparkles,
	Table2,
	Workflow,
} from "lucide-react";

import { ReBadge, ReCard, ReIconTile } from "@/components/reui/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/blocks/")({
	component: BlocksHub,
});

const GROUPS = [
	{
		title: "应用区块",
		path: "/reui/blocks/application" as const,
		count: 23,
		icon: LayoutGrid,
		tone: "dark" as const,
		description: "App Shell、认证、卡片、弹窗、空状态、事件日历、流程、表单、甘特图、看板、导航、入职、个人资料、编辑器、日程、设置、Sheet、统计、时间线、白板、向导。",
		tags: ["App Shell", "Wizard", "Gantt", "Calendar", "Timeline"],
	},
	{
		title: "数据表格",
		path: "/reui/blocks/data-grid" as const,
		count: 9,
		icon: Table2,
		tone: "blue" as const,
		description: "基础表格、高级工具栏、列设置、行拖拽、单元格编辑、展开行、筛选、分组、虚拟滚动。",
		tags: ["Advanced", "Editing", "Grouping", "Virtual"],
	},
	{
		title: "图表",
		path: "/reui/blocks/charts" as const,
		count: 10,
		icon: ChartNoAxesCombined,
		tone: "violet" as const,
		description: "面积图、柱状图、组合图、折线图、饼图、径向图、桑基图、斜率图、迷你图、状态追踪条。",
		tags: ["Area", "Composed", "Sankey", "Sparkline"],
	},
	{
		title: "解决方案",
		path: "/reui/blocks/solutions" as const,
		count: 11,
		icon: Workflow,
		tone: "emerald" as const,
		description: "Agents、AI Ops、Analytics、Billing、Bookings、CRM、DevOps、Digital Twin、Files、Inventory、Users 的行业化后台布局。",
		tags: ["CRM", "Billing", "DevOps", "Inventory"],
	},
	{
		title: "AI 组件",
		path: "/reui/blocks/ai" as const,
		count: 3,
		icon: Sparkles,
		tone: "amber" as const,
		description: "Agent Activity 工具调用时间线、AI Chat 对话界面、AI Usage token 与成本面板。",
		tags: ["Agent Activity", "AI Chat", "AI Usage"],
	},
];

const ORIGINAL = [
	{ group: "Application", count: 23, path: "/reui/blocks/application" as const },
	{ group: "Data Grid", count: 9, path: "/reui/blocks/data-grid" as const },
	{ group: "Chart", count: 10, path: "/reui/blocks/charts" as const },
	{ group: "Solutions", count: 11, path: "/reui/blocks/solutions" as const },
	{ group: "AI Agents", count: 3, path: "/reui/blocks/ai" as const },
];

function BlocksHub() {
	return (
		<>
			<div className="mb-5 grid gap-4 sm:grid-cols-3">
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Blocks} tone="dark" />
					<div>
						<p className="text-muted-foreground text-[11px]">区块示例</p>
						<p className="text-xl font-semibold tabular-nums">56</p>
					</div>
					<ReBadge tone="success" className="ml-auto">全部可交互</ReBadge>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={LayoutGrid} tone="blue" />
					<div>
						<p className="text-muted-foreground text-[11px]">覆盖类别</p>
						<p className="text-xl font-semibold tabular-nums">5</p>
					</div>
					<span className="text-muted-foreground ml-auto text-[10px]">后台常用</span>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Sparkles} tone="violet" />
					<div>
						<p className="text-muted-foreground text-[11px]">设计系统</p>
						<p className="text-xl font-semibold">ReUI</p>
					</div>
					<ReBadge tone="outline" className="ml-auto">Neutral</ReBadge>
				</ReCard>
			</div>

			<Link
				to="/reui/blocks/pro"
				className="group bg-card mb-4 flex flex-wrap items-center gap-4 rounded-2xl border p-4 shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
			>
				<ReIconTile icon={Sparkles} tone="violet" />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h2 className="text-sm font-semibold">Pro 能力仿照</h2>
						<ReBadge tone="dark" className="h-4 px-1 font-mono text-[8px]">NEW</ReBadge>
						<ReBadge tone="outline" className="h-4 px-1 font-mono text-[8px]">6 labs / 24 variants</ReBadge>
					</div>
					<p className="text-muted-foreground mt-0.5 text-[11px]">
						在 56 个基础区块之上，补充 App Shell、Data Grid、AI Chat、CRM、AI Usage、Editor 六组 Pro 变体仿照，并附 56 分类 / 500 变体的公开目录。
					</p>
				</div>
				<span className="text-muted-foreground flex items-center gap-1 text-[11px]">
					查看实验室
					<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
				</span>
			</Link>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{GROUPS.map((group) => {
					const Icon = group.icon;
					return (
						<Link
							key={group.path}
							to={group.path}
							className="group bg-card flex flex-col rounded-2xl border p-4 shadow-[0_1px_2px_rgb(0_0_0/0.03)] transition-all hover:-translate-y-0.5 hover:shadow-lg"
						>
							<div className="flex items-start justify-between">
								<ReIconTile icon={Icon} tone={group.tone} />
								<ReBadge tone="outline" className="font-mono text-[9px]">{group.count} blocks</ReBadge>
							</div>
							<h2 className="mt-3 text-sm font-semibold tracking-tight">{group.title}</h2>
							<p className="text-muted-foreground mt-1 line-clamp-3 text-[11px] leading-5">{group.description}</p>
							<div className="mt-3 flex flex-wrap gap-1">
								{group.tags.map((tag) => (
									<span key={tag} className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[9px]">
										{tag}
									</span>
								))}
							</div>
							<div className="text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 text-[11px]">
								<span>查看全部示例</span>
								<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</div>
						</Link>
					);
				})}

				<div className="border-border bg-secondary/30 flex flex-col justify-center rounded-2xl border border-dashed p-4">
					<p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Coverage</p>
					<p className="mt-2 text-sm font-semibold">后台类别全覆盖</p>
					<p className="text-muted-foreground mt-1 text-[11px] leading-5">
						电商与营销区块不属于后台系统核心场景，未纳入本展厅。需要时可以在同一套组件层上继续扩展。
					</p>
					<div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-300">
						<Check className="size-3" />
						不含任何 ReUI Pro 付费源码
					</div>
				</div>
			</div>

			<ReCard className="mt-5 overflow-hidden">
				<div className="flex items-center justify-between border-b px-5 py-3.5">
					<div>
						<p className="text-sm font-semibold">原始分类对照</p>
						<p className="text-muted-foreground mt-0.5 text-[11px]">reui.io/blocks 中后台相关分类与展厅的对应关系</p>
					</div>
					<ReBadge tone="outline">56 / 56</ReBadge>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-muted-foreground bg-secondary/40 text-left text-[11px]">
								<th className="px-5 py-2.5 font-medium">ReUI 分类</th>
								<th className="px-5 py-2.5 font-medium">原始区块数</th>
								<th className="px-5 py-2.5 font-medium">展厅覆盖</th>
								<th className="px-5 py-2.5 font-medium">入口</th>
							</tr>
						</thead>
						<tbody>
							{ORIGINAL.map((row) => (
								<tr key={row.group} className="hover:bg-secondary/40 border-t">
									<td className="px-5 py-3 font-mono text-xs">{row.group}</td>
									<td className="text-muted-foreground px-5 py-3 text-xs tabular-nums">{row.count}</td>
									<td className="px-5 py-3">
										<span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-300">
											<Check className="size-3.5" />
											已覆盖
										</span>
									</td>
									<td className="px-5 py-3">
										<Link to={row.path} className={cn("text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-[11px] underline-offset-4 hover:underline")}>
											查看示例
											<ArrowUpRight className="size-3" />
										</Link>
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
