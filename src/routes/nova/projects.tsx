import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Columns3,
	Ellipsis,
	Plus,
	Search,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nova/projects")({
	component: ProjectsPage,
});

type Provider = "OA" | "AN" | "GO" | "DS";

type Project = {
	id: string;
	name: string;
	description: string;
	providers: Provider[];
	budget: number;
	cycle: "每月" | "每周" | "每小时";
	access: "限制" | "继承";
	members: number;
	expires: string;
	active: boolean;
};

const PROVIDER_STYLE: Record<Provider, string> = {
	OA: "bg-foreground text-background",
	AN: "bg-chart-cat-2/15 text-chart-cat-2 border-chart-cat-2/30",
	GO: "bg-chart-cat-1/15 text-chart-cat-1 border-chart-cat-1/30",
	DS: "bg-chart-cat-5/15 text-chart-cat-5 border-chart-cat-5/30",
};

const INITIAL_PROJECTS: Project[] = [
	{
		id: "prj_01",
		name: "new-research",
		description: "新模型的可行性验证与评测",
		providers: ["OA", "AN"],
		budget: 1000,
		cycle: "每月",
		access: "限制",
		members: 2,
		expires: "2026-09-16",
		active: true,
	},
	{
		id: "prj_02",
		name: "claude-code",
		description: "面向全公司的 Claude 编程助手",
		providers: ["AN"],
		budget: 5000,
		cycle: "每小时",
		access: "继承",
		members: 0,
		expires: "2026-11-02",
		active: true,
	},
	{
		id: "prj_03",
		name: "test-project",
		description: "用于接入测试的示例项目",
		providers: ["OA", "AN", "GO", "DS"],
		budget: 10,
		cycle: "每小时",
		access: "继承",
		members: 3,
		expires: "2026-10-10",
		active: true,
	},
	{
		id: "prj_04",
		name: "customer-support",
		description: "客服知识库与工单摘要",
		providers: ["DS", "GO"],
		budget: 2400,
		cycle: "每月",
		access: "限制",
		members: 12,
		expires: "2027-01-31",
		active: true,
	},
	{
		id: "prj_05",
		name: "content-studio",
		description: "营销内容生成与多语言润色",
		providers: ["AN", "GO"],
		budget: 800,
		cycle: "每周",
		access: "继承",
		members: 6,
		expires: "2026-12-15",
		active: false,
	},
	{
		id: "prj_06",
		name: "data-pipeline",
		description: "离线批处理与结构化抽取",
		providers: ["OA", "DS"],
		budget: 12000,
		cycle: "每月",
		access: "限制",
		members: 4,
		expires: "2027-03-01",
		active: true,
	},
	{
		id: "prj_07",
		name: "internal-copilot",
		description: "内部知识问答与代码补全",
		providers: ["OA", "AN", "GO"],
		budget: 3600,
		cycle: "每月",
		access: "继承",
		members: 28,
		expires: "2027-06-30",
		active: true,
	},
	{
		id: "prj_08",
		name: "legacy-archive",
		description: "历史项目归档，仅保留只读访问",
		providers: ["OA"],
		budget: 0,
		cycle: "每月",
		access: "限制",
		members: 1,
		expires: "2026-08-01",
		active: false,
	},
];

type ColumnKey = "providers" | "budget" | "cycle" | "access" | "members" | "expires" | "active";

const COLUMNS: { key: ColumnKey; label: string }[] = [
	{ key: "providers", label: "提供商" },
	{ key: "budget", label: "预算" },
	{ key: "cycle", label: "计费周期" },
	{ key: "access", label: "访问规则" },
	{ key: "members", label: "成员" },
	{ key: "expires", label: "到期时间" },
	{ key: "active", label: "启用" },
];

type SortKey = "name" | "budget" | "members" | "expires";

const PAGE_SIZE = 5;

