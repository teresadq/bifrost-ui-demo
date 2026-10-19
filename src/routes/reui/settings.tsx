import { createFileRoute } from "@tanstack/react-router";
import {
	Bell,
	Building2,
	CreditCard,
	Loader2,
	LockKeyhole,
	RotateCcw,
	Save,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
	ReBadge,
	ReButton,
	ReCard,
	ReCardContent,
	ReCardDescription,
	ReCardHeader,
	ReCardTitle,
	ReIconTile,
	RePageHeader,
} from "@/components/reui/ui";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/settings")({
	component: SettingsPage,
});

const SECTIONS = [
	{ id: "workspace", label: "工作区", description: "名称、区域与偏好", icon: Building2 },
	{ id: "security", label: "安全策略", description: "登录、2FA 与网络", icon: ShieldCheck },
	{ id: "notifications", label: "通知", description: "邮件、Slack 与摘要", icon: Bell },
	{ id: "billing", label: "计费", description: "套餐、预算与发票", icon: CreditCard },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

function Row({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
			<div className="min-w-0">
				<p className="text-xs font-medium">{title}</p>
				<p className="text-muted-foreground mt-0.5 text-[11px] leading-5">{description}</p>
			</div>
			<div className="shrink-0 sm:max-w-[280px]">{children}</div>
		</div>
	);
}

function SettingsPage() {
	const [active, setActive] = useState<SectionId>("workspace");
	const [saving, setSaving] = useState(false);
	const [dirty, setDirty] = useState(false);
	const [form, setForm] = useState({
		name: "Nova Gateway",
		slug: "nova-gateway",
		region: "us-east-1",
		timezone: "Asia/Shanghai",
		require2fa: true,
		enforceSso: false,
		sessionTimeout: "12h",
		ipAllowlist: "203.0.113.0/24\n198.51.100.7",
		emailApprovals: true,
		emailIncidents: true,
		emailBilling: true,
		weeklyDigest: true,
		slackWebhook: "",
		budget: "8000",
		alertThreshold: "80",
		invoiceEmail: "finance@nova.dev",
	});

	function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((current) => ({ ...current, [key]: value }));
		setDirty(true);
	}

	async function save() {
		setSaving(true);
		await new Promise((resolve) => setTimeout(resolve, 750));
		setSaving(false);
		setDirty(false);
		toast.success("设置已保存", { description: "更改将在所有会话中生效" });
	}

	function reset() {
		setForm({
			name: "Nova Gateway",
			slug: "nova-gateway",
			region: "us-east-1",
			timezone: "Asia/Shanghai",
			require2fa: true,
			enforceSso: false,
			sessionTimeout: "12h",
			ipAllowlist: "203.0.113.0/24\n198.51.100.7",
			emailApprovals: true,
			emailIncidents: true,
			emailBilling: true,
			weeklyDigest: true,
			slackWebhook: "",
			budget: "8000",
			alertThreshold: "80",
			invoiceEmail: "finance@nova.dev",
		});
		setDirty(false);
		toast.info("已恢复为上次保存的设置");
	}

	return (
		<>
			<RePageHeader
				eyebrow="Settings"
				title="设置"
				description="管理工作区、安全策略、通知与计费偏好。"
				actions={
					<>
						<ReButton variant="outline" className="gap-1.5" onClick={reset} disabled={!dirty || saving}>
							<RotateCcw className="size-3.5" />
							重置
						</ReButton>
						<ReButton className="gap-1.5" onClick={save} disabled={saving}>
							{saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
							{saving ? "保存中…" : "保存更改"}
						</ReButton>
					</>
				}
			/>

			<div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
				<div className="space-y-1.5 lg:sticky lg:top-24 lg:self-start">
					{SECTIONS.map((section) => {
						const Icon = section.icon;
						const isActive = active === section.id;
						return (
							<button
								key={section.id}
								type="button"
								onClick={() => setActive(section.id)}
								className={cn(
									"flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors",
									isActive ? "bg-card border shadow-sm" : "hover:bg-accent border border-transparent",
								)}
							>
								<Icon className={cn("mt-0.5 size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
								<div>
									<p className={cn("text-xs", isActive ? "font-medium" : "text-muted-foreground")}>{section.label}</p>
									<p className="text-muted-foreground/70 mt-0.5 text-[10px]">{section.description}</p>
								</div>
							</button>
						);
					})}
					<div className="mt-4 rounded-xl border bg-gradient-to-br from-secondary to-card p-3.5">
						<ReIconTile icon={Sparkles} tone="dark" className="size-8 rounded-lg" />
						<p className="mt-2.5 text-xs font-medium">需要更细的控制？</p>
						<p className="text-muted-foreground mt-1 text-[10px] leading-5">
							企业版支持 SCIM、审计导出与自定义数据驻留。
						</p>
						<ReButton variant="outline" size="sm" className="mt-2.5 w-full" onClick={() => toast.info("演示模式：销售联系不可用")}>
							联系销售
						</ReButton>
					</div>
				</div>

				<div className="min-w-0">
					{active === "workspace" && (
						<ReCard>
							<ReCardHeader className="border-b pb-4">
								<div>
									<ReCardTitle>工作区信息</ReCardTitle>
									<ReCardDescription>这些信息会显示在控制台和发给成员的邮件中。</ReCardDescription>
								</div>
								<ReBadge tone="dark">团队版</ReBadge>
							</ReCardHeader>
							<ReCardContent className="divide-y pt-0">
								<Row title="工作区名称" description="面向团队内部显示的友好名称。">
									<Input value={form.name} onChange={(event) => update("name", event.target.value)} className="h-9 rounded-lg" />
								</Row>
								<Row title="工作区标识" description="用于 API 与邀请链接，仅支持小写字母和连字符。">
									<div className="flex items-center rounded-lg border">
										<span className="text-muted-foreground border-r px-2.5 text-[11px]">nova.dev/</span>
										<Input
											value={form.slug}
											onChange={(event) => update("slug", event.target.value)}
											className="h-9 rounded-none border-0 shadow-none focus-visible:ring-0"
										/>
									</div>
								</Row>
								<Row title="默认区域" description="新建项目默认使用的推理区域。">
									<Select value={form.region} onValueChange={(value) => update("region", value)}>
										<SelectTrigger className="h-9 w-full rounded-lg">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-lg">
											<SelectItem value="us-east-1">美国东部 (us-east-1)</SelectItem>
											<SelectItem value="us-west-2">美国西部 (us-west-2)</SelectItem>
											<SelectItem value="eu-central-1">欧洲中部 (eu-central-1)</SelectItem>
											<SelectItem value="ap-southeast-1">亚太东南 (ap-southeast-1)</SelectItem>
										</SelectContent>
									</Select>
								</Row>
								<Row title="时区" description="报表与账单周期使用的时区。">
									<Select value={form.timezone} onValueChange={(value) => update("timezone", value)}>
										<SelectTrigger className="h-9 w-full rounded-lg">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-lg">
											<SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
											<SelectItem value="UTC">UTC</SelectItem>
											<SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
										</SelectContent>
									</Select>
								</Row>
								<Row title="工作区 ID" description="在调用管理 API 时使用。">
									<code className="bg-secondary block rounded-lg px-3 py-2 font-mono text-[11px]">ws_9f2c4a1e8b7d</code>
								</Row>
							</ReCardContent>
						</ReCard>
					)}

					{active === "security" && (
						<ReCard>
							<ReCardHeader className="border-b pb-4">
								<div>
									<ReCardTitle>安全策略</ReCardTitle>
									<ReCardDescription>适用于工作区内所有成员与 API 密钥。</ReCardDescription>
								</div>
								<ReBadge tone="success" dot>策略正常</ReBadge>
							</ReCardHeader>
							<ReCardContent className="divide-y pt-0">
								<Row title="强制双因素认证" description="所有成员必须在首次登录后 7 天内启用 2FA。">
									<Switch checked={form.require2fa} onCheckedChange={(checked) => update("require2fa", checked)} />
								</Row>
								<Row title="强制 SSO 登录" description="关闭密码登录，仅允许通过 SAML 身份提供商登录。">
									<Switch checked={form.enforceSso} onCheckedChange={(checked) => update("enforceSso", checked)} />
								</Row>
								<Row title="会话有效期" description="超过此时间未活动的会话需要重新登录。">
									<Select value={form.sessionTimeout} onValueChange={(value) => update("sessionTimeout", value)}>
										<SelectTrigger className="h-9 w-full rounded-lg">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-lg">
											<SelectItem value="1h">1 小时</SelectItem>
											<SelectItem value="8h">8 小时</SelectItem>
											<SelectItem value="12h">12 小时</SelectItem>
											<SelectItem value="7d">7 天</SelectItem>
										</SelectContent>
									</Select>
								</Row>
								<Row title="IP 允许列表" description="每行一个 CIDR。留空表示允许所有来源。">
									<Textarea
										value={form.ipAllowlist}
										onChange={(event) => update("ipAllowlist", event.target.value)}
										className="min-h-24 rounded-lg font-mono text-[11px]"
									/>
								</Row>
								<Row title="API 密钥有效期" description="新创建的密钥默认在到期后自动吊销。">
									<Select value="90d" onValueChange={() => toast.info("演示模式：此项不可修改")}>
										<SelectTrigger className="h-9 w-full rounded-lg">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-lg">
											<SelectItem value="30d">30 天</SelectItem>
											<SelectItem value="90d">90 天</SelectItem>
											<SelectItem value="365d">1 年</SelectItem>
										</SelectContent>
									</Select>
								</Row>
							</ReCardContent>
						</ReCard>
					)}

					{active === "notifications" && (
						<ReCard>
							<ReCardHeader className="border-b pb-4">
								<div>
									<ReCardTitle>通知偏好</ReCardTitle>
									<ReCardDescription>选择你希望接收的事件与渠道。</ReCardDescription>
								</div>
								<ReBadge tone="outline">邮件 + Slack</ReBadge>
							</ReCardHeader>
							<ReCardContent className="divide-y pt-0">
								<Row title="审批请求" description="有新的审批请求或审批结果时通知我。">
									<Switch checked={form.emailApprovals} onCheckedChange={(checked) => update("emailApprovals", checked)} />
								</Row>
								<Row title="告警与故障" description="服务可用性、延迟与错误率超过阈值时通知我。">
									<Switch checked={form.emailIncidents} onCheckedChange={(checked) => update("emailIncidents", checked)} />
								</Row>
								<Row title="账单与预算" description="预算使用达到 80% 或发票生成时通知我。">
									<Switch checked={form.emailBilling} onCheckedChange={(checked) => update("emailBilling", checked)} />
								</Row>
								<Row title="每周用量摘要" description="每周一上午发送团队用量与成本摘要。">
									<Switch checked={form.weeklyDigest} onCheckedChange={(checked) => update("weeklyDigest", checked)} />
								</Row>
								<Row title="Slack Webhook" description="粘贴 Incoming Webhook 地址以推送告警。">
									<Input
										value={form.slackWebhook}
										onChange={(event) => update("slackWebhook", event.target.value)}
										placeholder="https://hooks.slack.com/services/…"
										className="h-9 rounded-lg font-mono text-[11px]"
									/>
								</Row>
							</ReCardContent>
						</ReCard>
					)}

					{active === "billing" && (
						<div className="space-y-4">
							<ReCard>
								<ReCardHeader className="border-b pb-4">
									<div>
										<ReCardTitle>套餐与预算</ReCardTitle>
										<ReCardDescription>团队版按实际用量计费，账单每月 1 日生成。</ReCardDescription>
									</div>
									<ReBadge tone="dark">Team · $99/月</ReBadge>
								</ReCardHeader>
								<ReCardContent className="divide-y pt-0">
									<Row title="月度预算" description="达到预算后网关会暂停非关键项目请求。">
										<div className="flex items-center rounded-lg border">
											<span className="text-muted-foreground border-r px-2.5 text-[11px]">$</span>
											<Input
												value={form.budget}
												onChange={(event) => update("budget", event.target.value)}
												className="h-9 rounded-none border-0 shadow-none focus-visible:ring-0"
											/>
										</div>
									</Row>
									<Row title="预算告警阈值" description="达到该百分比时通过邮件与 Slack 提醒。">
										<div className="flex items-center rounded-lg border">
											<Input
												value={form.alertThreshold}
												onChange={(event) => update("alertThreshold", event.target.value)}
												className="h-9 rounded-none border-0 shadow-none focus-visible:ring-0"
											/>
											<span className="text-muted-foreground border-l px-2.5 text-[11px]">%</span>
										</div>
									</Row>
									<Row title="发票接收邮箱" description="发票 PDF 与用量明细会发送到此邮箱。">
										<Input
											value={form.invoiceEmail}
											onChange={(event) => update("invoiceEmail", event.target.value)}
											className="h-9 rounded-lg"
										/>
									</Row>
								</ReCardContent>
							</ReCard>

							<ReCard>
								<ReCardHeader className="pb-3">
									<ReCardTitle>最近发票</ReCardTitle>
									<ReBadge tone="outline">自动扣款</ReBadge>
								</ReCardHeader>
								<ReCardContent className="pt-0">
									<ul className="divide-y">
										{[
											{ id: "INV-2026-09", date: "2026-09-01", amount: "$5,120.00", status: "已支付" },
											{ id: "INV-2026-08", date: "2026-08-01", amount: "$4,680.00", status: "已支付" },
											{ id: "INV-2026-07", date: "2026-07-01", amount: "$3,940.00", status: "已支付" },
										].map((invoice) => (
											<li key={invoice.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
												<ReIconTile icon={CreditCard} tone="neutral" className="size-8 rounded-lg" />
												<div className="min-w-0 flex-1">
													<p className="font-mono text-[11px] font-medium">{invoice.id}</p>
													<p className="text-muted-foreground text-[10px]">{invoice.date}</p>
												</div>
												<span className="font-mono text-xs tabular-nums">{invoice.amount}</span>
												<ReBadge tone="success">{invoice.status}</ReBadge>
												<button
													type="button"
													onClick={() => toast.success("演示模式：发票已下载")}
													className="text-muted-foreground hover:text-foreground cursor-pointer text-[11px] underline-offset-4 hover:underline"
												>
													下载
												</button>
											</li>
										))}
									</ul>
								</ReCardContent>
							</ReCard>
						</div>
					)}

					<div className="mt-4 flex items-center justify-between rounded-xl border border-dashed px-4 py-3">
						<div className="flex items-center gap-2">
							<LockKeyhole className="text-muted-foreground size-3.5" />
							<p className="text-muted-foreground text-[11px]">
								所有更改都会写入审计日志。
								{dirty && <span className="text-amber-600 dark:text-amber-300 ml-2">有未保存的更改</span>}
							</p>
						</div>
						<ReButton size="sm" className="gap-1.5" onClick={save} disabled={!dirty || saving}>
							{saving ? <Loader2 className="size-3 animate-spin" /> : <Save className="size-3" />}
							保存
						</ReButton>
					</div>
				</div>
			</div>
		</>
	);
}
