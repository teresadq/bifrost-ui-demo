import {
	Activity,
	ArrowRight,
	ArrowUpRight,
	Bot,
	Check,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	CircleDollarSign,
	Clock,
	Cloud,
	Command,
	Database,
	FileText,
	FolderOpen,
	GripVertical,
	Hash,
	Inbox,
	Layers,
	LayoutDashboard,
	Mail,
	MessageSquare,
	MoreHorizontal,
	PanelLeft,
	Plus,
	Search,
	Server,
	Settings2,
	ShieldCheck,
	Sparkles,
	Star,
	Terminal,
	Users,
	Wand2,
	X,
	Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { BlockCard, MiniAvatar, MiniBar } from "@/components/reui/gallery";
import { ReBadge, ReButton, ReProgress } from "@/components/reui/ui";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Mode = { id: string; label: string };

const TINY = "text-[8px]";
const MICRO = "text-[7px]";

function Lab({
	title,
	description,
	modes,
	className,
	children,
}: {
	title: string;
	description: string;
	modes: Mode[];
	className?: string;
	children: (mode: string) => ReactNode;
}) {
	const [mode, setMode] = useState(modes[0].id);
	return (
		<BlockCard title={title} category="pro" description={description} badge={`${modes.length} variants`} className={className}>
			<div className="mb-3 flex flex-wrap gap-1">
				{modes.map((item) => (
					<button
						key={item.id}
						type="button"
						onClick={() => setMode(item.id)}
						className={cn(
							"cursor-pointer rounded-md border px-2 py-1 text-[10px] transition-colors",
							mode === item.id ? "border-primary/40 bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-accent",
						)}
					>
						{item.label}
					</button>
				))}
				<ReBadge tone="outline" className="ml-auto self-center font-mono text-[8px]">
					PRO 仿照
				</ReBadge>
			</div>
			<div className="bg-card min-h-[300px] rounded-xl border p-3">{children(mode)}</div>
		</BlockCard>
	);
}

/* ───────────────────────── App Shell variants ───────────────────────── */

function ShellFrame({ children, sidebar, topbar }: { children: ReactNode; sidebar: ReactNode; topbar?: ReactNode }) {
	return (
		<div className="flex h-[290px] overflow-hidden rounded-lg border">
			{sidebar}
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex h-8 shrink-0 items-center gap-2 border-b px-2.5">
					<div className="flex items-center gap-1">
						<span className="size-1.5 rounded-full bg-destructive/70" />
						<span className="size-1.5 rounded-full bg-amber-400" />
						<span className="size-1.5 rounded-full bg-emerald-500" />
					</div>
					{topbar}
				</div>
				<div className="min-h-0 flex-1 overflow-hidden p-2.5">{children}</div>
			</div>
		</div>
	);
}

function RailSidebar() {
	const items = [LayoutDashboard, Inbox, Users, Database, Settings2];
	return (
		<div className="bg-sidebar flex w-11 shrink-0 flex-col items-center gap-1 border-r p-1.5">
			<span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
				<Sparkles className="size-3" />
			</span>
			<div className="mt-2 space-y-1">
				{items.map((Icon, index) => (
					<span key={index} className={cn("grid size-7 place-items-center rounded-md", index === 0 ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground/50")}>
						<Icon className="size-3.5" />
					</span>
				))}
			</div>
			<span className="bg-sidebar-accent mt-auto grid size-6 place-items-center rounded-full text-[6px] text-sidebar-foreground">陈</span>
		</div>
	);
}

function AppShellLab({ mode }: { mode: string }) {
	if (mode === "rail") {
		return (
			<ShellFrame sidebar={<RailSidebar />} topbar={<span className="text-muted-foreground text-[7px]">工作台 / 概览</span>}>
				<div className="flex items-center justify-between">
					<p className={cn(TINY, "font-semibold")}>概览</p>
					<div className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 text-[6px]">新建</div>
				</div>
				<div className="mt-2 grid grid-cols-3 gap-1.5">
					{["请求", "延迟", "成本"].map((label) => (
						<div key={label} className="rounded-md border p-1.5">
							<p className={cn(MICRO, "text-muted-foreground")}>{label}</p>
							<p className="text-[9px] font-semibold tabular-nums">{[ "1.28M", "214ms", "$7.4K" ][["请求", "延迟", "成本"].indexOf(label)]}</p>
						</div>
					))}
				</div>
				<div className="mt-1.5 rounded-md border p-2">
					<svg viewBox="0 0 200 40" className="h-16 w-full" preserveAspectRatio="none">
						<polygon points="0,40 0,30 20,26 40,31 60,20 80,24 100,14 120,18 140,8 160,12 180,5 200,9 200,40" fill="var(--chart-cat-1)" opacity="0.15" />
						<polyline points="0,30 20,26 40,31 60,20 80,24 100,14 120,18 140,8 160,12 180,5 200,9" fill="none" stroke="var(--chart-cat-1)" strokeWidth="1.5" />
					</svg>
				</div>
			</ShellFrame>
		);
	}
	if (mode === "dual") {
		return (
			<ShellFrame
				sidebar={
					<div className="flex h-full">
						<RailSidebar />
						<div className="bg-card w-[112px] shrink-0 border-r p-1.5">
							<div className="flex items-center justify-between">
								<p className="text-[7px] font-medium">收件箱</p>
								<Plus className="text-muted-foreground size-2.5" />
							</div>
							<div className="mt-1.5 space-y-1">
								{[
									["审核请求", "3"],
									["模型告警", "8"],
									["账单通知", "2"],
									["系统更新", ""],
								].map(([label, count], index) => (
									<div key={label} className={cn("rounded-md px-1.5 py-1", index === 0 ? "bg-secondary" : "")}>
										<div className="flex items-center gap-1">
											<span className="size-1 rounded-full bg-primary" />
											<span className={cn(TINY, "truncate")}>{label}</span>
											{count && <span className="text-muted-foreground ml-auto font-mono text-[6px]">{count}</span>}
										</div>
										<p className={cn(MICRO, "text-muted-foreground mt-0.5 truncate")}>今天 · 3 条未读</p>
									</div>
								))}
							</div>
						</div>
					</div>
				}
				topbar={<span className="text-muted-foreground text-[7px]">收件箱 / 审核请求</span>}
			>
				<div className="space-y-2">
					{[
						["预算告警阈值调整", "林嘉 · 10:24", "待审批"],
						["生产环境 API Key 轮换", "王一鸣 · 09:50", "待审批"],
						["新增 Claude 提供商", "周雨 · 昨天", "已通过"],
					].map(([title, meta, badge]) => (
						<div key={title} className="flex items-center gap-2 rounded-md border p-2">
							<span className="bg-secondary grid size-6 place-items-center rounded-full"><Mail className="size-2.5" /></span>
							<div className="min-w-0 flex-1">
								<p className={cn(TINY, "font-medium")}>{title}</p>
								<p className={cn(MICRO, "text-muted-foreground mt-0.5")}>{meta}</p>
							</div>
							<ReBadge tone={badge === "待审批" ? "warning" : "success"} className="h-4 px-1 text-[6px]">{badge}</ReBadge>
						</div>
					))}
				</div>
			</ShellFrame>
		);
	}
	if (mode === "command") {
		return (
			<ShellFrame sidebar={<RailSidebar />} topbar={<span className="text-muted-foreground text-[7px]">按 ⌘K 打开命令面板</span>}>
				<div className="relative h-full">
					<div className="grid grid-cols-3 gap-1.5 opacity-40">
						{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-12 rounded-md border" />)}
					</div>
					<div className="border-border bg-popover absolute inset-x-8 top-6 overflow-hidden rounded-lg border shadow-xl">
						<div className="flex items-center gap-1.5 border-b px-2 py-1.5">
							<Search className="text-muted-foreground size-2.5" />
							<span className="text-[7px]">搜索页面、项目或操作…</span>
							<kbd className="text-muted-foreground ml-auto rounded border px-1 font-mono text-[6px]">ESC</kbd>
						</div>
						<div className="p-1">
							<p className={cn(MICRO, "text-muted-foreground px-1.5 py-1 uppercase tracking-wider")}>页面</p>
							{[
								["概览", "⌘1"],
								["看板", "⌘2"],
								["项目设置", "⌘3"],
							].map(([label, key], index) => (
								<div key={label} className={cn("flex items-center gap-1.5 rounded px-1.5 py-1 text-[7px]", index === 0 && "bg-secondary")}>
									<LayoutDashboard className="size-2.5 text-muted-foreground" />
									<span>{label}</span>
									<kbd className="text-muted-foreground ml-auto font-mono text-[6px]">{key}</kbd>
								</div>
							))}
							<p className={cn(MICRO, "text-muted-foreground mt-1 px-1.5 py-1 uppercase tracking-wider")}>操作</p>
							<div className="flex items-center gap-1.5 rounded px-1.5 py-1 text-[7px]">
								<Plus className="size-2.5 text-muted-foreground" />
								新建 API 密钥
							</div>
						</div>
					</div>
				</div>
			</ShellFrame>
		);
	}
	return (
		<ShellFrame
			sidebar={<RailSidebar />}
			topbar={
				<div className="flex items-center gap-1.5">
					<span className="text-muted-foreground text-[7px]">Nova Gateway</span>
					<span className="text-muted-foreground/50 text-[7px]">/</span>
					<span className="rounded border bg-secondary px-1 py-0.5 text-[6px]">production</span>
					<span className="rounded border px-1 py-0.5 text-[6px] text-muted-foreground">staging</span>
					<span className="ml-auto flex items-center gap-1 text-[6px] text-emerald-600 dark:text-emerald-300">
						<span className="size-1 rounded-full bg-emerald-500" />
						所有系统正常
					</span>
				</div>
			}
		>
			<div className="grid grid-cols-2 gap-2">
				<div className="rounded-lg border p-2">
					<p className={cn(TINY, "font-medium")}>环境切换</p>
					<div className="mt-1.5 space-y-1">
						{[
							["production", "us-east-1", true],
							["staging", "us-west-2", false],
							["preview", "eu-central-1", false],
						].map(([name, region, active]) => (
							<div key={String(name)} className={cn("flex items-center gap-1 rounded border px-1.5 py-1", active && "border-primary/40 bg-secondary")}>
								<span className={cn("size-1 rounded-full", active ? "bg-emerald-500" : "bg-muted-foreground")} />
								<span className="text-[7px]">{name}</span>
								<span className="text-muted-foreground ml-auto font-mono text-[6px]">{region}</span>
							</div>
						))}
					</div>
				</div>
				<div className="space-y-2">
					<div className="rounded-lg border p-2">
						<p className={cn(TINY, "font-medium")}>部署状态</p>
						<p className="text-muted-foreground mt-0.5 text-[6px]">v2.4.1 · 8 分钟前</p>
						<MiniBar value={100} tone="bg-emerald-500" className="mt-1.5 h-1" />
					</div>
					<div className="rounded-lg border p-2">
						<p className={cn(TINY, "font-medium")}>区域延迟</p>
						<div className="mt-1.5 space-y-1">
							{["us-east-1", "us-west-2", "eu-central-1"].map((region, index) => (
								<div key={region} className="flex items-center gap-1">
									<span className="text-muted-foreground shrink-0 text-[6px] whitespace-nowrap">{region}</span>
									<MiniBar value={[42, 68, 55][index]} className="h-0.5" />
									<span className="text-muted-foreground flex w-6 justify-end font-mono text-[6px]">{["182", "241", "204"][index]}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</ShellFrame>
	);
}

/* ───────────────────────── Data Grid variants ───────────────────────── */

const GRID_ROWS = [
	["陈晓", "管理员", "平台组", "us-east-1", "运行中"],
	["王一鸣", "开发者", "网关组", "us-west-2", "运行中"],
	["林嘉", "开发者", "应用组", "eu-central-1", "已暂停"],
	["周雨", "开发者", "应用组", "ap-southeast-1", "运行中"],
	["赵可", "只读", "数据组", "us-east-1", "异常"],
];

function StatusDot({ value }: { value: string }) {
	return <ReBadge dot tone={value === "运行中" ? "success" : value === "已暂停" ? "warning" : "danger"} className="h-4 px-1 text-[6px]">{value}</ReBadge>;
}

function DataGridLab({ mode }: { mode: string }) {
	const [width, setWidth] = useState(120);
	const [selected, setSelected] = useState<Set<number>>(new Set([0, 2]));
	const [expanded, setExpanded] = useState<Set<string>>(new Set(["平台组"]));

	if (mode === "pin") {
		return (
			<div>
				<div className="mb-2 flex items-center gap-1.5 text-[7px]">
					<ReBadge tone="dark" className="h-4 px-1 text-[6px]">Pinned: 成员</ReBadge>
					<span className="text-muted-foreground">横向滚动时首列保持可见</span>
				</div>
				<div className="overflow-x-auto rounded-lg border">
					<table className="min-w-[520px] w-full text-left">
						<thead>
							<tr className="text-muted-foreground bg-secondary/50 text-[7px]">
								<th className="bg-secondary/90 sticky left-0 z-10 px-2 py-1.5 font-medium">成员</th>
								<th className="px-2 py-1.5 font-medium">角色</th>
								<th className="px-2 py-1.5 font-medium">团队</th>
								<th className="px-2 py-1.5 font-medium">区域</th>
								<th className="px-2 py-1.5 font-medium">状态</th>
								<th className="px-2 py-1.5 font-medium">成本</th>
								<th className="px-2 py-1.5 font-medium">请求</th>
							</tr>
						</thead>
						<tbody>
							{GRID_ROWS.map(([name, role, team, region, status], index) => (
								<tr key={name} className="border-t">
									<td className="bg-card sticky left-0 z-10 px-2 py-1.5">
										<div className="flex items-center gap-1.5"><MiniAvatar name={name} className="size-4 text-[6px]" /><span className="text-[7px] font-medium">{name}</span></div>
									</td>
									<td className="text-muted-foreground px-2 py-1.5 text-[7px]">{role}</td>
									<td className="text-muted-foreground px-2 py-1.5 text-[7px]">{team}</td>
									<td className="text-muted-foreground px-2 py-1.5 font-mono text-[6px]">{region}</td>
									<td className="px-2 py-1.5"><StatusDot value={status} /></td>
									<td className="px-2 py-1.5 text-right font-mono text-[7px] tabular-nums">${[2840, 2210, 1180, 960, 720][index]}</td>
									<td className="px-2 py-1.5 text-right font-mono text-[7px] tabular-nums">{[342, 281, 198, 134, 76][index]}K</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	if (mode === "resize") {
		return (
			<div>
				<div className="mb-2 flex items-center gap-1.5 text-[7px]">
					<ReBadge tone="outline" className="h-4 px-1 text-[6px]">列宽 {width}px</ReBadge>
					<span className="text-muted-foreground">拖动「成员」列右侧手柄调整宽度</span>
				</div>
				<div className="overflow-x-auto rounded-lg border">
					<table className="w-full text-left" style={{ minWidth: width + 320 }}>
						<thead>
							<tr className="text-muted-foreground bg-secondary/50 text-[7px]">
								<th className="relative px-2 py-1.5 font-medium" style={{ width }}>
									成员
									<span
										role="separator"
										aria-label="调整列宽"
										className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-border hover:bg-primary"
										onPointerDown={(event) => {
											event.preventDefault();
											const startX = event.clientX;
											const startWidth = width;
											const move = (moveEvent: PointerEvent) => setWidth(Math.max(80, Math.min(240, startWidth + moveEvent.clientX - startX)));
											const up = () => {
												window.removeEventListener("pointermove", move);
												window.removeEventListener("pointerup", up);
											};
											window.addEventListener("pointermove", move);
											window.addEventListener("pointerup", up);
										}}
									/>
								</th>
								<th className="px-2 py-1.5 font-medium">角色</th>
								<th className="px-2 py-1.5 font-medium">团队</th>
								<th className="px-2 py-1.5 font-medium">状态</th>
								<th className="px-2 py-1.5 text-right font-medium">成本</th>
							</tr>
						</thead>
						<tbody>
							{GRID_ROWS.map(([name, role, team, , status], index) => (
								<tr key={name} className="border-t">
									<td className="px-2 py-1.5" style={{ width }}><span className="text-[7px] font-medium">{name}</span></td>
									<td className="text-muted-foreground px-2 py-1.5 text-[7px]">{role}</td>
									<td className="text-muted-foreground px-2 py-1.5 text-[7px]">{team}</td>
									<td className="px-2 py-1.5"><StatusDot value={status} /></td>
									<td className="px-2 py-1.5 text-right font-mono text-[7px]">${[2840, 2210, 1180, 960, 720][index]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}

	if (mode === "bulk") {
		return (
			<div>
				<div className={cn("mb-2 flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[7px]", selected.size > 0 ? "bg-secondary/60" : "text-muted-foreground")}>
					{selected.size > 0 ? (
						<>
							<span className="font-medium">已选择 {selected.size} 行</span>
							<ReButton size="sm" variant="outline" className="ml-1 h-5 px-1.5 text-[6px]">批量编辑</ReButton>
							<ReButton size="sm" variant="outline" className="text-destructive h-5 px-1.5 text-[6px]" onClick={() => setSelected(new Set())}>删除</ReButton>
							<button type="button" className="text-muted-foreground ml-auto cursor-pointer text-[6px]" onClick={() => setSelected(new Set())}>取消</button>
						</>
					) : (
						<span>勾选行以启用批量操作</span>
					)}
				</div>
				<table className="w-full text-left">
					<thead>
						<tr className="text-muted-foreground bg-secondary/50 text-[7px]">
							<th className="w-6 px-2 py-1.5">
								<input
									type="checkbox"
									aria-label="全选"
									checked={selected.size === GRID_ROWS.length}
									onChange={(event) => setSelected(event.target.checked ? new Set(GRID_ROWS.map((_, index) => index)) : new Set())}
								/>
							</th>
							<th className="px-2 py-1.5 font-medium">成员</th>
							<th className="px-2 py-1.5 font-medium">团队</th>
							<th className="px-2 py-1.5 font-medium">状态</th>
							<th className="px-2 py-1.5 text-right font-medium">成本</th>
						</tr>
					</thead>
					<tbody>
						{GRID_ROWS.map(([name, , team, , status], index) => (
							<tr key={name} className={cn("border-t", selected.has(index) && "bg-secondary/40")}>
								<td className="px-2 py-1.5">
									<input
										type="checkbox"
										aria-label={`选择 ${name}`}
										checked={selected.has(index)}
										onChange={(event) =>
											setSelected((current) => {
												const next = new Set(current);
												if (event.target.checked) next.add(index);
												else next.delete(index);
												return next;
											})
										}
									/>
								</td>
								<td className="px-2 py-1.5 text-[7px] font-medium">{name}</td>
								<td className="text-muted-foreground px-2 py-1.5 text-[7px]">{team}</td>
								<td className="px-2 py-1.5"><StatusDot value={status} /></td>
								<td className="px-2 py-1.5 text-right font-mono text-[7px]">${[2840, 2210, 1180, 960, 720][index]}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-2 text-[7px] text-muted-foreground">点击组头折叠 / 展开成员</div>
			<div className="rounded-lg border">
				{[
					["平台组", [0, 1]],
					["应用组", [2, 3]],
					["数据组", [4]],
				].map(([group, indexes]) => {
					const isOpen = expanded.has(String(group));
					return (
						<div key={String(group)}>
							<button
								type="button"
								onClick={() =>
									setExpanded((current) => {
										const next = new Set(current);
										if (next.has(String(group))) next.delete(String(group));
										else next.add(String(group));
										return next;
									})
								}
								className="bg-secondary/50 flex w-full cursor-pointer items-center gap-1 border-b px-2 py-1.5 text-left text-[7px] font-medium"
							>
								<ChevronRight className={cn("size-2.5 transition-transform", isOpen && "rotate-90")} />
								{group}
								<span className="text-muted-foreground font-normal">({(indexes as number[]).length})</span>
							</button>
							{isOpen &&
								(indexes as number[]).map((index) => (
									<div key={index} className="flex items-center gap-2 border-b px-4 py-1.5 last:border-b-0">
										<MiniAvatar name={GRID_ROWS[index][0]} className="size-4 text-[6px]" />
										<span className="text-[7px]">{GRID_ROWS[index][0]}</span>
										<span className="text-muted-foreground text-[6px]">{GRID_ROWS[index][1]}</span>
										<span className="text-muted-foreground ml-auto font-mono text-[7px]">${[2840, 2210, 1180, 960, 720][index]}</span>
									</div>
								))}
						</div>
					);
				})}
			</div>
		</div>
	);
}

/* ───────────────────────── AI Chat variants ───────────────────────── */

function AiChatLab({ mode }: { mode: string }) {
	const [approved, setApproved] = useState(false);
	const [suggestion, setSuggestion] = useState(true);
	if (mode === "starters") {
		return (
			<div className="flex h-full flex-col">
				<div className="flex flex-1 flex-col items-center justify-center text-center">
					<span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-xl"><Sparkles className="size-4" /></span>
					<p className="mt-2 text-[10px] font-semibold">今天想了解什么？</p>
					<p className={cn(MICRO, "text-muted-foreground mt-0.5")}>可以询问用量、延迟、成本或运维操作</p>
					<div className="mt-3 grid w-full max-w-[300px] grid-cols-2 gap-1.5">
						{[
							["分析本周成本", "成本"],
							["定位延迟尖峰", "性能"],
							["生成迁移计划", "计划"],
							["总结未读告警", "运维"],
						].map(([label, tag]) => (
							<button key={label} type="button" className="hover:border-primary/40 cursor-pointer rounded-lg border p-2 text-left transition-colors">
								<ReBadge tone="outline" className="h-3.5 px-1 text-[5px]">{tag}</ReBadge>
								<p className="mt-1 text-[7px] font-medium">{label}</p>
							</button>
						))}
					</div>
				</div>
				<div className="mt-2 flex items-center gap-1.5 rounded-lg border px-2 py-1.5">
					<Input placeholder="询问 Nova Copilot…" className="h-6 border-0 px-0 text-[7px] shadow-none focus-visible:ring-0" />
					<span className="bg-primary text-primary-foreground grid size-5 place-items-center rounded"><ArrowUpRight className="size-2.5" /></span>
				</div>
			</div>
		);
	}
	if (mode === "compare") {
		return (
			<div>
				<div className="mb-2 flex items-center gap-1.5">
					<ReBadge tone="outline" className="h-4 px-1 text-[6px]">模型对比</ReBadge>
					<span className="text-muted-foreground text-[7px]">同一提示词 · 两个模型并排</span>
				</div>
				<div className="rounded-lg border bg-secondary/40 p-2 text-[7px]">为什么客服项目今天的延迟升高了？</div>
				<div className="mt-2 grid grid-cols-2 gap-2">
					{[
						{ name: "Claude Sonnet 4.5", latency: "1.2s", tokens: "486", cost: "$0.0021", tone: "success" as const, text: "p95 从 318ms 升至 412ms，主要来自 us-east-1 连接池排队。建议将 20% 流量切到 us-west-2，并预热连接池。" },
						{ name: "GPT-4o", latency: "0.9s", tokens: "412", cost: "$0.0018", tone: "outline" as const, text: "延迟升高与上游连接池饱和度相关。可临时扩容 2 个副本，或将非关键请求降级到 DeepSeek V3。" },
					].map((model) => (
						<div key={model.name} className="rounded-lg border p-2">
							<div className="flex items-center gap-1">
								<span className="bg-secondary grid size-4 place-items-center rounded-full"><Bot className="size-2.5" /></span>
								<span className="truncate text-[7px] font-medium">{model.name}</span>
							</div>
							<p className={cn(MICRO, "text-muted-foreground mt-1.5 leading-3")}>{model.text}</p>
							<div className="mt-2 flex items-center gap-1 border-t pt-1.5 text-[6px] text-muted-foreground">
								<Clock className="size-2" />{model.latency}
								<Hash className="ml-1 size-2" />{model.tokens}
								<CircleDollarSign className="ml-1 size-2" />{model.cost}
							</div>
							<div className="mt-1.5 flex gap-1">
								<ReBadge tone={model.tone} className="h-4 px-1 text-[5px]">{model.tone === "success" ? "推荐" : "备选"}</ReBadge>
								<span className="text-muted-foreground text-[6px]">复制回答</span>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
	if (mode === "branch") {
		return (
			<div>
				<div className="flex items-center gap-1.5">
					<ReBadge tone="outline" className="h-4 px-1 text-[6px]">分支 2 / 3</ReBadge>
					<span className="text-muted-foreground text-[6px]">从第 2 条回答继续对话</span>
					<div className="ml-auto flex gap-0.5">
						<span className="grid size-4 place-items-center rounded border text-[6px]">‹</span>
						<span className="grid size-4 place-items-center rounded border text-[6px]">›</span>
					</div>
				</div>
				<div className="mt-2 space-y-1.5">
					<div className="flex justify-end"><div className="bg-primary text-primary-foreground max-w-[80%] rounded-lg px-2 py-1 text-[7px]">给出两种降级方案</div></div>
					<div className="flex gap-1.5">
						<span className="bg-secondary grid size-4 shrink-0 place-items-center rounded-full"><Sparkles className="size-2" /></span>
						<div className="bg-secondary/60 max-w-[85%] rounded-lg px-2 py-1 text-[7px] leading-3">
							方案 A：将非关键请求路由到 DeepSeek V3，预计降低成本 18%。
							<span className="text-muted-foreground mt-1 block text-[6px]">分支 2 · 由你编辑</span>
						</div>
					</div>
					<div className="flex gap-1.5 opacity-50">
						<span className="bg-secondary grid size-4 shrink-0 place-items-center rounded-full"><Sparkles className="size-2" /></span>
						<div className="bg-secondary/60 max-w-[85%] rounded-lg px-2 py-1 text-[7px] leading-3">方案 B：仅对低优先级项目启用限流，保留全部模型能力。</div>
					</div>
				</div>
				<div className="mt-2 flex items-center gap-1.5 border-t pt-1.5 text-[6px] text-muted-foreground">
					<Database className="size-2" />上下文 42%
					<span className="ml-auto">2 个分支 · 可继续编辑</span>
				</div>
			</div>
		);
	}
	return (
		<div>
			<div className="flex items-center gap-1.5">
				<ReBadge tone="info" dot className="h-4 px-1 text-[6px]">Agent 运行中</ReBadge>
				<span className="text-muted-foreground text-[6px]">trace_9f3a21</span>
			</div>
			<div className="mt-2 space-y-1">
				{[
					["解析意图", "planner", true],
					["查询用量与日志", "analytics.query", true],
					["生成迁移计划", "claude-sonnet-4.5", true],
					["等待审批", "approval", false],
				].map(([label, tool, done]) => (
					<div key={String(label)} className="flex items-center gap-1.5 rounded-md border px-1.5 py-1">
						<span className={cn("grid size-3 place-items-center rounded-full", done ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600")}>
							{done ? <Check className="size-2" /> : <Clock className="size-2" />}
						</span>
						<span className="text-[7px]">{label}</span>
						<span className="bg-secondary text-muted-foreground ml-auto rounded px-1 font-mono text-[5px]">{tool}</span>
					</div>
				))}
			</div>
			<div className={cn("mt-2 rounded-lg border p-2", approved ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5")}>
				<p className="text-[7px] font-medium">{approved ? "已批准执行" : "需要你的批准"}</p>
				<p className={cn(MICRO, "text-muted-foreground mt-0.5 leading-3")}>Agent 将把 20% 客服流量切换到 us-west-2，预计影响 42K 请求。</p>
				{!approved && (
					<div className="mt-1.5 flex gap-1">
						<ReButton size="sm" className="h-5 px-1.5 text-[6px]" onClick={() => setApproved(true)}>批准</ReButton>
						<ReButton size="sm" variant="outline" className="h-5 px-1.5 text-[6px]" onClick={() => toast.info("已拒绝，Agent 将停止")}>拒绝</ReButton>
					</div>
				)}
			</div>
		</div>
	);
}

/* ───────────────────────── CRM variants ───────────────────────── */

const CRM_DEALS = [
	{ name: "Acme Corp", amount: 48, stage: 0 },
	{ name: "Globex", amount: 26, stage: 0 },
	{ name: "Initech", amount: 62, stage: 1 },
	{ name: "Umbrella", amount: 38, stage: 1 },
	{ name: "Stark Ind.", amount: 96, stage: 2 },
];

function CrmLab({ mode }: { mode: string }) {
	if (mode === "pipeline") {
		return (
			<div>
				<div className="mb-2 flex items-center gap-1.5">
					<ReBadge tone="dark" className="h-4 px-1 text-[6px]">$270K 管道</ReBadge>
					<span className="text-muted-foreground text-[7px]">按阶段分组的交易</span>
				</div>
				<div className="grid grid-cols-3 gap-1.5">
					{["线索", "谈判", "赢单"].map((stage, stageIndex) => (
						<div key={stage} className="rounded-lg bg-secondary/50 p-1.5">
							<div className="flex items-center justify-between">
								<span className="text-[7px] font-medium">{stage}</span>
								<span className="text-muted-foreground font-mono text-[6px]">${CRM_DEALS.filter((deal) => deal.stage === stageIndex).reduce((sum, deal) => sum + deal.amount, 0)}K</span>
							</div>
							<div className="mt-1 space-y-1">
								{CRM_DEALS.filter((deal) => deal.stage === stageIndex).map((deal) => (
									<div key={deal.name} className="rounded-md border bg-card p-1.5">
										<p className="text-[7px] font-medium">{deal.name}</p>
										<p className="text-muted-foreground mt-0.5 font-mono text-[6px]">${deal.amount}K · 30 天</p>
										<div className="mt-1 flex items-center gap-1">
											<MiniAvatar name={deal.name} className="size-3 text-[5px]" />
											<MiniBar value={[30, 55, 90][stageIndex]} className="h-0.5" />
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
	if (mode === "deal") {
		return (
			<div>
				<div className="flex items-start justify-between">
					<div>
						<p className="text-[9px] font-semibold">Stark Industries · 企业版</p>
						<p className={cn(MICRO, "text-muted-foreground mt-0.5")}>Owner: 陈晓 · Close: 10 月 31 日</p>
					</div>
					<ReBadge tone="success" className="h-4 px-1 text-[6px]">$96K</ReBadge>
				</div>
				<div className="mt-2 flex items-center gap-1">
					{["线索", "谈判", "赢单"].map((stage, index) => (
						<div key={stage} className="flex flex-1 items-center gap-1">
							<span className={cn("grid size-3.5 place-items-center rounded-full border text-[5px]", index <= 1 ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground")}>
								{index < 1 ? <Check className="size-2" /> : index + 1}
							</span>
							<span className={cn("text-[6px]", index === 1 && "font-medium")}>{stage}</span>
							{index < 2 && <span className={cn("h-px flex-1", index < 1 ? "bg-primary" : "bg-border")} />}
						</div>
					))}
				</div>
				<div className="mt-2 grid grid-cols-2 gap-2">
					<div className="rounded-md border p-2">
						<p className={cn(MICRO, "text-muted-foreground")}>联系人</p>
						<div className="mt-1 space-y-1">
							{["Tony Stark · CTO", "Pepper Potts · COO"].map((person) => (
								<div key={person} className="flex items-center gap-1"><MiniAvatar name={person} className="size-3 text-[5px]" /><span className="text-[6px]">{person}</span></div>
							))}
						</div>
					</div>
					<div className="rounded-md border p-2">
						<p className={cn(MICRO, "text-muted-foreground")}>最近活动</p>
						<div className="mt-1 space-y-1">
							<p className="text-[6px]">产品演示 · 昨天</p>
							<p className={cn(MICRO, "text-muted-foreground")}>安全评审 · 10-14</p>
						</div>
					</div>
				</div>
				<div className="mt-2 flex gap-1">
					<ReButton size="sm" className="h-5 px-1.5 text-[6px]" onClick={() => toast.success("已标记为赢单")}>标记赢单</ReButton>
					<ReButton size="sm" variant="outline" className="h-5 px-1.5 text-[6px]" onClick={() => toast.info("已打开交易编辑")}>编辑交易</ReButton>
				</div>
			</div>
		);
	}
	if (mode === "contacts") {
		return (
			<div>
				<div className="mb-2 flex items-center gap-1.5">
					<Search className="text-muted-foreground size-2.5" />
					<span className="text-muted-foreground text-[7px]">搜索联系人…</span>
					<ReBadge tone="outline" className="ml-auto h-4 px-1 text-[6px]">128 位联系人</ReBadge>
				</div>
				<div className="space-y-1">
					{[
						["Tony Stark", "Stark Industries · CTO", "决策人"],
						["Pepper Potts", "Stark Industries · COO", "关键用户"],
						["Bruce Wayne", "Wayne Enterprises · VP", "技术评估"],
						["Diana Prince", "Themyscira Labs · Head of AI", "决策人"],
					].map(([name, meta, tag]) => (
						<div key={name} className="flex items-center gap-2 rounded-md border px-2 py-1.5">
							<MiniAvatar name={name} className="size-6 text-[7px]" />
							<div className="min-w-0 flex-1">
								<p className="text-[7px] font-medium">{name}</p>
								<p className={cn(MICRO, "text-muted-foreground truncate")}>{meta}</p>
							</div>
							<ReBadge tone="outline" className="h-4 px-1 text-[6px]">{tag}</ReBadge>
							<Mail className="text-muted-foreground size-2.5" />
						</div>
					))}
				</div>
			</div>
		);
	}
	const data = [
		{ month: "7 月", closed: 82, forecast: 96 },
		{ month: "8 月", closed: 104, forecast: 112 },
		{ month: "9 月", closed: 128, forecast: 138 },
		{ month: "10 月", closed: 96, forecast: 152 },
	];
	return (
		<div>
			<div className="flex items-end justify-between">
				<div>
					<p className={cn(MICRO, "text-muted-foreground")}>本季度预测</p>
					<p className="text-lg font-semibold tabular-nums">$498K</p>
				</div>
				<ReBadge tone="success" className="h-4 px-1 text-[6px]">置信度 78%</ReBadge>
			</div>
			<div className="mt-2 h-[150px]">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={16}>
						<CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
						<XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 7 }} />
						<YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 7 }} tickFormatter={(value) => `$${value}K`} width={38} />
						<Tooltip contentStyle={{ fontSize: 8, borderRadius: 8, borderColor: "var(--border)" }} />
						<Bar dataKey="closed" fill="var(--chart-cat-1)" radius={[2, 2, 0, 0]} />
						<Bar dataKey="forecast" fill="var(--chart-cat-other)" radius={[2, 2, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div className="flex justify-center gap-3 text-[6px] text-muted-foreground">
				<span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-[var(--chart-cat-1)]" />已赢单</span>
				<span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-[var(--chart-cat-other)]" />预测</span>
			</div>
		</div>
	);
}

/* ───────────────────────── AI Usage variants ───────────────────────── */

function AiUsageLab({ mode }: { mode: string }) {
	const [budget, setBudget] = useState(8000);
	const [local, setLocal] = useState({ enabled: true, gpu: true, cache: false });
	if (mode === "planner") {
		const projected = Math.round((5280 / 8000) * budget);
		return (
			<div>
				<div className="flex items-center justify-between">
					<p className="text-[8px] font-medium">月度预算规划</p>
					<ReBadge tone="outline" className="h-4 px-1 text-[6px]">${budget.toLocaleString("en-US")}</ReBadge>
				</div>
				<input
					type="range"
					min={2000}
					max={16000}
					step={500}
					value={budget}
					onChange={(event) => setBudget(Number(event.target.value))}
					className="accent-primary mt-2 w-full"
					aria-label="月度预算"
				/>
				<div className="mt-1 flex justify-between text-[6px] text-muted-foreground"><span>$2K</span><span>$16K</span></div>
				<div className="mt-2 grid grid-cols-3 gap-1.5">
					{[
						["当前花费", "$5,280"],
						["预计月底", `$${projected.toLocaleString("en-US")}`],
						["剩余", `$${Math.max(0, budget - projected).toLocaleString("en-US")}`],
					].map(([label, value]) => (
						<div key={label} className="rounded-md border p-1.5">
							<p className={cn(MICRO, "text-muted-foreground")}>{label}</p>
							<p className="mt-0.5 text-[9px] font-semibold tabular-nums">{value}</p>
						</div>
					))}
				</div>
				<div className="mt-2">
					<div className="mb-1 flex justify-between text-[6px] text-muted-foreground"><span>预算使用</span><span>{Math.min(100, Math.round((projected / budget) * 100))}%</span></div>
					<MiniBar value={Math.min(100, (projected / budget) * 100)} className="h-1.5" />
				</div>
				<p className="text-muted-foreground mt-2 text-[6px]">建议为 Claude 设置每日上限，避免月末突发流量。</p>
			</div>
		);
	}
	if (mode === "spend") {
		const spend = [
			{ name: "Claude", amount: 2840, share: 38, tone: "bg-violet-500/80" },
			{ name: "OpenAI", amount: 2210, share: 30, tone: "bg-emerald-500/80" },
			{ name: "DeepSeek", amount: 1180, share: 16, tone: "bg-amber-500/80" },
			{ name: "Gemini", amount: 720, share: 10, tone: "bg-blue-500/80" },
			{ name: "其他", amount: 460, share: 6, tone: "bg-zinc-400/80" },
		];
		return (
			<div>
				<div className="mb-2 flex items-center justify-between">
					<p className="text-[8px] font-medium">成本热力图</p>
					<ReBadge tone="outline" className="h-4 px-1 text-[6px]">$7,410</ReBadge>
				</div>
				<div className="grid grid-cols-6 grid-rows-2 gap-1" style={{ height: 150 }}>
					{spend.map((item, index) => (
						<div
							key={item.name}
							className={cn("flex flex-col justify-between rounded-md p-1.5 text-white", item.tone, index === 0 && "col-span-3 row-span-2", index === 1 && "col-span-3", index > 1 && "col-span-2")}
						>
							<span className="text-[6px] opacity-80">{item.name}</span>
							<span className="text-[8px] font-semibold tabular-nums">${item.amount}</span>
						</div>
					))}
				</div>
				<p className="text-muted-foreground mt-2 text-[6px]">块面积表示成本占比，颜色区分提供商。</p>
			</div>
		);
	}
	if (mode === "nodes") {
		return (
			<div>
				<div className="mb-2 flex items-center gap-1.5">
					<ReBadge tone="success" dot className="h-4 px-1 text-[6px]">6 个节点在线</ReBadge>
					<span className="text-muted-foreground text-[6px]">边缘推理节点</span>
				</div>
				<table className="w-full text-left">
					<thead>
						<tr className="text-muted-foreground bg-secondary/50 text-[6px]">
							<th className="px-1.5 py-1 font-medium">区域</th>
							<th className="px-1.5 py-1 font-medium">模型</th>
							<th className="px-1.5 py-1 font-medium">状态</th>
							<th className="px-1.5 py-1 text-right font-medium">延迟</th>
							<th className="px-1.5 py-1 text-right font-medium">Token</th>
						</tr>
					</thead>
					<tbody>
						{[
							["us-east-1", "Claude Haiku", "在线", "82ms", "1.2B"],
							["us-west-2", "GPT-4o mini", "在线", "96ms", "840M"],
							["eu-central-1", "Llama 3.1", "在线", "112ms", "620M"],
							["ap-southeast-1", "DeepSeek V3", "降级", "246ms", "410M"],
						].map(([region, model, status, latency, tokens]) => (
							<tr key={region} className="border-t">
								<td className="px-1.5 py-1 font-mono text-[6px]">{region}</td>
								<td className="px-1.5 py-1 text-[6px]">{model}</td>
								<td className="px-1.5 py-1"><ReBadge dot tone={status === "在线" ? "success" : "warning"} className="h-4 px-1 text-[5px]">{status}</ReBadge></td>
								<td className="px-1.5 py-1 text-right font-mono text-[6px]">{latency}</td>
								<td className="px-1.5 py-1 text-right font-mono text-[6px]">{tokens}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
	return (
		<div>
			<div className="mb-2 flex items-center justify-between">
				<p className="text-[8px] font-medium">本地模型设置</p>
				<ReBadge tone="outline" className="h-4 px-1 text-[6px]">1 台推理机</ReBadge>
			</div>
			<div className="space-y-1.5">
				{([
					["启用本地推理", "enabled", "所有敏感请求优先本地处理"],
					["GPU 加速", "gpu", "使用 H100 进行批处理"],
					["本地响应缓存", "cache", "缓存重复问答以降低延迟"],
				] as const).map(([label, key, desc]) => (
					<div key={label} className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
						<div>
							<p className="text-[7px] font-medium">{label}</p>
							<p className={cn(MICRO, "text-muted-foreground")}>{desc}</p>
						</div>
						<Switch checked={local[key]} onCheckedChange={(checked) => setLocal((current) => ({ ...current, [key]: checked }))} />
					</div>
				))}
			</div>
			<div className="mt-2 rounded-md border p-2">
				<div className="flex justify-between text-[6px]"><span className="text-muted-foreground">显存占用</span><span className="font-mono">62%</span></div>
				<MiniBar value={62} className="mt-1 h-1" />
				<p className="text-muted-foreground mt-1 text-[6px]">24GB / 40GB · 可加载 1 个 7B 模型</p>
			</div>
		</div>
	);
}

/* ───────────────────────── Editor variants ───────────────────────── */

function EditorLab({ mode }: { mode: string }) {
	const [accepted, setAccepted] = useState(false);
	if (mode === "doc") {
		return (
			<div className="h-full">
				<div className="mb-2 flex items-center gap-0.5 border-b pb-1.5 text-[6px] text-muted-foreground">
					{["H1", "H2", "B", "I", "U", "•", "1.", "“"].map((tool) => <span key={tool} className="hover:bg-accent grid size-4 cursor-pointer place-items-center rounded">{tool}</span>)}
					<span className="ml-auto flex items-center gap-1"><EyeIcon /> 预览</span>
				</div>
				<p className="text-[10px] font-semibold">模型接入规范 v2.1</p>
				<p className={cn(MICRO, "text-muted-foreground mt-0.5")}>最后编辑：陈晓 · 2 分钟前</p>
				<p className={cn(TINY, "mt-2 leading-3.5")}>所有新 provider 必须实现 <code className="bg-secondary rounded px-0.5 font-mono text-[6px]">stream()</code> 与 <code className="bg-secondary rounded px-0.5 font-mono text-[6px]">countTokens()</code> 接口。</p>
				<ul className={cn(TINY, "mt-1 list-disc pl-3 leading-3.5 text-muted-foreground")}>
					<li>错误码遵循统一网关约定</li>
					<li>请求体需经过 schema 校验</li>
					<li>超时与重试由网关层统一处理</li>
				</ul>
				<div className="border-primary mt-1.5 rounded-r border-l-2 bg-secondary/50 px-2 py-1 text-[6px] text-muted-foreground">提示：使用 <span className="text-foreground">@nova/sdk</span> 自动生成类型定义。</div>
			</div>
		);
	}
	if (mode === "redline") {
		return (
			<div className="flex h-full gap-2">
				<div className="min-w-0 flex-1">
					<p className="text-[9px] font-semibold">服务协议 · 数据处理附录</p>
					<p className={cn(MICRO, "text-muted-foreground mt-0.5")}>3 处修改 · 2 条评论</p>
					<div className={cn(TINY, "mt-2 space-y-1.5 leading-3.5")}>
						<p>乙方应在服务终止后 <span className="bg-emerald-500/15 text-emerald-700 underline dark:text-emerald-300">三十（30）</span><span className="text-destructive line-through">六十（60）</span> 日内删除全部数据。</p>
						<p>甲方有权在提前 <span className="bg-emerald-500/15 text-emerald-700 underline dark:text-emerald-300">七（7）</span><span className="text-destructive line-through">十四（14）</span> 日通知后终止本协议。</p>
						<p className="text-muted-foreground">审计记录应保留不少于 <span className="bg-emerald-500/15 text-emerald-700 underline dark:text-emerald-300">三（3）</span> 年。</p>
					</div>
				</div>
				<div className="w-[105px] shrink-0 space-y-1.5 border-l pl-2">
					<p className={cn(MICRO, "text-muted-foreground")}>评论</p>
					<div className="rounded-md border p-1.5">
						<div className="flex items-center gap-1"><MiniAvatar name="林嘉" className="size-3 text-[5px]" /><span className="text-[6px] font-medium">林嘉</span></div>
						<p className={cn(MICRO, "text-muted-foreground mt-1 leading-3")}>删除期限建议改为 30 天，符合客户要求。</p>
					</div>
					<div className="rounded-md border p-1.5 opacity-60">
						<div className="flex items-center gap-1"><MiniAvatar name="陈晓" className="size-3 text-[5px]" /><span className="text-[6px] font-medium">陈晓</span></div>
						<p className={cn(MICRO, "text-muted-foreground mt-1 leading-3")}>已确认，等待法务复核。</p>
					</div>
				</div>
			</div>
		);
	}
	if (mode === "ai") {
		return (
			<div className="flex h-full gap-2">
				<div className="min-w-0 flex-1">
					<div className="mb-1.5 flex items-center gap-1 text-[6px] text-muted-foreground"><Wand2 className="size-2.5 text-violet-500" /> AI 写作助手已启用</div>
					<p className={cn(TINY, "leading-3.5")}>旧版网关在上线后出现了性能问题，导致部分客户投诉。</p>
					<p className="text-muted-foreground mt-1 text-[6px]">选中段落，让 AI 改写为更专业的表达。</p>
					<div className="mt-2 flex gap-1">
						<ReButton size="sm" className="h-5 gap-1 px-1.5 text-[6px]" onClick={() => setAccepted(true)}><Sparkles className="size-2" />生成改写</ReButton>
						<ReButton size="sm" variant="outline" className="h-5 px-1.5 text-[6px]">更简洁</ReButton>
						<ReButton size="sm" variant="outline" className="h-5 px-1.5 text-[6px]">更正式</ReButton>
					</div>
				</div>
				<div className="w-[130px] shrink-0 rounded-md border bg-secondary/30 p-1.5">
					<p className={cn(MICRO, "text-muted-foreground")}>建议改写</p>
					<p className={cn(MICRO, "mt-1 leading-3")}>
						{accepted ? "旧版网关上线后出现性能回归，影响部分客户体验。建议在 v2.1 中补充容量评估与灰度发布流程。" : "旧版网关上线后出现性能问题，导致部分客户投诉。"}
					</p>
					<div className="mt-1.5 flex gap-1">
						<button type="button" onClick={() => setAccepted(true)} className="bg-primary text-primary-foreground rounded px-1 py-0.5 text-[5px]">接受</button>
						<button type="button" onClick={() => setAccepted(false)} className="text-muted-foreground text-[5px]">拒绝</button>
					</div>
				</div>
			</div>
		);
	}
	return (
		<div className="h-full">
			<div className="mb-1.5 flex items-center justify-between">
				<p className="text-[9px] font-semibold">协作编辑</p>
				<div className="flex -space-x-1">
					{["陈", "林", "王"].map((name, index) => (
						<span key={name} className="grid size-4 place-items-center rounded-full border-2 border-card text-[5px] font-semibold text-white" style={{ background: ["#5b5bd6", "#0d9488", "#d97706"][index] }}>{name}</span>
					))}
					<span className="grid size-4 place-items-center rounded-full border-2 border-card bg-secondary text-[5px] text-muted-foreground">+2</span>
				</div>
			</div>
			<p className={cn(TINY, "leading-4")}>
				本季度目标是把网关 p95 延迟控制在 <span className="bg-violet-500/15 text-violet-700 underline decoration-violet-500 decoration-2 underline-offset-2 dark:text-violet-300">220ms</span> 以内，同时保持 99.9% 的可用性。
			</p>
			<div className="mt-1.5 rounded-md border-l-2 border-violet-500 bg-violet-500/5 px-2 py-1">
				<p className={cn(MICRO, "text-muted-foreground")}><span className="font-medium text-foreground">林嘉</span> · 建议补充 us-west-2 的容量计划</p>
			</div>
			<p className={cn(TINY, "mt-1.5 leading-4 text-muted-foreground")}>下一步将根据压测结果调整路由权重，并在灰度环境验证缓存命中率。</p>
			<div className="mt-2 flex items-center gap-1 text-[6px] text-muted-foreground"><span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />5 人正在查看</div>
		</div>
	);
}

function EyeIcon() {
	return <span className="inline-block size-2 rounded-full border border-current" />;
}

export function ProBlocks() {
	return (
		<div className="grid gap-4 xl:grid-cols-2">
			<Lab
				title="App Shell · Pro 变体"
				description="图标栏、双栏导航、⌘K 命令面板与环境切换器。"
				modes={[
					{ id: "rail", label: "Icon Rail" },
					{ id: "dual", label: "Dual Sidebar" },
					{ id: "command", label: "Command-K" },
					{ id: "env", label: "Environment" },
				]}
			>
				{(mode) => <AppShellLab mode={mode} />}
			</Lab>
			<Lab
				title="Data Grid · Pro 变体"
				description="列冻结、拖拽调整列宽、批量编辑与树形行。"
				modes={[
					{ id: "pin", label: "Column Pinning" },
					{ id: "resize", label: "Resizing" },
					{ id: "bulk", label: "Bulk Edit" },
					{ id: "tree", label: "Tree Rows" },
				]}
			>
				{(mode) => <DataGridLab mode={mode} />}
			</Lab>
			<Lab
				title="AI Chat · Pro 变体"
				description="提示词起步、模型对比、分支线程与 Agent 审批。"
				modes={[
					{ id: "starters", label: "Prompt Starters" },
					{ id: "compare", label: "Model Compare" },
					{ id: "branch", label: "Branching" },
					{ id: "agent", label: "Agent Task" },
				]}
			>
				{(mode) => <AiChatLab mode={mode} />}
			</Lab>
			<Lab
				title="CRM · Pro 变体"
				description="销售管道、交易详情、联系人目录与预测报表。"
				modes={[
					{ id: "pipeline", label: "Pipeline" },
					{ id: "deal", label: "Deal Sheet" },
					{ id: "contacts", label: "Contacts" },
					{ id: "forecast", label: "Forecast" },
				]}
			>
				{(mode) => <CrmLab mode={mode} />}
			</Lab>
			<Lab
				title="AI Usage · Pro 变体"
				description="预算规划、成本热力图、边缘节点与本地模型。"
				modes={[
					{ id: "planner", label: "Usage Planner" },
					{ id: "spend", label: "Spend Map" },
					{ id: "nodes", label: "Edge Nodes" },
					{ id: "local", label: "Local Models" },
				]}
			>
				{(mode) => <AiUsageLab mode={mode} />}
			</Lab>
			<Lab
				title="Editor · Pro 变体"
				description="文档编辑器、合同红线、AI 改写与协同光标。"
				modes={[
					{ id: "doc", label: "Document" },
					{ id: "redline", label: "Redlines" },
					{ id: "ai", label: "AI Writing" },
					{ id: "collab", label: "Collaborative" },
				]}
			>
				{(mode) => <EditorLab mode={mode} />}
			</Lab>
		</div>
	);
}
