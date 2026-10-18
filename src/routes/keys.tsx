import { createFileRoute } from "@tanstack/react-router";
import { Copy, Ellipsis, KeyRound, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/dataTable";
import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill, type StatusTone } from "@/components/statusPill";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export const Route = createFileRoute("/keys")({
	component: KeysPage,
});

type KeyStatus = "active" | "revoked";

type ApiKey = {
	id: string;
	name: string;
	masked: string;
	scopes: string[];
	createdAt: string;
	lastUsed: string;
	status: KeyStatus;
};

const SCOPES = [
	{ key: "inference", label: "推理调用", description: "调用 /v1/chat/completions 等推理接口" },
	{ key: "models", label: "读取模型", description: "列出可用模型与定价信息" },
	{ key: "logs", label: "读取日志", description: "读取请求日志与用量统计" },
	{ key: "admin", label: "管理配置", description: "修改提供商、项目与路由配置" },
];

const INITIAL_KEYS: ApiKey[] = [
	{ id: "key_01", name: "生产环境", masked: "sk-nova-••••••••3f9a", scopes: ["inference", "models"], createdAt: "2026-08-12", lastUsed: "刚刚", status: "active" },
	{ id: "key_02", name: "客服工作流", masked: "sk-nova-••••••••b21c", scopes: ["inference"], createdAt: "2026-09-03", lastUsed: "12 分钟前", status: "active" },
	{ id: "key_03", name: "数据分析", masked: "sk-nova-••••••••7d4e", scopes: ["models", "logs"], createdAt: "2026-09-18", lastUsed: "2 小时前", status: "active" },
	{ id: "key_04", name: "CI 测试", masked: "sk-nova-••••••••9a10", scopes: ["inference", "models"], createdAt: "2026-07-01", lastUsed: "昨天", status: "active" },
	{ id: "key_05", name: "旧版移动端", masked: "sk-nova-••••••••0c7b", scopes: ["inference"], createdAt: "2025-12-20", lastUsed: "45 天前", status: "revoked" },
	{ id: "key_06", name: "运维脚本", masked: "sk-nova-••••••••e5d2", scopes: ["admin", "logs", "models"], createdAt: "2026-10-02", lastUsed: "3 天前", status: "active" },
];

const SCOPE_LABEL: Record<string, string> = {
	inference: "推理",
	models: "模型",
	logs: "日志",
	admin: "管理",
};

