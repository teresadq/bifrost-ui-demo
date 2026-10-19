import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, MoveRight, Sparkles, Star, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/themeToggle";
import { ReuiLogo } from "@/components/reui/reuiShell";
import { ReBadge } from "@/components/reui/ui";

export function ReuiAuthLayout({
	children,
	footer,
}: {
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<div className="bg-background grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
			<div className="flex min-h-dvh flex-col">
				<header className="flex items-center justify-between px-6 py-5 lg:px-10">
					<Link to="/reui/dashboard" aria-label="Nova ReUI 首页">
						<ReuiLogo />
					</Link>
					<div className="flex items-center gap-1">
						<Link
							to="/"
							className="text-muted-foreground hover:text-foreground hover:bg-accent hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors sm:flex"
						>
							切换风格
							<ArrowUpRight className="size-3.5" />
						</Link>
						<ThemeToggle />
					</div>
				</header>

				<main className="flex flex-1 items-center justify-center px-6 py-8 lg:px-10">
					<div className="w-full max-w-[400px]">{children}</div>
				</main>

				<footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 px-6 py-5 text-[11px] lg:px-10">
					<span>© 2026 Nova Console · 静态演示</span>
					{footer}
				</footer>
			</div>

			<aside className="relative hidden overflow-hidden bg-zinc-950 text-white lg:block">
				<div className="reui-dot-grid-dark absolute inset-0 opacity-70" />
				<div className="absolute -top-32 -right-24 size-[420px] rounded-full bg-blue-600/25 blur-[110px]" />
				<div className="absolute -bottom-40 -left-20 size-[420px] rounded-full bg-violet-600/25 blur-[120px]" />

				<div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
					<div>
						<ReBadge className="border-white/15 bg-white/10 text-white">
							<Sparkles className="size-3" />
							ReUI Design System
						</ReBadge>
						<h2 className="mt-6 max-w-md text-[2rem] leading-[1.15] font-semibold tracking-tight text-balance">
							让 AI 网关的每一次请求,
							<br />
							都清晰可控。
						</h2>
						<p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
							统一的模型接入、可观测性与成本治理。用一套控制台管理 OpenAI、Anthropic、Gemini 与 DeepSeek。
						</p>
					</div>

					<div className="relative my-10 h-[300px]">
						<div className="absolute top-2 left-2 w-[260px] rotate-[-3deg] rounded-xl border border-white/12 bg-white/[0.06] p-4 backdrop-blur-sm">
							<div className="flex items-center justify-between">
								<span className="text-[10px] tracking-wider text-white/40 uppercase">进行中</span>
								<ReBadge className="border-white/10 bg-white/10 text-white/70">3</ReBadge>
							</div>
							<p className="mt-3 text-sm font-medium">请求重试策略可配置化</p>
							<div className="mt-3 flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<span className="grid size-5 place-items-center rounded-full bg-emerald-400/20 text-[8px] font-semibold text-emerald-300">王</span>
									<span className="text-[10px] text-white/40">王一鸣</span>
								</div>
								<span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-300">紧急</span>
							</div>
							<div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
								<div className="h-full w-3/5 rounded-full bg-blue-400" />
							</div>
						</div>

						<div className="absolute top-28 right-6 w-[230px] rotate-[2deg] rounded-xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur-sm">
							<div className="flex items-center gap-2">
								<span className="grid size-7 place-items-center rounded-full bg-blue-400/20 text-[9px] font-semibold text-blue-300">陈</span>
								<div className="leading-tight">
									<p className="text-xs font-medium">陈晓</p>
									<p className="text-[9px] text-white/40">刚刚完成一次部署</p>
								</div>
							</div>
							<p className="mt-3 text-xs text-white/70">Anthropic Prompt Caching 支持已上线</p>
							<div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-300">
								<Check className="size-3" />
								生产环境 · 运行正常
							</div>
						</div>

						<div className="absolute bottom-0 left-16 flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">
							<span className="grid size-8 place-items-center rounded-lg bg-white/10">
								<Zap className="size-4 text-amber-300" />
							</span>
							<div>
								<p className="text-sm font-semibold tabular-nums">1.28M</p>
								<p className="text-[9px] text-white/40">过去 7 天请求</p>
							</div>
							<div className="ml-3 border-l border-white/10 pl-3">
								<p className="text-sm font-semibold tabular-nums">99.94%</p>
								<p className="text-[9px] text-white/40">成功率</p>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between border-t border-white/10 pt-6">
						<div className="flex items-center gap-3">
							<div className="flex -space-x-2">
								{["陈", "王", "林", "周"].map((name, index) => (
									<span
										key={name}
										className="grid size-7 place-items-center rounded-full border-2 border-zinc-950 text-[9px] font-semibold"
										style={{
											background: ["#1d4ed8", "#047857", "#6d28d9", "#b45309"][index],
										}}
									>
										{name}
									</span>
								))}
							</div>
							<p className="text-[11px] text-white/45">已有 2,400+ 团队使用 Nova 管理模型网关</p>
						</div>
						<div className="flex items-center gap-1 text-amber-300">
							{[0, 1, 2, 3, 4].map((star) => (
								<Star key={star} className="size-3 fill-current" />
							))}
						</div>
					</div>
				</div>
			</aside>
		</div>
	);
}

export function ReuiAuthSwitch({ to, label }: { to: "/reui/login" | "/reui/register"; label: string }) {
	return (
		<Link to={to} className="text-foreground group inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline">
			{label}
			<MoveRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
}
