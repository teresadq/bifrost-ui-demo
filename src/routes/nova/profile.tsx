import { createFileRoute } from "@tanstack/react-router";
import { Laptop, LogOut, Smartphone, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill } from "@/components/statusPill";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/nova/profile")({
	component: ProfilePage,
});

const TIMEZONES = ["Asia/Shanghai", "Asia/Singapore", "Europe/London", "America/New_York"];
const LANGUAGES = ["简体中文", "English"];

function ProfilePage() {
	const [saving, setSaving] = useState(false);
	const [profile, setProfile] = useState({
		name: "陈晓",
		email: "admin@nova.dev",
		title: "平台工程负责人",
		bio: "负责 Nova 团队的模型网关、成本治理和可观测性建设。",
		timezone: "Asia/Shanghai",
		language: "简体中文",
		emailNotify: true,
	});
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	function patch<K extends keyof typeof profile>(key: K, value: (typeof profile)[K]) {
		setProfile((current) => ({ ...current, [key]: value }));
	}

	async function save() {
		setSaving(true);
		await new Promise((resolve) => setTimeout(resolve, 700));
		setSaving(false);
		toast.success("个人资料已保存");
	}

	function changePassword() {
		if (newPassword.length < 8) {
			toast.error("新密码至少需要 8 位");
			return;
		}
		setCurrentPassword("");
		setNewPassword("");
		toast.success("密码已更新，其他设备将需要重新登录");
	}

	return (
		<AppShell>
			<PageHeader
				title="个人资料"
				description="管理你的账号信息、偏好设置、密码和登录会话。"
				actions={
					<Button isLoading={saving} onClick={save}>
						保存更改
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
				<Card className="h-fit gap-0 py-0">
					<CardContent className="flex flex-col items-center px-5 py-6 text-center">
						<Avatar className="size-20">
							<AvatarFallback className="bg-secondary text-2xl font-medium">陈</AvatarFallback>
						</Avatar>
						<p className="mt-3 text-sm font-semibold">{profile.name}</p>
						<p className="text-muted-foreground mt-0.5 text-xs">{profile.email}</p>
						<div className="mt-2 flex items-center gap-1.5">
							<StatusPill tone="solid">管理员</StatusPill>
							<StatusPill tone="info" dot>
								2FA 已开启
							</StatusPill>
						</div>
						<Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info("头像上传在演示中不可用")}>
							<Upload className="size-3.5" />
							更换头像
						</Button>
						<p className="text-muted-foreground/70 mt-4 text-[10px]">加入于 2025 年 8 月 12 日</p>
					</CardContent>
				</Card>

				<div className="space-y-4">
					<Card className="gap-0 py-0">
						<CardHeader className="border-b px-5 py-4">
							<CardTitle className="text-sm">基本信息</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 px-5 py-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label htmlFor="profile-name">姓名</Label>
									<Input
										id="profile-name"
										value={profile.name}
										onChange={(event) => patch("name", event.target.value)}
										className="mt-1.5"
									/>
								</div>
								<div>
									<Label htmlFor="profile-email">邮箱</Label>
									<Input
										id="profile-email"
										type="email"
										value={profile.email}
										onChange={(event) => patch("email", event.target.value)}
										className="mt-1.5"
									/>
								</div>
							</div>
							<div>
								<Label htmlFor="profile-title">职位</Label>
								<Input
									id="profile-title"
									value={profile.title}
									onChange={(event) => patch("title", event.target.value)}
									className="mt-1.5"
								/>
							</div>
							<div>
								<Label htmlFor="profile-bio">个人简介</Label>
								<Textarea
									id="profile-bio"
									value={profile.bio}
									onChange={(event) => patch("bio", event.target.value)}
									className="mt-1.5"
								/>
							</div>
						</CardContent>
					</Card>

					<Card className="gap-0 py-0">
						<CardHeader className="border-b px-5 py-4">
							<CardTitle className="text-sm">偏好设置</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 px-5 py-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label>时区</Label>
									<Select value={profile.timezone} onValueChange={(value) => patch("timezone", value)}>
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
								<div>
									<Label>界面语言</Label>
									<Select value={profile.language} onValueChange={(value) => patch("language", value)}>
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
							<div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2.5">
								<div>
									<p className="text-[13px] font-medium">邮件通知</p>
									<p className="text-muted-foreground mt-0.5 text-xs">接收审批结果、预算告警和每周报告。</p>
								</div>
								<Switch checked={profile.emailNotify} onCheckedChange={(checked) => patch("emailNotify", checked)} aria-label="邮件通知" />
							</div>
						</CardContent>
					</Card>

					<Card className="gap-0 py-0">
						<CardHeader className="border-b px-5 py-4">
							<CardTitle className="text-sm">修改密码</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4 px-5 py-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<div>
									<Label htmlFor="current-password">当前密码</Label>
									<Input
										id="current-password"
										type="password"
										value={currentPassword}
										onChange={(event) => setCurrentPassword(event.target.value)}
										className="mt-1.5"
									/>
								</div>
								<div>
									<Label htmlFor="new-password">新密码</Label>
									<Input
										id="new-password"
										type="password"
										value={newPassword}
										onChange={(event) => setNewPassword(event.target.value)}
										className="mt-1.5"
									/>
								</div>
							</div>
							<div className="flex justify-end">
								<Button variant="outline" onClick={changePassword}>
									更新密码
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="gap-0 py-0">
						<CardHeader className="border-b px-5 py-4">
							<CardTitle className="text-sm">活跃会话</CardTitle>
						</CardHeader>
						<CardContent className="px-0">
							<ul>
								{[
									{ id: "s1", icon: Laptop, name: "MacBook Pro · Chrome", location: "上海 · 10.12.3.41", time: "当前会话", current: true },
									{ id: "s2", icon: Smartphone, name: "iPhone 16 · Safari", location: "上海 · 10.12.3.88", time: "2 天前", current: false },
								].map((session, index) => (
									<li
										key={session.id}
										className={`flex flex-wrap items-center gap-3 px-5 py-3 ${index > 0 ? "border-t" : ""}`}
									>
										<session.icon className="text-muted-foreground size-4" />
										<div className="flex-1">
											<p className="text-[13px]">{session.name}</p>
											<p className="text-muted-foreground text-[11px]">{session.location}</p>
										</div>
										{session.current ? (
											<StatusPill tone="info" dot>
												当前会话
											</StatusPill>
										) : (
											<>
												<span className="text-muted-foreground text-[11px]">{session.time}</span>
												<Button
													variant="ghost"
													size="sm"
													className="text-muted-foreground h-7 text-xs"
													onClick={() => toast.success("该会话已注销")}
												>
													<LogOut className="size-3.5" />
													注销
												</Button>
											</>
										)}
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</AppShell>
	);
}
