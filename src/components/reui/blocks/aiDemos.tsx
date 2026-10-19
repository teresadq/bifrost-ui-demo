import {
	ArrowUp,
	Bot,
	Check,
	ChevronRight,
	CircleDollarSign,
	Clock,
	Database,
	Search,
	Sparkles,
	Terminal,
	Wand2,
	Zap,
} from "lucide-react";
import { useState } from "react";

import { BlockCard, DemoHeader, DemoSurface, GalleryGrid, MiniBar } from "@/components/reui/gallery";
import { ReBadge } from "@/components/reui/ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function AgentActivityDemo() {
	const [expanded, setExpanded] = useState(false);
	const steps = [
		{ label: "解析用户意图", tool: "planner", time: "0.4s", status: "done" },
		{ label: "查询项目用量", tool: "analytics.query", time: "1.2s", status: "done" },
		{ label: "读取错误日志", tool: "logs.search", time: "2.1s", status: "done" },
		{ label: "生成诊断结论", tool: "claude-sonnet-4.5", time: "3.8s", status: "running" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="Agent 活动" meta="trace_9f3a21 · 4 个步骤" action={<ReBadge tone="info" dot>运行中</ReBadge>} />
			<div className="space-y-1">
				{steps.map((step, index) => (
					<div key={step.label} className="rounded-md border">
						<button
							type="button"
							onClick={() => step.status === "done" && setExpanded((value) => !value)}
							className="flex w-full cursor-pointer items-center gap-1.5 px-2 py-1.5 text-left"
						>
							<span className={cn("grid size-3.5 place-items-center rounded-full", step.status === "done" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : "bg-blue-500/15 text-blue-600 dark:text-blue-300")}>
								{step.status === "done" ? <Check className="size-2" /> : <span className="size-1 animate-pulse rounded-full bg-current" />}
							</span>
							<span className="text-[8px] font-medium">{step.label}</span>
							<span className="bg-secondary text-muted-foreground ml-auto rounded px-1 py-0.5 font-mono text-[6px]">{step.tool}</span>
							<span className="text-muted-foreground font-mono text-[6px] tabular-nums">{step.time}</span>
							{step.status === "done" && <ChevronRight className={cn("text-muted-foreground size-2.5 transition-transform", expanded && index === 0 && "rotate-90")} />}
						</button>
						{expanded && index === 0 && (
							<div className="bg-secondary/50 border-t px-2 py-1.5">
								<pre className="text-muted-foreground overflow-x-auto font-mono text-[6px] leading-3">{`{
  "intent": "diagnose_latency",
  "project": "prj_customer_agent",
  "timeRange": "1h"
}`}</pre>
							</div>
						)}
					</div>
				))}
			</div>
			<div className="text-muted-foreground mt-2 flex items-center gap-1 text-[6px]">
				<span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
				正在调用 claude-sonnet-4.5 · 已使用 12,480 tokens
			</div>
		</DemoSurface>
	);
}

