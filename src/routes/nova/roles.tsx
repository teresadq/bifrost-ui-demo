import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { StatusPill } from "@/components/statusPill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nova/roles")({
	component: RolesPage,
});

type Role = {
	id: string;
	name: string;
	description: string;
	members: number;
	builtIn: boolean;
};

const PERMISSION_GROUPS = [
	{
		group: "项目",
		permissions: [
			{ key: "project.view", label: "查看项目" },
			{ key: "project.create", label: "创建项目" },
			{ key: "project.edit", label: "编辑项目" },
			{ key: "project.delete", label: "删除项目" },
		],
	},
	{
		group: "模型与提供商",
		permissions: [
			{ key: "model.view", label: "查看模型目录" },
			{ key: "model.configure", label: "配置提供商与密钥" },
			{ key: "model.custom", label: "添加自定义模型" },
		],
	},
	{
		group: "API 密钥",
		permissions: [
			{ key: "key.view", label: "查看密钥" },
			{ key: "key.create", label: "创建密钥" },
			{ key: "key.revoke", label: "吊销密钥" },
		],
	},
	{
		group: "成员与角色",
		permissions: [
			{ key: "member.view", label: "查看成员" },
			{ key: "member.invite", label: "邀请成员" },
			{ key: "role.manage", label: "管理角色与权限" },
		],
	},
	{
		group: "账单与审计",
		permissions: [
			{ key: "billing.view", label: "查看账单与用量" },
			{ key: "billing.manage", label: "管理套餐与支付" },
			{ key: "audit.view", label: "查看审计日志" },
			{ key: "alert.manage", label: "管理告警规则" },
		],
	},
	{
		group: "系统设置",
		permissions: [
			{ key: "settings.view", label: "查看设置" },
			{ key: "settings.manage", label: "修改设置" },
		],
	},
];

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((group) => group.permissions.map((item) => item.key));

const INITIAL_ROLES: Role[] = [
	{ id: "admin", name: "管理员", description: "拥有工作区的全部权限，包括账单与成员管理。", members: 2, builtIn: true },
	{ id: "developer", name: "开发者", description: "可以创建项目、配置模型和创建 API 密钥。", members: 4, builtIn: true },
	{ id: "viewer", name: "查看者", description: "只读访问项目、日志和报表，不能做任何修改。", members: 2, builtIn: true },
	{ id: "finance", name: "财务", description: "可以查看账单、用量和预算，但不能修改项目。", members: 1, builtIn: true },
	{ id: "auditor", name: "审计员", description: "只读访问审计日志和设置，用于合规检查。", members: 0, builtIn: false },
];

const INITIAL_PERMISSIONS: Record<string, Set<string>> = {
	admin: new Set(ALL_PERMISSIONS),
	developer: new Set([
		"project.view",
		"project.create",
		"project.edit",
		"model.view",
		"model.configure",
		"key.view",
		"key.create",
		"member.view",
		"billing.view",
	]),
	viewer: new Set(["project.view", "model.view", "billing.view", "audit.view", "settings.view"]),
	finance: new Set(["project.view", "model.view", "billing.view", "billing.manage", "audit.view"]),
	auditor: new Set(["audit.view", "settings.view", "billing.view"]),
};

