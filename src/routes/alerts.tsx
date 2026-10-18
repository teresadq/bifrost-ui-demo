import { createFileRoute } from "@tanstack/react-router";
import { BellOff, Plus, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/dataTable";
import { AppShell } from "@/components/dashboard/appShell";
import { Metric } from "@/components/metric";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/alerts")({
	component: AlertsPage,
});

type Severity = "critical" | "warning" | "info";
type AlertState = "firing" | "ok";

type AlertRule = {
	id: string;
	name: string;
	metric: string;
	condition: string;
	severity: Severity;
	channels: string[];
	state: AlertState;
	enabled: boolean;
};

const INITIAL_RULES: AlertRule[] = [
	{ id: "al_01", name: "错误率过高", metric: "error_rate", condition: "> 2% 持续 5 分钟", severity: "critical", channels: ["邮件", "Slack"], state: "firing", enabled: true },
	{ id: "al_02", name: "P95 延迟升高", metric: "latency_p95", condition: "> 2,000 ms 持续 10 分钟", severity: "warning", channels: ["Slack"], state: "ok", enabled: true },
	{ id: "al_03", name: "项目预算接近上限", metric: "budget_usage", condition: "> 80% 月度预算", severity: "warning", channels: ["邮件"], state: "ok", enabled: true },
	{ id: "al_04", name: "提供商限流", metric: "provider_rate_limit", condition: "任意 429 响应 > 10 次/分钟", severity: "critical", channels: ["邮件", "Webhook"], state: "ok", enabled: true },
	{ id: "al_05", name: "每日成本异常", metric: "daily_cost", condition: "> 上日均值 150%", severity: "info", channels: ["邮件"], state: "ok", enabled: false },
];

const SEVERITY: Record<Severity, { label: string; tone: StatusTone }> = {
	critical: { label: "严重", tone: "danger" },
	warning: { label: "警告", tone: "warning" },
	info: { label: "提示", tone: "info" },
};

const CHANNELS = ["邮件", "Slack", "Webhook"];

const EVENTS = [
	{ id: "ev_1", time: "14:28:41", rule: "错误率过高", detail: "error_rate = 2.4% · 持续 6 分钟", state: "firing" as AlertState },
	{ id: "ev_2", time: "13:02:10", rule: "P95 延迟升高", detail: "latency_p95 = 2,184 ms · 已恢复", state: "ok" as AlertState },
	{ id: "ev_3", time: "11:47:33", rule: "提供商限流", detail: "Groq 返回 429 · 12 次/分钟", state: "firing" as AlertState },
	{ id: "ev_4", time: "09:15:02", rule: "项目预算接近上限", detail: "customer-support 使用 84% 预算", state: "firing" as AlertState },
];

