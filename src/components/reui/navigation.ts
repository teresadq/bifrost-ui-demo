import {
	ChartNoAxesCombined,
	FolderKanban,
	LayoutDashboard,
	Settings,
	SquareKanban,
	Users,
} from "lucide-react";

export type ReuiPath =
	| "/reui/dashboard"
	| "/reui/kanban"
	| "/reui/analytics"
	| "/reui/projects"
	| "/reui/members"
	| "/reui/settings";

export const REUI_NAV: {
	label: string;
	items: { label: string; to: ReuiPath; icon: typeof LayoutDashboard; badge?: string }[];
}[] = [
	{
		label: "工作台",
		items: [
			{ label: "概览", to: "/reui/dashboard", icon: LayoutDashboard },
			{ label: "看板", to: "/reui/kanban", icon: SquareKanban, badge: "12" },
			{ label: "分析报表", to: "/reui/analytics", icon: ChartNoAxesCombined },
		],
	},
	{
		label: "管理",
		items: [
			{ label: "项目", to: "/reui/projects", icon: FolderKanban },
			{ label: "团队成员", to: "/reui/members", icon: Users },
			{ label: "设置", to: "/reui/settings", icon: Settings },
		],
	},
];

export const REUI_PAGES = REUI_NAV.flatMap((group) => group.items);

export function reuiPageTitle(pathname: string) {
	return REUI_PAGES.find((item) => item.to === pathname)?.label ?? "概览";
}
