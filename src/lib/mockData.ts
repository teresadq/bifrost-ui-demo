export const TREND_DATA = [
	{ date: "10-05", success: 42800, error: 320 },
	{ date: "10-06", success: 46200, error: 280 },
	{ date: "10-07", success: 38100, error: 410 },
	{ date: "10-08", success: 51400, error: 360 },
	{ date: "10-09", success: 58300, error: 520 },
	{ date: "10-10", success: 49800, error: 300 },
	{ date: "10-11", success: 45100, error: 240 },
	{ date: "10-12", success: 62700, error: 610 },
	{ date: "10-13", success: 71400, error: 480 },
	{ date: "10-14", success: 69300, error: 390 },
	{ date: "10-15", success: 76800, error: 540 },
	{ date: "10-16", success: 84200, error: 620 },
	{ date: "10-17", success: 91800, error: 470 },
	{ date: "10-18", success: 88400, error: 410 },
];

export const STATS = [
	{
		label: "总请求数",
		value: "1,284,392",
		delta: "+12.4%",
		positive: true,
		spark: [38, 42, 40, 48, 52, 49, 58, 62, 60, 68, 74, 78],
	},
	{
		label: "平均延迟",
		value: "214 ms",
		delta: "-8.1%",
		positive: true,
		spark: [64, 62, 58, 60, 54, 52, 50, 48, 46, 44, 42, 41],
	},
	{
		label: "成功率",
		value: "99.94%",
		delta: "+0.02%",
		positive: true,
		spark: [58, 60, 57, 61, 63, 62, 66, 68, 67, 70, 72, 73],
	},
	{
		label: "Token 消耗",
		value: "1.92 B",
		delta: "+6.8%",
		positive: false,
		spark: [30, 36, 34, 40, 38, 46, 44, 50, 55, 52, 58, 61],
	},
];

export const MODEL_USAGE = [
	{ name: "GPT-4o", provider: "OpenAI", share: 38, color: "var(--chart-cat-1)" },
	{ name: "Claude Sonnet 4.5", provider: "Anthropic", share: 27, color: "var(--chart-cat-2)" },
	{ name: "DeepSeek V3", provider: "DeepSeek", share: 18, color: "var(--chart-cat-5)" },
	{ name: "Gemini 2.5 Pro", provider: "Google", share: 11, color: "var(--chart-cat-3)" },
	{ name: "其他", provider: "4 个提供商", share: 6, color: "var(--chart-cat-other)" },
];

export type RequestStatus = "success" | "error" | "retry";

export const RECENT_REQUESTS: {
	id: string;
	model: string;
	provider: string;
	status: RequestStatus;
	latency: string;
	tokens: string;
	time: string;
}[] = [
	{
		id: "req_9f3a21",
		model: "claude-sonnet-4-5",
		provider: "Anthropic",
		status: "success",
		latency: "182 ms",
		tokens: "2,481",
		time: "14:32:08",
	},
	{
		id: "req_9f3a1e",
		model: "gpt-4o",
		provider: "OpenAI",
		status: "success",
		latency: "241 ms",
		tokens: "1,902",
		time: "14:31:54",
	},
	{
		id: "req_9f3a17",
		model: "deepseek-v3",
		provider: "DeepSeek",
		status: "retry",
		latency: "1,284 ms",
		tokens: "3,170",
		time: "14:31:47",
	},
	{
		id: "req_9f3a10",
		model: "gemini-2.5-pro",
		provider: "Google",
		status: "success",
		latency: "308 ms",
		tokens: "5,632",
		time: "14:31:29",
	},
	{
		id: "req_9f3a09",
		model: "gpt-4o-mini",
		provider: "OpenAI",
		status: "success",
		latency: "96 ms",
		tokens: "842",
		time: "14:31:12",
	},
	{
		id: "req_9f3a02",
		model: "claude-haiku-4.5",
		provider: "Anthropic",
		status: "error",
		latency: "—",
		tokens: "0",
		time: "14:30:58",
	},
	{
		id: "req_9f39fb",
		model: "deepseek-v3",
		provider: "DeepSeek",
		status: "success",
		latency: "211 ms",
		tokens: "1,244",
		time: "14:30:41",
	},
];

export const NAV_GROUPS = [
	{
		label: "工作台",
		items: [
			{ icon: "layout-dashboard", label: "概览", active: true },
			{ icon: "scroll-text", label: "请求日志" },
			{ icon: "bar-chart-3", label: "分析报表" },
		],
	},
	{
		label: "配置",
		items: [
			{ icon: "server", label: "提供商" },
			{ icon: "boxes", label: "模型目录" },
			{ icon: "key-round", label: "API 密钥" },
			{ icon: "users", label: "团队成员" },
		],
	},
	{
		label: "系统",
		items: [
			{ icon: "settings", label: "设置" },
			{ icon: "life-buoy", label: "帮助中心" },
		],
	},
] as const;
