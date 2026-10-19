import { createFileRoute } from "@tanstack/react-router";
import {
	Ellipsis,
	Mail,
	Search,
	Send,
	ShieldCheck,
	UserPlus,
	Users,
	UserX,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { REUI_MEMBERS, type ReuiMember } from "@/components/reui/data";
import {
	ReBadge,
	ReButton,
	ReCard,
	ReEmptyState,
	ReIconTile,
	RePageHeader,
} from "@/components/reui/ui";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/members")({
	component: MembersPage,
});

const STATUS_TONE = {
	在线: "success",
	离开: "outline",
	停用: "neutral",
	待邀请: "info",
} as const;

const ROLE_TONE = {
	所有者: "dark",
	管理员: "blue",
	开发者: "neutral",
	只读: "outline",
} as const;

function MembersPage() {
	const [members, setMembers] = useState<ReuiMember[]>(REUI_MEMBERS);
	const [query, setQuery] = useState("");
	const [role, setRole] = useState("all");
	const [inviteOpen, setInviteOpen] = useState(false);
	const [invite, setInvite] = useState({ email: "", role: "开发者" as ReuiMember["role"], team: "应用组" });

	const filtered = useMemo(() => {
		const value = query.trim().toLowerCase();
		return members.filter((member) => {
			const matchesQuery =
				!value || member.name.toLowerCase().includes(value) || member.email.toLowerCase().includes(value) || member.team.includes(value);
			const matchesRole = role === "all" || member.role === role;
			return matchesQuery && matchesRole;
		});
	}, [members, query, role]);

	const online = members.filter((member) => member.status === "在线").length;
	const twoFactor = members.filter((member) => member.twoFactor).length;
	const pending = members.filter((member) => member.status === "待邀请").length;

	function updateRole(id: string, nextRole: ReuiMember["role"]) {
		setMembers((current) => current.map((member) => (member.id === id ? { ...member, role: nextRole } : member)));
		toast.success("角色已更新");
	}

	function sendInvite() {
		const email = invite.email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			toast.error("请输入有效的邮箱地址");
			return;
		}
		const name = email.split("@")[0];
		setMembers((current) => [
			...current,
			{
				id: `u-${Date.now()}`,
				name,
				email,
				initials: name.slice(0, 1).toUpperCase(),
				role: invite.role,
				team: invite.team,
				twoFactor: false,
				status: "待邀请",
				lastActive: "—",
				color: "bg-secondary text-secondary-foreground",
			},
		]);
		setInvite({ email: "", role: "开发者", team: "应用组" });
		setInviteOpen(false);
		toast.success("邀请已发送", { description: `已向 ${email} 发送加入链接` });
	}

	return (
		<>
			<RePageHeader
				eyebrow="Team"
				title="团队成员"
				description="管理工作区成员、角色与双因素认证状态。"
				actions={
					<>
						<ReButton variant="outline" className="gap-1.5" onClick={() => toast.info("演示模式：SSO 配置不可用")}>
							<ShieldCheck className="size-3.5" />
							SSO 配置
						</ReButton>
						<ReButton className="gap-1.5" onClick={() => setInviteOpen(true)}>
							<UserPlus className="size-3.5" />
							邀请成员
						</ReButton>
					</>
				}
			/>

			<div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Users} tone="dark" />
					<div>
						<p className="text-muted-foreground text-[11px]">全部成员</p>
						<p className="text-xl font-semibold tabular-nums">{members.length}</p>
					</div>
					<ReBadge tone="outline" className="ml-auto">上限 25</ReBadge>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={UserPlus} tone="emerald" />
					<div>
						<p className="text-muted-foreground text-[11px]">当前在线</p>
						<p className="text-xl font-semibold tabular-nums">{online}</p>
					</div>
					<span className="text-muted-foreground ml-auto text-[10px]">过去 5 分钟</span>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={ShieldCheck} tone="blue" />
					<div>
						<p className="text-muted-foreground text-[11px]">2FA 覆盖</p>
						<p className="text-xl font-semibold tabular-nums">
							{Math.round((twoFactor / Math.max(1, members.length)) * 100)}%
						</p>
					</div>
					<span className="text-muted-foreground ml-auto text-[10px]">{twoFactor} 人已启用</span>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Mail} tone="amber" />
					<div>
						<p className="text-muted-foreground text-[11px]">待接受邀请</p>
						<p className="text-xl font-semibold tabular-nums">{pending}</p>
					</div>
					<ReBadge tone="warning" className="ml-auto">需要跟进</ReBadge>
				</ReCard>
			</div>

			<ReCard className="overflow-hidden">
				<div className="flex flex-wrap items-center gap-2 border-b p-3">
					<div className="relative">
						<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
						<Input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="搜索姓名、邮箱或团队…"
							className="h-8 w-64 rounded-lg pl-8 text-xs"
						/>
					</div>
					<Select value={role} onValueChange={setRole}>
						<SelectTrigger className="h-8 w-32 rounded-lg text-xs">
							<SelectValue placeholder="角色" />
						</SelectTrigger>
						<SelectContent className="rounded-lg">
							<SelectItem value="all">全部角色</SelectItem>
							<SelectItem value="所有者">所有者</SelectItem>
							<SelectItem value="管理员">管理员</SelectItem>
							<SelectItem value="开发者">开发者</SelectItem>
							<SelectItem value="只读">只读</SelectItem>
						</SelectContent>
					</Select>
					<span className="text-muted-foreground ml-auto text-[11px]">{filtered.length} 位成员</span>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-muted-foreground bg-secondary/40 text-left text-[11px]">
								<th className="px-5 py-2.5 font-medium">成员</th>
								<th className="px-5 py-2.5 font-medium">角色</th>
								<th className="px-5 py-2.5 font-medium">团队</th>
								<th className="px-5 py-2.5 font-medium">2FA</th>
								<th className="px-5 py-2.5 font-medium">状态</th>
								<th className="px-5 py-2.5 font-medium">最近活跃</th>
								<th className="w-10 px-5 py-2.5" />
							</tr>
						</thead>
						<tbody>
							{filtered.map((member) => (
								<tr key={member.id} className="hover:bg-secondary/40 border-t transition-colors">
									<td className="px-5 py-3">
										<div className="flex items-center gap-2.5">
											<span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold", member.color)}>
												{member.initials}
											</span>
											<div className="min-w-0">
												<p className="text-xs font-medium">
													{member.name}
													{member.role === "所有者" && <span className="text-muted-foreground ml-1.5 text-[10px]">(你)</span>}
												</p>
												<p className="text-muted-foreground truncate text-[10px]">{member.email}</p>
											</div>
										</div>
									</td>
									<td className="px-5 py-3">
										{member.role === "所有者" ? (
											<ReBadge tone={ROLE_TONE[member.role]}>{member.role}</ReBadge>
										) : (
											<Select value={member.role} onValueChange={(value) => updateRole(member.id, value as ReuiMember["role"])}>
												<SelectTrigger className="h-7 w-24 rounded-md text-[11px]">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="rounded-lg">
													<SelectItem value="管理员">管理员</SelectItem>
													<SelectItem value="开发者">开发者</SelectItem>
													<SelectItem value="只读">只读</SelectItem>
												</SelectContent>
											</Select>
										)}
									</td>
									<td className="text-muted-foreground px-5 py-3 text-xs">{member.team}</td>
									<td className="px-5 py-3">
										{member.twoFactor ? (
											<span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-300">
												<ShieldCheck className="size-3.5" />
												已启用
											</span>
										) : (
											<span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
												<UserX className="size-3.5" />
												未启用
											</span>
										)}
									</td>
									<td className="px-5 py-3">
										<ReBadge dot tone={STATUS_TONE[member.status]}>
											{member.status}
										</ReBadge>
									</td>
									<td className="text-muted-foreground px-5 py-3 text-xs">{member.lastActive}</td>
									<td className="px-5 py-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													aria-label={`${member.name} 的操作`}
													className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-7 cursor-pointer place-items-center rounded-md"
												>
													<Ellipsis className="size-3.5" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-44 rounded-lg">
												<DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("已复制邀请链接")}>
													复制邀请链接
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("演示模式：成员详情不可用")}>
													查看成员详情
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													variant="destructive"
													className="cursor-pointer"
													disabled={member.role === "所有者"}
													onClick={() => {
														setMembers((current) => current.filter((item) => item.id !== member.id));
														toast.success(`已移除 ${member.name}`);
													}}
												>
													移除成员
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filtered.length === 0 && (
					<ReEmptyState
						icon={Users}
						title="没有匹配的成员"
						description="尝试调整搜索关键词或角色筛选。"
						action={
							<ReButton
								variant="outline"
								onClick={() => {
									setQuery("");
									setRole("all");
								}}
							>
								清除筛选
							</ReButton>
						}
					/>
				)}
			</ReCard>

			<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
				<DialogContent className="rounded-xl sm:max-w-[440px]">
					<DialogHeader>
						<DialogTitle className="text-base">邀请团队成员</DialogTitle>
						<DialogDescription className="text-xs">对方会收到一封包含加入链接的邮件，链接 7 天内有效。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="invite-email" className="text-xs">邮箱地址</Label>
							<Input
								id="invite-email"
								type="email"
								value={invite.email}
								onChange={(event) => setInvite((current) => ({ ...current, email: event.target.value }))}
								placeholder="teammate@company.com"
								className="mt-1.5 h-10 rounded-lg"
								onKeyDown={(event) => {
									if (event.key === "Enter") sendInvite();
								}}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label className="text-xs">角色</Label>
								<Select value={invite.role} onValueChange={(value) => setInvite((current) => ({ ...current, role: value as ReuiMember["role"] }))}>
									<SelectTrigger className="mt-1.5 h-10 w-full rounded-lg">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-lg">
										<SelectItem value="管理员">管理员</SelectItem>
										<SelectItem value="开发者">开发者</SelectItem>
										<SelectItem value="只读">只读</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label className="text-xs">团队</Label>
								<Select value={invite.team} onValueChange={(value) => setInvite((current) => ({ ...current, team: value }))}>
									<SelectTrigger className="mt-1.5 h-10 w-full rounded-lg">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-lg">
										<SelectItem value="平台组">平台组</SelectItem>
										<SelectItem value="网关组">网关组</SelectItem>
										<SelectItem value="应用组">应用组</SelectItem>
										<SelectItem value="数据组">数据组</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<ReButton variant="outline" onClick={() => setInviteOpen(false)}>
							取消
						</ReButton>
						<ReButton onClick={sendInvite}>
							<Send className="size-3.5" />
							发送邀请
						</ReButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
