import { Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowRight,
	ArrowUpRight,
	Bold,
	CalendarDays,
	Check,
	CheckCircle2,
	ChevronRight,
	CircleDollarSign,
	Clock,
	Code2,
	Columns3,
	CreditCard,
	Database,
	Ellipsis,
	FileText,
	Filter,
	FolderKanban,
	GripVertical,
	Image,
	Italic,
	LayoutDashboard,
	ListTodo,
	MoreHorizontal,
	Package,
	Pencil,
	Plus,
	Search,
	Settings2,
	Sparkles,
	Star,
	Trash2,
	TrendingUp,
	Underline,
	User,
	UserPlus,
	Users,
	Wand2,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BlockCard, DemoHeader, DemoSurface, GalleryGrid, MiniAvatar, MiniBar } from "@/components/reui/gallery";
import {
	ReBadge,
	ReButton,
	ReProgress,
} from "@/components/reui/ui";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

function AppShellDemo() {
	const nav = ["概览", "项目", "模型", "成员", "设置"];
	return (
		<DemoSurface className="p-0">
			<div className="flex h-[228px] overflow-hidden rounded-xl">
				<div className="bg-sidebar w-14 shrink-0 border-r p-2">
					<div className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
						<Sparkles className="size-3" />
					</div>
					<div className="mt-3 space-y-1.5">
						{nav.map((item, index) => (
							<div key={item} className={cn("flex h-6 items-center gap-1.5 rounded-md px-1.5 text-[8px]", index === 0 ? "bg-accent font-medium" : "text-muted-foreground")}>
								<span className={cn("size-1 rounded-full", index === 0 ? "bg-primary" : "bg-current opacity-50")} />
								<span className="truncate">{item}</span>
							</div>
						))}
					</div>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex h-8 items-center justify-between border-b px-2.5">
						<div className="text-muted-foreground flex items-center gap-1 text-[8px]">
							工作台 <ChevronRight className="size-2.5" /> <span className="text-foreground font-medium">概览</span>
						</div>
						<div className="flex items-center gap-1">
							<div className="bg-secondary h-5 w-16 rounded-md" />
							<div className="bg-primary size-5 rounded-full" />
						</div>
					</div>
					<div className="p-2.5">
						<div className="grid grid-cols-3 gap-1.5">
							{["请求", "延迟", "成功率"].map((label, index) => (
								<div key={label} className="rounded-md border p-1.5">
									<p className="text-muted-foreground text-[7px]">{label}</p>
									<p className="mt-0.5 text-[10px] font-semibold tabular-nums">{["1.28M", "214ms", "99.9%"][index]}</p>
								</div>
							))}
						</div>
						<div className="mt-1.5 rounded-md border p-2">
							<div className="flex items-center justify-between">
								<p className="text-[8px] font-medium">请求趋势</p>
								<div className="bg-secondary h-3 w-10 rounded" />
							</div>
							<svg viewBox="0 0 240 42" className="mt-1 h-10 w-full" preserveAspectRatio="none">
								<polyline points="0,34 20,30 40,33 60,24 80,27 100,18 120,22 140,12 160,16 180,8 200,12 220,5 240,8" fill="none" stroke="var(--chart-cat-1)" strokeWidth="1.5" />
							</svg>
						</div>
					</div>
				</div>
			</div>
		</DemoSurface>
	);
}

function AuthDemo() {
	return (
		<DemoSurface className="flex h-[228px] items-center justify-center bg-[linear-gradient(135deg,var(--secondary),var(--card))]">
			<div className="w-[210px] rounded-xl border bg-card p-4 shadow-sm">
				<div className="flex items-center gap-1.5">
					<span className="bg-primary text-primary-foreground grid size-5 place-items-center rounded">
						<Sparkles className="size-2.5" />
					</span>
					<p className="text-[10px] font-semibold">Nova Console</p>
				</div>
				<p className="mt-2.5 text-[11px] font-semibold">欢迎回来</p>
				<p className="text-muted-foreground text-[8px]">登录以继续管理模型网关</p>
				<div className="mt-2.5 space-y-1.5">
					<div className="border-input flex h-6 items-center rounded-md border px-2 text-[8px] text-muted-foreground">you@company.com</div>
					<div className="border-input flex h-6 items-center rounded-md border px-2 text-[8px] text-muted-foreground">••••••••</div>
					<div className="bg-primary text-primary-foreground flex h-6 items-center justify-center rounded-md text-[8px] font-medium">登录</div>
				</div>
				<div className="mt-2 flex gap-1.5">
					<div className="flex h-5 flex-1 items-center justify-center rounded border text-[7px]">GitHub</div>
					<div className="flex h-5 flex-1 items-center justify-center rounded border text-[7px]">Google</div>
				</div>
			</div>
		</DemoSurface>
	);
}

