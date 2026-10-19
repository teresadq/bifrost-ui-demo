import { createFileRoute } from "@tanstack/react-router";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/dataTable";
import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill, type StatusTone } from "@/components/statusPill";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/nova/models")({
	component: ModelsPage,
});

type ModelStatus = "available" | "preview" | "deprecated";

type Model = {
	id: string;
	name: string;
	provider: string;
	modality: "文本" | "多模态" | "嵌入";
	context: string;
	contextValue: number;
	inputPrice: number;
	outputPrice: number;
	status: ModelStatus;
	requests: string;
	requestsValue: number;
};

const MODELS: Model[] = [
	{ id: "gpt-4o", name: "gpt-4o", provider: "OpenAI", modality: "多模态", context: "128k", contextValue: 128, inputPrice: 2.5, outputPrice: 10, status: "available", requests: "428.1k", requestsValue: 428100 },
	{ id: "gpt-4o-mini", name: "gpt-4o-mini", provider: "OpenAI", modality: "多模态", context: "128k", contextValue: 128, inputPrice: 0.15, outputPrice: 0.6, status: "available", requests: "96.2k", requestsValue: 96210 },
	{ id: "o3", name: "o3", provider: "OpenAI", modality: "文本", context: "200k", contextValue: 200, inputPrice: 10, outputPrice: 40, status: "preview", requests: "3.4k", requestsValue: 3400 },
	{ id: "claude-sonnet-4-5", name: "claude-sonnet-4-5", provider: "Anthropic", modality: "多模态", context: "200k", contextValue: 200, inputPrice: 3, outputPrice: 15, status: "available", requests: "312.8k", requestsValue: 312800 },
	{ id: "claude-haiku-4-5", name: "claude-haiku-4-5", provider: "Anthropic", modality: "多模态", context: "200k", contextValue: 200, inputPrice: 0.8, outputPrice: 4, status: "available", requests: "64.2k", requestsValue: 64200 },
	{ id: "claude-opus-4-1", name: "claude-opus-4-1", provider: "Anthropic", modality: "多模态", context: "200k", contextValue: 200, inputPrice: 15, outputPrice: 75, status: "available", requests: "8.1k", requestsValue: 8100 },
	{ id: "gemini-2.5-pro", name: "gemini-2.5-pro", provider: "Google", modality: "多模态", context: "1M", contextValue: 1000, inputPrice: 1.25, outputPrice: 10, status: "available", requests: "128.5k", requestsValue: 128500 },
	{ id: "gemini-2.5-flash", name: "gemini-2.5-flash", provider: "Google", modality: "多模态", context: "1M", contextValue: 1000, inputPrice: 0.3, outputPrice: 2.5, status: "available", requests: "77.9k", requestsValue: 77900 },
	{ id: "deepseek-v3", name: "deepseek-v3", provider: "DeepSeek", modality: "文本", context: "128k", contextValue: 128, inputPrice: 0.27, outputPrice: 1.1, status: "available", requests: "208.3k", requestsValue: 208300 },
	{ id: "deepseek-r1", name: "deepseek-r1", provider: "DeepSeek", modality: "文本", context: "64k", contextValue: 64, inputPrice: 0.55, outputPrice: 2.19, status: "available", requests: "31.8k", requestsValue: 31800 },
	{ id: "llama-3.3-70b", name: "llama-3.3-70b", provider: "Groq", modality: "文本", context: "128k", contextValue: 128, inputPrice: 0.59, outputPrice: 0.79, status: "available", requests: "41.6k", requestsValue: 41600 },
	{ id: "mistral-large", name: "mistral-large-latest", provider: "Mistral", modality: "文本", context: "128k", contextValue: 128, inputPrice: 2, outputPrice: 6, status: "preview", requests: "2.1k", requestsValue: 2100 },
	{ id: "text-embedding-3-large", name: "text-embedding-3-large", provider: "OpenAI", modality: "嵌入", context: "8k", contextValue: 8, inputPrice: 0.13, outputPrice: 0, status: "available", requests: "182.4k", requestsValue: 182400 },
	{ id: "gpt-4-turbo", name: "gpt-4-turbo", provider: "OpenAI", modality: "多模态", context: "128k", contextValue: 128, inputPrice: 10, outputPrice: 30, status: "deprecated", requests: "1.2k", requestsValue: 1200 },
];

