import {
	Activity,
	BarChart3,
	Bell,
	BellRing,
	Boxes,
	ClipboardList,
	CreditCard,
	FolderKanban,
	GitPullRequest,
	KeyRound,
	LayoutDashboard,
	LifeBuoy,
	ListChecks,
	type LucideIcon,
	ScrollText,
	Server,
	Settings,
	ShieldCheck,
	User,
	Users,
} from "lucide-react";

export type AppPath =
	| "/nova/dashboard"
	| "/nova/logs"
	| "/nova/analytics"
	| "/nova/projects"
	| "/nova/wizard"
	| "/nova/approvals"
	| "/nova/providers"
	| "/nova/models"
	| "/nova/members"
	| "/nova/roles"
	| "/nova/keys"
	| "/nova/audit-logs"
	| "/nova/alerts"
	| "/nova/billing"
	| "/nova/status"
	| "/nova/settings"
	| "/nova/help"
	| "/nova/profile"
	| "/nova/notifications";

export type NavItem = {
	label: string;
	to: AppPath;
	icon: LucideIcon;
	badge?: string;
	keywords?: string;
};

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
	{
		label: "工作台",
		items: [
			{ label: "概览", to: "/nova/dashboard", icon: LayoutDashboard, keywords: "dashboard overview home" },
			{ label: "请求日志", to: "/nova/logs", icon: ScrollText, keywords: "logs requests 日志" },
			{ label: "分析报表", to: "/nova/analytics", icon: BarChart3, keywords: "analytics report 图表" },
		],
	},
	{
		label: "项目",
		items: [
			{ label: "项目列表", to: "/nova/projects", icon: FolderKanban, keywords: "projects 项目" },
			{ label: "分步配置", to: "/nova/wizard", icon: ListChecks, keywords: "wizard steps 配置" },
			{ label: "审批中心", to: "/nova/approvals", icon: GitPullRequest, badge: "3", keywords: "approvals 审批" },
		],
	},
	{
		label: "模型",
		items: [
			{ label: "提供商", to: "/nova/providers", icon: Server, keywords: "providers openai anthropic 提供商" },
			{ label: "模型目录", to: "/nova/models", icon: Boxes, keywords: "models catalog 模型" },
		],
	},
	{
		label: "访问与权限",
		items: [
			{ label: "团队成员", to: "/nova/members", icon: Users, keywords: "members team users 成员" },
			{ label: "角色权限", to: "/nova/roles", icon: ShieldCheck, keywords: "roles permissions rbac 权限" },
			{ label: "API 密钥", to: "/nova/keys", icon: KeyRound, keywords: "api keys 密钥" },
			{ label: "审计日志", to: "/nova/audit-logs", icon: ClipboardList, keywords: "audit 审计" },
		],
	},
	{
		label: "系统",
		items: [
			{ label: "告警规则", to: "/nova/alerts", icon: BellRing, keywords: "alerts 告警" },
			{ label: "账单与用量", to: "/nova/billing", icon: CreditCard, keywords: "billing invoice 账单" },
			{ label: "系统状态", to: "/nova/status", icon: Activity, keywords: "status health uptime 状态" },
			{ label: "设置", to: "/nova/settings", icon: Settings, keywords: "settings 设置" },
			{ label: "帮助中心", to: "/nova/help", icon: LifeBuoy, keywords: "help faq 帮助" },
		],
	},
];

export const ALL_PAGES = NAV_GROUPS.flatMap((group) => group.items);

export const EXTRA_PAGES: NavItem[] = [
	{ label: "个人资料", to: "/nova/profile", icon: User, keywords: "profile account 个人" },
	{ label: "通知中心", to: "/nova/notifications", icon: Bell, keywords: "notifications 通知" },
];

export function pageTitle(pathname: string): string {
	const match = [...ALL_PAGES, ...EXTRA_PAGES].find((item) => item.to === pathname);
	return match?.label ?? "工作台";
}