function CardDemo() {
	return (
		<div className="grid h-[228px] grid-cols-2 gap-2">
			<DemoSurface className="flex flex-col justify-between">
				<div>
					<div className="flex items-center justify-between">
						<p className="text-muted-foreground text-[9px]">总请求数</p>
						<ReBadge tone="success" className="h-4 px-1 text-[8px]">+12.4%</ReBadge>
					</div>
					<p className="mt-1 text-lg font-semibold tabular-nums">1,284,392</p>
				</div>
				<svg viewBox="0 0 120 30" className="h-8 w-full" preserveAspectRatio="none">
					<polyline points="0,24 15,20 30,22 45,15 60,18 75,10 90,13 105,6 120,9" fill="none" stroke="var(--chart-cat-1)" strokeWidth="1.5" />
				</svg>
			</DemoSurface>
			<div className="space-y-2">
				<DemoSurface className="flex items-center gap-2 p-2.5">
					<div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 text-white">
						<Wand2 className="size-4" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-[10px] font-medium">Claude Sonnet 4.5</p>
						<p className="text-muted-foreground text-[8px]">Anthropic · 34ms</p>
					</div>
					<ChevronRight className="text-muted-foreground ml-auto size-3" />
				</DemoSurface>
				<DemoSurface className="space-y-1.5 p-2.5">
					<div className="flex items-center justify-between">
						<p className="text-[9px] font-medium">预算使用</p>
						<p className="font-mono text-[8px]">66%</p>
					</div>
					<MiniBar value={66} />
					<p className="text-muted-foreground text-[8px]">$5,280 / $8,000</p>
				</DemoSurface>
			</div>
		</div>
	);
}

function DashboardDemo() {
	return (
		<DemoSurface className="h-[228px]">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-[10px] font-semibold">概览</p>
					<p className="text-muted-foreground text-[8px]">最近 14 天运行情况</p>
				</div>
				<div className="bg-secondary flex rounded-md p-0.5 text-[7px]">
					<span className="rounded px-1.5 py-0.5">7 天</span>
					<span className="bg-card rounded px-1.5 py-0.5 shadow-sm">14 天</span>
				</div>
			</div>
			<div className="mt-2 grid grid-cols-4 gap-1.5">
				{[
					["请求", "1.28M"],
					["延迟", "214ms"],
					["成功率", "99.9%"],
					["Token", "1.92B"],
				].map(([label, value]) => (
					<div key={label} className="rounded-md border p-1.5">
						<p className="text-muted-foreground text-[7px]">{label}</p>
						<p className="text-[10px] font-semibold tabular-nums">{value}</p>
					</div>
				))}
			</div>
			<div className="mt-1.5 grid grid-cols-3 gap-1.5">
				<div className="col-span-2 rounded-md border p-2">
					<svg viewBox="0 0 200 50" className="h-[70px] w-full" preserveAspectRatio="none">
						<polygon points="0,50 0,40 20,36 40,42 60,28 80,32 100,20 120,24 140,14 160,18 180,8 200,12 200,50" fill="var(--chart-cat-1)" opacity="0.16" />
						<polyline points="0,40 20,36 40,42 60,28 80,32 100,20 120,24 140,14 160,18 180,8 200,12" fill="none" stroke="var(--chart-cat-1)" strokeWidth="1.5" />
					</svg>
				</div>
				<div className="space-y-1.5 rounded-md border p-2">
					{["GPT-4o 38%", "Claude 27%", "DeepSeek 18%"].map((item, index) => (
						<div key={item}>
							<p className="text-[7px]">{item}</p>
							<MiniBar value={[76, 54, 36][index]} className="mt-0.5 h-1" />
						</div>
					))}
				</div>
			</div>
		</DemoSurface>
	);
}

function DialogDemo() {
	const [open, setOpen] = useState(false);
	return (
		<DemoSurface className="flex h-[228px] flex-col items-center justify-center gap-2">
			<div className="text-muted-foreground grid size-10 place-items-center rounded-xl bg-secondary">
				<Trash2 className="size-5" />
			</div>
			<p className="text-xs font-medium">删除确认对话框</p>
			<p className="text-muted-foreground text-center text-[10px]">危险操作需要二次确认</p>
			<ReButton size="sm" variant="outline" className="mt-1" onClick={() => setOpen(true)}>
				打开 Dialog
			</ReButton>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="rounded-xl sm:max-w-[360px]">
					<DialogHeader>
						<DialogTitle className="text-base">删除项目「客服智能体」？</DialogTitle>
						<DialogDescription className="text-xs">该操作不可撤销，关联的 API Key 将立即失效。</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<ReButton variant="outline" size="sm" onClick={() => setOpen(false)}>取消</ReButton>
						<ReButton size="sm" variant="destructive" onClick={() => { setOpen(false); toast.success("项目已删除"); }}>确认删除</ReButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</DemoSurface>
	);
}

function EmptyStateDemo() {
	return (
		<DemoSurface className="flex h-[228px] flex-col items-center justify-center text-center">
			<div className="bg-secondary mb-3 grid size-12 place-items-center rounded-2xl">
				<FolderKanban className="text-muted-foreground size-5" />
			</div>
			<p className="text-xs font-semibold">还没有项目</p>
			<p className="text-muted-foreground mt-1 max-w-[180px] text-[10px] leading-4">创建第一个项目，开始接入模型提供商并管理预算。</p>
			<ReButton size="sm" className="mt-3 gap-1"><Plus className="size-3" /> 新建项目</ReButton>
		</DemoSurface>
	);
}

