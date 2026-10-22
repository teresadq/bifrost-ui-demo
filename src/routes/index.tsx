import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	ArrowUpRight,
	Check,
	Command,
	GitBranch,
	Layers,
	LayoutDashboard,
	PanelsTopLeft,
	Server,
	Sparkles,
	SquareKanban,
	SwatchBook,
} from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
	component: StyleChooserPage,
});

function BifrostPreview() {
	return (
		<div className="relative h-[210px] overflow-hidden rounded-lg border border-zinc-200 bg-[#f4f4f5] text-zinc-900">
			<div className="flex h-full">
				<div className="w-[54px] shrink-0 border-r border-zinc-200 bg-[#fafafa] p-2">
					<div className="flex items-center gap-1">
						<span className="size-3 rounded-sm bg-[oklch(0.5081_0.1049_165.61)]" />
						<span className="h-1 w-5 rounded bg-zinc-300" />
					</div>
					<div className="mt-3 space-y-1.5">
						<div className="h-1.5 w-8 rounded bg-zinc-300" />
						<div className="h-1.5 w-9 rounded bg-zinc-200" />
						<div className="h-1.5 w-7 rounded bg-zinc-200" />
						<div className="h-1.5 w-10 rounded bg-zinc-200" />
						<div className="h-1.5 w-8 rounded bg-zinc-200" />
					</div>
					<div className="mt-auto" />
				</div>
				<div className="min-w-0 flex-1 p-2.5">
					<div className="flex items-center justify-between">
						<div>
							<div className="h-1.5 w-10 rounded bg-zinc-400" />
							<div className="mt-1 h-1 w-16 rounded bg-zinc-300" />
						</div>
						<div className="flex gap-1">
							<div className="h-4 w-10 rounded-sm border border-zinc-300 bg-white" />
							<div className="h-4 w-10 rounded-sm bg-[oklch(0.5081_0.1049_165.61)]" />
						</div>
					</div>
					<div className="mt-2.5 grid grid-cols-4 gap-1.5">
						{["bg-[oklch(0.5081_0.1049_165.61)]", "bg-indigo-400", "bg-amber-400", "bg-zinc-300"].map((color, index) => (
							<div key={index} className="rounded-sm border border-zinc-200 bg-white p-1.5">
								<div className="h-1 w-6 rounded bg-zinc-300" />
								<div className="mt-1 h-2 w-8 rounded bg-zinc-500" />
								<div className={cn("mt-1.5 h-1 w-full rounded", color)} />
							</div>
						))}
					</div>
					<div className="mt-2 rounded-sm border border-zinc-200 bg-white p-2">
						<div className="flex items-center justify-between">
							<div className="h-1 w-10 rounded bg-zinc-400" />
							<div className="h-1 w-6 rounded bg-zinc-200" />
						</div>
						<svg viewBox="0 0 200 54" className="mt-2 h-12 w-full" preserveAspectRatio="none">
							<defs>
								<linearGradient id="chooser-bifrost-fill" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#0f766e" stopOpacity="0.25" />
									<stop offset="100%" stopColor="#0f766e" stopOpacity="0" />
								</linearGradient>
							</defs>
							<polygon points="0,54 0,40 20,36 40,42 60,28 80,32 100,20 120,24 140,14 160,18 180,8 200,12 200,54" fill="url(#chooser-bifrost-fill)" />
							<polyline
								points="0,40 20,36 40,42 60,28 80,32 100,20 120,24 140,14 160,18 180,8 200,12"
								fill="none"
								stroke="#0f766e"
								strokeWidth="1.5"
							/>
						</svg>
					</div>
				</div>
			</div>
			<div className="absolute top-2 right-2 rounded bg-white/80 px-1.5 py-0.5 font-mono text-[8px] text-zinc-500 backdrop-blur">
				Geist · radius 8
			</div>
		</div>
	);
}

