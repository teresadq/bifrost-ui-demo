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
	| "/dashboard"
	| "/logs"
	| "/analytics"
	| "/projects"
	| "/wizard"
	| "/approvals"
	| "/providers"
	| "/models"
	| "/members"
	| "/roles"
	| "/keys"
	| "/audit-logs"
	| "/alerts"
	| "/billing"
	| "/status"
	| "/settings"
	| "/help"
	| "/profile"
	| "/notifications";

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
			{ label: "概览", to: "/dashboard", icon: LayoutDashboard, keywords: "dashboard overview home" },
			{ label: "请求日志", to: "/logs", icon: ScrollText, keywords: "logs requests 日志" },
			{ label: "分析报表", to: "/analytics", icon: BarChart3, keywords: "analytics report 图表" },
		],
	},
	{
		label: "项目",
		items: [
			{ label: "项目列表", to: "/projects", icon: FolderKanban, keywords: "projects 项目" },
			{ label: "分步配置", to: "/wizard", icon: ListChecks, keywords: "wizard steps 配置" },
			{ label: "审批中心", to: "/approvals", icon: GitPullRequest, badge: "3", keywords: "approvals 审批" },
		],
	},
	{
		label: "模型",
		items: [
			{ label: "提供商", to: "/providers", icon: Server, keywords: "providers openai anthropic 提供商" },
			{ label: "模型目录", to: "/models", icon: Boxes, keywords: "models catalog 模型" },
		],
	},
	{
		label: "访问与权限",
		items: [
			{ label: "团队成员", to: "/members", icon: Users, keywords: "members team users 成员" },
			{ label: "角色权限", to: "/roles", icon: ShieldCheck, keywords: "roles permissions rbac 权限" },
			{ label: "API 密钥", to: "/keys", icon: KeyRound, keywords: "api keys 密钥" },
			{ label: "审计日志", to: "/audit-logs", icon: ClipboardList, keywords: "audit 审计" },
		],
	},
	{
		label: "系统",
		items: [
			{ label: "告警规则", to: "/alerts", icon: BellRing, keywords: "alerts 告警" },
			{ label: "账单与用量", to: "/billing", icon: CreditCard, keywords: "billing invoice 账单" },
			{ label: "系统状态", to: "/status", icon: Activity, keywords: "status health uptime 状态" },
			{ label: "设置", to: "/settings", icon: Settings, keywords: "settings 设置" },
			{ label: "帮助中心", to: "/help", icon: LifeBuoy, keywords: "help faq 帮助" },
		],
	},
];

export const ALL_PAGES = NAV_GROUPS.flatMap((group) => group.items);

export const EXTRA_PAGES: NavItem[] = [
	{ label: "个人资料", to: "/profile", icon: User, keywords: "profile account 个人" },
	{ label: "通知中心", to: "/notifications", icon: Bell, keywords: "notifications 通知" },
];

export function pageTitle(pathname: string): string {
	const match = [...ALL_PAGES, ...EXTRA_PAGES].find((item) => item.to === pathname);
	return match?.label ?? "工作台";
}
