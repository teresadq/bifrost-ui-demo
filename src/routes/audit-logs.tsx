import { createFileRoute } from "@tanstack/react-router";
import { Download, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/dataTable";
import { AppShell } from "@/components/dashboard/appShell";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill } from "@/components/statusPill";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/audit-logs")({
	component: AuditLogsPage,
});

type AuditResult = "success" | "failed";

type AuditEntry = {
	id: string;
	time: string;
	actor: string;
	actorEmail: string;
	action: string;
	actionLabel: string;
	target: string;
	ip: string;
	result: AuditResult;
	metadata: Record<string, string>;
};

const ENTRIES: AuditEntry[] = [
	{ id: "au_01", time: "2026-10-18 14:32:08", actor: "陈晓", actorEmail: "admin@nova.dev", action: "key.revoke", actionLabel: "吊销密钥", target: "旧版移动端", ip: "10.12.3.41", result: "success", metadata: { key_id: "key_05", reason: "密钥轮换", project: "customer-support" } },
	{ id: "au_02", time: "2026-10-18 14:20:51", actor: "王敏", actorEmail: "wangmin@nova.dev", action: "member.invite", actionLabel: "邀请成员", target: "zhaolei@nova.dev", ip: "10.12.3.18", result: "success", metadata: { role: "开发者", expires_in: "7d", email_sent: "true" } },
	{ id: "au_03", time: "2026-10-18 13:58:12", actor: "周航", actorEmail: "zhouhang@nova.dev", action: "project.update", actionLabel: "修改项目", target: "internal-copilot", ip: "10.12.9.77", result: "success", metadata: { field: "budget", from: "3000", to: "3600" } },
	{ id: "au_04", time: "2026-10-18 13:41:03", actor: "李娜", actorEmail: "lina@nova.dev", action: "billing.export", actionLabel: "导出账单", target: "2026-09 月度账单", ip: "10.12.4.22", result: "success", metadata: { format: "csv", rows: "184" } },
	{ id: "au_05", time: "2026-10-18 12:17:44", actor: "林菲", actorEmail: "linfei@nova.dev", action: "key.create", actionLabel: "创建密钥", target: "数据分析", ip: "10.12.7.5", result: "success", metadata: { scopes: "models,logs", expires_in: "90d" } },
	{ id: "au_06", time: "2026-10-18 11:52:30", actor: "未知用户", actorEmail: "—", action: "login.failed", actionLabel: "登录失败", target: "控制台", ip: "203.0.113.42", result: "failed", metadata: { reason: "invalid_password", attempts: "3", locked: "false" } },
	{ id: "au_07", time: "2026-10-18 11:20:09", actor: "陈晓", actorEmail: "admin@nova.dev", action: "settings.update", actionLabel: "修改设置", target: "安全策略", ip: "10.12.3.41", result: "success", metadata: { field: "enforce_2fa", from: "false", to: "true" } },
	{ id: "au_08", time: "2026-10-18 10:45:37", actor: "宋涛", actorEmail: "songtao@nova.dev", action: "project.view", actionLabel: "查看项目", target: "data-pipeline", ip: "10.12.8.60", result: "success", metadata: { page: "/projects/data-pipeline" } },
	{ id: "au_09", time: "2026-10-18 10:12:18", actor: "赵磊", actorEmail: "zhaolei@nova.dev", action: "member.invite.accept", actionLabel: "接受邀请", target: "Nova 团队", ip: "198.51.100.7", result: "success", metadata: { role: "开发者", method: "email_link" } },
	{ id: "au_10", time: "2026-10-18 09:48:02", actor: "王敏", actorEmail: "wangmin@nova.dev", action: "role.update", actionLabel: "修改角色", target: "财务", ip: "10.12.3.18", result: "success", metadata: { permission_added: "billing.manage", permission_removed: "none" } },
	{ id: "au_11", time: "2026-10-17 18:31:55", actor: "周航", actorEmail: "zhouhang@nova.dev", action: "provider.test", actionLabel: "测试提供商", target: "Groq", ip: "10.12.9.77", result: "failed", metadata: { status_code: "429", error: "rate_limited", latency_ms: "96" } },
	{ id: "au_12", time: "2026-10-17 17:04:21", actor: "陈晓", actorEmail: "admin@nova.dev", action: "approval.approve", actionLabel: "通过审批", target: "AP-2468", ip: "10.12.3.41", result: "success", metadata: { request: "content-studio 项目续期", comment: "同意续期。" } },
];

const ACTIONS = [
	["key.revoke", "吊销密钥"],
	["key.create", "创建密钥"],
	["member.invite", "邀请成员"],
	["role.update", "修改角色"],
	["project.update", "修改项目"],
	["settings.update", "修改设置"],
	["login.failed", "登录失败"],
	["approval.approve", "通过审批"],
] as const;

