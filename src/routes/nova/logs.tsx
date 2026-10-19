import { createFileRoute } from "@tanstack/react-router";
import { Download, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/dataTable";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill, type StatusTone } from "@/components/statusPill";
import { AppShell } from "@/components/dashboard/appShell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nova/logs")({
	component: LogsPage,
});

type LogStatus = "success" | "error" | "retry";

type LogEntry = {
	id: string;
	time: string;
	type: "Chat" | "Embeddings" | "Tools";
	provider: string;
	model: string;
	status: LogStatus;
	latency: number | null;
	tokensIn: number;
	tokensOut: number;
	cost: number;
	requestBody: string;
	responseBody: string;
};

const STATUS_TONE: Record<LogStatus, StatusTone> = {
	success: "info",
	error: "danger",
	retry: "warning",
};

const STATUS_LABEL: Record<LogStatus, string> = {
	success: "成功",
	error: "失败",
	retry: "重试",
};

const PROVIDERS = ["OpenAI", "Anthropic", "Google", "DeepSeek", "Bedrock"];

function makeLog(index: number): LogEntry {
	const providers: { name: string; models: string[] }[] = [
		{ name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "o3"] },
		{ name: "Anthropic", models: ["claude-sonnet-4-5", "claude-haiku-4.5"] },
		{ name: "Google", models: ["gemini-2.5-pro", "gemini-2.5-flash"] },
		{ name: "DeepSeek", models: ["deepseek-v3", "deepseek-r1"] },
		{ name: "Bedrock", models: ["anthropic.claude-sonnet-4-5"] },
	];
	const provider = providers[index % providers.length];
	const model = provider.models[index % provider.models.length];
	const statuses: LogStatus[] = ["success", "success", "success", "retry", "success", "error"];
	const status = statuses[index % statuses.length];
	const types: LogEntry["type"][] = ["Chat", "Chat", "Embeddings", "Tools"];
	const tokensIn = 120 + ((index * 137) % 1800);
	const tokensOut = 40 + ((index * 89) % 700);
	const latency = status === "error" ? null : 80 + ((index * 311) % 1400);

	return {
		id: `req_${(918273 - index * 37).toString(16)}`,
		time: `10-18 ${String(14 - Math.floor(index / 6)).padStart(2, "0")}:${String(58 - (index % 6) * 7).padStart(2, "0")}:0${index % 9}`,
		type: types[index % types.length],
		provider: provider.name,
		model,
		status,
		latency,
		tokensIn,
		tokensOut,
		cost: Number(((tokensIn * 2.5 + tokensOut * 10) / 1_000_000).toFixed(5)),
		requestBody: JSON.stringify(
			{
				model,
				messages: [
					{ role: "system", content: "你是一个乐于助人的助手。" },
					{ role: "user", content: "请总结这段客服工单的核心诉求。" },
				],
				temperature: 0.7,
				max_tokens: 1024,
				stream: true,
			},
			null,
			2,
		),
		responseBody:
			status === "error"
				? JSON.stringify({ error: { type: "upstream_timeout", message: "Provider did not respond within 30s" } }, null, 2)
				: JSON.stringify(
						{
							id: `chatcmpl-${index}81a`,
							object: "chat.completion",
							model,
							usage: { prompt_tokens: tokensIn, completion_tokens: tokensOut, total_tokens: tokensIn + tokensOut },
							choices: [{ index: 0, message: { role: "assistant", content: "工单核心诉求是希望在预算耗尽前提升额度。" }, finish_reason: "stop" }],
						},
						null,
						2,
					),
	};
}

const INITIAL_LOGS = Array.from({ length: 26 }, (_, index) => makeLog(index));