function ProjectsPage() {
	const [projects, setProjects] = useState(INITIAL_PROJECTS);
	const [query, setQuery] = useState("");
	const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
	const [visible, setVisible] = useState<Record<ColumnKey, boolean>>({
		providers: true,
		budget: true,
		cycle: true,
		access: true,
		members: true,
		expires: true,
		active: true,
	});
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "name", dir: "asc" });
	const [page, setPage] = useState(1);

	const filtered = useMemo(() => {
		const rows = projects.filter((project) => {
			const matchesQuery =
				!query ||
				project.name.toLowerCase().includes(query.toLowerCase()) ||
				project.description.toLowerCase().includes(query.toLowerCase());
			const matchesStatus =
				status === "all" || (status === "active" ? project.active : !project.active);
			return matchesQuery && matchesStatus;
		});

		return [...rows].sort((a, b) => {
			let result = 0;
			if (sort.key === "name") result = a.name.localeCompare(b.name);
			if (sort.key === "budget") result = a.budget - b.budget;
			if (sort.key === "members") result = a.members - b.members;
			if (sort.key === "expires") result = a.expires.localeCompare(b.expires);
			return sort.dir === "asc" ? result : -result;
		});
	}, [projects, query, status, sort]);

	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPage = Math.min(page, pageCount);
	const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	const allSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.id));
	const someSelected = pageRows.some((row) => selected.has(row.id));

	function toggleAll(checked: boolean) {
		const next = new Set(selected);
		for (const row of pageRows) {
			if (checked) next.add(row.id);
			else next.delete(row.id);
		}
		setSelected(next);
	}

	function toggleOne(id: string, checked: boolean) {
		const next = new Set(selected);
		if (checked) next.add(id);
		else next.delete(id);
		setSelected(next);
	}

	function toggleSort(key: SortKey) {
		setSort((current) =>
			current.key === key ? { key, dir: current.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
		);
	}

	function updateProject(id: string, patch: Partial<Project>) {
		setProjects((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
	}

	function removeProjects(ids: string[]) {
		setProjects((rows) => rows.filter((row) => !ids.includes(row.id)));
		setSelected(new Set());
		toast.success(`已删除 ${ids.length} 个项目`);
	}

	const sortIcon = (key: SortKey) => (
		<ArrowUpDown className={cn("size-3", sort.key === key ? "text-foreground" : "text-muted-foreground/50")} />
	);

	return (
		<AppShell>
			<PageHeader
				title="项目列表"
				description="按项目分配预算、访问规则和成员。支持筛选、排序、批量操作与列自定义。"
				actions={
					<Button asChild>
						<Link to="/nova/wizard">
							<Plus className="size-4" />
							新建项目
						</Link>
					</Button>
				}
			/>

			<div className="rounded-lg border">
				{/* 工具栏 */}
				<div className="flex flex-wrap items-center gap-2 border-b p-3">
					<div className="text-muted-foreground focus-within:border-ring/60 flex h-8 w-full items-center gap-2 rounded-md border px-2.5 transition-colors sm:w-72">
						<Search className="size-3.5 shrink-0" />
						<input
							value={query}
							onChange={(event) => {
								setQuery(event.target.value);
								setPage(1);
							}}
							placeholder="搜索项目…"
							className="placeholder:text-muted-foreground/70 min-w-0 flex-1 bg-transparent text-[13px] outline-none"
						/>
					</div>

					<Select
						value={status}
						onValueChange={(value) => {
							setStatus(value as typeof status);
							setPage(1);
						}}
					>
						<SelectTrigger size="sm" className="w-32 text-[13px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">全部状态</SelectItem>
							<SelectItem value="active">已启用</SelectItem>
							<SelectItem value="inactive">已停用</SelectItem>
						</SelectContent>
					</Select>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8">
								<Columns3 className="size-3.5" />
								显示列
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40">
							<DropdownMenuLabel className="text-xs">自定义列</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{COLUMNS.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.key}
									checked={visible[column.key]}
									onCheckedChange={(checked) =>
										setVisible((current) => ({ ...current, [column.key]: checked === true }))
									}
								>
									{column.label}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					<span className="text-muted-foreground ml-auto text-xs">
						共 {filtered.length} 个项目
					</span>
				</div>

				{/* 批量操作条 */}
				{selected.size > 0 && (
					<div className="bg-secondary/60 flex flex-wrap items-center gap-2 border-b px-3 py-2">
						<span className="text-xs font-medium">已选择 {selected.size} 项</span>
						<div className="ml-auto flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-xs"
								onClick={() => {
									selected.forEach((id) => updateProject(id, { active: true }));
									toast.success("已批量启用");
									setSelected(new Set());
								}}
							>
								批量启用
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-7 text-xs"
								onClick={() => {
									selected.forEach((id) => updateProject(id, { active: false }));
									toast.success("已批量停用");
									setSelected(new Set());
								}}
							>
								批量停用
							</Button>
							<Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => removeProjects([...selected])}>
								<Trash2 className="size-3" />
								删除
							</Button>
						</div>
					</div>
				)}

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="w-10 pl-3">
								<Checkbox
									aria-label="全选当前页"
									checked={allSelected ? true : someSelected ? "indeterminate" : false}
									onCheckedChange={(checked) => toggleAll(checked === true)}
								/>
							</TableHead>
							<TableHead>
								<button type="button" className="flex cursor-pointer items-center gap-1.5" onClick={() => toggleSort("name")}>
									名称
									{sortIcon("name")}
								</button>
							</TableHead>
							{visible.providers && <TableHead>提供商</TableHead>}
							{visible.budget && (
								<TableHead>
									<button type="button" className="flex cursor-pointer items-center gap-1.5" onClick={() => toggleSort("budget")}>
										预算
										{sortIcon("budget")}
									</button>
								</TableHead>
							)}
							{visible.cycle && <TableHead>计费周期</TableHead>}
							{visible.access && <TableHead>访问规则</TableHead>}
							{visible.members && (
								<TableHead>
									<button type="button" className="flex cursor-pointer items-center gap-1.5" onClick={() => toggleSort("members")}>
										成员
										{sortIcon("members")}
									</button>
								</TableHead>
							)}
							{visible.expires && (
								<TableHead>
									<button type="button" className="flex cursor-pointer items-center gap-1.5" onClick={() => toggleSort("expires")}>
										到期时间
										{sortIcon("expires")}
									</button>
								</TableHead>
							)}
							{visible.active && <TableHead>启用</TableHead>}
							<TableHead className="w-12 pr-3" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{pageRows.map((project) => (
							<TableRow key={project.id} data-state={selected.has(project.id) ? "selected" : undefined}>
								<TableCell className="pl-3">
									<Checkbox
										aria-label={`选择 ${project.name}`}
										checked={selected.has(project.id)}
										onCheckedChange={(checked) => toggleOne(project.id, checked === true)}
									/>
								</TableCell>
								<TableCell>
									<div className="min-w-[180px]">
										<p className="text-[13px] font-medium">{project.name}</p>
										<p className="text-muted-foreground mt-0.5 max-w-[240px] truncate text-xs">{project.description}</p>
									</div>
								</TableCell>
								{visible.providers && (
									<TableCell>
										<div className="flex -space-x-1">
											{project.providers.map((provider) => (
												<span
													key={provider}
													className={cn(
														"flex size-5 items-center justify-center rounded border font-mono text-[9px] font-medium ring-2 ring-card",
														PROVIDER_STYLE[provider],
													)}
													title={provider}
												>
													{provider}
												</span>
											))}
										</div>
									</TableCell>
								)}
								{visible.budget && (
									<TableCell className="font-mono text-[13px] tabular-nums">
										${project.budget.toLocaleString("en-US")}
									</TableCell>
								)}
								{visible.cycle && (
									<TableCell>
										<span className="bg-secondary text-secondary-foreground rounded px-1.5 py-0.5 text-[11px]">
											{project.cycle}
										</span>
									</TableCell>
								)}
								{visible.access && <TableCell className="text-[13px]">{project.access}</TableCell>}
								{visible.members && (
									<TableCell className="font-mono text-[13px] tabular-nums">
										{project.members === 0 ? "开放" : project.members}
									</TableCell>
								)}
								{visible.expires && (
									<TableCell className="text-muted-foreground font-mono text-xs">{project.expires}</TableCell>
								)}
								{visible.active && (
									<TableCell>
										<Switch
											checked={project.active}
											aria-label={`${project.name} 启用状态`}
											onCheckedChange={(checked) => {
												updateProject(project.id, { active: checked });
												toast.success(checked ? "项目已启用" : "项目已停用");
											}}
										/>
									</TableCell>
								)}
								<TableCell className="pr-3">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="size-7" aria-label="行操作">
												<Ellipsis className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-36">
											<DropdownMenuItem onClick={() => toast.info(`编辑 ${project.name}`)}>编辑</DropdownMenuItem>
											<DropdownMenuItem onClick={() => toast.success("已复制项目")}>复制</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem variant="destructive" onClick={() => removeProjects([project.id])}>
												<Trash2 className="size-4" />
												删除
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
						{pageRows.length === 0 && (
							<TableRow>
								<TableCell colSpan={9} className="text-muted-foreground h-32 text-center text-sm">
									没有匹配的项目，试试调整筛选条件
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* 分页 */}
				<div className="flex flex-wrap items-center justify-between gap-3 border-t px-3 py-2.5">
					<p className="text-muted-foreground text-xs">
						{filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
						{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} 条
					</p>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
							aria-label="上一页"
							disabled={currentPage <= 1}
							onClick={() => setPage(currentPage - 1)}
						>
							<ChevronLeft className="size-4" />
						</Button>
						<span className="text-muted-foreground px-2 text-xs">
							第 {currentPage} / {pageCount} 页
						</span>
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
							aria-label="下一页"
							disabled={currentPage >= pageCount}
							onClick={() => setPage(currentPage + 1)}
						>
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			</div>
		</AppShell>
	);
}
