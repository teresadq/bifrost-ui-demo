import {
	Activity,
	ArrowUpRight,
	Bot,
	CalendarDays,
	CheckCircle2,
	Clock,
	Cloud,
	Cpu,
	Database,
	FileText,
	FolderOpen,
	GitBranch,
	HardDrive,
	Package,
	Server,
	ShieldCheck,
	Sparkles,
	Users,
	Zap,
} from "lucide-react";

import { BlockCard, DemoHeader, DemoSurface, GalleryGrid, MiniAvatar, MiniBar } from "@/components/reui/gallery";
import { ReBadge } from "@/components/reui/ui";
import { cn } from "@/lib/utils";

function AgentsSolution() {
	const agents = [
		{ name: "客服 Agent", model: "Claude Sonnet", calls: "128K", success: "99.2%", tone: "bg-emerald-500" },
		{ name: "代码审查 Agent", model: "GPT-4o", calls: "64K", success: "98.7%", tone: "bg-blue-500" },
		{ name: "数据分析 Agent", model: "DeepSeek V3", calls: "41K", success: "99.6%", tone: "bg-violet-500" },
		{ name: "合规 Agent", model: "Claude Haiku", calls: "18K", success: "97.4%", tone: "bg-amber-500" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="Agent 运行状态" meta="Agents · 4 个活跃" action={<ReBadge tone="success" dot>全部正常</ReBadge>} />
			<div className="grid grid-cols-2 gap-2">
				{agents.map((agent) => (
					<div key={agent.name} className="rounded-lg border p-2">
						<div className="flex items-center gap-1.5">
							<span className={cn("size-1.5 rounded-full", agent.tone)} />
							<span className="truncate text-[8px] font-medium">{agent.name}</span>
						</div>
						<p className="text-muted-foreground mt-0.5 truncate text-[7px]">{agent.model}</p>
						<div className="mt-2 flex items-end justify-between">
							<div><p className="text-[9px] font-semibold tabular-nums">{agent.calls}</p><p className="text-muted-foreground text-[6px]">调用</p></div>
							<div className="text-right"><p className="text-[9px] font-semibold tabular-nums">{agent.success}</p><p className="text-muted-foreground text-[6px]">成功率</p></div>
						</div>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function AiOpsSolution() {
	const pipelines = [
		{ label: "模型健康检查", value: 98, tone: "bg-emerald-500" },
		{ label: "成本异常检测", value: 84, tone: "bg-blue-500" },
		{ label: "延迟归因", value: 72, tone: "bg-violet-500" },
		{ label: "容量预测", value: 61, tone: "bg-amber-500" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="AI Ops 自动化" meta="今日运行 142 次" action={<ReBadge tone="outline">4 条流水线</ReBadge>} />
			<div className="grid grid-cols-3 gap-1.5">
				{[
					["事件", "12"],
					["MTTR", "8m"],
					["自动化", "86%"],
				].map(([label, value]) => (
					<div key={label} className="rounded-lg border p-1.5 text-center">
						<p className="text-[10px] font-semibold tabular-nums">{value}</p>
						<p className="text-muted-foreground text-[6px]">{label}</p>
					</div>
				))}
			</div>
			<div className="mt-2.5 space-y-2">
				{pipelines.map((pipeline) => (
					<div key={pipeline.label}>
						<div className="mb-0.5 flex items-center justify-between text-[7px]">
							<span>{pipeline.label}</span>
							<span className="text-muted-foreground tabular-nums">{pipeline.value}%</span>
						</div>
						<MiniBar value={pipeline.value} tone={pipeline.tone} className="h-1" />
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function AnalyticsSolution() {
	return (
		<DemoSurface>
			<DemoHeader title="产品分析" meta="Analytics · 最近 30 天" action={<ReBadge tone="success">+18.2%</ReBadge>} />
			<div className="flex items-end justify-between">
				<div>
					<p className="text-muted-foreground text-[7px]">活跃用户</p>
					<p className="text-lg font-semibold tabular-nums">24,812</p>
				</div>
				<svg viewBox="0 0 120 38" className="h-8 w-28" preserveAspectRatio="none">
					<polygon points="0,38 0,30 15,28 30,31 45,22 60,24 75,16 90,18 105,9 120,12 120,38" fill="var(--chart-cat-1)" opacity="0.15" />
					<polyline points="0,30 15,28 30,31 45,22 60,24 75,16 90,18 105,9 120,12" fill="none" stroke="var(--chart-cat-1)" strokeWidth="1.5" />
				</svg>
			</div>
			<div className="mt-2 space-y-1 border-t pt-2">
				<div className="text-muted-foreground grid grid-cols-[1fr_40px_40px] text-[6px]"><span>页面</span><span className="text-right">访问</span><span className="text-right">转化</span></div>
				{[
					["/dashboard", "8.2K", "32%"],
					["/projects", "6.1K", "28%"],
					["/models", "4.8K", "21%"],
					["/settings", "2.4K", "12%"],
				].map(([page, visits, conversion]) => (
					<div key={page} className="grid grid-cols-[1fr_40px_40px] text-[7px]">
						<span className="truncate font-mono">{page}</span>
						<span className="text-right tabular-nums">{visits}</span>
						<span className="text-right text-emerald-600 dark:text-emerald-300">{conversion}</span>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function BillingSolution() {
	return (
		<DemoSurface>
			<DemoHeader title="账单与用量" meta="Billing · Team 套餐" action={<ReBadge tone="dark">$99/月</ReBadge>} />
			<div className="rounded-lg border p-2.5">
				<div className="flex items-center justify-between">
					<span className="text-[8px] font-medium">本月成本</span>
					<span className="font-mono text-[9px]">$5,280 / $8,000</span>
				</div>
				<MiniBar value={66} className="mt-1.5 h-1.5" />
				<p className="text-muted-foreground mt-1 text-[6px]">预计月底剩余 $1,120 · 自动扣款</p>
			</div>
			<div className="mt-2 space-y-1.5">
				{[
					["INV-2026-09", "9 月", "$5,120.00"],
					["INV-2026-08", "8 月", "$4,680.00"],
					["INV-2026-07", "7 月", "$3,940.00"],
				].map(([id, month, amount]) => (
					<div key={id} className="flex items-center gap-1.5 text-[7px]">
						<FileText className="text-muted-foreground size-2.5" />
						<span className="font-mono">{id}</span>
						<span className="text-muted-foreground">{month}</span>
						<span className="ml-auto font-mono tabular-nums">{amount}</span>
						<ReBadge tone="success" className="h-3.5 px-1 text-[6px]">已支付</ReBadge>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function BookingsSolution() {
	const slots = [
		{ time: "09:30", name: "产品同步", status: "已确认", tone: "success" as const },
		{ time: "11:00", name: "客户演示", status: "已确认", tone: "success" as const },
		{ time: "14:00", name: "技术评审", status: "待确认", tone: "warning" as const },
		{ time: "16:30", name: "1:1", status: "空闲", tone: "outline" as const },
	];
	return (
		<DemoSurface>
			<DemoHeader title="预约日程" meta="Bookings · 2026-10-19" action={<ReBadge tone="outline">4 个时段</ReBadge>} />
			<div className="flex gap-1">
				{["一", "二", "三", "四", "五"].map((day, index) => (
					<div key={day} className={cn("flex-1 rounded-md border py-1 text-center", index === 3 && "border-primary bg-secondary/60")}>
						<p className="text-muted-foreground text-[6px]">周{day}</p>
						<p className="text-[9px] font-semibold tabular-nums">{14 + index}</p>
					</div>
				))}
			</div>
			<div className="mt-2 space-y-1.5">
				{slots.map((slot) => (
					<div key={slot.time} className="flex items-center gap-2 rounded-md border px-2 py-1.5">
						<span className="font-mono text-[8px] tabular-nums">{slot.time}</span>
						<span className="flex-1 truncate text-[8px]">{slot.name}</span>
						<ReBadge tone={slot.tone} dot className="h-4 px-1 text-[6px]">{slot.status}</ReBadge>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function CrmSolution() {
	const columns = [
		{ label: "线索", total: "$42K", tone: "bg-zinc-400", deals: ["Acme Corp", "Globex"] },
		{ label: "谈判", total: "$86K", tone: "bg-blue-500", deals: ["Initech", "Umbrella"] },
		{ label: "赢单", total: "$128K", tone: "bg-emerald-500", deals: ["Stark Ind."] },
	];
	return (
		<DemoSurface>
			<DemoHeader title="销售管道" meta="CRM · 本季度" action={<ReBadge tone="success">$256K</ReBadge>} />
			<div className="grid grid-cols-3 gap-1.5">
				{columns.map((column) => (
					<div key={column.label} className="rounded-lg bg-secondary/50 p-1.5">
						<div className="flex items-center gap-1">
							<span className={cn("size-1 rounded-full", column.tone)} />
							<span className="text-[7px] font-medium">{column.label}</span>
							<span className="text-muted-foreground ml-auto font-mono text-[6px]">{column.total}</span>
						</div>
						<div className="mt-1 space-y-1">
							{column.deals.map((deal, index) => (
								<div key={deal} className="rounded-md border bg-card p-1.5">
									<p className="truncate text-[7px] font-medium">{deal}</p>
									<p className="text-muted-foreground mt-0.5 text-[6px]">${[12, 24, 36][index] + 12}K · 30 天</p>
									<div className="mt-1 flex items-center gap-1">
										<MiniAvatar name={deal} className="size-3 text-[5px]" />
										<MiniBar value={[30, 60, 85][index]} className="h-0.5" />
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function DevOpsSolution() {
	const deployments = [
		{ hash: "a3f9c21", env: "production", status: "成功", desc: "feat: 模型路由重试策略", time: "8 分钟前" },
		{ hash: "b7d2e10", env: "staging", status: "成功", desc: "fix: 审计日志分页", time: "1 小时前" },
		{ hash: "c1a8f44", env: "production", status: "失败", desc: "chore: 升级网关依赖", time: "3 小时前" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="部署记录" meta="DevOps · 最近 24 小时" action={<ReBadge tone="success" dot>健康</ReBadge>} />
			<div className="mb-2 flex items-center gap-1">
				{Array.from({ length: 30 }, (_, index) => (
					<span key={index} className={cn("h-1.5 flex-1 rounded-sm", index === 12 ? "bg-amber-400" : "bg-emerald-500/70")} />
				))}
			</div>
			<div className="space-y-1.5">
				{deployments.map((deployment) => (
					<div key={deployment.hash} className="flex items-center gap-1.5 rounded-md border px-1.5 py-1">
						<GitBranch className="text-muted-foreground size-2.5" />
						<span className="font-mono text-[7px]">{deployment.hash}</span>
						<span className="text-muted-foreground text-[6px]">{deployment.env}</span>
						<span className="flex-1 truncate text-[7px]">{deployment.desc}</span>
						<ReBadge tone={deployment.status === "成功" ? "success" : "danger"} className="h-3.5 px-1 text-[6px]">{deployment.status}</ReBadge>
					</div>
				))}
			</div>
			<p className="text-muted-foreground mt-2 text-[6px]">最近部署 8 分钟前 · 平均恢复时间 4 分钟</p>
		</DemoSurface>
	);
}

function DigitalTwinSolution() {
	return (
		<DemoSurface>
			<DemoHeader title="数字孪生" meta="Digital Twin · 边缘网关" action={<ReBadge tone="outline">3 个节点</ReBadge>} />
			<div className="grid grid-cols-[1fr_1fr] gap-2">
				<div className="space-y-1">
					{[
						{ label: "us-east-1", icon: Server, active: true },
						{ label: "us-west-2", icon: Server, active: true },
						{ label: "eu-central-1", icon: Server, active: false },
					].map((node) => {
						const Icon = node.icon;
						return (
							<div key={node.label} className={cn("flex items-center gap-1 rounded-md border px-1.5 py-1 text-[7px]", node.active ? "bg-card" : "bg-secondary/40 text-muted-foreground")}>
								<Icon className="size-2.5" />
								<span className="truncate">{node.label}</span>
								<span className={cn("ml-auto size-1 rounded-full", node.active ? "bg-emerald-500" : "bg-muted-foreground")} />
							</div>
						);
					})}
				</div>
				<div className="grid grid-cols-2 gap-1.5">
					{[
						{ label: "CPU", value: "42%", icon: Cpu },
						{ label: "内存", value: "68%", icon: HardDrive },
						{ label: "连接", value: "1.2K", icon: Activity },
						{ label: "丢包", value: "0.02%", icon: Cloud },
					].map((metric) => {
						const Icon = metric.icon;
						return (
							<div key={metric.label} className="rounded-md border p-1.5">
								<Icon className="text-muted-foreground size-2.5" />
								<p className="mt-0.5 text-[8px] font-semibold tabular-nums">{metric.value}</p>
								<p className="text-muted-foreground text-[6px]">{metric.label}</p>
							</div>
						);
					})}
				</div>
			</div>
			<div className="mt-2 rounded-md border border-dashed p-1.5 text-[6px] text-muted-foreground">
				同步延迟 12ms · 最后更新 3 秒前
			</div>
		</DemoSurface>
	);
}

function FilesSolution() {
	const files = [
		{ name: "model-eval-report.pdf", type: "pdf", size: "2.4 MB", owner: "陈晓", time: "10:24" },
		{ name: "gateway-config.json", type: "json", size: "18 KB", owner: "王一鸣", time: "昨天" },
		{ name: "cost-2026-09.csv", type: "csv", size: "1.1 MB", owner: "周雨", time: "10-12" },
		{ name: "architecture.png", type: "img", size: "840 KB", owner: "林嘉", time: "10-10" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="工作区文件" meta="Files · 128 个文件" action={<ReBadge tone="outline">2.4 GB</ReBadge>} />
			<div className="space-y-1">
				{files.map((file) => (
					<div key={file.name} className="flex items-center gap-1.5 rounded-md px-1 py-1 hover:bg-secondary/50">
						<span className="bg-secondary grid size-5 place-items-center rounded">
							{file.type === "img" ? <FolderOpen className="size-2.5" /> : file.type === "json" ? <Database className="size-2.5" /> : <FileText className="size-2.5" />}
						</span>
						<div className="min-w-0 flex-1">
							<p className="truncate text-[7px] font-medium">{file.name}</p>
							<p className="text-muted-foreground text-[6px]">{file.owner} · {file.size}</p>
						</div>
						<span className="text-muted-foreground text-[6px]">{file.time}</span>
						<ArrowUpRight className="text-muted-foreground size-2.5" />
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function InventorySolution() {
	const items = [
		{ sku: "GPU-H100", name: "H100 推理节点", stock: 12, capacity: 20, status: "充足" },
		{ sku: "GPU-A10", name: "A10 推理节点", stock: 3, capacity: 24, status: "偏低" },
		{ sku: "API-BURST", name: "突发配额包", stock: 86, capacity: 100, status: "充足" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="容量库存" meta="Inventory · 推理资源" action={<ReBadge tone="warning">1 项需补货</ReBadge>} />
			<div className="space-y-2">
				{items.map((item) => (
					<div key={item.sku} className="rounded-lg border p-2">
						<div className="flex items-center gap-1.5">
							<Package className="text-muted-foreground size-2.5" />
							<span className="text-[8px] font-medium">{item.name}</span>
							<span className="text-muted-foreground ml-auto font-mono text-[6px]">{item.sku}</span>
							<ReBadge tone={item.status === "充足" ? "success" : "warning"} className="h-3.5 px-1 text-[6px]">{item.status}</ReBadge>
						</div>
						<div className="mt-1.5 flex items-center gap-2">
							<MiniBar value={(item.stock / item.capacity) * 100} tone={item.status === "充足" ? "bg-emerald-500" : "bg-amber-500"} className="h-1" />
							<span className="text-muted-foreground shrink-0 text-[6px] tabular-nums">{item.stock}/{item.capacity}</span>
						</div>
					</div>
				))}
			</div>
		</DemoSurface>
	);
}

function UsersSolution() {
	const users = [
		{ name: "陈晓", role: "所有者", status: "在线", requests: "342K" },
		{ name: "王一鸣", role: "管理员", status: "在线", requests: "281K" },
		{ name: "林嘉", role: "开发者", status: "离开", requests: "198K" },
		{ name: "周雨", role: "开发者", status: "在线", requests: "134K" },
	];
	return (
		<DemoSurface>
			<DemoHeader title="用户与用量" meta="Users · 7 位成员" action={<ReBadge tone="outline">2FA 57%</ReBadge>} />
			<table className="w-full text-left">
				<thead>
					<tr className="text-muted-foreground text-[6px]">
						<th className="pb-1 font-medium">成员</th>
						<th className="pb-1 font-medium">角色</th>
						<th className="pb-1 font-medium">状态</th>
						<th className="pb-1 text-right font-medium">请求</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.name} className="border-t">
							<td className="py-1">
								<div className="flex items-center gap-1.5">
									<MiniAvatar name={user.name} className="size-4 text-[6px]" />
									<span className="text-[7px]">{user.name}</span>
								</div>
							</td>
							<td className="text-muted-foreground py-1 text-[7px]">{user.role}</td>
							<td className="py-1">
								<ReBadge dot tone={user.status === "在线" ? "success" : "outline"} className="h-3.5 px-1 text-[6px]">{user.status}</ReBadge>
							</td>
							<td className="py-1 text-right font-mono text-[7px] tabular-nums">{user.requests}</td>
						</tr>
					))}
				</tbody>
			</table>
		</DemoSurface>
	);
}

export function SolutionBlocks() {
	return (
		<GalleryGrid>
			<BlockCard title="Agents" category="solutions" description="客服、代码、数据、合规 Agent 的运行状态。" badge="agents"><AgentsSolution /></BlockCard>
			<BlockCard title="AI Ops" category="solutions" description="自动化流水线、事件与 MTTR。" badge="ai-ops"><AiOpsSolution /></BlockCard>
			<BlockCard title="Analytics" category="solutions" description="活跃用户、页面访问与转化。" badge="analytics"><AnalyticsSolution /></BlockCard>
			<BlockCard title="Billing" category="solutions" description="套餐、预算进度与发票列表。" badge="billing"><BillingSolution /></BlockCard>
			<BlockCard title="Bookings" category="solutions" description="日期选择与预约时段状态。" badge="bookings"><BookingsSolution /></BlockCard>
			<BlockCard title="CRM" category="solutions" description="线索、谈判与赢单销售管道。" badge="crm"><CrmSolution /></BlockCard>
			<BlockCard title="DevOps" category="solutions" description="部署记录、环境与可用性。" badge="dev-ops"><DevOpsSolution /></BlockCard>
			<BlockCard title="Digital Twin" category="solutions" description="边缘节点与实时资源指标。" badge="digital-twin"><DigitalTwinSolution /></BlockCard>
			<BlockCard title="Files" category="solutions" description="文件类型、大小与协作者。" badge="files"><FilesSolution /></BlockCard>
			<BlockCard title="Inventory" category="solutions" description="推理资源库存与补货提醒。" badge="inventory"><InventorySolution /></BlockCard>
			<BlockCard title="Users" category="solutions" description="成员角色、在线状态与请求量。" badge="users"><UsersSolution /></BlockCard>
		</GalleryGrid>
	);
}