function LogsPage() {
	const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
	const [query, setQuery] = useState("");
	const [provider, setProvider] = useState("all");
	const [status, setStatus] = useState("all");
	const [type, setType] = useState("all");
	const [live, setLive] = useState(false);
	const [activeId, setActiveId] = useState<string | null>(null);
	const active = logs.find((log) => log.id === activeId) ?? null;

	useEffect(() => {
		if (!live) return;
		let counter = 100;
		const interval = setInterval(() => {
			counter += 1;
			setLogs((current) => [makeLog(counter), ...current].slice(0, 60));
		}, 5000);
		return () => clearInterval(interval);
	}, [live]);

	const filtered = useMemo(
		() =>
			logs.filter((log) => {
				const matchesQuery = !query || `${log.id} ${log.model}`.toLowerCase().includes(query.toLowerCase());
				return (
					matchesQuery &&
					(provider === "all" || log.provider === provider) &&
					(status === "all" || log.status === status) &&
					(type === "all" || log.type === type)
				);
			}),
		[logs, query, provider, status, type],
	);

	const columns: Column<LogEntry>[] = [
		{
			key: "time",
			header: "时间",
			sortable: true,
			sortValue: (row) => row.time,
			cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.time}</span>,
		},
		{
			key: "type",
			header: "类型",
			cell: (row) => (
				<span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[11px]">{row.type}</span>
			),
		},
		{
			key: "provider",
			header: "提供商",
			sortable: true,
			sortValue: (row) => row.provider,
			cell: (row) => <span className="text-[13px]">{row.provider}</span>,
		},
		{
			key: "model",
			header: "模型",
			cell: (row) => <span className="font-mono text-xs">{row.model}</span>,
		},
		{
			key: "status",
			header: "状态",
			cell: (row) => (
				<StatusPill tone={STATUS_TONE[row.status]} dot>
					{STATUS_LABEL[row.status]}
				</StatusPill>
			),
		},
		{
			key: "latency",
			header: "延迟",
			sortable: true,
			sortValue: (row) => row.latency ?? 99999,
			cell: (row) => (
				<span className={cn("font-mono text-xs tabular-nums", row.status === "error" && "text-muted-foreground")}>
					{row.latency ? `${row.latency.toLocaleString("en-US")} ms` : "—"}
				</span>
			),
			className: "text-right",
			headClassName: "text-right",
		},
		{
			key: "tokens",
			header: "Token",
			cell: (row) => (
				<span className="font-mono text-xs tabular-nums">
					{row.tokensIn.toLocaleString("en-US")} <span className="text-muted-foreground">+</span>{" "}
					{row.tokensOut.toLocaleString("en-US")}
				</span>
			),
			className: "text-right",
			headClassName: "text-right",
		},
		{
			key: "cost",
			header: "成本",
			sortable: true,
			sortValue: (row) => row.cost,
			cell: (row) => <span className="font-mono text-xs tabular-nums">${row.cost.toFixed(5)}</span>,
			className: "text-right",
			headClassName: "text-right",
		},
	];

	return (
		<AppShell>
			<PageHeader
				title="请求日志"
				description="实时查看每一次模型调用的请求、响应、延迟与成本，点击行查看详情。"
				actions={
					<>
						<label className="flex cursor-pointer items-center gap-2 text-[13px]">
							<Switch checked={live} onCheckedChange={setLive} aria-label="实时日志" />
							<span className={cn("flex items-center gap-1.5", live ? "text-foreground" : "text-muted-foreground")}>
								<span className={cn("size-1.5 rounded-full", live ? "animate-pulse bg-chart-info" : "bg-muted-foreground/40")} />
								实时
							</span>
						</label>
						<Button variant="outline" onClick={() => toast.success("已导出日志（演示）")}>
							<Download className="size-4" />
							导出
						</Button>
					</>
				}
			/>

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="总请求数" value="1,284,392" trend="+12.4%" hint="最近 14 天" />
				<Metric label="成功率" value="99.94%" trend="+0.02%" hint="失败 771 次" />
				<Metric label="平均延迟" value="214 ms" trend="-8.1%" hint="P95 · 1,284 ms" />
				<Metric label="总成本" value="$3,482.10" trend="+6.8%" hint="较上个周期" />
			</div>

			<div className="mb-3 flex flex-wrap items-center gap-2">
				<div className="text-muted-foreground focus-within:border-ring/60 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 transition-colors sm:w-64">
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="搜索请求 ID 或模型…"
						className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
					/>
				</div>
				<Select value={provider} onValueChange={setProvider}>
					<SelectTrigger size="sm" className="w-32 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部提供商</SelectItem>
						{PROVIDERS.map((item) => (
							<SelectItem key={item} value={item}>
								{item}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部状态</SelectItem>
						<SelectItem value="success">成功</SelectItem>
						<SelectItem value="error">失败</SelectItem>
						<SelectItem value="retry">重试</SelectItem>
					</SelectContent>
				</Select>
				<Select value={type} onValueChange={setType}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部类型</SelectItem>
						<SelectItem value="Chat">Chat</SelectItem>
						<SelectItem value="Embeddings">Embeddings</SelectItem>
						<SelectItem value="Tools">Tools</SelectItem>
					</SelectContent>
				</Select>
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground h-8"
					onClick={() => {
						setQuery("");
						setProvider("all");
						setStatus("all");
						setType("all");
					}}
				>
					<RefreshCw className="size-3.5" />
					重置
				</Button>
				<span className="text-muted-foreground ml-auto text-xs">{filtered.length} 条结果</span>
			</div>

			<DataTable
				columns={columns}
				rows={filtered}
				pageSize={10}
				onRowClick={(row) => setActiveId(row.id)}
				emptyText="没有匹配的请求日志"
			/>

			{active && (
				<div className="fixed inset-0 z-40">
					<div className="absolute inset-0 bg-black/30" onClick={() => setActiveId(null)} />
					<aside className="bg-card animate-in slide-in-from-right duration-200 absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col border-l shadow-2xl">
						<div className="flex items-start justify-between gap-3 border-b px-5 py-4">
							<div>
								<p className="font-mono text-sm font-medium">{active.id}</p>
								<p className="text-muted-foreground mt-1 text-xs">
									{active.time} · {active.provider} · {active.model}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<StatusPill tone={STATUS_TONE[active.status]} dot>
									{STATUS_LABEL[active.status]}
								</StatusPill>
								<Button variant="ghost" size="icon" className="size-7" aria-label="关闭" onClick={() => setActiveId(null)}>
									<X className="size-4" />
								</Button>
							</div>
						</div>

						<div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
							<div className="grid grid-cols-2 gap-4">
								{[
									["请求类型", active.type],
									["延迟", active.latency ? `${active.latency} ms` : "—"],
									["输入 Token", active.tokensIn.toLocaleString("en-US")],
									["输出 Token", active.tokensOut.toLocaleString("en-US")],
									["成本", `$${active.cost.toFixed(5)}`],
									["缓存命中", active.status === "success" ? "是 · 1,024 tokens" : "否"],
								].map(([label, value]) => (
									<div key={label}>
										<p className="text-muted-foreground text-[11px]">{label}</p>
										<p className="mt-1 font-mono text-[13px]">{value}</p>
									</div>
								))}
							</div>

							<section className="mt-5">
								<h3 className="mb-2 text-[13px] font-medium">请求体</h3>
								<pre className="bg-muted/40 custom-scrollbar max-h-64 overflow-auto rounded-md border p-3 font-mono text-[11px] leading-5">
									{active.requestBody}
								</pre>
							</section>

							<section className="mt-5">
								<h3 className="mb-2 text-[13px] font-medium">响应体</h3>
								<pre className="bg-muted/40 custom-scrollbar max-h-64 overflow-auto rounded-md border p-3 font-mono text-[11px] leading-5">
									{active.responseBody}
								</pre>
							</section>

							<section className="mt-5">
								<h3 className="mb-2 text-[13px] font-medium">请求头</h3>
								<div className="rounded-md border">
									{[
										["x-bf-project", "customer-support"],
										["x-bf-api-key", "sk-nova-••••3f9a"],
										["x-request-id", active.id],
										["user-agent", "nova-sdk/1.4.0"],
									].map(([key, value], index) => (
										<div
											key={key}
											className={cn("flex items-center justify-between gap-4 px-3 py-2 text-xs", index > 0 && "border-t")}
										>
											<span className="text-muted-foreground font-mono">{key}</span>
											<span className="truncate font-mono">{value}</span>
										</div>
									))}
								</div>
							</section>
						</div>

						<div className="flex items-center justify-end gap-2 border-t px-5 py-3">
							<Button variant="outline" onClick={() => toast.success("已复制请求 ID")}>
								复制 ID
							</Button>
							<Button onClick={() => toast.info("该请求已加入排查清单")}>加入排查</Button>
						</div>
					</aside>
				</div>
			)}
		</AppShell>
	);
}
