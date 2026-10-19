import {
	Blocks,
	ChartNoAxesCombined,
	FlaskConical,
	FolderKanban,
	LayoutDashboard,
	LayoutGrid,
	Settings,
	Shapes,
	SquareKanban,
	Table2,
	Users,
	Workflow,
} from "lucide-react";

export type ReuiPath =
	| "/reui/dashboard"
	| "/reui/kanban"
	| "/reui/analytics"
	| "/reui/projects"
	| "/reui/members"
	| "/reui/settings"
	| "/reui/blocks"
	| "/reui/blocks/application"
	| "/reui/blocks/data-grid"
	| "/reui/blocks/charts"
	| "/reui/blocks/solutions"
	| "/reui/blocks/ai"
	| "/reui/blocks/pro";

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
	{
		label: "Blocks",
		items: [
			{ label: "展厅总览", to: "/reui/blocks", icon: Blocks },
			{ label: "Pro 仿照", to: "/reui/blocks/pro", icon: FlaskConical, badge: "24" },
			{ label: "应用区块", to: "/reui/blocks/application", icon: LayoutGrid },
			{ label: "数据表格", to: "/reui/blocks/data-grid", icon: Table2 },
			{ label: "图表", to: "/reui/blocks/charts", icon: Shapes },
			{ label: "解决方案", to: "/reui/blocks/solutions", icon: Workflow },
			{ label: "AI 组件", to: "/reui/blocks/ai", icon: ChartNoAxesCombined },
		],
	},
];

export const REUI_PAGES = REUI_NAV.flatMap((group) => group.items);

export function reuiPageTitle(pathname: string) {
	return REUI_PAGES.find((item) => item.to === pathname)?.label ?? "概览";
}
