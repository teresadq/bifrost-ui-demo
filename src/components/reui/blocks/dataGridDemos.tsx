import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Columns3,
	Download,
	Ellipsis,
	Filter,
	GripVertical,
	Pencil,
	Search,
	Table2,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BlockCard, DemoHeader, DemoSurface, GalleryGrid, MiniAvatar } from "@/components/reui/gallery";
import { ReBadge, ReButton } from "@/components/reui/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type GridRow = {
	id: string;
	name: string;
	email: string;
	role: "开发者" | "管理员" | "只读";
	status: "运行中" | "已暂停" | "异常";
	amount: number;
	lastActive: string;
};

const ROWS: GridRow[] = [
	{ id: "u1", name: "陈晓", email: "chen.xiao@nova.dev", role: "管理员", status: "运行中", amount: 2840, lastActive: "刚刚" },
	{ id: "u2", name: "王一鸣", email: "wang.yiming@nova.dev", role: "开发者", status: "运行中", amount: 2210, lastActive: "2 分钟前" },
	{ id: "u3", name: "林嘉", email: "lin.jia@nova.dev", role: "开发者", status: "已暂停", amount: 1180, lastActive: "26 分钟前" },
	{ id: "u4", name: "周雨", email: "zhou.yu@nova.dev", role: "开发者", status: "运行中", amount: 960, lastActive: "5 分钟前" },
	{ id: "u5", name: "赵可", email: "zhao.ke@nova.dev", role: "只读", status: "异常", amount: 720, lastActive: "3 小时前" },
	{ id: "u6", name: "沈舟", email: "shen.zhou@nova.dev", role: "开发者", status: "运行中", amount: 640, lastActive: "11 分钟前" },
	{ id: "u7", name: "许澄", email: "xu.cheng@nova.dev", role: "只读", status: "已暂停", amount: 480, lastActive: "12 天前" },
	{ id: "u8", name: "韩川", email: "han.chuan@nova.dev", role: "管理员", status: "运行中", amount: 420, lastActive: "1 小时前" },
];

const STATUS_TONE = {
	运行中: "success",
	已暂停: "warning",
	异常: "danger",
} as const;

function Status({ value }: { value: GridRow["status"] }) {
	return <ReBadge dot tone={STATUS_TONE[value]}>{value}</ReBadge>;
}

