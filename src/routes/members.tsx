import { createFileRoute } from "@tanstack/react-router";
import { Check, Ellipsis, MailPlus, ShieldCheck, Trash2, UserX, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTable, type Column } from "@/components/dataTable";
import { AppShell } from "@/components/dashboard/appShell";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill, type StatusTone } from "@/components/statusPill";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/members")({
	component: MembersPage,
});

type MemberRole = "管理员" | "开发者" | "查看者" | "财务";
type MemberStatus = "active" | "invited" | "suspended";

type Member = {
	id: string;
	name: string;
	email: string;
	role: MemberRole;
	status: MemberStatus;
	twoFactor: boolean;
	lastActive: string;
};

const ROLES: MemberRole[] = ["管理员", "开发者", "查看者", "财务"];

const INITIAL_MEMBERS: Member[] = [
	{ id: "usr_01", name: "陈晓", email: "admin@nova.dev", role: "管理员", status: "active", twoFactor: true, lastActive: "刚刚" },
	{ id: "usr_02", name: "王敏", email: "wangmin@nova.dev", role: "管理员", status: "active", twoFactor: true, lastActive: "12 分钟前" },
	{ id: "usr_03", name: "周航", email: "zhouhang@nova.dev", role: "开发者", status: "active", twoFactor: true, lastActive: "1 小时前" },
	{ id: "usr_04", name: "林菲", email: "linfei@nova.dev", role: "开发者", status: "active", twoFactor: false, lastActive: "3 小时前" },
	{ id: "usr_05", name: "何静", email: "hejing@nova.dev", role: "开发者", status: "active", twoFactor: true, lastActive: "昨天" },
	{ id: "usr_06", name: "宋涛", email: "songtao@nova.dev", role: "查看者", status: "active", twoFactor: false, lastActive: "2 天前" },
	{ id: "usr_07", name: "李娜", email: "lina@nova.dev", role: "财务", status: "active", twoFactor: true, lastActive: "4 天前" },
	{ id: "usr_08", name: "赵磊", email: "zhaolei@nova.dev", role: "开发者", status: "invited", twoFactor: false, lastActive: "邀请待接受" },
	{ id: "usr_09", name: "孙悦", email: "sunyue@nova.dev", role: "查看者", status: "suspended", twoFactor: false, lastActive: "30 天前" },
];

const STATUS: Record<MemberStatus, { label: string; tone: StatusTone }> = {
	active: { label: "活跃", tone: "info" },
	invited: { label: "待接受邀请", tone: "warning" },
	suspended: { label: "已暂停", tone: "neutral" },
};