function EventCalendarDemo() {
	const weekdays = ["一", "二", "三", "四", "五", "六", "日"];
	const events: Record<number, { label: string; tone: string }> = {
		3: { label: "模型评审", tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
		8: { label: "Sprint 计划", tone: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
		14: { label: "发布窗口", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
		19: { label: "成本复盘", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
		24: { label: "团队同步", tone: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300" },
	};
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="2026 年 10 月" meta="事件日历 · 月视图" action={<ReBadge tone="outline">5 个事件</ReBadge>} />
			<div className="grid grid-cols-7 gap-0.5 text-center">
				{weekdays.map((day) => <span key={day} className="text-muted-foreground py-0.5 text-[8px]">{day}</span>)}
				{Array.from({ length: 35 }, (_, index) => {
					const day = index - 3;
					const valid = day >= 1 && day <= 31;
					const event = events[day];
					return (
						<div key={index} className={cn("h-6 rounded border border-transparent p-0.5 text-left", valid && "border-border/60", event && "ring-1 ring-primary/30")}>
							{valid && <span className="text-[7px] tabular-nums">{day}</span>}
							{event && <span className={cn("mt-0.5 block truncate rounded px-0.5 text-[5px] leading-2.5", event.tone)}>{event.label}</span>}
						</div>
					);
				})}
			</div>
		</DemoSurface>
	);
}

function FlowDemo() {
	return (
		<DemoSurface className="flex h-[228px] items-center justify-center">
			<svg viewBox="0 0 280 170" className="h-full w-full" aria-hidden>
				<defs>
					<marker id="flow-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
						<path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
					</marker>
				</defs>
				<path d="M70 42 H120" stroke="var(--muted-foreground)" strokeWidth="1" markerEnd="url(#flow-arrow)" />
				<path d="M180 42 H230" stroke="var(--muted-foreground)" strokeWidth="1" markerEnd="url(#flow-arrow)" />
				<path d="M150 66 V96" stroke="var(--muted-foreground)" strokeWidth="1" markerEnd="url(#flow-arrow)" />
				<path d="M150 124 V146" stroke="var(--muted-foreground)" strokeWidth="1" markerEnd="url(#flow-arrow)" />
				<rect x="10" y="24" width="60" height="36" rx="7" fill="var(--card)" stroke="var(--border)" />
				<text x="40" y="40" textAnchor="middle" fontSize="7" fill="var(--muted-foreground)">请求</text>
				<text x="40" y="50" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--foreground)">触发</text>
				<rect x="120" y="24" width="60" height="36" rx="7" fill="var(--primary)" />
				<text x="150" y="40" textAnchor="middle" fontSize="7" fill="var(--primary-foreground)" opacity="0.7">模型路由</text>
				<text x="150" y="50" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--primary-foreground)">Claude</text>
				<rect x="230" y="24" width="40" height="36" rx="7" fill="var(--card)" stroke="var(--border)" />
				<text x="250" y="45" textAnchor="middle" fontSize="8" fill="var(--foreground)">成功</text>
				<rect x="120" y="96" width="60" height="28" rx="7" fill="var(--card)" stroke="var(--border)" />
				<text x="150" y="113" textAnchor="middle" fontSize="8" fill="var(--foreground)">重试 / 降级</text>
				<rect x="110" y="146" width="80" height="20" rx="10" fill="var(--secondary)" />
				<text x="150" y="159" textAnchor="middle" fontSize="7" fill="var(--muted-foreground)">告警与审计日志</text>
				<circle cx="150" cy="66" r="2" fill="var(--chart-cat-5)" />
			</svg>
		</DemoSurface>
	);
}

function FormDemo() {
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="创建提供商连接" meta="表单校验 · zod" action={<ReBadge tone="outline">Form</ReBadge>} />
			<div className="space-y-2">
				<div className="grid grid-cols-2 gap-2">
					<div>
						<Label className="text-[8px]">显示名称</Label>
						<Input defaultValue="Anthropic 生产" className="mt-0.5 h-7 rounded-md text-[9px]" />
					</div>
					<div>
						<Label className="text-[8px]">区域</Label>
						<Select defaultValue="us-east-1">
							<SelectTrigger className="mt-0.5 h-7 w-full rounded-md text-[9px]"><SelectValue /></SelectTrigger>
							<SelectContent className="rounded-lg"><SelectItem value="us-east-1">us-east-1</SelectItem><SelectItem value="eu-central-1">eu-central-1</SelectItem></SelectContent>
						</Select>
					</div>
				</div>
				<div>
					<Label className="text-[8px]">API Key</Label>
					<Input defaultValue="sk-ant-••••••••" className="mt-0.5 h-7 rounded-md font-mono text-[9px]" />
				</div>
				<div className="rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1 text-[8px] text-destructive">密钥格式不正确，应以 sk-ant- 开头</div>
				<div className="flex justify-end gap-1.5 pt-0.5">
					<ReButton size="sm" variant="outline" className="h-6 px-2 text-[8px]">取消</ReButton>
					<ReButton size="sm" className="h-6 px-2 text-[8px]">保存连接</ReButton>
				</div>
			</div>
		</DemoSurface>
	);
}

function GanttDemo() {
	const rows = [
		{ label: "网关限流", start: 1, span: 4, tone: "bg-blue-500", owner: "王" },
		{ label: "审计导出", start: 3, span: 5, tone: "bg-violet-500", owner: "林" },
		{ label: "成本看板", start: 6, span: 4, tone: "bg-emerald-500", owner: "周" },
		{ label: "SSO 接入", start: 8, span: 4, tone: "bg-amber-500", owner: "陈" },
	];
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="Sprint 42 时间线" meta="甘特图 · 12 周" action={<ReBadge tone="outline">4 项</ReBadge>} />
			<div className="space-y-1.5">
				<div className="grid grid-cols-[56px_1fr] gap-2">
					<span className="text-muted-foreground text-[7px]">任务</span>
					<div className="grid grid-cols-12 gap-px">
						{Array.from({ length: 12 }, (_, index) => (
							<span key={index} className="text-muted-foreground text-center text-[6px] tabular-nums">{index + 1}</span>
						))}
					</div>
				</div>
				{rows.map((row) => (
					<div key={row.label} className="grid grid-cols-[56px_1fr] items-center gap-2">
						<div className="flex items-center gap-1">
							<MiniAvatar name={row.owner} className="size-3.5 text-[6px]" />
							<span className="truncate text-[8px]">{row.label}</span>
						</div>
						<div className="bg-secondary relative h-4 rounded">
							<div className={cn("absolute inset-y-0 rounded", row.tone)} style={{ left: `${((row.start - 1) / 12) * 100}%`, width: `${(row.span / 12) * 100}%` }} />
						</div>
					</div>
				))}
			</div>
			<div className="mt-3 flex items-center gap-2 border-t pt-2 text-[7px] text-muted-foreground">
				<span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-blue-500" />进行中</span>
				<span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-violet-500" />计划中</span>
				<span className="ml-auto">今天：第 7 周</span>
			</div>
		</DemoSurface>
	);
}