function BaseGridDemo() {
	return (
		<DemoSurface className="p-0">
			<div className="overflow-hidden rounded-xl">
				<table className="w-full text-left">
					<thead>
						<tr className="text-muted-foreground bg-secondary/50 text-[8px]">
							<th className="px-3 py-1.5 font-medium">成员</th>
							<th className="px-3 py-1.5 font-medium">角色</th>
							<th className="px-3 py-1.5 font-medium">状态</th>
							<th className="px-3 py-1.5 text-right font-medium">成本</th>
						</tr>
					</thead>
					<tbody>
						{ROWS.slice(0, 5).map((row) => (
							<tr key={row.id} className="hover:bg-secondary/40 border-t">
								<td className="px-3 py-1.5">
									<div className="flex items-center gap-1.5">
										<MiniAvatar name={row.name} className="size-5 text-[7px]" />
										<div className="min-w-0">
											<p className="truncate text-[8px] font-medium">{row.name}</p>
											<p className="text-muted-foreground truncate text-[7px]">{row.email}</p>
										</div>
									</div>
								</td>
								<td className="text-muted-foreground px-3 py-1.5 text-[8px]">{row.role}</td>
								<td className="px-3 py-1.5"><Status value={row.status} /></td>
								<td className="px-3 py-1.5 text-right font-mono text-[8px] tabular-nums">${row.amount.toLocaleString("en-US")}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</DemoSurface>
	);
}

function AdvancedGridDemo() {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState<"asc" | "desc">("desc");
	const pageSize = 4;
	const filtered = useMemo(
		() => ROWS.filter((row) => row.name.includes(query) || row.email.includes(query)).sort((a, b) => (sort === "asc" ? a.amount - b.amount : b.amount - a.amount)),
		[query, sort],
	);
	const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
	const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
	const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));

	return (
		<DemoSurface className="p-0">
			<div className="flex items-center gap-1 border-b p-2">
				<div className="relative">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-1.5 size-2.5 -translate-y-1/2" />
					<Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="搜索…" className="h-6 w-32 rounded-md pl-6 text-[8px]" />
				</div>
				<ReButton variant="outline" size="sm" className="h-6 gap-1 px-1.5 text-[7px]"><Filter className="size-2.5" />筛选</ReButton>
				<ReButton variant="outline" size="sm" className="h-6 gap-1 px-1.5 text-[7px]"><Columns3 className="size-2.5" />列</ReButton>
				<ReButton variant="outline" size="sm" className="h-6 gap-1 px-1.5 text-[7px]" onClick={() => toast.success("已导出 CSV")}><Download className="size-2.5" />导出</ReButton>
				{selected.size > 0 && <ReBadge tone="dark" className="ml-auto h-4 text-[7px]">已选 {selected.size}</ReBadge>}
			</div>
			<table className="w-full text-left">
				<thead>
					<tr className="text-muted-foreground bg-secondary/50 text-[8px]">
						<th className="w-6 px-2 py-1.5">
							<Checkbox
								checked={allSelected}
								onCheckedChange={(checked) =>
									setSelected((current) => {
										const next = new Set(current);
										for (const row of rows) {
											if (checked) next.add(row.id);
											else next.delete(row.id);
										}
										return next;
									})
								}
								aria-label="全选"
							/>
						</th>
						<th className="px-2 py-1.5 font-medium">成员</th>
						<th className="px-2 py-1.5 font-medium">状态</th>
						<th className="px-2 py-1.5 text-right font-medium">
							<button type="button" className="ml-auto flex cursor-pointer items-center gap-0.5" onClick={() => setSort((value) => (value === "asc" ? "desc" : "asc"))}>
								成本 {sort === "asc" ? <ArrowUp className="size-2" /> : <ArrowDown className="size-2" />}
							</button>
						</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.id} className={cn("hover:bg-secondary/40 border-t", selected.has(row.id) && "bg-secondary/50")}>
							<td className="px-2 py-1.5">
								<Checkbox
									checked={selected.has(row.id)}
									onCheckedChange={(checked) =>
										setSelected((current) => {
											const next = new Set(current);
											if (checked) next.add(row.id);
											else next.delete(row.id);
											return next;
										})
									}
									aria-label={`选择 ${row.name}`}
								/>
							</td>
							<td className="px-2 py-1.5">
								<div className="flex items-center gap-1.5">
									<MiniAvatar name={row.name} className="size-4 text-[6px]" />
									<span className="text-[8px]">{row.name}</span>
								</div>
							</td>
							<td className="px-2 py-1.5"><Status value={row.status} /></td>
							<td className="px-2 py-1.5 text-right font-mono text-[8px] tabular-nums">${row.amount.toLocaleString("en-US")}</td>
						</tr>
					))}
					{rows.length === 0 && <tr><td colSpan={4} className="text-muted-foreground py-6 text-center text-[8px]">没有匹配结果</td></tr>}
				</tbody>
			</table>
			<div className="flex items-center justify-between border-t px-2 py-1.5">
				<span className="text-muted-foreground text-[7px]">{(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} / {filtered.length}</span>
				<div className="flex items-center gap-0.5">
					<ReButton variant="outline" size="icon" className="size-4" aria-label="上一页" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="size-2" /></ReButton>
					<ReButton variant="outline" size="icon" className="size-4" aria-label="下一页" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight className="size-2" /></ReButton>
				</div>
			</div>
		</DemoSurface>
	);
}