function MembersPage() {
	const [members, setMembers] = useState(INITIAL_MEMBERS);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [query, setQuery] = useState("");
	const [role, setRole] = useState("all");
	const [status, setStatus] = useState("all");
	const [inviteOpen, setInviteOpen] = useState(false);
	const [inviteEmail, setInviteEmail] = useState("");
	const [inviteRole, setInviteRole] = useState<MemberRole>("开发者");
	const [inviteMessage, setInviteMessage] = useState("");

	const rows = useMemo(
		() =>
			members.filter((member) => {
				const matchesQuery = !query || `${member.name} ${member.email}`.toLowerCase().includes(query.toLowerCase());
				return matchesQuery && (role === "all" || member.role === role) && (status === "all" || member.status === status);
			}),
		[members, query, role, status],
	);

	function updateMember(id: string, patch: Partial<Member>) {
		setMembers((current) => current.map((member) => (member.id === id ? { ...member, ...patch } : member)));
	}

	function sendInvite() {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
			toast.error("请输入有效的邮箱地址");
			return;
		}
		const name = inviteEmail.split("@")[0];
		setMembers((current) => [
			...current,
			{
				id: `usr_${Date.now()}`,
				name,
				email: inviteEmail,
				role: inviteRole,
				status: "invited",
				twoFactor: false,
				lastActive: "邀请待接受",
			},
		]);
		setInviteOpen(false);
		setInviteEmail("");
		setInviteMessage("");
		toast.success("邀请已发送", { description: `${inviteEmail} · ${inviteRole}` });
	}

	const columns: Column<Member>[] = [
		{
			key: "member",
			header: "成员",
			sortable: true,
			sortValue: (row) => row.name,
			cell: (row) => (
				<div className="flex items-center gap-2.5">
					<Avatar className="size-7">
						<AvatarFallback className="bg-secondary text-[10px] font-medium">{row.name.slice(0, 1)}</AvatarFallback>
					</Avatar>
					<div>
						<p className="text-[13px] font-medium">{row.name}</p>
						<p className="text-muted-foreground text-[11px]">{row.email}</p>
					</div>
				</div>
			),
		},
		{
			key: "role",
			header: "角色",
			cell: (row) => (
				<span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[11px]">{row.role}</span>
			),
		},
		{
			key: "status",
			header: "状态",
			cell: (row) => (
				<StatusPill tone={STATUS[row.status].tone} dot>
					{STATUS[row.status].label}
				</StatusPill>
			),
		},
		{
			key: "2fa",
			header: "双重验证",
			cell: (row) =>
				row.twoFactor ? (
					<span className="text-chart-info-ink inline-flex items-center gap-1 text-xs">
						<Check className="size-3.5" /> 已开启
					</span>
				) : (
					<span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
						<X className="size-3.5" /> 未开启
					</span>
				),
		},
		{
			key: "lastActive",
			header: "最近活跃",
			cell: (row) => <span className="text-muted-foreground text-xs">{row.lastActive}</span>,
		},
		{
			key: "actions",
			header: "",
			cell: (row) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="size-7" aria-label="成员操作">
							<Ellipsis className="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuLabel className="text-[11px]">修改角色</DropdownMenuLabel>
						{ROLES.map((item) => (
							<DropdownMenuItem
								key={item}
								onClick={() => {
									updateMember(row.id, { role: item });
									toast.success(`${row.name} 的角色已更新为${item}`);
								}}
							>
								{item}
								{row.role === item && <Check className="ml-auto size-3.5" />}
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => toast.success("已重新发送邀请")}>
							<MailPlus className="size-4" />
							重新发送邀请
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => {
							updateMember(row.id, { status: row.status === "suspended" ? "active" : "suspended" });
							toast.success(row.status === "suspended" ? "成员已恢复" : "成员已暂停");
						}}>
							<UserX className="size-4" />
							{row.status === "suspended" ? "恢复成员" : "暂停成员"}
						</DropdownMenuItem>
						<DropdownMenuItem
							variant="destructive"
							onClick={() => {
								setMembers((current) => current.filter((member) => member.id !== row.id));
								toast.success(`${row.name} 已被移出团队`);
							}}
						>
							<Trash2 className="size-4" />
							移除成员
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
			className: "w-12",
		},
	];

	return (
		<AppShell>
			<PageHeader
				title="团队成员"
				description="邀请成员、分配角色并管理访问状态。角色权限可在「角色权限」中细调。"
				actions={
					<Button onClick={() => setInviteOpen(true)}>
						<MailPlus className="size-4" />
						邀请成员
					</Button>
				}
			/>

			<div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
				<Metric label="团队成员" value={members.length} hint="含 1 个待接受邀请" />
				<Metric label="活跃成员" value={members.filter((m) => m.status === "active").length} hint="最近 30 天登录" />
				<Metric label="管理员" value={members.filter((m) => m.role === "管理员").length} hint="拥有全部权限" />
				<Metric
					label="未开启 2FA"
					value={members.filter((m) => !m.twoFactor && m.status === "active").length}
					hint="建议在安全设置中强制开启"
					tone="warning"
				/>
			</div>

			<div className="mb-3 flex flex-wrap items-center gap-2">
				<div className="text-muted-foreground focus-within:border-ring/60 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 transition-colors sm:w-64">
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="搜索姓名或邮箱…"
						className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
					/>
				</div>
				<Select value={role} onValueChange={setRole}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部角色</SelectItem>
						{ROLES.map((item) => (
							<SelectItem key={item} value={item}>
								{item}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger size="sm" className="w-28 text-[13px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">全部状态</SelectItem>
						<SelectItem value="active">活跃</SelectItem>
						<SelectItem value="invited">待接受邀请</SelectItem>
						<SelectItem value="suspended">已暂停</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{selected.size > 0 && (
				<div className="bg-secondary/60 mb-3 flex flex-wrap items-center gap-2 rounded-md border px-3 py-2">
					<span className="text-xs font-medium">已选择 {selected.size} 名成员</span>
					<div className="ml-auto flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="h-7 text-xs"
							onClick={() => {
								[...selected].forEach((id) => updateMember(id, { status: "suspended" }));
								setSelected(new Set());
								toast.success("已批量暂停");
							}}
						>
							批量暂停
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-7 text-xs"
							onClick={() => {
								setMembers((current) => current.filter((member) => !selected.has(member.id)));
								setSelected(new Set());
								toast.success("已移除所选成员");
							}}
						>
							移除
						</Button>
					</div>
				</div>
			)}

			<DataTable
				columns={columns}
				rows={rows}
				pageSize={8}
				selectable
				selected={selected}
				onSelectedChange={setSelected}
				emptyText="没有匹配的成员"
			/>

			<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>邀请成员</DialogTitle>
						<DialogDescription>对方会收到一封包含加入链接的邮件，链接 7 天内有效。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="invite-email">邮箱地址</Label>
							<Input
								id="invite-email"
								type="email"
								value={inviteEmail}
								onChange={(event) => setInviteEmail(event.target.value)}
								placeholder="teammate@company.com"
								className="mt-1.5"
							/>
						</div>
						<div>
							<Label>角色</Label>
							<Select value={inviteRole} onValueChange={(value) => setInviteRole(value as MemberRole)}>
								<SelectTrigger className="mt-1.5 w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ROLES.map((item) => (
										<SelectItem key={item} value={item}>
											{item}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div>
							<Label htmlFor="invite-message">附言（可选）</Label>
							<Textarea
								id="invite-message"
								value={inviteMessage}
								onChange={(event) => setInviteMessage(event.target.value)}
								placeholder="欢迎加入 Nova 团队！"
								className="mt-1.5"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setInviteOpen(false)}>
							取消
						</Button>
						<Button onClick={sendInvite}>
							<ShieldCheck className="size-4" />
							发送邀请
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
