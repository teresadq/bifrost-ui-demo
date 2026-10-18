import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { ModelUsage } from "@/components/dashboard/modelUsage";
import { RecentRequests } from "@/components/dashboard/recentRequests";
import { StatCard } from "@/components/dashboard/statCard";
import { UsageChart } from "@/components/dashboard/usageChart";
import { Button } from "@/components/ui/button";
import { STATS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
});

const RANGES = ["7 天", "14 天", "30 天"] as const;

function greeting() {
	const hour = new Date().getHours();
	if (hour < 6) return "夜深了";
	if (hour < 12) return "早上好";
	if (hour < 18) return "下午好";
	return "晚上好";
}

function displayName() {
	try {
		const stored = localStorage.getItem("nova:user");
		if (stored) return JSON.parse(stored).name ?? "陈晓";
	} catch {
		// ignore malformed local data
	}
	return "陈晓";
}

function DashboardPage() {
	const [range, setRange] = useState<(typeof RANGES)[number]>("14 天");
	const [name] = useState(displayName);

	return (
		<AppShell>
			<div className="mb-5 flex flex-wrap items-end justify-between gap-3">
				<div>
					<h1 className="text-xl font-semibold tracking-tight">概览</h1>
					<p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
						<span>
							{greeting()}，{name}。这是网关最近 {range.replace(" ", "")}的运行情况。
						</span>
						<span className="inline-flex items-center gap-1.5 text-xs">
							<span className="bg-chart-info size-1.5 rounded-full" />
							<span className="text-muted-foreground">所有系统运行正常</span>
						</span>
					</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="bg-card flex items-center rounded-sm border p-0.5" role="group" aria-label="时间范围">
						{RANGES.map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => setRange(option)}
								aria-pressed={range === option}
								className={cn(
									"cursor-pointer rounded-[3px] px-2.5 py-1 text-xs transition-colors",
									range === option
										? "bg-secondary text-foreground font-medium shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								{option}
							</button>
						))}
					</div>
					<Button
						variant="outline"
						size="sm"
						className="h-8"
						onClick={() => toast.success("报告已生成", { description: "演示模式：不会下载任何文件" })}
					>
						<Download className="size-3.5" />
						导出报表
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{STATS.map((stat) => (
					<StatCard key={stat.label} {...stat} />
				))}
			</div>

			<div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
				<UsageChart />
				<ModelUsage />
			</div>

			<div className="mt-3">
				<RecentRequests />
			</div>

			<p className="text-muted-foreground/70 mt-4 text-center text-[11px]">
				Nova 控制台 · 设计参考 Bifrost UI 设计系统 · 纯静态演示，数据均为虚构
			</p>
		</AppShell>
	);
}
