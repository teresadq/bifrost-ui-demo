import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill } from "@/components/statusPill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/status")({
	component: StatusPage,
});

const SERVICES = [
	{ name: "API 网关", description: "推理与管理 API", uptime: "99.99%", latency: "12 ms", status: "operational" },
	{ name: "控制台", description: "管理界面与静态资源", uptime: "100%", latency: "38 ms", status: "operational" },
	{ name: "推理路由", description: "提供商选择与故障转移", uptime: "99.98%", latency: "9 ms", status: "operational" },
	{ name: "计费服务", description: "用量统计与预算核算", uptime: "99.99%", latency: "24 ms", status: "operational" },
	{ name: "审计与日志", description: "事件写入与检索", uptime: "99.97%", latency: "41 ms", status: "operational" },
	{ name: "Webhook 投递", description: "外部事件通知", uptime: "99.92%", latency: "86 ms", status: "degraded" },
];

const INCIDENTS = [
	{
		id: "inc_1",
		date: "2026-10-12",
		title: "Webhook 投递延迟升高",
		duration: "23 分钟",
		status: "已恢复",
		description: "部分 Webhook 事件因下游重试队列积压延迟投递，已扩容队列并补充监控。",
	},
	{
		id: "inc_2",
		date: "2026-09-28",
		title: "Anthropic 提供商短时 429",
		duration: "8 分钟",
		status: "已恢复",
		description: "上游限流导致部分请求重试，自动故障转移至备用密钥后恢复。",
	},
	{
		id: "inc_3",
		date: "2026-09-03",
		title: "控制台计划内维护",
		duration: "15 分钟",
		status: "已完成",
		description: "升级控制台依赖与数据库索引，管理 API 短暂不可用，推理服务未受影响。",
	},
];

function uptimeBars(seed: number) {
	return Array.from({ length: 30 }, (_, index) => {
		const value = (index * 37 + seed * 17) % 100;
		return value < 1 ? "down" : value < 4 ? "degraded" : "up";
	});
}

function StatusPage() {
	return (
		<AppShell>
			<PageHeader
				title="系统状态"
				description="服务健康、可用性与历史事件。数据每 60 秒刷新一次。"
				actions={
					<Button variant="outline" onClick={() => toast.success("状态已刷新")}>
						<RefreshCw className="size-4" />
						刷新
					</Button>
				}
			/>

			<div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-chart-info/25 bg-chart-info/5 px-4 py-3">
				<CheckCircle2 className="text-chart-info-ink size-5 shrink-0" />
				<div className="flex-1">
					<p className="text-[13px] font-medium">所有核心系统运行正常</p>
					<p className="text-muted-foreground mt-0.5 text-xs">Webhook 投递轻微延迟，正在观察中 · 更新于 30 秒前</p>
				</div>
				<StatusPill tone="info" dot>
					运行正常
				</StatusPill>
			</div>

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="整体可用性" value="99.99%" hint="最近 30 天" />
				<Metric label="平均延迟" value="12 ms" hint="网关内部处理" />
				<Metric label="进行中事件" value="0" hint="暂无未恢复事件" />
				<Metric label="最近事件" value="6 天前" hint="Webhook 延迟" />
			</div>

			<div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
				{SERVICES.map((service, index) => {
					const bars = uptimeBars(index + 1);
					return (
						<Card key={service.name} className="gap-0 py-0">
							<CardHeader className="flex flex-row items-start justify-between px-4 py-3.5">
								<div>
									<CardTitle className="text-[13px]">{service.name}</CardTitle>
									<p className="text-muted-foreground mt-1 text-[11px]">{service.description}</p>
								</div>
								<StatusPill tone={service.status === "operational" ? "info" : "warning"} dot>
									{service.status === "operational" ? "正常" : "轻微延迟"}
								</StatusPill>
							</CardHeader>
							<div className="flex items-end gap-0.5 px-4 pb-2" aria-hidden>
								{bars.map((bar, barIndex) => (
									<span
										key={barIndex}
										className={cn(
											"h-7 flex-1 rounded-[1px]",
											bar === "up" && "bg-chart-info/70",
											bar === "degraded" && "bg-chart-warning/80",
											bar === "down" && "bg-destructive/80",
										)}
									/>
								))}
							</div>
							<div className="text-muted-foreground flex items-center justify-between border-t px-4 py-2.5 text-[11px]">
								<span>可用性 {service.uptime}</span>
								<span className="font-mono">P95 {service.latency}</span>
							</div>
						</Card>
					);
				})}
			</div>

			<Card className="mt-4 gap-0 py-0">
				<CardHeader className="border-b px-5 py-4">
					<CardTitle className="text-sm">历史事件</CardTitle>
					<p className="text-muted-foreground mt-1 text-xs">最近 90 天的故障与维护记录</p>
				</CardHeader>
				<CardContent className="px-0">
					<ul>
						{INCIDENTS.map((incident) => (
							<li key={incident.id} className="border-b px-5 py-4 last:border-b-0">
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-muted-foreground font-mono text-xs">{incident.date}</span>
									<span className="text-[13px] font-medium">{incident.title}</span>
									<StatusPill tone="info" className="ml-auto">
										{incident.status}
									</StatusPill>
									<span className="text-muted-foreground font-mono text-[11px]">持续 {incident.duration}</span>
								</div>
								<p className="text-muted-foreground mt-1.5 text-xs leading-5">{incident.description}</p>
							</li>
						))}
					</ul>
				</CardContent>
			</Card>
		</AppShell>
	);
}