function AiChatDemo() {
	const [messages, setMessages] = useState([
		{ role: "user", text: "为什么客服项目今天的延迟升高了？" },
		{ role: "assistant", text: "根据最近 1 小时的日志，p95 从 318ms 升到 412ms。主要原因是 us-east-1 的 Claude 连接池排队，建议临时把 20% 流量切到 us-west-2。" },
	]);
	const [draft, setDraft] = useState("");
	function send() {
		const text = draft.trim();
		if (!text) return;
		setMessages((current) => [...current, { role: "user", text }]);
		setDraft("");
		setTimeout(() => {
			setMessages((current) => [...current, { role: "assistant", text: "收到。我可以继续分析具体项目的请求分布，或生成一份切换区域的执行计划。" }]);
		}, 500);
	}
	return (
		<DemoSurface className="flex h-[330px] flex-col p-0">
			<div className="flex items-center gap-2 border-b px-3 py-2">
				<span className="bg-primary text-primary-foreground grid size-5 place-items-center rounded-md"><Wand2 className="size-2.5" /></span>
				<div>
					<p className="text-[9px] font-semibold">Nova Copilot</p>
					<p className="text-muted-foreground text-[6px]">Claude Sonnet 4.5 · 上下文 42%</p>
				</div>
				<ReBadge tone="success" dot className="ml-auto">在线</ReBadge>
			</div>
			<div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
				{messages.map((message, index) => (
					<div key={index} className={cn("flex gap-1.5", message.role === "user" && "flex-row-reverse")}>
						<span className={cn("grid size-5 shrink-0 place-items-center rounded-full", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary")}>
							{message.role === "user" ? "陈" : <Sparkles className="size-2.5" />}
						</span>
						<div className={cn("max-w-[82%] rounded-lg px-2 py-1.5 text-[7px] leading-3.5", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary/70")}>
							{message.text}
							{message.role === "assistant" && index === 1 && (
								<div className="mt-1.5 flex flex-wrap gap-1">
									<span className="bg-card inline-flex items-center gap-0.5 rounded border px-1 py-0.5 font-mono text-[6px]"><Database className="size-2" />logs.search</span>
									<span className="bg-card inline-flex items-center gap-0.5 rounded border px-1 py-0.5 font-mono text-[6px]"><Zap className="size-2" />latency.analyze</span>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
			<div className="flex items-center gap-1.5 border-t p-2">
				<Input
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => { if (event.key === "Enter") send(); }}
					placeholder="询问用量、延迟或成本…"
					className="h-7 rounded-lg text-[8px]"
				/>
				<button type="button" onClick={send} aria-label="发送" className="bg-primary text-primary-foreground grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg">
					<ArrowUp className="size-3" />
				</button>
			</div>
		</DemoSurface>
	);
}

function AiUsageDemo() {
	const models = [
		{ name: "Claude Sonnet 4.5", tokens: "1.24B", cost: "$2,840", share: 38, tone: "bg-violet-500" },
		{ name: "GPT-4o", tokens: "986M", cost: "$2,210", share: 30, tone: "bg-emerald-500" },
		{ name: "DeepSeek V3", tokens: "1.51B", cost: "$1,180", share: 16, tone: "bg-amber-500" },
		{ name: "Gemini 2.5 Pro", tokens: "388M", cost: "$720", share: 10, tone: "bg-blue-500" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="AI 用量" meta="AI Usage · 本月" action={<ReBadge tone="outline">$7,410</ReBadge>} />
			<div className="grid grid-cols-3 gap-1.5">
				{[
					{ label: "Token", value: "4.12B", icon: Zap },
					{ label: "请求", value: "967K", icon: Bot },
					{ label: "成本", value: "$7.4K", icon: CircleDollarSign },
				].map((item) => {
					const Icon = item.icon;
					return (
						<div key={item.label} className="rounded-lg border p-1.5">
							<Icon className="text-muted-foreground size-2.5" />
							<p className="mt-0.5 text-[10px] font-semibold tabular-nums">{item.value}</p>
							<p className="text-muted-foreground text-[6px]">{item.label}</p>
						</div>
					);
				})}
			</div>
			<div className="mt-2 space-y-1.5">
				{models.map((model) => (
					<div key={model.name}>
						<div className="mb-0.5 flex items-center gap-1 text-[7px]">
							<span className={cn("size-1.5 rounded-full", model.tone)} />
							<span className="flex-1 truncate">{model.name}</span>
							<span className="text-muted-foreground font-mono text-[6px]">{model.tokens}</span>
							<span className="w-8 text-right font-mono text-[6px] tabular-nums">{model.cost}</span>
						</div>
						<MiniBar value={model.share} tone={model.tone} className="h-1" />
					</div>
				))}
			</div>
			<div className="mt-2 rounded-md border p-1.5">
				<div className="flex items-center justify-between text-[7px]">
					<span className="font-medium">预算使用</span>
					<span className="font-mono">68%</span>
				</div>
				<MiniBar value={68} className="mt-1 h-1" />
				<p className="text-muted-foreground mt-1 text-[6px]">$8,600 / $12,600 · 预计月底剩余 $1,240</p>
			</div>
		</DemoSurface>
	);
}

export function AiBlocks() {
	return (
		<GalleryGrid>
			<BlockCard title="Agent Activity" category="ai-agents" description="工具调用步骤、耗时与可展开输出。" badge="agent-activity">
				<div className="[&_pre]:max-h-24"><AgentActivityDemo /></div>
			</BlockCard>
			<BlockCard title="AI Chat" category="ai-agents" description="对话线程、工具徽章与输入框。" badge="ai-chat">
				<AiChatDemo />
			</BlockCard>
			<BlockCard title="AI Usage" category="ai-agents" description="Token、请求、成本与预算概览。" badge="ai-usage">
				<AiUsageDemo />
			</BlockCard>
		</GalleryGrid>
	);
}
