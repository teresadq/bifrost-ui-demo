import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeftRight,
	Bell,
	Check,
	ChevronsUpDown,
	Command,
	FolderKanban,
	LogOut,
	Menu,
	Plus,
	Search,
	Settings2,
	Sparkles,
	Users,
	X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/themeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Input } from "@/components/ui/input";
import { REUI_NAV, REUI_PAGES, reuiPageTitle } from "@/components/reui/navigation";
import { ReBadge, ReButton, ReProgress } from "@/components/reui/ui";
import { cn } from "@/lib/utils";

export function ReuiLogo({ compact = false }: { compact?: boolean }) {
	return (
		<div className="flex items-center gap-2.5">
			<span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
				<Sparkles className="size-4" strokeWidth={2} />
			</span>
			{!compact && (
				<div className="leading-tight">
					<p className="text-sm font-semibold tracking-tight">Nova</p>
					<p className="text-muted-foreground text-[10px] tracking-wide">ReUI edition</p>
				</div>
			)}
		</div>
	);
}

function NavSearch() {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const results = useMemo(() => {
		const value = query.trim().toLowerCase();
		if (!value) return REUI_PAGES;
		return REUI_PAGES.filter((page) => page.label.toLowerCase().includes(value) || page.to.includes(value));
	}, [query]);

	return (
		<div className="relative">
			<div className="relative">
				<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
				<Input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					onFocus={() => setOpen(true)}
					onBlur={() => window.setTimeout(() => setOpen(false), 120)}
					onKeyDown={(event) => {
						if (event.key === "Enter" && results[0]) {
							void navigate({ to: results[0].to });
							setOpen(false);
						}
						if (event.key === "Escape") setOpen(false);
					}}
					placeholder="搜索页面…"
					aria-label="搜索页面"
					className="bg-secondary/70 focus-visible:bg-card h-8 rounded-lg border-transparent pl-8 text-xs shadow-none focus-visible:border-ring md:w-56"
				/>
				<kbd className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 hidden -translate-y-1/2 items-center gap-0.5 rounded border bg-card px-1 py-0.5 font-mono text-[9px] md:flex">
					<Command className="size-2.5" />K
				</kbd>
			</div>
			{open && (
				<div className="bg-popover absolute top-10 left-0 z-50 w-72 overflow-hidden rounded-xl border p-1 shadow-lg">
					<p className="text-muted-foreground px-2 py-1.5 text-[10px] font-medium tracking-wider uppercase">页面</p>
					{results.length === 0 ? (
						<p className="text-muted-foreground px-2 py-3 text-xs">没有匹配的页面</p>
					) : (
						results.map((page) => {
							const Icon = page.icon;
							return (
								<Link
									key={page.to}
									to={page.to}
									onClick={() => setOpen(false)}
									className="hover:bg-accent flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs"
								>
									<Icon className="text-muted-foreground size-3.5" />
									{page.label}
									<span className="text-muted-foreground ml-auto font-mono text-[10px]">{page.to}</span>
								</Link>
							);
						})
					)}
				</div>
			)}
		</div>
	);
}

