export type KanbanTask = {
	id: string;
	title: string;
	description?: string;
	priority: "urgent" | "high" | "medium" | "low";
	assignee: { name: string; color: string };
	tags: string[];
	due?: string;
	comments: number;
	subtasks?: { done: number; total: number };
};

export const KANBAN_COLUMNS = [
	{ id: "planning", label: "待规划", hint: "收集需求与排期" },
	{ id: "progress", label: "进行中", hint: "本周冲刺" },
	{ id: "review", label: "待审核", hint: "等待评审" },
	{ id: "done", label: "已完成", hint: "最近 7 天" },
] as const;

export const INITIAL_BOARD: Record<string, KanbanTask[]> = {
	planning: [
		{
			id: "task-1",
			title: "支持 Gemini 2.5 Flash 流式响应",
			description: "接入新的 provider adapter，补齐 SSE 增量解析。",
			priority: "high",
			assignee: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			tags: ["provider", "streaming"],
			due: "10 月 24 日",
			comments: 4,
			subtasks: { done: 0, total: 5 },
		},
		{
			id: "task-2",
			title: "审计日志支持按模型维度筛选",
			priority: "medium",
			assignee: { name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
			tags: ["audit"],
			due: "10 月 28 日",
			comments: 1,
		},
		{
			id: "task-3",
			title: "设计团队用量周报邮件模板",
			priority: "low",
			assignee: { name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			tags: ["growth", "email"],
			comments: 0,
		},
	],
	progress: [
		{
			id: "task-4",
			title: "请求重试策略可配置化",
			description: "允许按项目和提供商分别设置重试次数与退避曲线。",
			priority: "urgent",
			assignee: { name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
			tags: ["gateway", "reliability"],
			due: "今天",
			comments: 7,
			subtasks: { done: 3, total: 5 },
		},
		{
			id: "task-5",
			title: "API Key 作用域细粒度校验",
			priority: "high",
			assignee: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			tags: ["security", "rbac"],
			due: "10 月 21 日",
			comments: 3,
			subtasks: { done: 4, total: 6 },
		},
		{
			id: "task-6",
			title: "控制台明暗主题一致性走查",
			priority: "medium",
			assignee: { name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			tags: ["design-system"],
			due: "10 月 22 日",
			comments: 2,
			subtasks: { done: 2, total: 4 },
		},
	],
	review: [
		{
			id: "task-7",
			title: "成本预算告警阈值配置",
			description: "评审后端接口与前端提示文案。",
			priority: "high",
			assignee: { name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
			tags: ["billing", "alerts"],
			due: "10 月 20 日",
			comments: 5,
			subtasks: { done: 4, total: 4 },
		},
		{
			id: "task-8",
			title: "团队成员批量导入 CSV",
			priority: "medium",
			assignee: { name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
			tags: ["members"],
			due: "10 月 23 日",
			comments: 1,
			subtasks: { done: 3, total: 3 },
		},
	],
	done: [
		{
			id: "task-9",
			title: "Anthropic Prompt Caching 支持",
			priority: "high",
			assignee: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			tags: ["provider", "cost"],
			due: "10 月 15 日",
			comments: 9,
			subtasks: { done: 6, total: 6 },
		},
		{
			id: "task-10",
			title: "请求日志详情抽屉性能优化",
			priority: "medium",
			assignee: { name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			tags: ["performance"],
			due: "10 月 12 日",
			comments: 3,
		},
		{
			id: "task-11",
			title: "系统状态页 30 天可用性条",
			priority: "low",
			assignee: { name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
			tags: ["status"],
			due: "10 月 9 日",
			comments: 2,
		},
	],
};

export type ReuiProject = {
	id: string;
	name: string;
	description: string;
	owner: { name: string; color: string };
	status: "运行中" | "已暂停" | "草稿";
	providers: string[];
	requests: string;
	budget: number;
	used: number;
	due: string;
	members: { name: string; color: string }[];
};

export const REUI_PROJECTS: ReuiProject[] = [
	{
		id: "prj-01",
		name: "客服智能体",
		description: "面向售后场景的多轮对话与工单摘要",
		owner: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
		status: "运行中",
		providers: ["Anthropic", "OpenAI"],
		requests: "428K",
		budget: 4200,
		used: 68,
		due: "12 月 31 日",
		members: [
			{ name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			{ name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			{ name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
		],
	},
	{
		id: "prj-02",
		name: "代码审查助手",
		description: "GitHub PR 自动摘要、风险标注与建议",
		owner: { name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
		status: "运行中",
		providers: ["OpenAI", "DeepSeek"],
		requests: "265K",
		budget: 1800,
		used: 41,
		due: "11 月 30 日",
		members: [
			{ name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
			{ name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
		],
	},
	{
		id: "prj-03",
		name: "营销文案生成",
		description: "多语言投放素材批量生成与合规检查",
		owner: { name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
		status: "运行中",
		providers: ["Google", "Anthropic"],
		requests: "198K",
		budget: 2600,
		used: 82,
		due: "11 月 15 日",
		members: [
			{ name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			{ name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
			{ name: "赵可", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
		],
	},
	{
		id: "prj-04",
		name: "内部知识库问答",
		description: "基于 RAG 的制度查询与引用溯源",
		owner: { name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
		status: "已暂停",
		providers: ["DeepSeek"],
		requests: "92K",
		budget: 900,
		used: 100,
		due: "10 月 31 日",
		members: [
			{ name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
			{ name: "赵可", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
		],
	},
	{
		id: "prj-05",
		name: "会议纪要工作流",
		description: "录音转写、要点提炼与行动项分派",
		owner: { name: "赵可", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
		status: "草稿",
		providers: ["OpenAI"],
		requests: "—",
		budget: 600,
		used: 0,
		due: "待定",
		members: [{ name: "赵可", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" }],
	},
	{
		id: "prj-06",
		name: "数据洞察 Copilot",
		description: "自然语言查询指标与自动生成图表",
		owner: { name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
		status: "运行中",
		providers: ["OpenAI", "Google", "DeepSeek"],
		requests: "351K",
		budget: 3200,
		used: 57,
		due: "12 月 12 日",
		members: [
			{ name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
			{ name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			{ name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			{ name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
		],
	},
	{
		id: "prj-07",
		name: "合规审查机器人",
		description: "合同条款风险识别与修订建议",
		owner: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
		status: "运行中",
		providers: ["Anthropic"],
		requests: "76K",
		budget: 1200,
		used: 34,
		due: "11 月 8 日",
		members: [
			{ name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			{ name: "赵可", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
		],
	},
	{
		id: "prj-08",
		name: "语音客服质检",
		description: "通话转写、情绪识别与质检评分",
		owner: { name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
		status: "已暂停",
		providers: ["OpenAI", "Google"],
		requests: "134K",
		budget: 2000,
		used: 71,
		due: "10 月 26 日",
		members: [
			{ name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
			{ name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
		],
	},
];

export type ReuiMember = {
	id: string;
	name: string;
	email: string;
	initials: string;
	role: "所有者" | "管理员" | "开发者" | "只读";
	team: string;
	twoFactor: boolean;
	status: "在线" | "离开" | "停用" | "待邀请";
	lastActive: string;
	color: string;
};

export const REUI_MEMBERS: ReuiMember[] = [
	{ id: "u1", name: "陈晓", email: "chen.xiao@nova.dev", initials: "陈", role: "所有者", team: "平台组", twoFactor: true, status: "在线", lastActive: "刚刚", color: "bg-primary text-primary-foreground" },
	{ id: "u2", name: "王一鸣", email: "wang.yiming@nova.dev", initials: "王", role: "管理员", team: "网关组", twoFactor: true, status: "在线", lastActive: "2 分钟前", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
	{ id: "u3", name: "林嘉", email: "lin.jia@nova.dev", initials: "林", role: "开发者", team: "应用组", twoFactor: true, status: "离开", lastActive: "26 分钟前", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
	{ id: "u4", name: "周雨", email: "zhou.yu@nova.dev", initials: "周", role: "开发者", team: "应用组", twoFactor: false, status: "在线", lastActive: "5 分钟前", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
	{ id: "u5", name: "赵可", email: "zhao.ke@nova.dev", initials: "赵", role: "只读", team: "数据组", twoFactor: false, status: "离开", lastActive: "3 小时前", color: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
	{ id: "u6", name: "沈舟", email: "shen.zhou@nova.dev", initials: "沈", role: "开发者", team: "网关组", twoFactor: true, status: "在线", lastActive: "11 分钟前", color: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
	{ id: "u7", name: "许澄", email: "xu.cheng@nova.dev", initials: "许", role: "只读", team: "数据组", twoFactor: false, status: "停用", lastActive: "12 天前", color: "bg-secondary text-secondary-foreground" },
];

export const REUI_ACTIVITY = [
	{ id: "a1", actor: "王一鸣", action: "将「请求重试策略可配置化」移动到进行中", time: "8 分钟前", tone: "blue" },
	{ id: "a2", actor: "林嘉", action: "提交了预算告警阈值的评审请求", time: "34 分钟前", tone: "violet" },
	{ id: "a3", actor: "陈晓", action: "创建了 API Key「ci-pipeline」", time: "1 小时前", tone: "neutral" },
	{ id: "a4", actor: "周雨", action: "修复了日志抽屉的滚动性能问题", time: "2 小时前", tone: "emerald" },
	{ id: "a5", actor: "系统", action: "us-west-2 区域延迟短暂升高，已恢复", time: "4 小时前", tone: "amber" },
];

export const COST_BREAKDOWN = [
	{ model: "Claude Sonnet 4.5", provider: "Anthropic", requests: 342_180, tokens: "1.24B", cost: 2840, share: 38 },
	{ model: "GPT-4o", provider: "OpenAI", requests: 281_440, tokens: "986M", cost: 2210, share: 30 },
	{ model: "DeepSeek V3", provider: "DeepSeek", requests: 198_320, tokens: "1.51B", cost: 1180, share: 16 },
	{ model: "Gemini 2.5 Pro", provider: "Google", requests: 94_210, tokens: "388M", cost: 720, share: 10 },
	{ model: "其他", provider: "4 个提供商", requests: 51_630, tokens: "142M", cost: 460, share: 6 },
];

export const MONTHLY_COST = [
	{ month: "5 月", anthropic: 1480, openai: 1720, deepseek: 520, google: 310 },
	{ month: "6 月", anthropic: 1720, openai: 1680, deepseek: 640, google: 360 },
	{ month: "7 月", anthropic: 1960, openai: 1810, deepseek: 780, google: 420 },
	{ month: "8 月", anthropic: 2180, openai: 1940, deepseek: 910, google: 510 },
	{ month: "9 月", anthropic: 2520, openai: 2070, deepseek: 1040, google: 610 },
	{ month: "10 月", anthropic: 2840, openai: 2210, deepseek: 1180, google: 720 },
];

export const LATENCY_TREND = [
	{ day: "10-12", p50: 142, p95: 318, p99: 612 },
	{ day: "10-13", p50: 138, p95: 301, p99: 588 },
	{ day: "10-14", p50: 151, p95: 342, p99: 664 },
	{ day: "10-15", p50: 146, p95: 322, p99: 631 },
	{ day: "10-16", p50: 134, p95: 296, p99: 574 },
	{ day: "10-17", p50: 128, p95: 281, p99: 542 },
	{ day: "10-18", p50: 122, p95: 268, p99: 517 },
];