function AlertsPage() {
	const [rules, setRules] = useState(INITIAL_RULES);
	const [createOpen, setCreateOpen] = useState(false);
	const [name, setName] = useState("");
	const [metric, setMetric] = useState("error_rate");
	const [threshold, setThreshold] = useState("2");
	const [severity, setSeverity] = useState<Severity>("warning");
	const [channels, setChannels] = useState<string[]>(["邮件"]);

	const firing = rules.filter((rule) => rule.enabled && rule.state === "firing");

	function createRule() {
		if (!name.trim()) {
			toast.error("请输入告警名称");
			return;
		}
		setRules((current) => [
			...current,
			{
				id: `al_${Date.now()}`,
				name: name.trim(),
				metric,
				condition: `> ${threshold} 持续 5 分钟`,
				severity,
				channels,
				state: "ok",
				enabled: true,
			},
		]);
		setCreateOpen(false);
		setName("");
		toast.success("告警规则已创建");
	}

	const columns: Column<AlertRule>[] = [
		{
			key: "name",
			header: "告警名称",
			sortable: true,
			sortValue: (row) => row.name,
			cell: (row) => (
				<div>
					<p className="text-[13px] font-medium">{row.name}</p>
					<p className="text-muted-foreground mt-0.5 font-mono text-[10px]">{row.metric}</p>
				</div>
			),
		},
		{
			key: "condition",
			header: "触发条件",
			cell: (row) => <span className="text-muted-foreground text-xs">{row.condition}</span>,
		},
		{
			key: "severity",
			header: "级别",
			cell: (row) => (
				<StatusPill tone={SEVERITY[row.severity].tone} dot>
					{SEVERITY[row.severity].label}
				</StatusPill>
			),
		},
		{
			key: "channels",
			header: "通知渠道",
			cell: (row) => (
				<div className="flex flex-wrap gap-1">
					{row.channels.map((channel) => (
						<span key={channel} className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[10px]">
							{channel}
						</span>
					))}
				</div>
			),
		},
		{
			key: "state",
			header: "状态",
			cell: (row) => (
				<StatusPill tone={row.state === "firing" ? "danger" : "info"} dot>
					{row.state === "firing" ? "触发中" : "正常"}
				</StatusPill>
			),
		},
		{
			key: "enabled",
			header: "启用",
			cell: (row) => (
				<Switch
					checked={row.enabled}
					aria-label={`${row.name} 启用`}
					onCheckedChange={(checked) => {
						setRules((current) => current.map((rule) => (rule.id === row.id ? { ...rule, enabled: checked } : rule)));
						toast.success(checked ? "告警已启用" : "告警已停用");
					}}
				/>
			),
		},
	];

	return (
		<AppShell>
			<PageHeader
				title="告警规则"
				description="针对错误率、延迟、预算和提供商状态配置告警，并通过邮件、Slack 或 Webhook 通知。"
				actions={
					<>
						<Button variant="outline" onClick={() => toast.success("已静默所有告警 1 小时")}>
							<BellOff className="size-4" />
							静默 1 小时
						</Button>
						<Button onClick={() => setCreateOpen(true)}>
							<Plus className="size-4" />
							新建告警
						</Button>
					</>
				}
			/>

			{firing.length > 0 && (
				<div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
					<TriangleAlert className="text-destructive mt-0.5 size-4 shrink-0" />
					<div className="flex-1">
						<p className="text-[13px] font-medium">
							{firing.length} 条告警正在触发
						</p>
						<p className="text-muted-foreground mt-0.5 text-xs">
							{firing.map((rule) => rule.name).join("、")} · 建议立即检查请求日志与提供商状态
						</p>
					</div>
					<Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success("已确认全部告警")}>
						全部确认
					</Button>
				</div>
			)}

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="触发中" value={firing.length} hint="需要处理" tone={firing.length > 0 ? "danger" : "default"} />
				<Metric label="正常" value={rules.filter((rule) => rule.state === "ok").length} hint="最近 24 小时" />
				<Metric label="已启用规则" value={rules.filter((rule) => rule.enabled).length} hint={`共 ${rules.length} 条规则`} />
				<Metric label="已静默" value="0" hint="当前没有静默窗口" />
			</div>

			<DataTable columns={columns} rows={rules} pageSize={8} emptyText="还没有告警规则" />

			<div className="mt-4 rounded-lg border">
				<div className="border-b px-5 py-4">
					<p className="text-sm font-medium">最近事件</p>
					<p className="text-muted-foreground mt-1 text-xs">最近 24 小时的告警状态变化</p>
				</div>
				<ul>
					{EVENTS.map((event) => (
						<li key={event.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b px-5 py-3 last:border-b-0">
							<span className="text-muted-foreground font-mono text-xs">{event.time}</span>
							<span className="text-[13px] font-medium">{event.rule}</span>
							<span className="text-muted-foreground text-xs">{event.detail}</span>
							<StatusPill tone={event.state === "firing" ? "danger" : "info"} dot className="ml-auto">
								{event.state === "firing" ? "触发" : "恢复"}
							</StatusPill>
						</li>
					))}
				</ul>
			</div>

			<Dialog open={createOpen} onOpenChange={setCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>新建告警规则</DialogTitle>
						<DialogDescription>当指标持续满足条件时触发通知。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="alert-name">告警名称</Label>
							<Input
								id="alert-name"
								value={name}
								onChange={(event) => setName(event.target.value)}
								placeholder="例如：错误率过高"
								className="mt-1.5"
							/>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<Label>指标</Label>
								<Select value={metric} onValueChange={setMetric}>
									<SelectTrigger className="mt-1.5 w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="error_rate">错误率</SelectItem>
										<SelectItem value="latency_p95">P95 延迟</SelectItem>
										<SelectItem value="budget_usage">预算使用率</SelectItem>
										<SelectItem value="daily_cost">每日成本</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="alert-threshold">阈值</Label>
								<Input
									id="alert-threshold"
									value={threshold}
									onChange={(event) => setThreshold(event.target.value)}
									className="mt-1.5 font-mono"
								/>
							</div>
						</div>
						<div>
							<Label>严重级别</Label>
							<Select value={severity} onValueChange={(value) => setSeverity(value as Severity)}>
								<SelectTrigger className="mt-1.5 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="critical">严重</SelectItem>
									<SelectItem value="warning">警告</SelectItem>
									<SelectItem value="info">提示</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label>通知渠道</Label>
							<div className="mt-1.5 flex flex-wrap gap-4">
								{CHANNELS.map((channel) => (
									<label key={channel} className="flex cursor-pointer items-center gap-2 text-[13px]">
										<Checkbox
											checked={channels.includes(channel)}
											onCheckedChange={(checked) =>
												setChannels((current) =>
													checked === true ? [...current, channel] : current.filter((item) => item !== channel),
												)
											}
										/>
										{channel}
									</label>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setCreateOpen(false)}>
							取消
						</Button>
						<Button onClick={createRule}>创建规则</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