function StyleSwitch() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="hover:bg-accent flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition-colors"
				>
					<ArrowLeftRight className="size-3.5" />
					<span className="hidden sm:inline">ReUI 风格</span>
					<ChevronsUpDown className="text-muted-foreground size-3" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 rounded-xl">
				<DropdownMenuLabel className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
					演示风格
				</DropdownMenuLabel>
				<DropdownMenuItem asChild>
					<Link to="/reui/dashboard" className="cursor-pointer">
						<Check className="size-3.5" />
						ReUI · 当前风格
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/nova/dashboard" className="cursor-pointer">
						<span className="size-3.5" />
						Bifrost · 墨绿紧凑
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link to="/" className="cursor-pointer">
						<ArrowLeftRight className="size-3.5" />
						返回风格选择页
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
	const location = useLocation();

	return (
		<div className="bg-sidebar flex h-full flex-col border-r">
			<div className="flex h-16 items-center justify-between px-4">
				<Link to="/reui/dashboard" className="flex items-center" onClick={onNavigate}>
					<ReuiLogo />
				</Link>
				<ReButton variant="outline" size="sm" className="h-7 gap-1 px-2 text-[11px]" asChild>
					<Link to="/reui/settings">
						<Settings2 className="size-3" />
						管理
					</Link>
				</ReButton>
			</div>

			<div className="px-3 pb-3">
				<button
					type="button"
					className="hover:bg-accent flex w-full cursor-pointer items-center gap-2.5 rounded-xl border bg-card px-2.5 py-2 text-left transition-colors"
				>
					<span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">
						NG
					</span>
					<div className="min-w-0 flex-1">
						<p className="truncate text-xs font-semibold">Nova Gateway</p>
						<p className="text-muted-foreground truncate text-[10px]">生产环境 · 团队版</p>
					</div>
					<ChevronsUpDown className="text-muted-foreground size-3.5" />
				</button>
			</div>

			<nav className="custom-scrollbar flex-1 px-3">
				{REUI_NAV.map((group) => (
					<div key={group.label} className="mb-5">
						<p className="text-muted-foreground/70 mb-1.5 px-2 text-[10px] font-medium tracking-[0.12em] uppercase">
							{group.label}
						</p>
						<ul className="space-y-0.5">
							{group.items.map((item) => {
								const Icon = item.icon;
								const active = location.pathname === item.to;
								return (
									<li key={item.to}>
										<Link
											to={item.to}
											onClick={onNavigate}
											aria-current={active ? "page" : undefined}
											className={cn(
												"group flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-all",
												active
													? "bg-primary text-primary-foreground font-medium shadow-sm"
													: "text-muted-foreground hover:bg-accent hover:text-foreground",
											)}
										>
											<Icon className="size-4 shrink-0" strokeWidth={1.8} />
											{item.label}
											{item.badge && (
												<span
													className={cn(
														"ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-medium",
														active ? "bg-primary-foreground/15 text-primary-foreground" : "bg-secondary text-muted-foreground",
													)}
												>
													{item.badge}
												</span>
											)}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				))}

				<div className="border-t pt-3">
					<Link
						to="/nova/dashboard"
						onClick={onNavigate}
						className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors"
					>
						<ArrowLeftRight className="size-4" strokeWidth={1.8} />
						Bifrost 风格演示
					</Link>
					<Link
						to="/"
						onClick={onNavigate}
						className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors"
					>
						<Sparkles className="size-4" strokeWidth={1.8} />
						切换演示风格
					</Link>
				</div>
			</nav>

			<div className="p-3">
				<div className="rounded-xl border bg-gradient-to-br from-secondary to-card p-3">
					<div className="flex items-center justify-between">
						<p className="text-xs font-semibold">本月请求量</p>
						<ReBadge tone="outline">68%</ReBadge>
					</div>
					<p className="text-muted-foreground mt-0.5 text-[10px]">8.6M / 12.6M 次</p>
					<ReProgress value={68} className="mt-2.5" />
				</div>
			</div>

			<div className="border-t p-3">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="hover:bg-accent flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors"
						>
							<Avatar className="size-8">
								<AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-semibold">陈</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1">
								<p className="truncate text-xs font-medium">陈晓</p>
								<p className="text-muted-foreground truncate text-[10px]">admin@nova.dev</p>
							</div>
							<ChevronsUpDown className="text-muted-foreground size-3.5" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" side="top" className="w-52 rounded-xl">
						<DropdownMenuLabel className="text-xs font-medium">chen.xiao@nova.dev</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link to="/reui/settings" className="cursor-pointer">
								<Settings2 className="size-4" />
								工作区设置
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link to="/" className="cursor-pointer">
								<ArrowLeftRight className="size-4" />
								切换风格
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							className="cursor-pointer"
							onClick={() => toast.success("演示模式：已退出登录")}
						>
							<LogOut className="size-4" />
							退出登录
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

export function ReuiShell({ children }: { children: ReactNode }) {
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);
	const title = reuiPageTitle(location.pathname);

	return (
		<div className="bg-background min-h-dvh">
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] lg:block">
				<Sidebar />
			</aside>

			{mobileOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
					<div className="bg-sidebar absolute inset-y-0 left-0 w-[280px] shadow-2xl">
						<button
							type="button"
							aria-label="关闭导航"
							className="text-muted-foreground hover:bg-accent absolute top-4 right-3 z-10 grid size-8 cursor-pointer place-items-center rounded-lg"
							onClick={() => setMobileOpen(false)}
						>
							<X className="size-4" />
						</button>
						<Sidebar onNavigate={() => setMobileOpen(false)} />
					</div>
				</div>
			)}

			<div className="lg:pl-[252px]">
				<header className="bg-background/80 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-xl md:px-6">
					<button
						type="button"
						aria-label="打开导航"
						className="text-muted-foreground hover:bg-accent grid size-8 cursor-pointer place-items-center rounded-lg lg:hidden"
						onClick={() => setMobileOpen(true)}
					>
						<Menu className="size-4" />
					</button>

					<div className="flex min-w-0 items-center gap-2 text-sm">
						<span className="text-muted-foreground hidden sm:inline">Nova Gateway</span>
						<span className="text-muted-foreground/50 hidden sm:inline">/</span>
						<span className="truncate font-medium">{title}</span>
						<ReBadge tone="outline" className="ml-1 hidden font-mono text-[9px] md:inline-flex">
							ReUI
						</ReBadge>
					</div>

					<div className="ml-auto flex items-center gap-1.5">
						<div className="mr-1 hidden md:block">
							<NavSearch />
						</div>
						<StyleSwitch />
						<ThemeToggle />
						<ReButton
							variant="ghost"
							size="icon"
							className="relative size-8"
							aria-label="新通知"
							onClick={() => toast.info("3 条未读通知：审批、告警和账单")}
						>
							<Bell className="size-4" />
							<span className="bg-destructive absolute top-2 right-2 size-1.5 rounded-full ring-2 ring-background" />
						</ReButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<ReButton variant="default" size="sm" className="ml-1 hidden gap-1.5 sm:flex">
									<Plus className="size-3.5" />
									新建
								</ReButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-44 rounded-xl">
								<DropdownMenuItem asChild>
									<Link to="/reui/kanban" className="cursor-pointer">
										<Plus className="size-3.5" />
										新建任务
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to="/reui/projects" className="cursor-pointer">
										<FolderKanban className="size-3.5" />
										新建项目
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to="/reui/members" className="cursor-pointer">
										<Users className="size-3.5" />
										邀请成员
									</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

				<main className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-7 md:py-8">{children}</main>
			</div>
		</div>
	);
}