const COLUMN_OPTIONS = [
	{ key: "email", label: "邮箱" },
	{ key: "role", label: "角色" },
	{ key: "status", label: "状态" },
	{ key: "amount", label: "成本" },
] as const;

function ColumnsGridDemo() {
	const [visible, setVisible] = useState<Record<string, boolean>>({ email: true, role: false, status: true, amount: true });
	return (
		<DemoSurface className="p-0">
			<div className="flex flex-wrap items-center gap-1 border-b p-2">
				<span className="text-muted-foreground flex items-center gap-1 text-[7px]"><Columns3 className="size-2.5" />列显示</span>
				{COLUMN_OPTIONS.map((column) => (
					<button
						key={column.key}
						type="button"
						onClick={() => setVisible((current) => ({ ...current, [column.key]: !current[column.key] }))}
						className={cn(
							"flex cursor-pointer items-center gap-1 rounded-md border px-1.5 py-0.5 text-[7px] transition-colors",
							visible[column.key] ? "border-primary/40 bg-secondary text-foreground" : "text-muted-foreground",
						)}
					>
						{visible[column.key] && <Check className="size-2" />}
						{column.label}
					</button>
				))}
			</div>
			<table className="w-full text-left">
				<thead>
					<tr className="text-muted-foreground bg-secondary/50 text-[8px]">
						<th className="px-2 py-1.5 font-medium">成员</th>
						{visible.email && <th className="px-2 py-1.5 font-medium">邮箱</th>}
						{visible.role && <th className="px-2 py-1.5 font-medium">角色</th>}
						{visible.status && <th className="px-2 py-1.5 font-medium">状态</th>}
						{visible.amount && <th className="px-2 py-1.5 text-right font-medium">成本</th>}
					</tr>
				</thead>
				<tbody>
					{ROWS.slice(0, 6).map((row) => (
						<tr key={row.id} className="hover:bg-secondary/40 border-t">
							<td className="px-2 py-1.5 text-[8px] font-medium">{row.name}</td>
							{visible.email && <td className="text-muted-foreground px-2 py-1.5 text-[7px]">{row.email}</td>}
							{visible.role && <td className="text-muted-foreground px-2 py-1.5 text-[8px]">{row.role}</td>}
							{visible.status && <td className="px-2 py-1.5"><Status value={row.status} /></td>}
							{visible.amount && <td className="px-2 py-1.5 text-right font-mono text-[8px] tabular-nums">${row.amount}</td>}
						</tr>
					))}
				</tbody>
			</table>
		</DemoSurface>
	);
}

function SortableRow({ row }: { row: GridRow }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id });
	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn("bg-card flex items-center gap-1.5 border-b px-2 py-1.5 last:border-b-0", isDragging && "relative z-10 shadow-lg")}
		>
			<button type="button" {...attributes} {...listeners} aria-label={`拖动 ${row.name}`} className="text-muted-foreground cursor-grab active:cursor-grabbing">
				<GripVertical className="size-3" />
			</button>
			<MiniAvatar name={row.name} className="size-4 text-[6px]" />
			<span className="text-[8px]">{row.name}</span>
			<span className="text-muted-foreground ml-auto text-[7px]">{row.role}</span>
			<Status value={row.status} />
		</div>
	);
}

function DragGridDemo() {
	const [rows, setRows] = useState(ROWS.slice(0, 5));
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);
	function onDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			const oldIndex = rows.findIndex((row) => row.id === active.id);
			const newIndex = rows.findIndex((row) => row.id === over.id);
			setRows((current) => arrayMove(current, oldIndex, newIndex));
		}
	}
	return (
		<DemoSurface className="p-0">
			<div className="text-muted-foreground flex items-center gap-1 border-b px-2 py-1.5 text-[7px]"><GripVertical className="size-2.5" />拖拽行手柄可重排</div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
				<SortableContext items={rows.map((row) => row.id)} strategy={verticalListSortingStrategy}>
					<div className="overflow-hidden rounded-b-xl">
						{rows.map((row) => <SortableRow key={row.id} row={row} />)}
					</div>
				</SortableContext>
			</DndContext>
		</DemoSurface>
	);
}