const STATUS: Record<ModelStatus, { label: string; tone: StatusTone }> = {
	available: { label: "可用", tone: "info" },
	preview: { label: "预览", tone: "purple" },
	deprecated: { label: "已弃用", tone: "neutral" },
};

const PROVIDERS = ["OpenAI", "Anthropic", "Google", "DeepSeek", "Groq", "Mistral"];

function ModelsPage() {
	const [query, setQuery] = useState("");
	const [provider, setProvider] = useState("all");
	const [modality, setModality] = useState("all");
	const [availableOnly, setAvailableOnly] = useState(false);

	const rows = useMemo(
		() =>
			MODELS.filter((model) => {
				const matchesQuery = !query || `${model.name} ${model.provider}`.toLowerCase().includes(query.toLowerCase());
				return (
					matchesQuery &&
					(provider === "all" || model.provider === provider) &&
					(modality === "all" || model.modality === modality) &&
					(!availableOnly || model.status === "available")
				);
			}),
		[query, provider, modality, availableOnly],
	);

	const columns: Column<Model>[] = [
		{
			key: "name",
			header: "模型",
			sortable: true,
			sortValue: (row) => row.name,
			cell: (row) => <span className="font-mono text-xs">{row.name}</span>,
		},
		{
			key: "provider",
			header: "提供商",
			sortable: true,
			sortValue: (row) => row.provider,
			cell: (row) => <span className="text-[13px]">{row.provider}</span>,
		},
		{
			key: "modality",
			header: "模态",
			cell: (row) => <span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[11px]">{row.modality}</span>,
		},
		{
			key: "context",
			header: "上下文",
			sortable: true,
			sortValue: (row) => row.contextValue,
			cell: (row) => <span className="font-mono text-xs">{row.context}</span>,
			className: "text-right",
			headClassName: "text-right",
		},
		{
			key: "input",
			header: "输入 $/1M",
			sortable: true,
			sortValue: (row) => row.inputPrice,
			cell: (row) => <span className="font-mono text-xs tabular-nums">${row.inputPrice.toFixed(2)}</span>,
			className: "text-right",
			headClassName: "text-right",
		},
		{
			key: "output",
			header: "输出 $/1M",
			sortable: true,
			sortValue: (row) => row.outputPrice,
			cell: (row) => <span className="font-mono text-xs tabular-nums">${row.outputPrice.toFixed(2)}</span>,
			className: "text-right",
			headClassName: "text-right",
		},
		{
			key: "requests",
			header: "24h 请求",
			sortable: true,
			sortValue: (row) => row.requestsValue,
			cell: (row) => <span className="font-mono text-xs tabular-nums">{row.requests}</span>,
			className: "text-right",
			headClassName: "text-right",
		},
		{
			key: "status",
			header: "状态",
			cell: (row) => (
				<StatusPill tone={STATUS[row.status].tone} dot>
					{STATUS[row.status].label}
				</StatusPill>
			),
		},
	];

	return (
		<AppShell>
			<PageHeader
				title="模型目录"
				description="查看所有可用模型、上下文窗口与定价。定价用于成本核算和预算告警。"
				actions={
					<>
						<Button variant="outline" onClick={() => toast.success("模型目录已刷新")}>
							<RefreshCw className="size-4" />
							刷新目录
						</Button>
						<Button onClick={() => toast.info("自定义模型在演示中不可用")}>
							<Plus className="size-4" />
							自定义模型
						</Button>
					</>
				}
			/>

			<div className="mb-3 flex flex-wrap items-center gap-2">
				<div className="text-muted-foreground focus-within:border-ring/60 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 transition-colors sm:w-64">
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="搜索模型…"
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
				<Select value={modality} onValueChange={setModality}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部模态</SelectItem>
						<SelectItem value="文本">文本</SelectItem>
						<SelectItem value="多模态">多模态</SelectItem>
						<SelectItem value="嵌入">嵌入</SelectItem>
					</SelectContent>
				</Select>
				<label className="ml-1 flex cursor-pointer items-center gap-2 text-[13px]">
					<Switch checked={availableOnly} onCheckedChange={setAvailableOnly} aria-label="仅显示可用模型" />
					<span className={availableOnly ? "text-foreground" : "text-muted-foreground"}>仅显示可用</span>
				</label>
				<span className="text-muted-foreground ml-auto text-xs">{rows.length} 个模型</span>
			</div>

			<DataTable columns={columns} rows={rows} pageSize={10} emptyText="没有匹配的模型" resetKey={`${provider}-${modality}-${availableOnly}`} />
		</AppShell>
	);
}
