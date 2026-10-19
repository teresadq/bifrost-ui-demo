import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Columns3,
	Ellipsis,
	FolderKanban,
	Pause,
	Plus,
	Search,
	Trash2,
	Users,
	Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { REUI_PROJECTS, type ReuiProject } from "@/components/reui/data";
import {
	ReAvatarStack,
	ReBadge,
	ReButton,
	ReCard,
	ReEmptyState,
	ReIconTile,
	RePageHeader,
	ReProgress,
} from "@/components/reui/ui";
import { Checkbox } from "@/components/ui/checkbox";
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

export const Route = createFileRoute("/reui/projects")({
	component: ProjectsPage,
});

const PAGE_SIZE = 5;

type SortKey = "name" | "requests" | "budget";

function requestValue(requests: string) {
	if (requests === "—") return 0;
	const value = Number.parseFloat(requests);
	return requests.endsWith("M") ? value * 1_000_000 : value * 1_000;
}

const STATUS_TONE = {
	运行中: "success",
	已暂停: "warning",
	草稿: "outline",
} as const;

function ProjectsPage() {
	const [projects, setProjects] = useState<ReuiProject[]>(REUI_PROJECTS);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState("all");
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });
	const [dialogOpen, setDialogOpen] = useState(false);
	const [draft, setDraft] = useState({ name: "", description: "", budget: "2000" });

	const filtered = useMemo(() => {
		const value = query.trim().toLowerCase();
		const rows = projects.filter((project) => {
			const matchesQuery = !value || project.name.toLowerCase().includes(value) || project.description.toLowerCase().includes(value);
			const matchesStatus = status === "all" || project.status === status;
			return matchesQuery && matchesStatus;
		});
		return rows.sort((a, b) => {
			const direction = sort.direction === "asc" ? 1 : -1;
			if (sort.key === "name") return a.name.localeCompare(b.name, "zh-CN") * direction;
			if (sort.key === "requests") return (requestValue(a.requests) - requestValue(b.requests)) * direction;
			return (a.budget - b.budget) * direction;
		});
	}, [projects, query, status, sort]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
	const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));

	const activeCount = projects.filter((project) => project.status === "运行中").length;
	const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
	const totalRequests = projects.reduce((sum, project) => sum + requestValue(project.requests), 0);

	function toggleSort(key: SortKey) {
		setSort((current) => ({
			key,
			direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
		}));
	}

	function sortIcon(key: SortKey) {
		if (sort.key !== key) return <ArrowUpDown className="size-3 opacity-40" />;
		return sort.direction === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />;
	}

	function toggleAll(checked: boolean) {
		setSelected((current) => {
			const next = new Set(current);
			for (const row of rows) {
				if (checked) next.add(row.id);
				else next.delete(row.id);
			}
			return next;
		});
	}

	function createProject() {
		const name = draft.name.trim();
		if (!name) {
			toast.error("请输入项目名称");
			return;
		}
		const project: ReuiProject = {
			id: `prj-${Date.now()}`,
			name,
			description: draft.description.trim() || "尚未填写项目描述",
			owner: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			status: "草稿",
			providers: ["OpenAI"],
			requests: "—",
			budget: Number(draft.budget) || 2000,
			used: 0,
			due: "待定",
			members: [{ name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" }],
		};
		setProjects((current) => [project, ...current]);
		setDialogOpen(false);
		setDraft({ name: "", description: "", budget: "2000" });
		setPage(1);
		toast.success("项目已创建", { description: `${name} · 草稿状态` });
	}

	const selectedCount = selected.size;

	return (
		<>
			<RePageHeader
				eyebrow="Projects"
				title="项目"
				description={`按项目隔离模型访问、预算与成员权限。共 ${projects.length} 个项目。`}
				actions={
					<>
						<ReButton variant="outline" className="gap-1.5" onClick={() => toast.info("列显示设置：名称、状态、预算、成员、到期日")}>
							<Columns3 className="size-3.5" />
							列设置
						</ReButton>
						<ReButton className="gap-1.5" onClick={() => setDialogOpen(true)}>
							<Plus className="size-3.5" />
							新建项目
						</ReButton>
					</>
				}
			/>

			<div className="mb-4 grid gap-4 sm:grid-cols-3">
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={FolderKanban} tone="dark" />
					<div>
						<p className="text-muted-foreground text-[11px]">运行中项目</p>
						<p className="text-xl font-semibold tabular-nums">
							{activeCount}
							<span className="text-muted-foreground text-xs font-normal"> / {projects.length}</span>
						</p>
					</div>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Users} tone="blue" />
					<div>
						<p className="text-muted-foreground text-[11px]">月请求总量</p>
						<p className="text-xl font-semibold tabular-nums">{(totalRequests / 1_000_000).toFixed(2)}M</p>
					</div>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Wallet} tone="amber" />
					<div>
						<p className="text-muted-foreground text-[11px]">月度预算</p>
						<p className="text-xl font-semibold tabular-nums">${totalBudget.toLocaleString("en-US")}</p>
					</div>
				</ReCard>
			</div>

			<ReCard className="overflow-hidden">
				<div className="flex flex-wrap items-center gap-2 border-b p-3">
					<div className="relative">
						<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
						<Input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
							placeholder="搜索项目…"
							className="h-8 w-56 rounded-lg pl-8 text-xs"
						/>
					</div>
					<Select
						value={status}
						onValueChange={(value) => {
							setStatus(value);
							setPage(1);
						}}
					>
						<SelectTrigger className="h-8 w-32 rounded-lg text-xs">
							<SelectValue placeholder="状态" />
						</SelectTrigger>
						<SelectContent className="rounded-lg">
							<SelectItem value="all">全部状态</SelectItem>
							<SelectItem value="运行中">运行中</SelectItem>
							<SelectItem value="已暂停">已暂停</SelectItem>
							<SelectItem value="草稿">草稿</SelectItem>
						</SelectContent>
					</Select>
					<span className="text-muted-foreground ml-auto text-[11px]">
						{filtered.length} 个项目
					</span>
				</div>

				{selectedCount > 0 && (
					<div className="bg-secondary/60 flex items-center gap-2 border-b px-3 py-2">
						<span className="text-xs font-medium">已选择 {selectedCount} 项</span>
						<ReButton
							variant="outline"
							size="sm"
							className="ml-2 gap-1"
							onClick={() => {
								toast.success(`已暂停 ${selectedCount} 个项目`);
								setSelected(new Set());
							}}
						>
							<Pause className="size-3" />
							暂停
						</ReButton>
						<ReButton
							variant="outline"
							size="sm"
							className="text-destructive gap-1"
							onClick={() => {
								setProjects((current) => current.filter((project) => !selected.has(project.id)));
								toast.success(`已删除 ${selectedCount} 个项目`);
								setSelected(new Set());
							}}
						>
							<Trash2 className="size-3" />
							删除
						</ReButton>
						<button
							type="button"
							className="text-muted-foreground hover:text-foreground ml-auto cursor-pointer text-[11px]"
							onClick={() => setSelected(new Set())}
						>
							取消选择
						</button>
					</div>
				)}

				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="text-muted-foreground bg-secondary/40 text-left text-[11px]">
								<th className="w-10 px-3 py-2.5">
									<Checkbox checked={allSelected} onCheckedChange={(checked) => toggleAll(checked === true)} aria-label="全选" />
								</th>
								<th className="px-3 py-2.5 font-medium">
									<button type="button" className="flex cursor-pointer items-center gap-1" onClick={() => toggleSort("name")}>
										项目
										{sortIcon("name")}
									</button>
								</th>
								<th className="px-3 py-2.5 font-medium">负责人</th>
								<th className="px-3 py-2.5 font-medium">状态</th>
								<th className="px-3 py-2.5 font-medium">提供商</th>
								<th className="px-3 py-2.5 font-medium">
									<button type="button" className="flex cursor-pointer items-center gap-1" onClick={() => toggleSort("requests")}>
										请求量
										{sortIcon("requests")}
									</button>
								</th>
								<th className="min-w-36 px-3 py-2.5 font-medium">
									<button type="button" className="flex cursor-pointer items-center gap-1" onClick={() => toggleSort("budget")}>
										预算
										{sortIcon("budget")}
									</button>
								</th>
								<th className="px-3 py-2.5 font-medium">成员</th>
								<th className="w-10 px-3 py-2.5" />
							</tr>
						</thead>
						<tbody>
							{rows.map((project) => (
								<tr key={project.id} className={cn("hover:bg-secondary/40 border-t transition-colors", selected.has(project.id) && "bg-secondary/50")}>
									<td className="px-3 py-3">
										<Checkbox
											checked={selected.has(project.id)}
											onCheckedChange={(checked) =>
												setSelected((current) => {
													const next = new Set(current);
													if (checked) next.add(project.id);
													else next.delete(project.id);
													return next;
												})
											}
											aria-label={`选择 ${project.name}`}
										/>
									</td>
									<td className="px-3 py-3">
										<p className="text-xs font-medium">{project.name}</p>
										<p className="text-muted-foreground mt-0.5 line-clamp-1 text-[10px]">{project.description}</p>
									</td>
									<td className="px-3 py-3">
										<div className="flex items-center gap-1.5">
											<span className={cn("grid size-5 place-items-center rounded-full text-[8px] font-semibold", project.owner.color)}>
												{project.owner.name.slice(0, 1)}
											</span>
											<span className="text-xs">{project.owner.name}</span>
										</div>
									</td>
									<td className="px-3 py-3">
										<ReBadge dot tone={STATUS_TONE[project.status]}>
											{project.status}
										</ReBadge>
									</td>
									<td className="px-3 py-3">
										<div className="flex flex-wrap gap-1">
											{project.providers.map((provider) => (
												<span key={provider} className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 text-[9px]">
													{provider}
												</span>
											))}
										</div>
									</td>
									<td className="px-3 py-3 font-mono text-xs tabular-nums">{project.requests}</td>
									<td className="px-3 py-3">
										<div className="flex items-center gap-2">
											<ReProgress
												value={project.used}
												tone={project.used >= 90 ? "bg-destructive" : project.used >= 70 ? "bg-amber-500" : "bg-primary"}
												className="w-16"
											/>
											<span className="text-muted-foreground text-[10px] tabular-nums">{project.used}%</span>
											<span className="text-muted-foreground/70 text-[10px]">${project.budget}</span>
										</div>
									</td>
									<td className="px-3 py-3">
										<ReAvatarStack people={project.members} max={3} />
									</td>
									<td className="px-3 py-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													aria-label="项目操作"
													className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-7 cursor-pointer place-items-center rounded-md"
												>
													<Ellipsis className="size-3.5" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-44 rounded-lg">
												<DropdownMenuItem className="cursor-pointer" onClick={() => toast.info(`打开「${project.name}」详情`)}>
													查看详情
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer" onClick={() => toast.info("演示模式：配置面板不可用")}>
													项目设置
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer" onClick={() => toast.success("已复制项目 ID")}>
													复制项目 ID
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													variant="destructive"
													className="cursor-pointer"
													onClick={() => {
														setProjects((current) => current.filter((item) => item.id !== project.id));
														toast.success("项目已删除");
													}}
												>
													删除项目
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{rows.length === 0 && (
					<ReEmptyState
						icon={FolderKanban}
						title="没有匹配的项目"
						description="尝试调整搜索关键词或状态筛选。"
						action={
							<ReButton
								variant="outline"
								onClick={() => {
									setQuery("");
									setStatus("all");
								}}
							>
								清除筛选
							</ReButton>
						}
					/>
				)}

				<div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2.5">
					<p className="text-muted-foreground text-[11px]">
						显示 {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
						{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} 个项目
					</p>
					<div className="flex items-center gap-1">
						<ReButton
							variant="outline"
							size="icon"
							className="size-7"
							aria-label="上一页"
							disabled={currentPage <= 1}
							onClick={() => setPage((value) => Math.max(1, value - 1))}
						>
							<ChevronLeft className="size-3.5" />
						</ReButton>
						{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
							<button
								key={number}
								type="button"
								onClick={() => setPage(number)}
								className={cn(
									"size-7 cursor-pointer rounded-md text-[11px] tabular-nums transition-colors",
									number === currentPage ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent text-muted-foreground",
								)}
							>
								{number}
							</button>
						))}
						<ReButton
							variant="outline"
							size="icon"
							className="size-7"
							aria-label="下一页"
							disabled={currentPage >= pageCount}
							onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
						>
							<ChevronRight className="size-3.5" />
						</ReButton>
					</div>
				</div>
			</ReCard>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="rounded-xl sm:max-w-[460px]">
					<DialogHeader>
						<DialogTitle className="text-base">新建项目</DialogTitle>
						<DialogDescription className="text-xs">项目会以草稿状态创建，可稍后配置提供商与密钥。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="project-name" className="text-xs">项目名称</Label>
							<Input
								id="project-name"
								value={draft.name}
								onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
								placeholder="例如：智能客服 2.0"
								className="mt-1.5 h-10 rounded-lg"
							/>
						</div>
						<div>
							<Label htmlFor="project-description" className="text-xs">描述</Label>
							<Input
								id="project-description"
								value={draft.description}
								onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
								placeholder="一句话说明这个项目做什么"
								className="mt-1.5 h-10 rounded-lg"
							/>
						</div>
						<div>
							<Label htmlFor="project-budget" className="text-xs">月度预算（美元）</Label>
							<Input
								id="project-budget"
								type="number"
								value={draft.budget}
								onChange={(event) => setDraft((current) => ({ ...current, budget: event.target.value }))}
								className="mt-1.5 h-10 rounded-lg"
							/>
						</div>
					</div>
					<DialogFooter>
						<ReButton variant="outline" onClick={() => setDialogOpen(false)}>
							取消
						</ReButton>
						<ReButton onClick={createProject}>
							<Plus className="size-3.5" />
							创建项目
						</ReButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