function EditingGridDemo() {
	const [rows, setRows] = useState(ROWS.slice(0, 5));
	const [editing, setEditing] = useState<string | null>(null);
	const [draft, setDraft] = useState("");
	return (
		<DemoSurface className="p-0">
			<div className="text-muted-foreground border-b px-2 py-1.5 text-[7px]">双击铅笔图标编辑名称，Enter 保存</div>
			<table className="w-full text-left">
				<thead>
					<tr className="text-muted-foreground bg-secondary/50 text-[8px]">
						<th className="px-2 py-1.5 font-medium">成员</th>
						<th className="px-2 py-1.5 font-medium">角色</th>
						<th className="w-14 px-2 py-1.5 font-medium">操作</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.id} className="hover:bg-secondary/40 border-t">
							<td className="px-2 py-1.5">
								{editing === row.id ? (
									<Input
										autoFocus
										value={draft}
										onChange={(event) => setDraft(event.target.value)}
										onKeyDown={(event) => {
											if (event.key === "Enter") {
												setRows((current) => current.map((item) => (item.id === row.id ? { ...item, name: draft || item.name } : item)));
												setEditing(null);
												toast.success("已保存");
											}
											if (event.key === "Escape") setEditing(null);
										}}
										onBlur={() => setEditing(null)}
										className="h-6 rounded-md text-[8px]"
									/>
								) : (
									<span className="text-[8px] font-medium">{row.name}</span>
								)}
							</td>
							<td className="text-muted-foreground px-2 py-1.5 text-[8px]">{row.role}</td>
							<td className="px-2 py-1.5">
								<button
									type="button"
									aria-label={`编辑 ${row.name}`}
									onClick={() => { setEditing(row.id); setDraft(row.name); }}
									className="text-muted-foreground hover:text-foreground grid size-5 cursor-pointer place-items-center rounded"
								>
									<Pencil className="size-2.5" />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</DemoSurface>
	);
}

function ExpansionGridDemo() {
	const [expanded, setExpanded] = useState<Set<string>>(new Set());
	return (
		<DemoSurface className="p-0">
			<table className="w-full text-left">
				<thead>
					<tr className="text-muted-foreground bg-secondary/50 text-[8px]">
						<th className="w-6 px-2 py-1.5" />
						<th className="px-2 py-1.5 font-medium">成员</th>
						<th className="px-2 py-1.5 font-medium">状态</th>
						<th className="px-2 py-1.5 text-right font-medium">成本</th>
					</tr>
				</thead>
				<tbody>
					{ROWS.slice(0, 4).map((row) => (
						<Fragment key={row.id}>
							<tr className="hover:bg-secondary/40 border-t">
								<td className="px-2 py-1.5">
									<button
										type="button"
										aria-label="展开行"
										onClick={() =>
											setExpanded((current) => {
												const next = new Set(current);
												if (next.has(row.id)) next.delete(row.id);
												else next.add(row.id);
												return next;
											})
										}
										className="text-muted-foreground cursor-pointer"
									>
										<ChevronRight className={cn("size-2.5 transition-transform", expanded.has(row.id) && "rotate-90")} />
									</button>
								</td>
								<td className="px-2 py-1.5 text-[8px] font-medium">{row.name}</td>
								<td className="px-2 py-1.5"><Status value={row.status} /></td>
								<td className="px-2 py-1.5 text-right font-mono text-[8px] tabular-nums">${row.amount}</td>
							</tr>
							{expanded.has(row.id) && (
								<tr className="bg-secondary/30 border-t">
									<td colSpan={4} className="px-4 py-2">
										<div className="grid grid-cols-3 gap-2 text-[7px]">
											<div><p className="text-muted-foreground">邮箱</p><p className="mt-0.5 font-mono">{row.email}</p></div>
											<div><p className="text-muted-foreground">最近活跃</p><p className="mt-0.5">{row.lastActive}</p></div>
											<div><p className="text-muted-foreground">角色</p><p className="mt-0.5">{row.role}</p></div>
										</div>
									</td>
								</tr>
							)}
						</Fragment>
					))}
				</tbody>
			</table>
		</DemoSurface>
	);
}

