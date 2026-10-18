import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, Download, ReceiptText, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill } from "@/components/statusPill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/billing")({
	component: BillingPage,
});

const PROJECT_COSTS = [
	{ name: "customer-support", cost: 1284, share: 37 },
	{ name: "internal-copilot", cost: 962, share: 28 },
	{ name: "data-pipeline", cost: 684, share: 20 },
	{ name: "content-studio", cost: 342, share: 10 },
	{ name: "其他项目", cost: 210, share: 5 },
];

const INVOICES = [
	{ id: "INV-2026-10", period: "2026 年 10 月", amount: "$4,120.00", status: "待支付", date: "2026-11-01" },
	{ id: "INV-2026-09", period: "2026 年 9 月", amount: "$3,842.60", status: "已支付", date: "2026-10-01" },
	{ id: "INV-2026-08", period: "2026 年 8 月", amount: "$3,120.40", status: "已支付", date: "2026-09-01" },
	{ id: "INV-2026-07", period: "2026 年 7 月", amount: "$2,784.15", status: "已支付", date: "2026-08-01" },
];

function BillingPage() {
	return (
		<AppShell>
			<PageHeader
				title="账单与用量"
				description="查看当前套餐、预算使用情况、项目成本拆分和历史发票。"
				actions={
					<Button variant="outline" onClick={() => toast.info("支付方式管理在演示中不可用")}>
						<CreditCard className="size-4" />
						支付方式
					</Button>
				}
			/>

			<div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
				<Card className="gap-0 py-0">
					<CardHeader className="flex flex-row items-start justify-between border-b px-5 py-4">
						<div>
							<CardTitle className="flex items-center gap-2 text-sm">
								团队版
								<StatusPill tone="solid">当前套餐</StatusPill>
							</CardTitle>
							<CardDescription className="mt-1 text-xs">适合 10-50 人的团队 · 20M 请求 / 月</CardDescription>
						</div>
						<p className="font-mono text-xl font-semibold">
							$499<span className="text-muted-foreground text-xs font-normal">/月</span>
						</p>
					</CardHeader>
					<CardContent className="px-5 py-5">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">本月请求用量</span>
							<span className="font-mono">12.4M / 20M</span>
						</div>
						<div className="bg-chart-track mt-2 h-2 overflow-hidden rounded-full">
							<div className="bg-foreground/80 h-full rounded-full" style={{ width: "62%" }} />
						</div>
						<p className="text-muted-foreground mt-2 text-[11px]">超出的请求按 $0.02 / 千次计费，下次续费 2026-11-01</p>

						<div className="mt-5 flex flex-wrap items-center gap-2">
							<Button size="sm" onClick={() => toast.success("升级申请已提交")}>
								<Sparkles className="size-3.5" />
								升级套餐
							</Button>
							<Button variant="outline" size="sm" onClick={() => toast.info("账单设置在演示中不可用")}>
								账单设置
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="flex items-center gap-2 text-sm">
							<ReceiptText className="size-4" />
							本月摘要
						</CardTitle>
					</CardHeader>
					<CardContent className="px-5 py-4">
						<div className="space-y-3 text-[13px]">
							{[
								["套餐费用", "$499.00"],
								["按量计费", "$813.20"],
								["缓存折扣", "-$182.40"],
							].map(([label, value]) => (
								<div key={label} className="flex items-center justify-between">
									<span className="text-muted-foreground">{label}</span>
									<span className="font-mono tabular-nums">{value}</span>
								</div>
							))}
							<div className="flex items-center justify-between border-t pt-3 font-medium">
								<span>本期合计</span>
								<span className="font-mono">$1,129.80</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">预算使用</span>
								<span className="font-mono">62% / $5,000</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="本月支出" value="$3,482" trend="+6.8%" hint="截至 10 月 18 日" />
				<Metric label="月度预算" value="$5,000" hint="剩余 $1,518" />
				<Metric label="预计月底" value="$4,120" trend="在预算内" hint="基于当前用量推算" />
				<Metric label="缓存节省" value="$1,240" trend="+18%" hint="相比未命中缓存" />
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-5 py-4">
						<CardTitle className="text-sm">项目成本拆分</CardTitle>
						<CardDescription className="mt-1 text-xs">本月按项目汇总</CardDescription>
					</CardHeader>
					<CardContent className="px-5 py-4">
						<ul className="space-y-4">
							{PROJECT_COSTS.map((project) => (
								<li key={project.name}>
									<div className="mb-1.5 flex items-baseline justify-between gap-2">
										<span className="text-[13px]">{project.name}</span>
										<span className="font-mono text-xs tabular-nums">${project.cost.toLocaleString("en-US")}</span>
									</div>
									<div className="bg-chart-track h-1.5 overflow-hidden rounded-full">
										<div className="bg-foreground/70 h-full rounded-full" style={{ width: `${project.share}%` }} />
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card className="gap-0 py-0">
					<CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
						<div>
							<CardTitle className="text-sm">历史发票</CardTitle>
							<CardDescription className="mt-1 text-xs">最近 4 个月的账单记录</CardDescription>
						</div>
						<Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success("已下载全部发票")}>
							<Download className="size-3.5" />
							全部下载
						</Button>
					</CardHeader>
					<CardContent className="px-0">
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="pl-5">发票编号</TableHead>
									<TableHead>周期</TableHead>
									<TableHead className="text-right">金额</TableHead>
									<TableHead>状态</TableHead>
									<TableHead className="pr-5 text-right">日期</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{INVOICES.map((invoice) => (
									<TableRow key={invoice.id}>
										<TableCell className="pl-5 font-mono text-xs">{invoice.id}</TableCell>
										<TableCell className="text-[13px]">{invoice.period}</TableCell>
										<TableCell className="text-right font-mono text-xs tabular-nums">{invoice.amount}</TableCell>
										<TableCell>
											<StatusPill tone={invoice.status === "已支付" ? "info" : "warning"} dot>
												{invoice.status}
											</StatusPill>
										</TableCell>
										<TableCell className="text-muted-foreground pr-5 text-right font-mono text-xs">{invoice.date}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</AppShell>
	);
}
