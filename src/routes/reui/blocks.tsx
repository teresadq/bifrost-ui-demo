import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { Info, ShieldCheck } from "lucide-react";

import { CatalogTabs } from "@/components/reui/gallery";
import { ReBadge } from "@/components/reui/ui";

export const Route = createFileRoute("/reui/blocks")({
	component: BlocksLayout,
});

const TABS = [
	{ label: "总览", to: "/reui/blocks" as const, count: "56" },
	{ label: "应用区块", to: "/reui/blocks/application" as const, count: "23" },
	{ label: "数据表格", to: "/reui/blocks/data-grid" as const, count: "9" },
	{ label: "图表", to: "/reui/blocks/charts" as const, count: "10" },
	{ label: "解决方案", to: "/reui/blocks/solutions" as const, count: "11" },
	{ label: "AI 组件", to: "/reui/blocks/ai" as const, count: "3" },
	{ label: "Pro 仿照", to: "/reui/blocks/pro" as const, count: "24" },
];

function BlocksLayout() {
	const pathname = useLocation({ select: (location) => location.pathname });
	const normalized = pathname.replace(/\/$/, "") || "/reui/blocks";

	return (
		<>
			<div className="mb-5 flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-muted-foreground mb-1 font-mono text-[10px] tracking-[0.14em] uppercase">Blocks Gallery</p>
					<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
						Blocks 展厅
						<ReBadge tone="dark" className="h-6 font-mono text-[9px]">80 patterns</ReBadge>
					</h1>
					<p className="text-muted-foreground mt-1 max-w-3xl text-sm">
						覆盖 ReUI Blocks 后台常用类别的 56 个基础示例，以及 6 组 / 24 个 Pro 变体仿照。
					</p>
				</div>
				<div className="bg-secondary/60 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px]">
					<ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-300" />
					<span className="text-muted-foreground">仅使用 MIT 免费组件与自建实现</span>
				</div>
			</div>

			<div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2.5">
				<Info className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-300" />
				<p className="text-muted-foreground text-[11px] leading-5">
					reui.io/blocks 的 Application、Data Grid、Charts、Solutions、AI Agents 区块属于 ReUI Pro 付费内容。
					本展厅不包含付费源码，而是用 ReUI 开源的免费组件（MIT）和等价的自建示例复刻其布局与交互模式，用于设计系统对照。
				</p>
			</div>

			<div className="mb-5">
				<CatalogTabs tabs={TABS} active={normalized} />
			</div>

			<Outlet />
		</>
	);
}