function AuditLogsPage() {
	const [query, setQuery] = useState("");
	const [action, setAction] = useState("all");
	const [result, setResult] = useState("all");
	const [activeId, setActiveId] = useState<string | null>(null);
	const active = ENTRIES.find((entry) => entry.id === activeId) ?? null;

	const rows = useMemo(
		() =>
			ENTRIES.filter((entry) => {
				const matchesQuery =
					!query ||
					`${entry.actor} ${entry.actorEmail} ${entry.target} ${entry.action}`.toLowerCase().includes(query.toLowerCase());
				return (
					matchesQuery &&
					(action === "all" || entry.action === action) &&
					(result === "all" || entry.result === result)
				);
			}),
		[query, action, result],
	);

	const columns: Column<AuditEntry>[] = [
		{
			key: "time",
			header: "时间",
			sortable: true,
			sortValue: (row) => row.time,
			cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.time}</span>,
		},
		{
			key: "actor",
			header: "操作者",
			cell: (row) => (
				<div className="flex items-center gap-2">
					<Avatar className="size-6">
						<AvatarFallback className="bg-secondary text-[9px] font-medium">{row.actor.slice(0, 1)}</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-[13px]">{row.actor}</p>
						<p className="text-muted-foreground text-[10px]">{row.actorEmail}</p>
					</div>
				</div>
			),
		},
		{
			key: "action",
			header: "操作",
			cell: (row) => <StatusPill tone="neutral">{row.actionLabel}</StatusPill>,
		},
		{
			key: "target",
			header: "对象",
			cell: (row) => <span className="text-[13px]">{row.target}</span>,
		},
		{
			key: "ip",
			header: "IP",
			cell: (row) => <span className="text-muted-foreground font-mono text-xs">{row.ip}</span>,
		},
		{
			key: "result",
			header: "结果",
			cell: (row) => (
				<StatusPill tone={row.result === "success" ? "info" : "danger"} dot>
					{row.result === "success" ? "成功" : "失败"}
				</StatusPill>
			),
		},
		{
			key: "detail",
			header: "",
			cell: (row) => (
				<Button variant="ghost" size="sm" className="text-muted-foreground h-7 text-xs" onClick={() => setActiveId(row.id)}>
					详情
				</Button>
			),
			className: "text-right",
			headClassName: "text-right",
		},
	];

	return (
		<AppShell>
			<PageHeader
				title="审计日志"
				description="记录所有关键配置变更与登录事件，用于安全审计和合规追溯。"
				actions={
					<Button variant="outline" onClick={() => toast.success("审计日志已导出（演示）")}>
						<Download className="size-4" />
						导出
					</Button>
				}
			/>

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="今日事件" value="42" hint="最近 24 小时" />
				<Metric label="失败操作" value="3" hint="登录失败 2 次" tone="warning" />
				<Metric label="活跃操作者" value="7" hint="最近 24 小时" />
				<Metric label="保留期限" value="365 天" hint="可在设置中调整" />
			</div>

			<div className="mb-3 flex flex-wrap items-center gap-2">
				<div className="text-muted-foreground focus-within:border-ring/60 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 transition-colors sm:w-64">
					<Search className="size-3.5 shrink-0" />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="搜索操作者、对象…"
						className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
					/>
				</div>
				<Select value={action} onValueChange={setAction}>
					<SelectTrigger size="sm" className="w-32 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部操作</SelectItem>
						{ACTIONS.map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={result} onValueChange={setResult}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部结果</SelectItem>
						<SelectItem value="success">成功</SelectItem>
						<SelectItem value="failed">失败</SelectItem>
					</SelectContent>
				</Select>
				<span className="text-muted-foreground ml-auto text-xs">{rows.length} 条记录</span>
			</div>

			<DataTable columns={columns} rows={rows} pageSize={10} emptyText="没有匹配的审计记录" resetKey={`${action}-${result}`} />

			{active && (
				<div className="fixed inset-0 z-40">
					<div className="absolute inset-0 bg-black/30" onClick={() => setActiveId(null)} />
					<aside className="bg-card animate-in slide-in-from-right duration-200 absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col border-l shadow-2xl">
						<div className="flex items-start justify-between gap-3 border-b px-5 py-4">
							<div>
								<p className="text-sm font-medium">{active.actionLabel}</p>
								<p className="text-muted-foreground mt-1 font-mono text-xs">{active.id}</p>
							</div>
							<Button variant="ghost" size="icon" className="size-7" aria-label="关闭" onClick={() => setActiveId(null)}>
								<X className="size-4" />
							</Button>
						</div>
						<div className="custom-scrollbar flex-1 overflow-y-auto px-5 py-4">
							<div className="grid grid-cols-2 gap-4">
								{[
									["操作者", active.actor],
									["邮箱", active.actorEmail],
									["时间", active.time],
									["IP 地址", active.ip],
									["对象", active.target],
									["结果", active.result === "success" ? "成功" : "失败"],
								].map(([label, value]) => (
									<div key={label}>
										<p className="text-muted-foreground text-[11px]">{label}</p>
										<p className="mt-1 text-[13px]">{value}</p>
									</div>
								))}
							</div>
							<section className="mt-6">
								<h3 className="mb-2 text-[13px] font-medium">事件元数据</h3>
								<pre className="bg-muted/40 overflow-auto rounded-md border p-3 font-mono text-[11px] leading-5">
									{JSON.stringify(active.metadata, null, 2)}
								</pre>
							</section>
						</div>
						<div className="flex justify-end gap-2 border-t px-5 py-3">
							<Button variant="outline" onClick={() => toast.success("事件 ID 已复制")}>
								复制事件 ID
							</Button>
							<Button onClick={() => toast.info("已加入合规检查清单")}>加入检查</Button>
						</div>
					</aside>
				</div>
			)}
		</AppShell>
	);
}
