import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	ChevronDown,
	ChevronRight,
	Layers,
	Search,
	Sparkles,
	Table2,
	Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { ProBlocks } from "@/components/reui/blocks/proDemos";
import { PRO_CATALOG, PRO_GROUP_LABELS, PRO_TOTALS, type ProGroup } from "@/components/reui/proCatalog";
import {
	ReBadge,
	ReButton,
	ReCard,
	ReIconTile,
} from "@/components/reui/ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/blocks/pro")({
	component: ProPage,
});

const GROUPS: ProGroup[] = ["application", "data-grid", "chart", "solutions", "ai-agents"];

const COVERAGE: Record<string, string[]> = {
	"application/app-shell": ["Icon Rail Dashboard", "Dual Sidebar Dashboard", "Section Tabs Admin", "Environment Switcher"],
	"data-grid/columns": ["Column Pinning", "Column Resizing", "Density"],
	"data-grid/editing": ["Bulk Edit", "Inline Editing"],
	"data-grid/expansion": ["Tree Rows", "Master Detail"],
	"ai-agents/ai-chat": ["Prompt Starter Welcome", "Model Comparison", "Branching Thread", "Agentic Task Panel"],
	"solutions/crm": ["Pipeline Dashboard", "Deal Sheet", "Contacts Directory", "Forecast Call"],
	"ai-agents/ai-usage": ["Usage Planner", "Spend Map", "Edge Nodes", "Local Models"],
	"application/rich-text-editor": ["Document Editor", "Contract Redlines", "Collaborative Editor", "AI Writing Assistant"],
};

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
	return (
		<ReCard className="p-4">
			<p className="text-muted-foreground text-[11px]">{label}</p>
			<p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
			<p className="text-muted-foreground mt-0.5 text-[10px]">{hint}</p>
		</ReCard>
	);
}

