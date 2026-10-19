import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck, CreditCard, GitPullRequest, Server, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nova/notifications")({
	component: NotificationsPage,
});

type Category = "approval" | "system" | "billing" | "security";

type Notification = {
	id: string;
	category: Category;
	title: string;
	description: string;
	time: string;
	read: boolean;
};

const CATEGORY_ICON = {
	approval: GitPullRequest,
	system: Server,
	billing: CreditCard,
	security: ShieldAlert,
} as const;

const CATEGORY_STYLE: Record<Category, string> = {
	approval: "bg-chart-cat-2/10 text-chart-cat-2",
	system: "bg-chart-info/10 text-chart-info-ink",
	billing: "bg-chart-warning/10 text-chart-warning-ink",
	security: "bg-destructive/10 text-destructive",
};

const INITIAL: Notification[] = [
	{
		id: "nt_1",
		category: "approval",
		title: "AP-2481 等待你的财务审批",
		description: "陈晓申请将 customer-support 的月度预算从 $2,400 提升至 $4,000。",
		time: "5 分钟前",
		read: false,
	},
	{
		id: "nt_2",
		category: "security",
		title: "检测到 3 次失败登录",
		description: "IP 203.0.113.42 在 10 分钟内连续尝试登录控制台失败，已自动限速。",
		time: "32 分钟前",
		read: false,
	},
	{
		id: "nt_3",
		category: "system",
		title: "Groq 提供商触发限流",
		description: "过去 15 分钟收到 42 次 429 响应，健康检查已自动降级该提供商。",
		time: "1 小时前",
		read: false,
	},
	{
		id: "nt_4",
		category: "billing",
		title: "项目预算已使用 84%",
		description: "customer-support 本月已使用 $2,016 / $2,400，建议提前调整预算。",
		time: "3 小时前",
		read: true,
	},
	{
		id: "nt_5",
		category: "approval",
		title: "你的申请 AP-2468 已通过",
		description: "content-studio 项目续期申请已由财务审批通过，续期至 2027-01-31。",
		time: "昨天 09:18",
		read: true,
	},
	{
		id: "nt_6",
		category: "system",
		title: "模型目录已更新",
		description: "新增 gemini-2.5-flash 定价信息，claude-haiku-4.5 上下文窗口更新为 200k。",
		time: "2 天前",
		read: true,
	},
	{
		id: "nt_7",
		category: "billing",
		title: "9 月发票已生成",
		description: "INV-2026-09 · $3,842.60，已自动从绑定支付方式扣款。",
		time: "3 天前",
		read: true,
	},
];

const TABS = [
	{ key: "all", label: "全部" },
	{ key: "unread", label: "未读" },
	{ key: "approval", label: "审批" },
	{ key: "system", label: "系统" },
	{ key: "billing", label: "账单" },
	{ key: "security", label: "安全" },
] as const;

function NotificationsPage() {
	const [items, setItems] = useState(INITIAL);
	const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");

	const unread = items.filter((item) => !item.read).length;

	const rows = useMemo(
		() =>
			items.filter((item) => {
				if (tab === "all") return true;
				if (tab === "unread") return !item.read;
				return item.category === tab;
			}),
		[items, tab],
	);

	function markAllRead() {
		setItems((current) => current.map((item) => ({ ...item, read: true })));
		toast.success("所有通知已标为已读");
	}

	return (
		<AppShell>
			<PageHeader
				title="通知中心"
				description="审批、安全、系统与账单相关的通知都会汇总到这里。"
				actions={
					<Button variant="outline" onClick={markAllRead} disabled={unread === 0}>
						<CheckCheck className="size-4" />
						全部标为已读
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap items-center gap-1 border-b">
				{TABS.map((item) => {
					const count =
						item.key === "all"
							? items.length
							: item.key === "unread"
								? unread
								: items.filter((notification) => notification.category === item.key).length;
					return (
						<button
							key={item.key}
							type="button"
							onClick={() => setTab(item.key)}
							className={cn(
								"-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2 text-[13px] transition-colors",
								tab === item.key
									? "border-foreground text-foreground font-medium"
									: "text-muted-foreground hover:text-foreground border-transparent",
							)}
						>
							{item.label}
							<span className="text-muted-foreground/70 font-mono text-[10px]">{count}</span>
						</button>
					);
				})}
			</div>

			<Card className="gap-0 py-0">
				{rows.length === 0 ? (
					<p className="text-muted-foreground py-16 text-center text-sm">这里没有通知</p>
				) : (
					<ul>
						{rows.map((item) => {
							const Icon = CATEGORY_ICON[item.category];
							return (
								<li key={item.id} className="border-b last:border-b-0">
									<button
										type="button"
										onClick={() =>
											setItems((current) =>
												current.map((notification) =>
													notification.id === item.id ? { ...notification, read: true } : notification,
												),
											)
										}
										className={cn(
											"flex w-full cursor-pointer items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40",
											!item.read && "bg-muted/20",
										)}
									>
										<span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md", CATEGORY_STYLE[item.category])}>
											<Icon className="size-4" />
										</span>
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className={cn("text-[13px]", item.read ? "font-normal" : "font-medium")}>{item.title}</p>
												{!item.read && <span className="bg-chart-info size-1.5 rounded-full" />}
											</div>
											<p className="text-muted-foreground mt-1 text-xs leading-5">{item.description}</p>
										</div>
										<span className="text-muted-foreground shrink-0 text-[11px]">{item.time}</span>
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</Card>
		</AppShell>
	);
}
