import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Circle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/approvals")({
	component: ApprovalsPage,
});

type ChainState = "done" | "current" | "waiting" | "rejected";

type ChainStep = {
	title: string;
	state: ChainState;
	actor?: string;
	time?: string;
	note?: string;
};

type ApprovalStatus = "pending" | "approved" | "rejected";

type Approval = {
	id: string;
	title: string;
	requester: string;
	department: string;
	submitted: string;
	budget: string;
	summary: string;
	status: ApprovalStatus;
	chain: ChainStep[];
};

const INITIAL_APPROVALS: Approval[] = [
	{
		id: "AP-2481",
		title: "提升 customer-support 月度预算",
		requester: "陈晓",
		department: "客户成功",
		submitted: "10 月 18 日 09:42",
		budget: "$2,400 → $4,000",
		summary: "客服知识库问答量在两周内增长 62%，现有预算预计在本月 24 日耗尽，希望提前上调额度以保证工单摘要服务不中断。",
		status: "pending",
		chain: [
			{ title: "提交申请", state: "done", actor: "陈晓", time: "10-18 09:42" },
			{
				title: "直属主管审批",
				state: "done",
				actor: "王敏",
				time: "10-18 10:15",
				note: "业务增长属实，同意上调预算。",
			},
			{ title: "财务审批", state: "current", actor: "李娜", time: "等待处理" },
			{ title: "预算生效", state: "waiting" },
		],
	},
	{
		id: "AP-2479",
		title: "为 internal-copilot 新增 Anthropic 提供商",
		requester: "周航",
		department: "研发中心",
		submitted: "10 月 17 日 16:08",
		budget: "$0 → $1,200",
		summary: "团队希望在现有 OpenAI 之外增加 Claude 作为备用提供商，用于代码审查场景的对比评测，预计新增月成本约 $1,200。",
		status: "pending",
		chain: [
			{ title: "提交申请", state: "done", actor: "周航", time: "10-17 16:08" },
			{ title: "直属主管审批", state: "current", actor: "陈晓", time: "等待处理" },
			{ title: "财务审批", state: "waiting" },
			{ title: "配置生效", state: "waiting" },
		],
	},
	{
		id: "AP-2475",
		title: "临时提升 data-pipeline 速率限制",
		requester: "林菲",
		department: "数据平台",
		submitted: "10 月 17 日 11:31",
		budget: "不涉及预算变更",
		summary: "季度离线批处理将在周末运行，需要将 RPM 从 60 临时提升到 300，持续 48 小时，结束后自动恢复。",
		status: "pending",
		chain: [
			{ title: "提交申请", state: "done", actor: "林菲", time: "10-17 11:31" },
			{
				title: "直属主管审批",
				state: "done",
				actor: "王敏",
				time: "10-17 13:02",
				note: "仅限周末，已确认不影响其他项目。",
			},
			{ title: "平台审批", state: "current", actor: "赵磊", time: "等待处理" },
			{ title: "限流生效", state: "waiting" },
		],
	},
	{
		id: "AP-2468",
		title: "content-studio 项目续期",
		requester: "何静",
		department: "市场增长",
		submitted: "10 月 15 日 10:20",
		budget: "续期至 2027-01-31",
		summary: "营销内容生成服务需要延长使用周期三个月，覆盖年末活动排期。",
		status: "approved",
		chain: [
			{ title: "提交申请", state: "done", actor: "何静", time: "10-15 10:20" },
			{ title: "直属主管审批", state: "done", actor: "王敏", time: "10-15 11:05" },
			{ title: "财务审批", state: "done", actor: "李娜", time: "10-16 09:18", note: "同意续期。" },
			{ title: "续期生效", state: "done" },
		],
	},
	{
		id: "AP-2460",
		title: "开放 legacy-archive 只读权限",
		requester: "宋涛",
		department: "研发中心",
		submitted: "10 月 14 日 14:52",
		budget: "不涉及预算变更",
		summary: "为历史项目添加只读访问权限，用于迁移前的数据核对。",
		status: "rejected",
		chain: [
			{ title: "提交申请", state: "done", actor: "宋涛", time: "10-14 14:52" },
			{
				title: "直属主管审批",
				state: "rejected",
				actor: "陈晓",
				time: "10-14 17:30",
				note: "归档项目已停止维护，请先在 sandbox 环境完成核对。",
			},
			{ title: "权限生效", state: "waiting" },
		],
	},
];

const STATUS_STYLE: Record<ApprovalStatus, { label: string; className: string }> = {
	pending: {
		label: "待审批",
		className: "border-chart-warning/30 bg-chart-warning/10 text-chart-warning-ink",
	},
	approved: {
		label: "已通过",
		className: "border-chart-info/30 bg-chart-info/10 text-chart-info-ink",
	},
	rejected: {
		label: "已驳回",
		className: "border-destructive/30 bg-destructive/10 text-destructive",
	},
};

const CHAIN_ICON = {
	done: Check,
	current: Clock,
	waiting: Circle,
	rejected: X,
} as const;