function KanbanDemo() {
	const columns = [
		{ label: "待办", tone: "bg-zinc-400", cards: ["接入 Gemini 2.5", "审计筛选"] },
		{ label: "进行中", tone: "bg-blue-500", cards: ["重试策略"] },
		{ label: "完成", tone: "bg-emerald-500", cards: ["Prompt 缓存"] },
	];
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="Mini Kanban" meta="拖拽版见完整看板页" action={<Link to="/reui/kanban" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 text-[8px]">打开<ArrowUpRight className="size-2.5" /></Link>} />
			<div className="grid grid-cols-3 gap-1.5">
				{columns.map((column) => (
					<div key={column.label} className="rounded-lg bg-secondary/60 p-1.5">
						<div className="flex items-center gap-1">
							<span className={cn("size-1 rounded-full", column.tone)} />
							<span className="text-[8px] font-medium">{column.label}</span>
							<span className="text-muted-foreground ml-auto font-mono text-[7px]">{column.cards.length}</span>
						</div>
						<div className="mt-1 space-y-1">
							{column.cards.map((card) => (
								<div key={card} className="rounded-md border bg-card p-1.5">
									<span className="text-[7px] leading-3">{card}</span>
									<div className="mt-1.5 flex items-center justify-between">
										<MiniAvatar name={card} className="size-3 text-[5px]" />
										<span className="text-muted-foreground text-[6px]">10 月</span>
									</div>
								</div>
							))}
							<div className="grid h-4 place-items-center rounded border border-dashed text-[6px] text-muted-foreground">
								<Plus className="size-2" />
							</div>
						</div>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function ListDemo() {
	const rows = [
		{ title: "客户反馈分析", meta: "Anthropic · 128K 请求", badge: "运行中", tone: "success" as const, initials: "陈" },
		{ title: "代码审查助手", meta: "OpenAI · 265K 请求", badge: "运行中", tone: "success" as const, initials: "王" },
		{ title: "知识库问答", meta: "DeepSeek · 92K 请求", badge: "已暂停", tone: "warning" as const, initials: "林" },
		{ title: "营销文案生成", meta: "Google · 198K 请求", badge: "草稿", tone: "outline" as const, initials: "周" },
	];
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="项目列表" meta="List · 行级操作" action={<ReBadge tone="outline">4 项</ReBadge>} />
			<ul className="divide-y">
				{rows.map((row) => (
					<li key={row.title} className="flex items-center gap-2 py-1.5 first:pt-0 last:pb-0">
						<span className="bg-secondary grid size-6 place-items-center rounded-full text-[8px] font-semibold">{row.initials}</span>
						<div className="min-w-0 flex-1">
							<p className="truncate text-[9px] font-medium">{row.title}</p>
							<p className="text-muted-foreground truncate text-[7px]">{row.meta}</p>
						</div>
						<ReBadge dot tone={row.tone} className="h-4 px-1 text-[7px]">{row.badge}</ReBadge>
						<Ellipsis className="text-muted-foreground size-3" />
					</li>
				))}
			</ul>
		</DemoSurface>
	);
}

function NavbarDemo() {
	return (
		<DemoSurface className="h-[228px] p-0">
			<div className="flex h-9 items-center gap-2 border-b px-3">
				<span className="bg-primary text-primary-foreground grid size-5 place-items-center rounded"><Sparkles className="size-2.5" /></span>
				<span className="text-[9px] font-semibold">Nova</span>
				<nav className="ml-3 hidden items-center gap-2 text-[8px] text-muted-foreground sm:flex">
					<span className="text-foreground font-medium">概览</span><span>项目</span><span>模型</span><span>团队</span>
				</nav>
				<div className="ml-auto flex items-center gap-1.5">
					<div className="bg-secondary hidden h-5 w-24 items-center gap-1 rounded-md px-1.5 text-[7px] text-muted-foreground sm:flex"><Search className="size-2.5" />搜索…</div>
					<div className="bg-primary size-5 rounded-full text-center text-[7px] leading-5 text-primary-foreground">陈</div>
				</div>
			</div>
			<div className="space-y-2 p-3">
				<div className="h-5 w-24 rounded bg-foreground/80" />
				<div className="h-2 w-40 rounded bg-secondary" />
				<div className="mt-3 flex gap-1.5">
					<div className="bg-primary h-5 w-16 rounded-md" />
					<div className="h-5 w-16 rounded-md border" />
				</div>
				<div className="mt-3 grid grid-cols-3 gap-1.5">
					{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-8 rounded-md border bg-secondary/40" />)}
				</div>
			</div>
		</DemoSurface>
	);
}

function OnboardingDemo() {
	const steps = [
		{ label: "创建账号", done: true },
		{ label: "连接提供商", done: true },
		{ label: "创建第一个项目", done: false },
		{ label: "邀请团队成员", done: false },
	];
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="开始使用 Nova" meta="3 / 5 已完成" action={<ReBadge tone="warning">50%</ReBadge>} />
			<MiniBar value={60} className="mb-3 h-1.5" />
			<ul className="space-y-1.5">
				{steps.map((step, index) => (
					<li key={step.label} className={cn("flex items-center gap-2 rounded-lg border px-2 py-1.5", step.done ? "bg-secondary/40" : "bg-card")}>
						<span className={cn("grid size-4 place-items-center rounded-full border text-[6px]", step.done ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground")}>
							{step.done ? <Check className="size-2.5" /> : index + 1}
						</span>
						<span className={cn("text-[8px]", step.done ? "text-muted-foreground line-through" : "font-medium")}>{step.label}</span>
						{!step.done && <ArrowRight className="ml-auto size-2.5 text-muted-foreground" />}
					</li>
				))}
			</ul>
			<ReButton size="sm" className="mt-2 h-6 w-full text-[8px]">继续设置</ReButton>
		</DemoSurface>
	);
}

function ProfileDemo() {
	return (
		<DemoSurface className="h-[228px] p-0">
			<div className="h-12 rounded-t-xl bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-transparent" />
			<div className="px-3">
				<div className="-mt-4 flex items-end justify-between">
					<span className="bg-primary text-primary-foreground grid size-9 place-items-center rounded-full border-2 border-card text-xs font-semibold">陈</span>
					<ReButton size="sm" variant="outline" className="h-5 gap-1 px-1.5 text-[7px]"><Pencil className="size-2" />编辑资料</ReButton>
				</div>
				<p className="mt-1 text-[10px] font-semibold">陈晓</p>
				<p className="text-muted-foreground text-[7px]">平台组 · 所有者 · chen.xiao@nova.dev</p>
				<div className="mt-2 flex gap-1.5">
					{["概览", "活动", "API 密钥"].map((tab, index) => (
						<span key={tab} className={cn("rounded-md px-1.5 py-0.5 text-[7px]", index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{tab}</span>
					))}
				</div>
				<div className="mt-2 grid grid-cols-3 gap-1.5">
					{[
						["项目", "8"],
						["请求", "1.2M"],
						["成员", "7"],
					].map(([label, value]) => (
						<div key={label} className="rounded-md border p-1.5 text-center">
							<p className="text-[10px] font-semibold tabular-nums">{value}</p>
							<p className="text-muted-foreground text-[6px]">{label}</p>
						</div>
					))}
				</div>
				<div className="mt-2 space-y-1">
					<div className="flex items-center gap-1.5 text-[7px]"><span className="size-1 rounded-full bg-emerald-500" />创建了 API Key「ci-pipeline」<span className="text-muted-foreground ml-auto">1 小时前</span></div>
					<div className="flex items-center gap-1.5 text-[7px]"><span className="size-1 rounded-full bg-blue-500" />加入了项目「客服智能体」<span className="text-muted-foreground ml-auto">昨天</span></div>
				</div>
			</div>
		</DemoSurface>
	);
}

function RichTextDemo() {
	return (
		<DemoSurface className="h-[228px] p-0">
			<div className="flex items-center gap-0.5 border-b px-2 py-1.5">
				{[
					{ icon: Bold, label: "加粗" },
					{ icon: Italic, label: "斜体" },
					{ icon: Underline, label: "下划线" },
					{ icon: Code2, label: "代码" },
				].map(({ icon: Icon, label }) => (
					<button key={label} type="button" aria-label={label} onClick={() => toast.info(`富文本：${label}`)} className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-5 cursor-pointer place-items-center rounded">
						<Icon className="size-2.5" />
					</button>
				))}
				<span className="mx-1 h-3 w-px bg-border" />
				<span className="text-muted-foreground text-[6px]">正文</span>
				<span className="ml-auto flex items-center gap-0.5 text-[6px] text-muted-foreground"><span className="bg-secondary rounded px-1 py-0.5">H1</span><span className="bg-secondary rounded px-1 py-0.5">H2</span></span>
			</div>
			<div className="p-3 text-[8px] leading-4">
				<p className="font-semibold">模型接入规范 v2.1</p>
				<p className="text-muted-foreground mt-1">所有新 provider 必须实现 <code className="bg-secondary rounded px-0.5 font-mono text-[7px]">stream()</code> 与 <code className="bg-secondary rounded px-0.5 font-mono text-[7px]">countTokens()</code> 接口。</p>
				<ul className="mt-1 list-disc pl-3 text-muted-foreground">
					<li>错误码遵循统一网关约定</li>
					<li>请求体需经过 schema 校验</li>
					<li>超时与重试由网关层统一处理</li>
				</ul>
				<div className="mt-2 rounded-md border-l-2 border-primary bg-secondary/50 px-2 py-1 text-[7px] text-muted-foreground">提示：使用 <span className="text-foreground">@nova/sdk</span> 可自动生成类型定义。</div>
			</div>
		</DemoSurface>
	);
}

function ScheduleDemo() {
	const days = ["周一", "周二", "周三", "周四", "周五"];
	const events = [
		{ day: 1, start: 1, span: 2, label: "网关周会", tone: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
		{ day: 2, start: 3, span: 2, label: "模型评审", tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
		{ day: 3, start: 2, span: 3, label: "Sprint 计划", tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
		{ day: 4, start: 5, span: 2, label: "成本复盘", tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
		{ day: 5, start: 4, span: 1, label: "发布窗口", tone: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
	];
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="本周日程" meta="Schedule · 工作日视图" action={<ReBadge tone="outline">5 个会议</ReBadge>} />
			<div className="grid grid-cols-[26px_1fr] gap-1">
				<div className="space-y-1">
					{["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"].map((time) => (
						<span key={time} className="text-muted-foreground block h-6 text-[6px] leading-6 tabular-nums">{time}</span>
					))}
				</div>
				<div>
					<div className="grid grid-cols-5 gap-1">
						{days.map((day) => <span key={day} className="text-muted-foreground text-center text-[7px]">{day}</span>)}
					</div>
					<div className="mt-1 grid grid-cols-5 grid-rows-6 gap-1" style={{ height: 168 }}>
						{days.map((day, dayIndex) => (
							<div key={day} className="relative rounded bg-secondary/40" style={{ gridColumn: dayIndex + 1, gridRow: "1 / span 6" }}>
								{events.filter((event) => event.day === dayIndex).map((event) => (
									<div
										key={event.label}
										className={cn("absolute inset-x-0.5 rounded px-0.5 py-0.5 text-[6px] leading-3", event.tone)}
										style={{ top: `${((event.start - 1) / 6) * 100}%`, height: `${(event.span / 6) * 100}%` }}
									>
										{event.label}
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</DemoSurface>
	);
}

function SettingsDemo() {
	const [state, setState] = useState({ twoFactor: true, sso: false, digest: true });
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="安全设置" meta="Settings · 行式布局" action={<ReBadge tone="outline">3 项</ReBadge>} />
			<div className="divide-y">
				{[
					{ key: "twoFactor" as const, label: "强制双因素认证", desc: "所有成员必须启用 2FA" },
					{ key: "sso" as const, label: "强制 SSO 登录", desc: "仅允许 SAML 身份提供商" },
					{ key: "digest" as const, label: "每周用量摘要", desc: "每周一发送成本摘要" },
				].map((row) => (
					<div key={row.key} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
						<div>
							<p className="text-[9px] font-medium">{row.label}</p>
							<p className="text-muted-foreground text-[7px]">{row.desc}</p>
						</div>
						<Switch checked={state[row.key]} onCheckedChange={(checked) => setState((current) => ({ ...current, [row.key]: checked }))} />
					</div>
				))}
			</div>
			<div className="mt-2 rounded-md border border-dashed p-1.5 text-[7px] text-muted-foreground">
				会话有效期 <span className="text-foreground font-medium">12 小时</span> · IP 允许列表 2 条
			</div>
		</DemoSurface>
	);
}

function SheetDemo() {
	return (
		<DemoSurface className="relative h-[228px] overflow-hidden p-0">
			<div className="absolute inset-0 bg-secondary/30" />
			<div className="bg-card absolute inset-y-0 right-0 w-[72%] border-l p-3 shadow-xl">
				<div className="flex items-center justify-between">
					<p className="text-[10px] font-semibold">创建 API 密钥</p>
					<span className="text-muted-foreground grid size-4 place-items-center rounded">×</span>
				</div>
				<p className="text-muted-foreground mt-1 text-[7px]">密钥只会展示一次，请妥善保存。</p>
				<div className="mt-2 space-y-1.5">
					<div>
						<Label className="text-[7px]">名称</Label>
						<Input defaultValue="生产环境" className="mt-0.5 h-6 rounded-md text-[8px]" />
					</div>
					<div>
						<Label className="text-[7px]">作用域</Label>
						<div className="mt-0.5 flex flex-wrap gap-1">
							{["inference", "models", "logs"].map((scope) => <span key={scope} className="bg-secondary rounded px-1 py-0.5 font-mono text-[6px]">{scope}</span>)}
						</div>
					</div>
					<div>
						<Label className="text-[7px]">有效期</Label>
						<div className="border-input mt-0.5 flex h-6 items-center rounded-md border px-1.5 text-[8px] text-muted-foreground">90 天</div>
					</div>
				</div>
				<div className="absolute inset-x-3 bottom-2 flex justify-end gap-1">
					<ReButton size="sm" variant="outline" className="h-5 px-1.5 text-[7px]">取消</ReButton>
					<ReButton size="sm" className="h-5 px-1.5 text-[7px]">创建</ReButton>
				</div>
			</div>
		</DemoSurface>
	);
}

function StatsDemo() {
	const stats = [
		{ label: "请求数", value: "1.28M", delta: "+12.4%", tone: "bg-blue-500", spark: [30, 36, 34, 42, 48, 46, 54, 60] },
		{ label: "延迟", value: "214ms", delta: "-6.4%", tone: "bg-emerald-500", spark: [60, 56, 58, 52, 48, 44, 42, 38] },
		{ label: "成功率", value: "99.94%", delta: "+0.02%", tone: "bg-violet-500", spark: [52, 54, 53, 58, 60, 59, 64, 66] },
		{ label: "成本", value: "$7.4K", delta: "+8.2%", tone: "bg-amber-500", spark: [32, 38, 36, 44, 42, 50, 54, 58] },
	];
	return (
		<DemoSurface className="h-[228px]">
			<div className="grid h-full grid-cols-2 gap-2">
				{stats.map((stat) => (
					<div key={stat.label} className="flex flex-col justify-between rounded-lg border p-2">
						<div className="flex items-center gap-1.5">
							<span className={cn("size-1.5 rounded-full", stat.tone)} />
							<span className="text-muted-foreground text-[7px]">{stat.label}</span>
							<span className="text-muted-foreground ml-auto font-mono text-[6px]">{stat.delta}</span>
						</div>
						<p className="text-sm font-semibold tabular-nums">{stat.value}</p>
						<svg viewBox="0 0 80 16" className="h-4 w-full" preserveAspectRatio="none">
							<polyline points={stat.spark.map((value, index) => `${(index / (stat.spark.length - 1)) * 80},${16 - (value / 80) * 14}`).join(" ")} fill="none" stroke="currentColor" className={cn(stat.tone.replace("bg-", "text-"))} strokeWidth="1.5" />
						</svg>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function TimelineDemo() {
	const items = [
		{ title: "部署 v2.4.1 到生产环境", time: "今天 14:32", tone: "bg-emerald-500", icon: CheckCircle2 },
		{ title: "林嘉提交了预算告警评审", time: "今天 13:05", tone: "bg-violet-500", icon: FileText },
		{ title: "us-west-2 延迟短暂升高", time: "今天 09:18", tone: "bg-amber-500", icon: Activity },
		{ title: "创建 API Key「ci-pipeline」", time: "昨天 18:44", tone: "bg-blue-500", icon: Code2 },
	];
	return (
		<DemoSurface className="h-[228px]">
			<DemoHeader title="审计时间线" meta="Timeline · 最近事件" action={<ReBadge tone="outline">4 条</ReBadge>} />
			<ol className="relative ml-1 space-y-2.5 border-l pl-3">
				{items.map((item) => {
					const Icon = item.icon;
					return (
						<li key={item.title} className="relative">
							<span className={cn("absolute -left-[17px] top-0.5 grid size-3 place-items-center rounded-full text-white", item.tone)}>
								<Icon className="size-2" />
							</span>
							<p className="text-[8px] leading-3">{item.title}</p>
							<p className="text-muted-foreground mt-0.5 text-[6px]">{item.time}</p>
						</li>
					);
				})}
			</ol>
		</DemoSurface>
	);
}

function WhiteboardDemo() {
	return (
		<DemoSurface className="reui-dot-grid relative h-[228px] overflow-hidden">
			<svg className="absolute inset-0 h-full w-full" aria-hidden>
				<path d="M80 60 C 120 60, 130 120, 170 120" fill="none" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="3 3" />
				<path d="M200 105 C 220 85, 230 70, 250 70" fill="none" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="3 3" />
			</svg>
			<div className="absolute top-5 left-4 w-24 rotate-[-3deg] rounded-md border bg-amber-200/80 p-2 text-[7px] text-amber-950 shadow-sm">
				<p className="font-semibold">Q4 目标</p>
				<p className="mt-1 leading-3">统一网关接入 8 家提供商</p>
			</div>
			<div className="absolute top-16 left-28 w-24 rotate-[2deg] rounded-md border bg-blue-200/80 p-2 text-[7px] text-blue-950 shadow-sm">
				<p className="font-semibold">风险</p>
				<p className="mt-1 leading-3">Gemini 流式适配延期</p>
			</div>
			<div className="absolute top-24 right-5 w-24 rotate-[-2deg] rounded-md border bg-emerald-200/80 p-2 text-[7px] text-emerald-950 shadow-sm">
				<p className="font-semibold">已完成</p>
				<p className="mt-1 leading-3">Prompt Caching 上线</p>
			</div>
			<div className="absolute bottom-3 left-4 flex items-center gap-1 rounded-md border bg-card px-1.5 py-1 text-[7px] shadow-sm">
				<Wand2 className="size-2.5" /> 正在协作 · 3 人
			</div>
		</DemoSurface>
	);
}

function WizardDemo() {
	const [step, setStep] = useState(1);
	const steps = ["基本信息", "模型配置", "预算", "确认"];
	return (
		<DemoSurface className="h-[228px]">
			<div className="flex items-center gap-1">
				{steps.map((label, index) => (
					<div key={label} className="flex flex-1 items-center gap-1">
						<span className={cn("grid size-4 shrink-0 place-items-center rounded-full border text-[6px]", index + 1 <= step ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground")}>
							{index + 1 < step ? <Check className="size-2" /> : index + 1}
						</span>
						<span className={cn("truncate text-[6px]", index + 1 === step ? "font-medium" : "text-muted-foreground")}>{label}</span>
						{index < steps.length - 1 && <span className={cn("h-px flex-1", index + 1 < step ? "bg-primary" : "bg-border")} />}
					</div>
				))}
			</div>
			<div className="mt-2.5 rounded-lg border p-2.5">
				{step === 1 && (
					<div className="space-y-1.5">
						<div><Label className="text-[7px]">项目名称</Label><Input defaultValue="客服智能体" className="mt-0.5 h-6 rounded-md text-[8px]" /></div>
						<div><Label className="text-[7px]">描述</Label><Input placeholder="一句话说明用途" className="mt-0.5 h-6 rounded-md text-[8px]" /></div>
					</div>
				)}
				{step === 2 && (
					<div className="space-y-1.5">
						{["Anthropic · Claude Sonnet 4.5", "OpenAI · GPT-4o", "DeepSeek · V3"].map((model, index) => (
							<div key={model} className={cn("flex items-center gap-1.5 rounded-md border px-2 py-1 text-[7px]", index === 0 && "border-primary bg-secondary/50")}>
								<span className={cn("grid size-3 place-items-center rounded-full border", index === 0 && "border-primary bg-primary text-primary-foreground")}>{index === 0 && <Check className="size-1.5" />}</span>
								{model}
							</div>
						))}
					</div>
				)}
				{step === 3 && (
					<div className="space-y-2">
						<div className="flex items-center justify-between"><span className="text-[7px]">月度预算</span><span className="text-[10px] font-semibold">$2,000</span></div>
						<MiniBar value={40} />
						<div className="grid grid-cols-3 gap-1">{[500, 1000, 2000].map((value) => <div key={value} className={cn("rounded border py-1 text-center text-[7px]", value === 2000 && "border-primary bg-secondary/50")}>${value}</div>)}</div>
					</div>
				)}
				{step === 4 && (
					<div className="space-y-1 text-[7px]">
						<div className="flex justify-between"><span className="text-muted-foreground">项目</span><span>客服智能体</span></div>
						<div className="flex justify-between"><span className="text-muted-foreground">模型</span><span>Claude Sonnet 4.5</span></div>
						<div className="flex justify-between"><span className="text-muted-foreground">月度预算</span><span>$2,000</span></div>
						<div className="mt-1.5 rounded-md bg-emerald-500/10 px-2 py-1 text-[7px] text-emerald-700 dark:text-emerald-300">配置检查通过，可以创建项目。</div>
					</div>
				)}
			</div>
			<div className="mt-2 flex items-center justify-between">
				<ReButton size="sm" variant="outline" className="h-5 px-1.5 text-[7px]" disabled={step === 1} onClick={() => setStep((value) => Math.max(1, value - 1))}>上一步</ReButton>
				<span className="text-muted-foreground text-[6px]">第 {step} / 4 步</span>
				<ReButton size="sm" className="h-5 px-1.5 text-[7px]" onClick={() => (step === 4 ? toast.success("项目已创建") : setStep((value) => value + 1))}>{step === 4 ? "创建项目" : "下一步"}</ReButton>
			</div>
		</DemoSurface>
	);
}

export function ApplicationBlocks() {
	return (
		<GalleryGrid>
			<BlockCard title="App Shell" category="application" description="侧边栏 + 顶栏 + 内容区的后台外壳。" badge="app-shell">
				<AppShellDemo />
			</BlockCard>
			<BlockCard title="Auth" category="application" description="登录 / 注册分栏布局与社交登录。" badge="auth">
				<AuthDemo />
			</BlockCard>
			<BlockCard title="Card" category="application" description="统计卡、内容卡与操作卡组合。" badge="card">
				<CardDemo />
			</BlockCard>
			<BlockCard title="Dashboard" category="application" description="指标、趋势与模型占比概览。" badge="dashboard">
				<DashboardDemo />
			</BlockCard>
			<BlockCard title="Dialog" category="application" description="危险操作二次确认，带遮罩与焦点管理。" badge="dialog">
				<DialogDemo />
			</BlockCard>
			<BlockCard title="Empty State" category="application" description="零数据引导与主操作入口。" badge="empty-state">
				<EmptyStateDemo />
			</BlockCard>
			<BlockCard title="Event Calendar" category="application" description="月视图事件日历，含多色事件标记。" badge="event-calendar">
				<EventCalendarDemo />
			</BlockCard>
			<BlockCard title="Flow" category="application" description="请求路由与降级流程节点图。" badge="flow">
				<FlowDemo />
			</BlockCard>
			<BlockCard title="Form" category="application" description="带校验状态与操作区的配置表单。" badge="form">
				<FormDemo />
			</BlockCard>
			<BlockCard title="Gantt" category="application" description="多任务排期与周时间刻度。" badge="gantt">
				<GanttDemo />
			</BlockCard>
			<BlockCard title="Kanban" category="application" description="三列迷你看板，完整拖拽版见看板页。" badge="kanban-board">
				<KanbanDemo />
			</BlockCard>
			<BlockCard title="List" category="application" description="头像、状态与行级操作的紧凑列表。" badge="list">
				<ListDemo />
			</BlockCard>
			<BlockCard title="Navbar" category="application" description="品牌、导航、搜索与账户入口。" badge="navbar">
				<NavbarDemo />
			</BlockCard>
			<BlockCard title="Onboarding" category="application" description="分步引导与完成进度追踪。" badge="onboarding">
				<OnboardingDemo />
			</BlockCard>
			<BlockCard title="Profile" category="application" description="个人资料头部、统计与活动记录。" badge="profile">
				<ProfileDemo />
			</BlockCard>
			<BlockCard title="Rich Text Editor" category="application" description="工具栏与文档内容排版示例。" badge="rich-text-editor">
				<RichTextDemo />
			</BlockCard>
			<BlockCard title="Schedule" category="application" description="工作日时间网格与会议事件。" badge="schedule">
				<ScheduleDemo />
			</BlockCard>
			<BlockCard title="Settings" category="application" description="行式设置项与实时开关。" badge="settings">
				<SettingsDemo />
			</BlockCard>
			<BlockCard title="Sheet" category="application" description="右侧滑出面板的表单与操作区。" badge="sheet">
				<SheetDemo />
			</BlockCard>
			<BlockCard title="Stats" category="application" description="四宫格指标卡与迷你趋势线。" badge="stats">
				<StatsDemo />
			</BlockCard>
			<BlockCard title="Timeline" category="application" description="审计事件时间线与状态色彩。" badge="timeline">
				<TimelineDemo />
			</BlockCard>
			<BlockCard title="Whiteboard" category="application" description="便签、连线与协作状态。" badge="whiteboard">
				<WhiteboardDemo />
			</BlockCard>
			<BlockCard title="Wizard" category="application" description="四步向导，可点击前进与后退。" badge="wizard">
				<WizardDemo />
			</BlockCard>
		</GalleryGrid>
	);
}
