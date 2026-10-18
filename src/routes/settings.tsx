import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

const TIMEZONES = ["Asia/Shanghai", "Asia/Singapore", "Europe/London", "America/New_York"];
const LANGUAGES = ["简体中文", "English"];
const THRESHOLDS = ["50", "70", "80", "90"];

function SettingRow({
	title,
	description,
	control,
	children,
}: {
	title: string;
	description: string;
	control?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<div className="flex items-start justify-between gap-6 px-5 py-4">
			<div className="min-w-0 flex-1">
				<p className="text-[13px] font-medium">{title}</p>
				<p className="text-muted-foreground mt-1 max-w-2xl text-xs leading-5">{description}</p>
				{children}
			</div>
			{control ? <div className="shrink-0 pt-0.5">{control}</div> : null}
		</div>
	);
}

function SettingsPage() {
	const [saving, setSaving] = useState(false);
	const [settings, setSettings] = useState({
		name: "Nova 团队",
		description: "统一管理公司内的模型调用、预算与访问权限。",
		timezone: "Asia/Shanghai",
		language: "简体中文",
		enforce2fa: true,
		ssoOnly: false,
		ipAllowlist: false,
		sessionTimeout: "720",
		origins: "*",
		notifyApproval: true,
		notifyWeekly: true,
		notifyUsage: true,
		threshold: "80",
	});

	function patch<K extends keyof typeof settings>(key: K, value: (typeof settings)[K]) {
		setSettings((current) => ({ ...current, [key]: value }));
	}

	async function save() {
		setSaving(true);
		await new Promise((resolve) => setTimeout(resolve, 800));
		setSaving(false);
		toast.success("设置已保存", { description: "演示模式：更改不会真正持久化。" });
	}

	return (
		<AppShell>
			<PageHeader
				title="设置"
				description="管理工作区信息、安全策略和通知偏好。"
				actions={
					<>
						<Button variant="outline" onClick={() => toast.info("已放弃未保存的更改")}>
							重置
						</Button>
						<Button isLoading={saving} onClick={save}>
							保存更改
						</Button>
					</>
				}
			/>

			<div className="bg-muted/30 mb-5 flex items-start gap-2.5 rounded-lg border px-4 py-3">
				<Info className="text-muted-foreground mt-0.5 size-4 shrink-0" />
				<p className="text-muted-foreground text-xs leading-5">
					仅管理员可以修改这些设置。部分安全策略变更会在团队成员下次登录时生效。
				</p>
			</div>

			<div className="space-y-5">
				{/* 工作区 */}
				<Card className="gap-0 py-0">
					<div className="border-b px-5 py-4">
						<p className="text-sm font-semibold">工作区</p>
						<p className="text-muted-foreground mt-1 text-xs">这些信息会展示在控制台和通知邮件中。</p>
					</div>
					<div className="space-y-4 px-5 py-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<Label htmlFor="workspace-name">工作区名称</Label>
								<Input
									id="workspace-name"
									className="mt-1.5"
									value={settings.name}
									onChange={(event) => patch("name", event.target.value)}
								/>
							</div>
							<div>
								<Label>默认时区</Label>
								<Select value={settings.timezone} onValueChange={(value) => patch("timezone", value)}>
									<SelectTrigger className="mt-1.5 w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{TIMEZONES.map((zone) => (
											<SelectItem key={zone} value={zone}>
												{zone}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div>
							<Label htmlFor="workspace-description">工作区描述</Label>
							<Textarea
								id="workspace-description"
								className="mt-1.5"
								value={settings.description}
								onChange={(event) => patch("description", event.target.value)}
							/>
						</div>
						<div className="sm:w-1/2 sm:pr-2">
							<Label>界面语言</Label>
							<Select value={settings.language} onValueChange={(value) => patch("language", value)}>
								<SelectTrigger className="mt-1.5 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LANGUAGES.map((language) => (
										<SelectItem key={language} value={language}>
											{language}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</Card>

				{/* 安全 */}
				<Card className="gap-0 divide-y py-0">
					<div className="px-5 py-4">
						<p className="text-sm font-semibold">安全设置</p>
						<p className="text-muted-foreground mt-1 text-xs">控制团队成员如何登录以及 API 的访问范围。</p>
					</div>

					<SettingRow
						title="强制双因素认证"
						description="所有团队成员在登录控制台时必须完成二次验证。"
						control={
							<Switch
								checked={settings.enforce2fa}
								onCheckedChange={(checked) => patch("enforce2fa", checked)}
								aria-label="强制双因素认证"
							/>
						}
					/>

					<SettingRow
						title="仅允许 SSO 登录"
						description="关闭密码登录，成员只能通过企业身份提供商登录。"
						control={
							<Switch
								checked={settings.ssoOnly}
								onCheckedChange={(checked) => patch("ssoOnly", checked)}
								aria-label="仅允许 SSO 登录"
							/>
						}
					/>

					<SettingRow
						title="IP 白名单"
						description="仅允许来自指定网段的请求访问管理 API。"
						control={
							<Switch
								checked={settings.ipAllowlist}
								onCheckedChange={(checked) => patch("ipAllowlist", checked)}
								aria-label="IP 白名单"
							/>
						}
					/>

					<SettingRow
						title="会话超时"
						description="控制台登录状态在无操作多久后失效，单位分钟。"
					>
						<Input
							type="number"
							min={15}
							className="mt-2 w-40 font-mono"
							value={settings.sessionTimeout}
							onChange={(event) => patch("sessionTimeout", event.target.value)}
						/>
					</SettingRow>

					<SettingRow
						title="允许的来源"
						description="CORS 与 WebSocket 允许的来源列表，每行一个。使用 * 允许所有来源。"
					>
						<Textarea
							className="mt-2 font-mono text-xs"
							rows={4}
							value={settings.origins}
							onChange={(event) => patch("origins", event.target.value)}
						/>
					</SettingRow>
				</Card>

				{/* 通知 */}
				<Card className="gap-0 divide-y py-0">
					<div className="px-5 py-4">
						<p className="text-sm font-semibold">通知</p>
						<p className="text-muted-foreground mt-1 text-xs">选择哪些事件需要通知管理员。</p>
					</div>

					<SettingRow
						title="审批结果通知"
						description="有新的审批申请，或你提交的申请被处理时发送邮件。"
						control={
							<Switch
								checked={settings.notifyApproval}
								onCheckedChange={(checked) => patch("notifyApproval", checked)}
								aria-label="审批结果通知"
							/>
						}
					/>

					<SettingRow
						title="每周使用报告"
						description="每周一发送上周的请求量、成本与异常汇总。"
						control={
							<Switch
								checked={settings.notifyWeekly}
								onCheckedChange={(checked) => patch("notifyWeekly", checked)}
								aria-label="每周使用报告"
							/>
						}
					/>

					<SettingRow
						title="用量告警"
						description="项目用量达到预算阈值时提醒负责人。"
						control={
							<Switch
								checked={settings.notifyUsage}
								onCheckedChange={(checked) => patch("notifyUsage", checked)}
								aria-label="用量告警"
							/>
						}
					>
						<div className="mt-2 flex items-center gap-2">
							<span className="text-muted-foreground text-xs">阈值</span>
							<Select value={settings.threshold} onValueChange={(value) => patch("threshold", value)}>
								<SelectTrigger size="sm" className="w-24 font-mono">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{THRESHOLDS.map((threshold) => (
										<SelectItem key={threshold} value={threshold}>
											{threshold}%
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</SettingRow>
				</Card>

				<div className="flex items-center justify-end gap-2 pb-2">
					<Button variant="outline" onClick={() => toast.info("已放弃未保存的更改")}>
						重置
					</Button>
					<Button isLoading={saving} onClick={save}>
						保存更改
					</Button>
				</div>
			</div>
		</AppShell>
	);
}