function FilteringGridDemo() {
	const [status, setStatus] = useState<"全部" | GridRow["status"]>("全部");
	const [query, setQuery] = useState("");
	const rows = ROWS.filter((row) => (status === "全部" || row.status === status) && (row.name.includes(query) || row.email.includes(query)));
	const filters: ("全部" | GridRow["status"])[] = ["全部", "运行中", "已暂停", "异常"];
	return (
		<DemoSurface className="p-0">
			<div className="flex flex-wrap items-center gap-1 border-b p-2">
				<div className="relative">
					<Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-1.5 size-2.5 -translate-y-1/2" />
					<Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="过滤…" className="h-6 w-24 rounded-md pl-6 text-[8px]" />
				</div>
				{filters.map((filter) => (
					<button
						key={filter}
						type="button"
						onClick={() => setStatus(filter)}
						className={cn("cursor-pointer rounded-md border px-1.5 py-0.5 text-[7px]", status === filter ? "border-primary/40 bg-secondary font-medium" : "text-muted-foreground")}
					>
						{filter}
					</button>
				))}
				<span className="text-muted-foreground ml-auto text-[7px]">{rows.length} 条</span>
			</div>
			<table className="w-full text-left">
				<thead>
					<tr className="text-muted-foreground bg-secondary/50 text-[8px]">
						<th className="px-2 py-1.5 font-medium">成员</th>
						<th className="px-2 py-1.5 font-medium">角色</th>
						<th className="px-2 py-1.5 font-medium">状态</th>
					</tr>
				</thead>
				<tbody>
					{rows.slice(0, 6).map((row) => (
						<tr key={row.id} className="hover:bg-secondary/40 border-t">
							<td className="px-2 py-1.5 text-[8px]">{row.name}</td>
							<td className="text-muted-foreground px-2 py-1.5 text-[8px]">{row.role}</td>
							<td className="px-2 py-1.5"><Status value={row.status} /></td>
						</tr>
					))}
					{rows.length === 0 && <tr><td colSpan={3} className="text-muted-foreground py-5 text-center text-[8px]">没有匹配结果</td></tr>}
				</tbody>
			</table>
		</DemoSurface>
	);
}

