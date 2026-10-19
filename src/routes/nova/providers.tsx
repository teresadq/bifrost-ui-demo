import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Loader2, Plus, RefreshCw, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill, type StatusTone } from "@/components/statusPill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nova/providers")({
	component: ProvidersPage,
});

type ProviderStatus = "active" | "warning" | "unconfigured";

type Provider = {
	id: string;
	name: string;
	mark: string;
	description: string;
	status: ProviderStatus;
	keys: number;
	requests: string;
	latency: string;
	spend: string;
};

const PROVIDERS: Provider[] = [
	{
		id: "openai",
		name: "OpenAI",
		mark: "OA",
		description: "GPT-4o、o3、Embeddings",
		status: "active",
		keys: 3,
		requests: "428.1k",
		latency: "182 ms",
		spend: "$4,820",
	},
	{
		id: "anthropic",
		name: "Anthropic",
		mark: "AN",
		description: "Claude Sonnet / Haiku / Opus",
		status: "active",
		keys: 2,
		requests: "312.8k",
		latency: "241 ms",
		spend: "$3,410",
	},
	{
		id: "google",
		name: "Google Vertex AI",
		mark: "GO",
		description: "Gemini 2.5 Pro / Flash",
		status: "active",
		keys: 1,
		requests: "128.5k",
		latency: "308 ms",
		spend: "$940",
	},
	{
		id: "deepseek",
		name: "DeepSeek",
		mark: "DS",
		description: "V3 / R1 推理模型",
		status: "active",
		keys: 1,
		requests: "208.3k",
		latency: "211 ms",
		spend: "$1,260",
	},
	{
		id: "bedrock",
		name: "AWS Bedrock",
		mark: "BR",
		description: "Claude / Llama / Titan",
		status: "active",
		keys: 2,
		requests: "84.2k",
		latency: "356 ms",
		spend: "$612",
	},
	{
		id: "groq",
		name: "Groq",
		mark: "GQ",
		description: "Llama 3.3 · 高速推理",
		status: "warning",
		keys: 1,
		requests: "41.6k",
		latency: "96 ms",
		spend: "$184",
	},
	{
		id: "ollama",
		name: "Ollama",
		mark: "OL",
		description: "本地自托管模型",
		status: "unconfigured",
		keys: 0,
		requests: "—",
		latency: "—",
		spend: "$0",
	},
	{
		id: "azure",
		name: "Azure OpenAI",
		mark: "AZ",
		description: "企业版 OpenAI 部署",
		status: "unconfigured",
		keys: 0,
		requests: "—",
		latency: "—",
		spend: "$0",
	},
];

const STATUS: Record<ProviderStatus, { label: string; tone: StatusTone }> = {
	active: { label: "运行正常", tone: "info" },
	warning: { label: "限流中", tone: "warning" },
	unconfigured: { label: "未配置", tone: "neutral" },
};

const TABS = [
	{ key: "all", label: "全部" },
	{ key: "active", label: "已启用" },
	{ key: "warning", label: "异常" },
	{ key: "unconfigured", label: "未配置" },
] as const;