function ApprovalsPage() {
	const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
	const [selectedId, setSelectedId] = useState(INITIAL_APPROVALS[0].id);
	const [comment, setComment] = useState("");

	const selected = approvals.find((item) => item.id === selectedId) ?? approvals[0];
	const pendingCount = approvals.filter((item) => item.status === "pending").length;

	function decide(approval: Approval, status: "approved" | "rejected") {
		setApprovals((rows) => rows.map((row) => (row.id === approval.id ? { ...row, status } : row)));
		setComment("");
		toast.success(status === "approved" ? "已通过该申请" : "已驳回该申请", {
			description: `${approval.id} · ${approval.title}`,
		});
	}

	return (
		<AppShell>
			<PageHeader
				title="审批中心"
				description="处理预算调整、权限变更和项目配置申请。左侧选择申请，右侧查看审批链并处理。"
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
				{/* 队列 */}
				<Card className="gap-0 py-0">
					<CardHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
						<CardTitle className="text-sm">审批队列</CardTitle>
						<Badge variant="secondary" className="font-mono">
							{pendingCount} 待处理
						</Badge>
					</CardHeader>
					<ul className="custom-scrollbar max-h-[640px] overflow-y-auto">
						{approvals.map((approval) => {
							const active = approval.id === selected.id;
							const status = STATUS_STYLE[approval.status];
							return (
								<li key={approval.id} className="border-b last:border-b-0">
									<button
										type="button"
										onClick={() => {
											setSelectedId(approval.id);
											setComment("");
										}}
										className={cn(
											"flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors",
											active ? "bg-secondary/60" : "hover:bg-muted/40",
										)}
									>
										<Avatar className="mt-0.5 size-7">
											<AvatarFallback className="bg-secondary text-[10px] font-medium">
												{approval.requester.slice(0, 1)}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0 flex-1">
											<p className={cn("truncate text-[13px]", active ? "font-medium" : "font-normal")}>
												{approval.title}
											</p>
											<p className="text-muted-foreground mt-1 text-[11px]">
												{approval.requester} · {approval.submitted}
											</p>
											<span
												className={cn(
													"mt-1.5 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px]",
													status.className,
												)}
											>
												{status.label}
											</span>
										</div>
									</button>
								</li>
							);
						})}
					</ul>
				</Card>

				{/* 详情 */}
				<Card className="gap-0 py-0">
					<CardHeader className="flex flex-row items-start justify-between gap-3 border-b px-5 py-4">
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<CardTitle className="text-[15px]">{selected.title}</CardTitle>
								<span
									className={cn(
										"inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px]",
										STATUS_STYLE[selected.status].className,
									)}
								>
									{STATUS_STYLE[selected.status].label}
								</span>
							</div>
							<p className="text-muted-foreground mt-1 font-mono text-[11px]">{selected.id}</p>
						</div>
					</CardHeader>

					<CardContent className="px-5 py-5">
						<div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
							{[
								["申请人", selected.requester],
								["所属部门", selected.department],
								["提交时间", selected.submitted],
								["预算变更", selected.budget],
							].map(([label, value]) => (
								<div key={label}>
									<p className="text-muted-foreground text-[11px]">{label}</p>
									<p className="mt-1 text-[13px] font-medium">{value}</p>
								</div>
							))}
						</div>

						<div className="bg-muted/40 mt-5 rounded-md border p-3 text-[13px] leading-6">
							<p className="text-muted-foreground mb-1 text-[11px]">申请说明</p>
							{selected.summary}
						</div>

						<h3 className="mt-6 mb-3 text-[13px] font-medium">审批链</h3>
						<ol>
							{selected.chain.map((step, index) => {
								const Icon = CHAIN_ICON[step.state];
								const last = index === selected.chain.length - 1;
								return (
									<li key={step.title} className="relative flex gap-3 pb-5 last:pb-0">
										{!last && <span className="bg-border absolute top-6 left-[11px] h-full w-px" />}
										<span
											className={cn(
												"relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
												step.state === "done" && "bg-foreground text-background border-foreground",
												step.state === "current" && "border-foreground text-foreground bg-card",
												step.state === "waiting" && "text-muted-foreground/60 bg-card",
												step.state === "rejected" && "border-destructive bg-destructive/10 text-destructive",
											)}
										>
											<Icon className="size-3" />
										</span>
										<div className="min-w-0 flex-1">
											<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
												<p className={cn("text-[13px]", step.state === "waiting" ? "text-muted-foreground" : "font-medium")}>
													{step.title}
												</p>
												{step.actor && <span className="text-muted-foreground text-[11px]">{step.actor}</span>}
												{step.time && <span className="text-muted-foreground/70 font-mono text-[10px]">{step.time}</span>}
											</div>
											{step.note && (
												<p className="bg-muted/50 text-muted-foreground mt-1.5 rounded border px-2.5 py-1.5 text-xs leading-5">
													{step.note}
												</p>
											)}
										</div>
									</li>
								);
							})}
						</ol>

						{selected.status === "pending" ? (
							<div className="mt-6 border-t pt-4">
								<label htmlFor="comment" className="text-[13px] font-medium">
									审批意见
								</label>
								<Textarea
									id="comment"
									value={comment}
									onChange={(event) => setComment(event.target.value)}
									placeholder="可选：填写通过或驳回的理由，将记录在审批链中"
									className="mt-2"
								/>
								<div className="mt-3 flex items-center justify-end gap-2">
									<Button variant="outline" onClick={() => decide(selected, "rejected")}>
										驳回
									</Button>
									<Button onClick={() => decide(selected, "approved")}>通过申请</Button>
								</div>
							</div>
						) : (
							<p className="text-muted-foreground mt-6 border-t pt-4 text-xs">
								该申请已处理，审批链为只读记录。
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</AppShell>
	);
}