function KeysPage() {
	const [keys, setKeys] = useState(INITIAL_KEYS);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("all");
	const [createOpen, setCreateOpen] = useState(false);
	const [name, setName] = useState("");
	const [scopes, setScopes] = useState<string[]>(["inference"]);
	const [expiry, setExpiry] = useState("90");
	const [createdKey, setCreatedKey] = useState<string | null>(null);

	const rows = useMemo(
		() =>
			keys.filter((key) => {
				const matchesQuery = !query || `${key.name} ${key.masked}`.toLowerCase().includes(query.toLowerCase());
				return matchesQuery && (status === "all" || key.status === status);
			}),
		[keys, query, status],
	);

	function copy(text: string, message = "已复制到剪贴板") {
		void navigator.clipboard?.writeText(text).catch(() => {});
		toast.success(message);
	}

	function createKey() {
		if (!name.trim()) {
			toast.error("请输入密钥名称");
			return;
		}
		if (scopes.length === 0) {
			toast.error("至少选择一个权限范围");
			return;
		}
		const full = `sk-nova-${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`;
		setKeys((current) => [
			{
				id: `key_${Date.now()}`,
				name: name.trim(),
				masked: `sk-nova-••••••••${full.slice(-4)}`,
				scopes,
				createdAt: "2026-10-18",
				lastUsed: "从未使用",
				status: "active",
			},
			...current,
		]);
		setCreatedKey(full);
		setCreateOpen(false);
		setName("");
		setScopes(["inference"]);
		toast.success("API 密钥已创建");
	}

	const columns: Column<ApiKey>[] = [
		{
			key: "name",
			header: "名称",
			sortable: true,
			sortValue: (row) => row.name,
			cell: (row) => (
				<div className="flex items-center gap-2">
					<KeyRound className="text-muted-foreground size-3.5" />
					<span className="text-[13px] font-medium">{row.name}</span>
				</div>
			),
		},
		{
			key: "key",
			header: "密钥",
			cell: (row) => (
				<div className="flex items-center gap-1.5">
					<span className="font-mono text-xs">{row.masked}</span>
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground size-5"
						aria-label="复制密钥"
						disabled={row.status === "revoked"}
						onClick={() => copy(row.masked, "密钥前缀已复制")}
					>
						<Copy className="size-3" />
					</Button>
				</div>
			),
		},
		{
			key: "scopes",
			header: "权限范围",
			cell: (row) => (
				<div className="flex flex-wrap gap-1">
					{row.scopes.map((scope) => (
						<span key={scope} className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[10px]">
							{SCOPE_LABEL[scope] ?? scope}
						</span>
					))}
				</div>
			),
		},
		{
			key: "createdAt",
			header: "创建时间",
			sortable: true,
			sortValue: (row) => row.createdAt,
			cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.createdAt}</span>,
		},
		{
			key: "lastUsed",
			header: "最近使用",
			cell: (row) => <span className="text-muted-foreground text-xs">{row.lastUsed}</span>,
		},
		{
			key: "status",
			header: "状态",
			cell: (row) => {
				const tone: StatusTone = row.status === "active" ? "info" : "neutral";
				return (
					<StatusPill tone={tone} dot>
						{row.status === "active" ? "有效" : "已吊销"}
					</StatusPill>
				);
			},
		},
		{
			key: "actions",
			header: "",
			cell: (row) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-7" aria-label="密钥操作">
							<Ellipsis className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-36">
						<DropdownMenuItem disabled={row.status === "revoked"} onClick={() => copy(row.masked, "密钥前缀已复制")}>
							<Copy className="size-4" />
							复制
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							variant="destructive"
							disabled={row.status === "revoked"}
							onClick={() => {
								setKeys((current) => current.map((key) => (key.id === row.id ? { ...key, status: "revoked" } : key)));
								toast.success(`${row.name} 已吊销`);
							}}
						>
							<Trash2 className="size-4" />
							吊销密钥
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
			className: "w-12",
		},
	];

	return (
		<AppShell>
			<PageHeader
				title="API 密钥"
				description="为不同服务和环境创建独立的 API 密钥，按最小权限原则分配范围。"
				actions={
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="size-4" />
						创建密钥
					</Button>
				}
			/>

			<div className="bg-muted/30 mb-5 flex items-start gap-2.5 rounded-lg border px-4 py-3">
				<ShieldAlert className="text-chart-warning-ink mt-0.5 size-4 shrink-0" />
				<p className="text-muted-foreground text-xs leading-5">
					密钥只在创建时完整展示一次。请勿把密钥提交到代码仓库；如怀疑泄露，请立即吊销并重新创建。
				</p>
			</div>

			<div className="mb-3 flex flex-wrap items-center gap-2">
				<div className="text-muted-foreground focus-within:border-ring/60 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 transition-colors sm:w-64">
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="搜索密钥名称…"
						className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
					/>
				</div>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部状态</SelectItem>
						<SelectItem value="active">有效</SelectItem>
						<SelectItem value="revoked">已吊销</SelectItem>
					</SelectContent>
				</Select>
				<span className="text-muted-foreground ml-auto text-xs">{rows.length} 个密钥</span>
			</div>

			<DataTable columns={columns} rows={rows} pageSize={8} emptyText="没有匹配的密钥" />

			<Dialog open={createOpen} onOpenChange={setCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>创建 API 密钥</DialogTitle>
						<DialogDescription>按用途选择权限范围，创建后请立即保存密钥。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="key-name">名称</Label>
							<Input
								id="key-name"
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="例如：生产环境"
								className="mt-1.5"
							/>
						</div>
						<div>
							<Label>权限范围</Label>
							<div className="mt-1.5 space-y-2">
								{SCOPES.map((scope) => (
									<label key={scope.key} className="flex cursor-pointer items-start gap-2.5 rounded-md border p-2.5">
										<Checkbox
											checked={scopes.includes(scope.key)}
											onCheckedChange={(checked) =>
												setScopes((current) =>
													checked === true ? [...current, scope.key] : current.filter((item) => item !== scope.key),
												)
											}
											className="mt-0.5"
										/>
										<span>
											<span className="block text-[13px] font-medium">{scope.label}</span>
											<span className="text-muted-foreground mt-0.5 block text-xs">{scope.description}</span>
										</span>
									</label>
								))}
							</div>
						</div>
						<div>
							<Label>有效期</Label>
							<Select value={expiry} onValueChange={setExpiry}>
								<SelectTrigger className="mt-1.5 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="30">30 天</SelectItem>
									<SelectItem value="90">90 天</SelectItem>
									<SelectItem value="365">1 年</SelectItem>
									<SelectItem value="never">永不过期</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setCreateOpen(false)}>
							取消
						</Button>
						<Button onClick={createKey}>创建密钥</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={createdKey !== null} onOpenChange={(open) => !open && setCreatedKey(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>密钥已创建</DialogTitle>
						<DialogDescription>这是唯一一次完整展示，请立即复制并妥善保存。</DialogDescription>
					</DialogHeader>
					<div className="bg-muted/40 rounded-md border p-3">
						<code className="block break-all font-mono text-xs">{createdKey}</code>
					</div>
					<DialogFooter>
						<Button onClick={() => copy(createdKey ?? "", "完整密钥已复制")}>
							<Copy className="size-4" />
							复制密钥
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