function ProvidersPage() {
	const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
	const [testing, setTesting] = useState<string | null>(null);
	const [addOpen, setAddOpen] = useState(false);
	const [newProvider, setNewProvider] = useState("ollama");
	const [apiKey, setApiKey] = useState("");

	const rows = PROVIDERS.filter((provider) => tab === "all" || provider.status === tab);

	async function test(provider: Provider) {
		setTesting(provider.id);
		await new Promise((resolve) => setTimeout(resolve, 900));
		setTesting(null);
		toast.success(`${provider.name} 连通性正常`, { description: "延迟 182 ms · 鉴权通过" });
	}

	function addProvider() {
		if (!apiKey.trim()) {
			toast.error("请输入 API Key");
			return;
		}
		setAddOpen(false);
		setApiKey("");
		toast.success("提供商已添加", { description: "正在进行首次连通性检测…" });
	}

	return (
		<AppShell>
			<PageHeader
				title="提供商"
				description="管理上游模型提供商、API Key 和连通性。异常提供商会被自动降级。"
				actions={
					<>
						<Button variant="outline" onClick={() => toast.success("已刷新提供商状态")}>
							<RefreshCw className="size-4" />
							刷新状态
						</Button>
						<Button onClick={() => setAddOpen(true)}>
							<Plus className="size-4" />
							添加提供商
						</Button>
					</>
				}
			/>

			<div className="mb-4 flex flex-wrap items-center gap-1 border-b">
				{TABS.map((item) => {
					const count = item.key === "all" ? PROVIDERS.length : PROVIDERS.filter((p) => p.status === item.key).length;
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

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{rows.map((provider) => {
					const status = STATUS[provider.status];
					return (
						<Card key={provider.id} className="gap-0 py-0">
							<div className="flex items-start gap-3 p-4">
								<span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-medium">
									{provider.mark}
								</span>
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<p className="text-[13px] font-medium">{provider.name}</p>
										<StatusPill tone={status.tone} dot>
											{status.label}
										</StatusPill>
									</div>
									<p className="text-muted-foreground mt-1 text-xs">{provider.description}</p>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="size-7" aria-label="提供商操作">
											<ChevronRight className="size-4 rotate-90" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-36">
										<DropdownMenuItem onClick={() => toast.info(`配置 ${provider.name}`)}>配置</DropdownMenuItem>
										<DropdownMenuItem onClick={() => test(provider)}>测试连通性</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem variant="destructive" onClick={() => toast.success(`${provider.name} 已停用`)}>
											停用
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div className="grid grid-cols-3 gap-2 border-t px-4 py-3">
								{[
									["密钥", `${provider.keys} 个`],
									["24h 请求", provider.requests],
									["平均延迟", provider.latency],
								].map(([label, value]) => (
									<div key={label}>
										<p className="text-muted-foreground text-[10px]">{label}</p>
										<p className="mt-0.5 font-mono text-xs tabular-nums">{value}</p>
									</div>
								))}
							</div>

							<div className="flex items-center justify-between border-t px-4 py-2.5">
								<span className="text-muted-foreground text-[11px]">
									本月支出 <span className="text-foreground font-mono">{provider.spend}</span>
								</span>
								<Button
									variant="ghost"
									size="sm"
									className="h-7 text-xs"
									disabled={provider.status === "unconfigured" || testing === provider.id}
									onClick={() => test(provider)}
								>
									{testing === provider.id ? <Loader2 className="size-3.5 animate-spin" /> : <Zap className="size-3.5" />}
									测试
								</Button>
							</div>
						</Card>
					);
				})}
			</div>

			<Dialog open={addOpen} onOpenChange={setAddOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>添加提供商</DialogTitle>
						<DialogDescription>选择提供商并填写 API Key，保存后会立即进行连通性测试。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label>提供商</Label>
							<Select value={newProvider} onValueChange={setNewProvider}>
								<SelectTrigger className="mt-1.5 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ollama">Ollama（本地）</SelectItem>
									<SelectItem value="azure">Azure OpenAI</SelectItem>
									<SelectItem value="mistral">Mistral AI</SelectItem>
									<SelectItem value="xai">xAI Grok</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="provider-key">API Key</Label>
							<Input
								id="provider-key"
								type="password"
								value={apiKey}
								onChange={(event) => setApiKey(event.target.value)}
								placeholder="sk-…"
								className="mt-1.5 font-mono"
							/>
							<p className="text-muted-foreground mt-1.5 text-xs">Key 会加密存储，之后不会再完整展示。</p>
						</div>
						<div>
							<Label htmlFor="provider-url">Base URL（可选）</Label>
							<Input id="provider-url" placeholder="https://api.example.com/v1" className="mt-1.5 font-mono" />
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setAddOpen(false)}>
							取消
						</Button>
						<Button onClick={addProvider}>保存并测试</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