function GroupingGridDemo() {
	const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
	const groups = ["管理员", "开发者", "只读"] as const;
	return (
		<DemoSurface className="p-0">
			<table className="w-full text-left">
				<tbody>
					{groups.map((group) => {
						const rows = ROWS.filter((row) => row.role === group);
						const isCollapsed = collapsed.has(group);
						return (
							<Fragment key={group}>
								<tr className="bg-secondary/50 border-t first:border-t-0">
									<td colSpan={4} className="px-2 py-1.5">
										<button
											type="button"
											onClick={() =>
												setCollapsed((current) => {
													const next = new Set(current);
													if (next.has(group)) next.delete(group);
													else next.add(group);
													return next;
												})
											}
											className="flex cursor-pointer items-center gap-1 text-[8px] font-medium"
										>
											<ChevronRight className={cn("size-2.5 transition-transform", !isCollapsed && "rotate-90")} />
											{group}
											<span className="text-muted-foreground font-normal">({rows.length})</span>
										</button>
									</td>
								</tr>
								{!isCollapsed && rows.map((row) => (
									<tr key={row.id} className="hover:bg-secondary/40 border-t">
										<td className="px-4 py-1.5 text-[8px]">{row.name}</td>
										<td className="text-muted-foreground px-2 py-1.5 text-[7px]">{row.email}</td>
										<td className="px-2 py-1.5"><Status value={row.status} /></td>
										<td className="px-2 py-1.5 text-right font-mono text-[8px]">${row.amount}</td>
									</tr>
								))}
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</DemoSurface>
	);
}

const VIRTUAL_SIZE = 10_000;
const ROW_HEIGHT = 26;

function VirtualGridDemo() {
	const [scrollTop, setScrollTop] = useState(0);
	const start = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - 2);
	const visibleCount = 11;
	const rows = Array.from({ length: visibleCount }, (_, index) => {
		const rowIndex = start + index;
		if (rowIndex >= VIRTUAL_SIZE) return null;
		return {
			id: rowIndex,
			name: `成员 ${String(rowIndex + 1).padStart(5, "0")}`,
			status: rowIndex % 7 === 0 ? "已暂停" : rowIndex % 11 === 0 ? "异常" : "运行中",
		};
	}).filter(Boolean) as { id: number; name: string; status: GridRow["status"] }[];
	return (
		<DemoSurface className="p-0">
			<div className="text-muted-foreground flex items-center justify-between border-b px-2 py-1.5 text-[7px]">
				<span>虚拟滚动</span>
				<span className="font-mono">{VIRTUAL_SIZE.toLocaleString("en-US")} 行 · 渲染 {rows.length} 行</span>
			</div>
			<div className="h-[200px] overflow-auto" onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}>
				<div style={{ height: VIRTUAL_SIZE * ROW_HEIGHT, position: "relative" }} className="w-full">
					<div style={{ transform: `translateY(${start * ROW_HEIGHT}px)` }}>
						{rows.map((row) => (
							<div key={row.id} className="flex h-[26px] items-center gap-2 border-b px-2 text-[8px]">
								<span className="text-muted-foreground w-8 font-mono text-[7px]">{row.id + 1}</span>
								<span className="flex-1">{row.name}</span>
								<Status value={row.status} />
							</div>
						))}
					</div>
				</div>
			</div>
		</DemoSurface>
	);
}

export function DataGridBlocks() {
	return (
		<GalleryGrid>
			<BlockCard title="Base" category="data-grid" description="最基础的表格：表头、行悬停与状态标记。" badge="base">
				<BaseGridDemo />
			</BlockCard>
			<BlockCard title="Advanced" category="data-grid" description="搜索、筛选、列设置、排序、选择与分页工具栏。" badge="advanced" className="xl:col-span-2">
				<AdvancedGridDemo />
			</BlockCard>
			<BlockCard title="Columns" category="data-grid" description="按需显示 / 隐藏列，联动表头与单元格。" badge="columns">
				<ColumnsGridDemo />
			</BlockCard>
			<BlockCard title="Drag & Drop" category="data-grid" description="基于 dnd-kit 的行拖拽排序。" badge="drag-drop">
				<DragGridDemo />
			</BlockCard>
			<BlockCard title="Editing" category="data-grid" description="行内编辑、Enter 保存与 Escape 取消。" badge="editing">
				<EditingGridDemo />
			</BlockCard>
			<BlockCard title="Expansion" category="data-grid" description="展开行展示详情字段与元数据。" badge="expansion">
				<ExpansionGridDemo />
			</BlockCard>
			<BlockCard title="Filtering" category="data-grid" description="状态过滤芯片与关键词搜索组合。" badge="filtering">
				<FilteringGridDemo />
			</BlockCard>
			<BlockCard title="Grouping" category="data-grid" description="按角色分组、组计数与折叠。" badge="grouping">
				<GroupingGridDemo />
			</BlockCard>
			<BlockCard title="Virtualization" category="data-grid" description="一万行数据只渲染可视窗口。" badge="virtualization" className="xl:col-span-2">
				<VirtualGridDemo />
			</BlockCard>
		</GalleryGrid>
	);
}
