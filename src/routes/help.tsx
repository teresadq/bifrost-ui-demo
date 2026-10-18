import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, ChevronDown, Code2, LifeBuoy, MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/help")({
	component: HelpPage,
});

const QUICK_LINKS = [
	{ icon: BookOpen, title: "快速开始", description: "5 分钟接入第一个模型提供商" },
	{ icon: Code2, title: "API 参考", description: "推理接口、鉴权与错误码" },
	{ icon: MessageCircle, title: "常见问题", description: "计费、预算与故障转移" },
	{ icon: LifeBuoy, title: "联系支持", description: "工作日 9:00-18:00 在线" },
];

const FAQ = [
	{
		q: "如何为项目设置预算和告警？",
		a: "在「项目列表」中编辑项目并填写月度预算，然后在「告警规则」中创建基于 budget_usage 的规则。达到阈值后会通过邮件、Slack 或 Webhook 通知负责人。",
	},
	{
		q: "提供商故障时会自动切换吗？",
		a: "会。路由层会检测 429、5xx 和超时，并按配置回退到同一提供商的备用密钥或降级到备用提供商。你可以在请求日志中看到 retry 状态的记录。",
	},
	{
		q: "API 密钥可以限制权限范围吗？",
		a: "可以。创建密钥时按需勾选推理、读取模型、读取日志或管理配置。建议为每个服务和环境创建独立密钥，并设置有效期。",
	},
	{
		q: "如何删除或停用成员？",
		a: "在「团队成员」中打开行操作菜单即可暂停或移除成员。暂停会立即撤销该成员的所有活跃会话，但保留历史审计记录。",
	},
	{
		q: "账单中的缓存折扣如何计算？",
		a: "当相同前缀的请求命中缓存时，输入 Token 按缓存价格计费。账单页的「缓存节省」展示相对未命中的差额。",
	},
];

const SHORTCUTS = [
	["⌘ K", "打开命令面板"],
	["↑ / ↓", "在命令面板中移动"],
	["↵", "打开选中项"],
	["Esc", "关闭弹窗或面板"],
];

function HelpPage() {
	const [open, setOpen] = useState<number | null>(0);
	const [query, setQuery] = useState("");

	const faq = FAQ.filter((item) => !query || `${item.q} ${item.a}`.toLowerCase().includes(query.toLowerCase()));

	return (
		<AppShell>
			<PageHeader
				title="帮助中心"
				description="查找常见问题、API 文档与联系方式。"
				actions={
					<Button variant="outline" onClick={() => toast.info("工单系统在演示中不可用")}>
						<LifeBuoy className="size-4" />
						提交工单
					</Button>
				}
			/>

			<div className="text-muted-foreground focus-within:border-ring/60 mb-4 flex h-9 max-w-xl items-center gap-2 rounded-md border px-3 transition-colors">
				<Search className="size-4 shrink-0" />
				<input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="搜索帮助文档…"
					className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
				/>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{QUICK_LINKS.map((link) => (
					<button
						key={link.title}
						type="button"
						onClick={() => toast.info(`「${link.title}」文档在演示中不可用`)}
						className="bg-card hover:bg-muted/40 group cursor-pointer rounded-lg border p-4 text-left transition-colors"
					>
						<div className="flex items-start justify-between">
							<span className="bg-secondary text-secondary-foreground flex size-8 items-center justify-center rounded-md">
								<link.icon className="size-4" />
							</span>
							<ArrowUpRight className="text-muted-foreground/50 group-hover:text-foreground size-3.5 transition-colors" />
						</div>
						<p className="mt-3 text-[13px] font-medium">{link.title}</p>
						<p className="text-muted-foreground mt-1 text-xs">{link.description}</p>
					</button>
				))}
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="text-sm">常见问题</CardTitle>
					</CardHeader>
					<CardContent className="px-0">
						{faq.length === 0 ? (
							<p className="text-muted-foreground py-12 text-center text-sm">没有匹配的问题</p>
						) : (
							faq.map((item) => {
								const expanded = open === FAQ.indexOf(item);
								return (
									<div key={item.q} className="border-b last:border-b-0">
										<button
											type="button"
											onClick={() => setOpen(expanded ? null : FAQ.indexOf(item))}
											className="flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left"
											aria-expanded={expanded}
										>
											<span className="flex-1 text-[13px] font-medium">{item.q}</span>
											<ChevronDown className={cn("text-muted-foreground size-4 transition-transform", expanded && "rotate-180")} />
										</button>
										{expanded && <p className="text-muted-foreground px-5 pb-4 text-xs leading-6">{item.a}</p>}
									</div>
								);
							})
						)}
					</CardContent>
				</Card>

				<div className="space-y-4">
					<Card className="gap-0 py-0">
						<CardHeader className="border-b px-5 py-4">
							<CardTitle className="text-sm">键盘快捷键</CardTitle>
						</CardHeader>
						<CardContent className="px-5 py-3">
							<ul className="space-y-2.5">
								{SHORTCUTS.map(([keys, description]) => (
									<li key={keys} className="flex items-center justify-between text-xs">
										<span className="text-muted-foreground">{description}</span>
										<kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-[10px]">{keys}</kbd>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>

					<Card className="gap-0 py-0">
						<CardContent className="px-5 py-4">
							<p className="text-[13px] font-medium">仍然需要帮助？</p>
							<p className="text-muted-foreground mt-1 text-xs leading-5">
								联系支持团队，我们会在一个工作日内回复。企业版客户可使用专属支持通道。
							</p>
							<Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("邮件客户端未在演示中接入")}>
								<MessageCircle className="size-3.5" />
								联系支持
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</AppShell>
	);
}