function RolesPage() {
	const [roles, setRoles] = useState(INITIAL_ROLES);
	const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
	const [selectedId, setSelectedId] = useState("developer");
	const [dirty, setDirty] = useState(false);
	const [createOpen, setCreateOpen] = useState(false);
	const [newName, setNewName] = useState("");
	const [newDescription, setNewDescription] = useState("");

	const selected = roles.find((role) => role.id === selectedId) ?? roles[0];
	const current = permissions[selected.id] ?? new Set<string>();

	const enabledCount = useMemo(() => current.size, [current]);

	function togglePermission(key: string, checked: boolean) {
		setPermissions((state) => {
			const next = new Set(state[selected.id] ?? []);
			if (checked) next.add(key);
			else next.delete(key);
			return { ...state, [selected.id]: next };
		});
		setDirty(true);
	}

	function toggleGroup(keys: string[], checked: boolean) {
		setPermissions((state) => {
			const next = new Set(state[selected.id] ?? []);
			for (const key of keys) {
				if (checked) next.add(key);
				else next.delete(key);
			}
			return { ...state, [selected.id]: next };
		});
		setDirty(true);
	}

	function save() {
		setDirty(false);
		toast.success(`${selected.name} 的权限已保存`);
	}

	function createRole() {
		if (!newName.trim()) {
			toast.error("请输入角色名称");
			return;
		}
		const id = `role_${Date.now()}`;
		setRoles((current) => [...current, { id, name: newName.trim(), description: newDescription.trim() || "自定义角色", members: 0, builtIn: false }]);
		setPermissions((state) => ({ ...state, [id]: new Set(["project.view", "model.view"]) }));
		setSelectedId(id);
		setCreateOpen(false);
		setNewName("");
		setNewDescription("");
		toast.success("角色已创建", { description: "继续勾选该角色需要的权限。" });
	}

	return (
		<AppShell>
			<PageHeader
				title="角色权限"
				description="通过角色为团队成员分配最小必要权限。内置角色不可删除，但可以调整权限。"
				actions={
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="size-4" />
						新建角色
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
				<Card className="gap-0 py-0">
					<div className="border-b px-4 py-3">
						<p className="text-sm font-medium">角色</p>
						<p className="text-muted-foreground mt-0.5 text-xs">{roles.length} 个角色</p>
					</div>
					<ul>
						{roles.map((role) => {
							const active = role.id === selected.id;
							return (
								<li key={role.id} className="border-b last:border-b-0">
									<button
										type="button"
										onClick={() => {
											setSelectedId(role.id);
											setDirty(false);
										}}
										className={cn(
											"w-full cursor-pointer px-4 py-3 text-left transition-colors",
											active ? "bg-secondary/60" : "hover:bg-muted/40",
										)}
									>
										<div className="flex items-center gap-2">
											<span className={cn("text-[13px]", active ? "font-medium" : "font-normal")}>{role.name}</span>
											{role.builtIn ? (
												<StatusPill tone="neutral">内置</StatusPill>
											) : (
												<StatusPill tone="purple">自定义</StatusPill>
											)}
										</div>
										<p className="text-muted-foreground mt-1 line-clamp-2 text-[11px] leading-4">{role.description}</p>
										<p className="text-muted-foreground/70 mt-1.5 text-[10px]">{role.members} 名成员</p>
									</button>
								</li>
							);
						})}
					</ul>
				</Card>

				<Card className="gap-0 py-0">
					<div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
						<div>
							<div className="flex items-center gap-2">
								<ShieldCheck className="size-4" />
								<p className="text-sm font-semibold">{selected.name}</p>
								<StatusPill tone="neutral">{enabledCount} / {ALL_PERMISSIONS.length} 项权限</StatusPill>
							</div>
							<p className="text-muted-foreground mt-1 text-xs">{selected.description}</p>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								disabled={!dirty}
								onClick={() => {
									setPermissions((state) => ({ ...state, [selected.id]: new Set(INITIAL_PERMISSIONS[selected.id] ?? []) }));
									setDirty(false);
								}}
							>
								重置
							</Button>
							<Button size="sm" disabled={!dirty} onClick={save}>
								保存更改
							</Button>
						</div>
					</div>

					<div className="divide-y">
						{PERMISSION_GROUPS.map((group) => {
							const keys = group.permissions.map((item) => item.key);
							const allChecked = keys.every((key) => current.has(key));
							const someChecked = keys.some((key) => current.has(key));

							return (
								<div key={group.group} className="px-5 py-4">
									<div className="mb-2 flex items-center gap-2">
										<Checkbox
											aria-label={`全选${group.group}`}
											checked={allChecked ? true : someChecked ? "indeterminate" : false}
											onCheckedChange={(checked) => toggleGroup(keys, checked === true)}
										/>
										<p className="text-[13px] font-medium">{group.group}</p>
									</div>
									<div className="ml-6 grid gap-2 sm:grid-cols-2">
										{group.permissions.map((permission) => (
											<label
												key={permission.key}
												className="hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-xs"
											>
												<Checkbox
													checked={current.has(permission.key)}
													onCheckedChange={(checked) => togglePermission(permission.key, checked === true)}
												/>
												{permission.label}
												{current.has(permission.key) && <Check className="text-chart-info-ink ml-auto size-3.5" />}
											</label>
										))}
									</div>
								</div>
							);
						})}
					</div>
				</Card>
			</div>

			<Dialog open={createOpen} onOpenChange={setCreateOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>新建角色</DialogTitle>
						<DialogDescription>创建后再为角色勾选具体权限。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="role-name">角色名称</Label>
							<Input
								id="role-name"
								value={newName}
								onChange={(event) => setNewName(event.target.value)}
								placeholder="例如：数据分析师"
								className="mt-1.5"
							/>
						</div>
						<div>
							<Label htmlFor="role-description">描述</Label>
							<Textarea
								id="role-description"
								value={newDescription}
								onChange={(event) => setNewDescription(event.target.value)}
								placeholder="说明这个角色适合哪些成员"
								className="mt-1.5"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setCreateOpen(false)}>
							取消
						</Button>
						<Button onClick={createRole}>创建角色</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</AppShell>
	);
}