function ProPage() {
	const [group, setGroup] = useState<ProGroup | "all">("all");
	const [query, setQuery] = useState("");
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const filtered = useMemo(() => {
		const value = query.trim().toLowerCase();
		return PRO_CATALOG.filter((category) => {
			if (group !== "all" && category.group !== group) return false;
			if (!value) return true;
			return (
				category.title.toLowerCase().includes(value) ||
				category.description.toLowerCase().includes(value) ||
				category.variants.some((variant) => variant.toLowerCase().includes(value))
			);
		});
	}, [group, query]);

	const totals = useMemo<Record<ProGroup | "all", number>>(() => {
		const result = { all: PRO_CATALOG.length } as Record<ProGroup | "all", number>;
		for (const key of GROUPS) {
			result[key] = PRO_CATALOG.filter((category) => category.group === key).length;
		}
		return result;
	}, []);

	function toggle(slug: string) {
		setExpanded((current) => {
			const next = new Set(current);
			if (next.has(slug)) next.delete(slug);
			else next.add(slug);
			return next;
		});
	}

	const searching = query.trim().length > 0;

	return (
		<>
			<div className="mb-4 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p className="text-muted-foreground mb-1 font-mono text-[10px] tracking-[0.14em] uppercase">ReUI Pro · Imitation</p>
					<h2 className="text-xl font-semibold tracking-tight">Pro 能力仿照</h2>
					<p className="text-muted-foreground mt-1 max-w-2xl text-xs leading-5">
						基于 reui.io/blocks 公开分类页整理出 <span className="text-foreground font-medium">56 个后台分类 / 500 个公开变体名称</span>，并用我们自己的组件仿照其中高频能力。
						新增 6 个实验室、24 个变体示例；不包含任何 Pro 付费源码。
					</p>
				</div>
				<div className="flex items-center gap-2">
					<ReBadge tone="dark" className="h-6 px-2 font-mono text-[9px]">PRO 仿照</ReBadge>
					<ReBadge tone="outline" className="h-6 px-2 font-mono text-[9px]">public catalog only</ReBadge>
				</div>
			</div>

			<div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<Stat label="Pro 后台分类" value={String(PRO_TOTALS.categories)} hint="Application / Data Grid / Chart / Solutions / AI" />
				<Stat label="公开变体名称" value={String(PRO_TOTALS.variants)} hint="来自 56 个公开分类页的变体条目" />
				<Stat label="基础仿照示例" value="56" hint="每个分类一个可交互示例" />
				<Stat label="Pro 变体实验室" value="6 组 / 24 个" hint="App Shell、Grid、AI Chat、CRM、Usage、Editor" />
			</div>

			<div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2.5">
				<Sparkles className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-300" />
				<p className="text-muted-foreground text-[11px] leading-5">
					这里的“理解”指从公开页面提取分类、变体名称与用途描述；“仿照”指用 ReUI 免费组件、项目内依赖和自建交互复刻同类能力，
					不是复制 Pro 源码。完整变体目录见页面底部的 Pro Catalog。
				</p>
			</div>

			<div className="mb-2 flex items-center gap-2">
				<ReIconTile icon={Wand2} tone="violet" className="size-8 rounded-lg" />
				<div>
					<p className="text-sm font-semibold">Pro 变体实验室</p>
					<p className="text-muted-foreground text-[11px]">每个实验室用一组分段按钮切换 4 个 Pro 变体模式</p>
				</div>
			</div>
			<ProBlocks />

			<ReCard className="mt-5 overflow-hidden">
				<div className="flex flex-wrap items-center gap-2 border-b p-4">
					<div className="flex items-center gap-2">
						<ReIconTile icon={Layers} tone="dark" className="size-8 rounded-lg" />
						<div>
							<p className="text-sm font-semibold">Pro Catalog</p>
							<p className="text-muted-foreground text-[10px]">
								{PRO_TOTALS.categories} 个分类 · {PRO_TOTALS.variants} 个变体 · 点击分类查看全部变体名称
							</p>
						</div>
					</div>
					<div className="ml-auto flex flex-wrap items-center gap-1.5">
						<div className="relative">
							<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2" />
							<Input
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="搜索分类或变体…"
								className="h-8 w-48 rounded-lg pl-7 text-[11px]"
							/>
						</div>
						<ReButton
							variant="outline"
							size="sm"
							className="h-8 text-[10px]"
							onClick={() => setExpanded((current) => (current.size ? new Set() : new Set(filtered.map((category) => category.slug))))}
						>
							{expanded.size ? "全部收起" : "全部展开"}
						</ReButton>
					</div>
				</div>

				<div className="flex flex-wrap gap-1 border-b px-4 py-2">
					{(["all", ...GROUPS] as const).map((key) => (
						<button
							key={key}
							type="button"
							onClick={() => setGroup(key)}
							className={cn(
								"cursor-pointer rounded-md px-2 py-1 text-[10px] transition-colors",
								group === key ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent",
							)}
						>
							{key === "all" ? "全部" : PRO_GROUP_LABELS[key]}
							<span className={cn("ml-1 font-mono text-[8px]", group === key ? "opacity-70" : "opacity-50")}>
								{key === "all" ? PRO_TOTALS.categories : totals[key]}
							</span>
						</button>
					))}
					<span className="text-muted-foreground ml-auto self-center text-[10px]">{filtered.length} 个分类</span>
				</div>

				<div className="divide-y">
					{filtered.map((category) => {
						const isOpen = expanded.has(category.slug) || searching;
						const coverage = COVERAGE[category.slug];
						const variantMatches = category.variants.filter((variant) => variant.toLowerCase().includes(query.trim().toLowerCase()));
						const visibleVariants = searching && variantMatches.length > 0 ? variantMatches : category.variants;
						return (
							<div key={category.slug}>
								<button
									type="button"
									onClick={() => toggle(category.slug)}
									className="hover:bg-secondary/40 flex w-full cursor-pointer items-start gap-2 px-4 py-2.5 text-left transition-colors"
								>
									<ChevronRight className={cn("text-muted-foreground mt-0.5 size-3 transition-transform", isOpen && "rotate-90")} />
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-1.5">
											<span className="text-xs font-medium">{category.title}</span>
											<ReBadge tone="outline" className="h-4 px-1 font-mono text-[8px]">{category.slug}</ReBadge>
											<ReBadge tone="neutral" className="h-4 px-1 font-mono text-[8px]">{category.variants.length}</ReBadge>
											{coverage && (
												<ReBadge tone="success" className="h-4 gap-0.5 px-1 text-[8px]">
													<Check className="size-2" />
													已仿照 {coverage.length}
												</ReBadge>
											)}
										</div>
										<p className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px]">{category.description}</p>
									</div>
									<span className="text-muted-foreground mt-0.5 shrink-0 text-[9px]">{PRO_GROUP_LABELS[category.group]}</span>
								</button>
								{isOpen && (
									<div className="bg-secondary/20 border-t px-4 py-2.5 pl-9">
										<div className="flex flex-wrap gap-1.5">
											{visibleVariants.map((variant) => {
												const covered = coverage?.some((item) => variant.toLowerCase().includes(item.toLowerCase()));
												return (
													<span
														key={variant}
														className={cn(
															"rounded-md border px-1.5 py-0.5 text-[9px]",
															covered
																? "border-primary/30 bg-primary/8 text-primary font-medium"
																: "bg-card text-muted-foreground",
														)}
													>
														{covered && <Check className="mr-0.5 inline size-2" />}
														{variant}
													</span>
												);
											})}
											{visibleVariants.length === 0 && <span className="text-muted-foreground text-[10px]">没有匹配的变体</span>}
										</div>
									</div>
								)}
							</div>
						);
					})}
					{filtered.length === 0 && <div className="text-muted-foreground py-12 text-center text-xs">没有匹配的分类或变体</div>}
				</div>
			</ReCard>

			<p className="text-muted-foreground/70 mt-3 text-center text-[10px]">
				目录信息来自 reui.io/blocks 公开分类页（仅标题与用途描述）· ReUI Pro 付费源码未抓取 · 仿照实现使用 MIT 免费组件与自建代码
			</p>
		</>
	);
}