function ReuiPreview() {
	return (
		<div className="relative h-[210px] overflow-hidden rounded-lg border border-zinc-200 bg-[#fbfbfb] text-zinc-900">
			<div className="flex h-full">
				<div className="w-[54px] shrink-0 border-r border-zinc-200 bg-white p-2">
					<div className="flex items-center gap-1">
						<span className="grid size-3.5 place-items-center rounded bg-zinc-900">
							<Sparkles className="size-2 text-white" />
						</span>
						<span className="h-1 w-5 rounded bg-zinc-300" />
					</div>
					<div className="mt-3 space-y-1.5">
						<div className="flex h-4 items-center gap-1 rounded-md bg-zinc-900 px-1.5">
							<div className="size-1 rounded bg-white/70" />
							<div className="h-1 w-5 rounded bg-white/70" />
						</div>
						<div className="flex h-4 items-center gap-1 px-1.5">
							<div className="size-1 rounded bg-zinc-400" />
							<div className="h-1 w-6 rounded bg-zinc-300" />
						</div>
						<div className="flex h-4 items-center gap-1 px-1.5">
							<div className="size-1 rounded bg-zinc-400" />
							<div className="h-1 w-5 rounded bg-zinc-200" />
						</div>
					</div>
				</div>
				<div className="min-w-0 flex-1 p-2.5">
					<div className="flex items-center justify-between">
						<div>
							<div className="h-1.5 w-10 rounded bg-zinc-700" />
							<div className="mt-1 h-1 w-16 rounded bg-zinc-300" />
						</div>
						<div className="flex items-center gap-1">
							<div className="h-4 w-8 rounded-lg border border-zinc-200 bg-white" />
							<div className="h-4 w-9 rounded-lg bg-zinc-900" />
						</div>
					</div>
					<div className="mt-2.5 grid grid-cols-3 gap-1.5">
						{[
							{ tone: "bg-zinc-50 border-zinc-200", badge: "bg-amber-100", dot: "bg-zinc-400" },
							{ tone: "bg-blue-50/70 border-blue-100", badge: "bg-rose-100", dot: "bg-blue-500" },
							{ tone: "bg-emerald-50/60 border-emerald-100", badge: "bg-emerald-100", dot: "bg-emerald-500" },
						].map((column, index) => (
							<div key={index} className={cn("rounded-lg border p-1.5", column.tone)}>
								<div className="flex items-center gap-1">
									<span className={cn("size-1 rounded-full", column.dot)} />
									<div className="h-1 w-5 rounded bg-zinc-300" />
								</div>
								<div className="mt-1.5 space-y-1">
									<div className="rounded-md border border-zinc-200 bg-white p-1.5 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
										<div className={cn("h-1 w-7 rounded", column.badge)} />
										<div className="mt-1 h-1 w-full rounded bg-zinc-300" />
										<div className="mt-0.5 h-1 w-3/4 rounded bg-zinc-200" />
										<div className="mt-1.5 flex items-center gap-1">
											<div className="size-1.5 rounded-full bg-zinc-300" />
											<div className="h-0.5 w-4 rounded bg-zinc-200" />
										</div>
									</div>
									<div className="rounded-md border border-zinc-200 bg-white p-1.5">
										<div className="h-1 w-6 rounded bg-zinc-200" />
										<div className="mt-1 h-1 w-full rounded bg-zinc-200" />
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="absolute top-2 right-2 rounded bg-white/80 px-1.5 py-0.5 font-mono text-[8px] text-zinc-500 backdrop-blur">
				Inter · radius 10
			</div>
		</div>
	);
}

function HtmxPreview() {
	return (
		<div className="relative h-[210px] overflow-hidden rounded-lg border border-zinc-200 bg-[#f4f4f5] text-zinc-900">
			<div className="flex h-full">
				<div className="w-[54px] shrink-0 border-r border-zinc-200 bg-[#fafafa] p-2">
					<div className="flex items-center gap-1">
						<span className="size-3 rounded-sm bg-[oklch(0.5081_0.1049_165.61)]" />
						<span className="h-1 w-5 rounded bg-zinc-300" />
					</div>
					<div className="mt-3 space-y-1.5">
						<div className="flex h-4 items-center gap-1 rounded-sm bg-white px-1.5 shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
							<div className="size-1 rounded-sm bg-[oklch(0.5081_0.1049_165.61)]" />
							<div className="h-1 w-5 rounded bg-zinc-400" />
						</div>
						<div className="flex h-4 items-center gap-1 px-1.5">
							<div className="size-1 rounded-sm bg-zinc-400" />
							<div className="h-1 w-6 rounded bg-zinc-300" />
						</div>
						<div className="flex h-4 items-center gap-1 px-1.5">
							<div className="size-1 rounded-sm bg-zinc-400" />
							<div className="h-1 w-5 rounded bg-zinc-200" />
						</div>
						<div className="flex h-4 items-center gap-1 px-1.5">
							<div className="size-1 rounded-sm bg-zinc-400" />
							<div className="h-1 w-7 rounded bg-zinc-200" />
						</div>
					</div>
				</div>
				<div className="min-w-0 flex-1 p-2.5">
					<div className="flex items-center justify-between">
						<div>
							<div className="h-1.5 w-10 rounded bg-zinc-500" />
							<div className="mt-1 h-1 w-16 rounded bg-zinc-300" />
						</div>
						<div className="flex items-center gap-1">
							<span className="rounded-sm border border-[oklch(0.5081_0.1049_165.61)]/30 bg-[oklch(0.5081_0.1049_165.61)]/10 px-1 py-0.5 font-mono text-[6px] text-[oklch(0.42_0.1049_165.61)]">
								hx-get
							</span>
							<span className="rounded-sm bg-zinc-200/80 px-1 py-0.5 font-mono text-[6px] text-zinc-500">Go · SSR</span>
							<div className="h-4 w-9 rounded-sm bg-[oklch(0.5081_0.1049_165.61)]" />
						</div>
					</div>
					<div className="mt-2 grid grid-cols-3 gap-1.5">
						{[
							{ label: "bg-zinc-300", value: "1.28M", spark: "0,16 8,13 16,14 24,9 32,10 40,6" },
							{ label: "bg-zinc-300", value: "214ms", spark: "0,6 8,8 16,7 24,10 32,11 40,13" },
							{ label: "bg-zinc-300", value: "99.94%", spark: "0,14 8,13 16,13 24,11 32,10 40,8" },
						].map((stat, index) => (
							<div key={index} className="rounded-sm border border-zinc-200 bg-white p-1.5">
								<div className="flex items-center justify-between">
									<div className="h-1 w-5 rounded bg-zinc-300" />
									<div className="size-1 rounded-full bg-[oklch(0.5081_0.1049_165.61)]" />
								</div>
								<div className="mt-1 font-mono text-[7px] font-semibold text-zinc-700">{stat.value}</div>
								<svg viewBox="0 0 40 18" className="mt-1 h-3 w-full" preserveAspectRatio="none">
									<polyline points={stat.spark} fill="none" stroke="#0f766e" strokeWidth="1" />
								</svg>
							</div>
						))}
					</div>
					<div className="mt-1.5 rounded-sm border border-zinc-200 bg-white">
						<div className="flex items-center gap-2 border-b border-zinc-100 px-1.5 py-1">
							<div className="h-1 w-6 rounded bg-zinc-400" />
							<div className="ml-auto h-1 w-4 rounded bg-zinc-200" />
							<div className="h-1 w-4 rounded bg-zinc-200" />
						</div>
						{[
							["req_a4f2c1", "gpt-4o", "99.9%"],
							["req_a4f2ac", "claude-sonnet-4-5", "99.8%"],
							["req_a4f297", "deepseek-v3", "97.2%"],
							["req_a4f282", "gemini-2.5-pro", "99.4%"],
						].map(([id, model, rate], index) => (
							<div key={id} className="flex items-center gap-1.5 px-1.5 py-[3px]">
								<div className="h-1 w-3 rounded-sm bg-zinc-300" />
								<span className="font-mono text-[5.5px] text-zinc-500">{id}</span>
								<span className="truncate font-mono text-[5.5px] text-zinc-400">{model}</span>
								<span className="ml-auto font-mono text-[5.5px] text-zinc-500">{rate}</span>
								<span
									className={cn(
										"size-1 rounded-full",
										index === 2 ? "bg-amber-400" : "bg-emerald-500",
									)}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function StyleCard({
	variant,
	title,
	subtitle,
	description,
	preview,
	primary,
	secondary,
	accent,
}: {
	variant: "bifrost" | "reui" | "htmx";
	title: string;
	subtitle: string;
	description: string;
	preview: ReactNode;
	primary: { to: string; label: string; external?: boolean };
	secondary: { to: string; label: string; external?: boolean };
	accent: string;
}) {
	const tags = {
		bifrost: ["Geist", "墨绿主色", "紧凑密度", "灰底卡片"],
		reui: ["Inter", "近黑主色", "大圆角", "看板组件"],
		htmx: ["Go + HTMX", "服务端 HTML", "零前端状态", "OOB 局部更新"],
	}[variant];

	const primaryClass = {
		bifrost: "bg-[oklch(0.5081_0.1049_165.61)] text-white hover:bg-[oklch(0.46_0.1049_165.61)]",
		reui: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200",
		htmx: "bg-[oklch(0.44_0.1049_165.61)] text-white hover:bg-[oklch(0.39_0.1049_165.61)]",
	}[variant];

	return (
		<div className="group bg-card relative flex flex-col rounded-2xl border p-3 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgb(0_0_0/0.25)]">
			<div className="overflow-hidden rounded-xl">{preview}</div>
			<div className="flex flex-1 flex-col px-2 pt-4 pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className={cn("size-2 rounded-full", accent)} />
						<span className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase">{title}</span>
					</div>
					<span className="text-muted-foreground rounded-md border px-1.5 py-0.5 font-mono text-[9px]">{variant}</span>
				</div>
				<h2 className="mt-2 text-lg font-semibold tracking-tight">{subtitle}</h2>
				<p className="text-muted-foreground mt-1 text-xs leading-5">{description}</p>

				<div className="mt-3 flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<span key={tag} className="bg-secondary text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px]">
							{tag}
						</span>
					))}
				</div>

				<div className="mt-auto flex items-center gap-2 pt-5">
					<Button asChild className={cn("h-9 flex-1 gap-1.5 rounded-lg text-xs", primaryClass)}>
						{primary.external ? (
							<a href={primary.to}>
								{primary.label}
								<ArrowRight className="size-3.5" />
							</a>
						) : (
							<Link to={primary.to}>
								{primary.label}
								<ArrowRight className="size-3.5" />
							</Link>
						)}
					</Button>
					<Button asChild variant="outline" className="h-9 gap-1 rounded-lg px-3 text-xs">
						{secondary.external ? (
							<a href={secondary.to}>
								{secondary.label}
								<ArrowUpRight className="size-3" />
							</a>
						) : (
							<Link to={secondary.to}>
								{secondary.label}
								<ArrowUpRight className="size-3" />
							</Link>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}

function StyleChooserPage() {
	const { resolvedTheme } = useTheme();

	return (
		<div className={cn("style-reui font-sans bg-background text-foreground min-h-dvh", resolvedTheme === "dark" && "dark")}>
			<div className="reui-dot-grid pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
			<div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col px-4 py-5 sm:px-6">
				<header className="flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
							<Sparkles className="size-4" />
						</span>
						<div className="leading-tight">
							<p className="text-sm font-semibold tracking-tight">Nova Console</p>
							<p className="text-muted-foreground text-[10px] tracking-wide">设计系统演示</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground hidden items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] sm:flex">
							<Command className="size-3" />
							同一套数据 · 三种风格
						</span>
						<ThemeToggle />
					</div>
				</header>

				<main className="flex flex-1 flex-col justify-center py-10">
					<div className="mx-auto max-w-2xl text-center">
						<div className="border-border bg-card text-muted-foreground mx-auto flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px]">
							<SwatchBook className="size-3" />
							React 19 · Tailwind v4 · TanStack Router · Go + HTMX
						</div>
						<h1 className="mt-5 text-[2rem] leading-[1.1] font-semibold tracking-tight text-balance sm:text-[2.75rem]">
							三种设计语言,
							<br />
							同一套 Nova 控制台
						</h1>
						<p className="text-muted-foreground mx-auto mt-4 max-w-lg text-sm leading-6">
							选择一个风格进入演示。三套界面共享相同的 mock 数据与业务功能，但使用完全不同的设计令牌、组件密度与布局语言。第三套按 Go + HTMX 的方法实现，页面与状态都由服务端负责。
						</p>
					</div>

					<div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<StyleCard
							variant="bifrost"
							title="Bifrost UI"
							subtitle="墨绿、紧凑、数据密集"
							description="抽取自 Bifrost 控制台的真实设计系统：Geist 字体、8px 圆角、灰底白卡与高信息密度，适合长时间运维操作。"
							preview={<BifrostPreview />}
							primary={{ to: "/nova/dashboard", label: "进入 Bifrost 控制台" }}
							secondary={{ to: "/nova/login", label: "登录页" }}
							accent="bg-[oklch(0.5081_0.1049_165.61)]"
						/>
						<StyleCard
							variant="reui"
							title="ReUI"
							subtitle="近黑、圆润、留白充足"
							description="基于 ReUI 的 Neutral 主题与免费 Kanban 组件：Inter 字体、10px 圆角、纯白表面与拖拽看板，更偏产品化表达。"
							preview={<ReuiPreview />}
							primary={{ to: "/reui/dashboard", label: "进入 ReUI 控制台" }}
							secondary={{ to: "/reui/kanban", label: "拖拽看板" }}
							accent="bg-zinc-900"
						/>
						<StyleCard
							variant="htmx"
							title="Go + HTMX"
							subtitle="服务端渲染、零前端状态"
							description="按 HTMX 的方法实现同一套 Bifrost 控制台：路由、筛选与写入都留在 Go 服务端，浏览器只交换 HTML 片段。搜索防抖、懒加载、OOB 更新与 HX-Redirect 都是真实请求。"
							preview={<HtmxPreview />}
							primary={{ to: "/htmx/dashboard", label: "进入 HTMX 控制台", external: true }}
							secondary={{ to: "/htmx/projects", label: "新建项目", external: true }}
							accent="bg-[oklch(0.44_0.1049_165.61)]"
						/>
					</div>

					<div className="mx-auto mt-8 grid w-full max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{ icon: Layers, title: "同一套功能", desc: "概览、项目、成员、设置等页面一一对应" },
							{ icon: GitBranch, title: "独立路由", desc: "/nova/*、/reui/* 与 /htmx/* 互不干扰" },
							{ icon: SquareKanban, title: "真实组件", desc: "ReUI 看板基于 dnd-kit，可拖拽卡片与列" },
							{ icon: Server, title: "真实请求", desc: "HTMX 版由 Go 渲染片段，状态留在服务端" },
						].map((item) => {
							const Icon = item.icon;
							return (
								<div key={item.title} className="bg-card/60 flex items-start gap-2.5 rounded-xl border p-3">
									<Icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
									<div>
										<p className="text-xs font-medium">{item.title}</p>
										<p className="text-muted-foreground mt-0.5 text-[10px] leading-5">{item.desc}</p>
									</div>
								</div>
							);
						})}
					</div>
				</main>

				<footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t py-4 text-[10px]">
					<span className="inline-flex items-center gap-1.5">
						<Check className="size-3 text-emerald-500" />
						所有数据均为本地虚构数据，仅在本机内存中读写
					</span>
					<span className="inline-flex items-center gap-1.5">
						<LayoutDashboard className="size-3" />
						ReUI 组件来自 MIT 协议的 keenthemes/reui · 仅使用免费组件
					</span>
					<span className="inline-flex items-center gap-1.5">
						<PanelsTopLeft className="size-3" />
						2026 Nova Console Demo
					</span>
				</footer>
			</div>
		</div>
	);
}
