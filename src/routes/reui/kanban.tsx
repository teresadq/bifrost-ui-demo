import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarDays,
	CheckCircle2,
	Filter,
	GripVertical,
	MessageSquare,
	Plus,
	Share2,
	Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
	Kanban,
	KanbanBoard,
	KanbanColumn,
	KanbanColumnContent,
	KanbanColumnHandle,
	KanbanItem,
	KanbanItemHandle,
	KanbanOverlay,
} from "@/components/reui/kanban";
import { INITIAL_BOARD, KANBAN_COLUMNS, type KanbanTask } from "@/components/reui/data";
import {
	ReAvatarStack,
	ReBadge,
	ReButton,
	ReCard,
	ReCardContent,
	ReCardHeader,
	ReCardTitle,
	ReIconTile,
	RePageHeader,
	ReProgress,
} from "@/components/reui/ui";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reui/kanban")({
	component: KanbanPage,
});

const PRIORITY_META = {
	urgent: { label: "紧急", tone: "danger" as const, bar: "bg-destructive" },
	high: { label: "高", tone: "warning" as const, bar: "bg-amber-500" },
	medium: { label: "中", tone: "blue" as const, bar: "bg-blue-500" },
	low: { label: "低", tone: "neutral" as const, bar: "bg-zinc-400" },
};

const COLUMN_META: Record<string, { accent: string; tone: "neutral" | "blue" | "info" | "success" }> = {
	planning: { accent: "bg-zinc-400", tone: "neutral" },
	progress: { accent: "bg-blue-500", tone: "blue" },
	review: { accent: "bg-violet-500", tone: "info" },
	done: { accent: "bg-emerald-500", tone: "success" },
};

function TaskCard({ task, overlay = false }: { task: KanbanTask; overlay?: boolean }) {
	const priority = PRIORITY_META[task.priority];

	return (
		<div
			className={cn(
				"bg-card group rounded-xl border p-3.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition-all",
				!overlay && "hover:border-ring/60 hover:shadow-md",
				overlay && "rotate-2 border-ring shadow-xl",
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<ReBadge tone={priority.tone}>
					<span className={cn("size-1.5 rounded-full", priority.bar)} />
					{priority.label}
				</ReBadge>
				{overlay ? (
					<GripVertical className="text-muted-foreground size-3.5" />
				) : (
					<KanbanItemHandle>
						<button
							type="button"
							aria-label={`拖动任务「${task.title}」`}
							className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-6 cursor-grab place-items-center rounded-md opacity-0 transition-all group-hover:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
						>
							<GripVertical className="size-3.5" />
						</button>
					</KanbanItemHandle>
				)}
			</div>

			<p className="mt-2 text-[13px] leading-5 font-medium">{task.title}</p>
			{task.description && (
				<p className="text-muted-foreground mt-1 line-clamp-2 text-[11px] leading-5">{task.description}</p>
			)}

			{task.tags.length > 0 && (
				<div className="mt-2.5 flex flex-wrap gap-1">
					{task.tags.map((tag) => (
						<span key={tag} className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[9px]">
							#{tag}
						</span>
					))}
				</div>
			)}

			{task.subtasks && task.subtasks.total > 0 && (
				<div className="mt-3">
					<div className="text-muted-foreground mb-1 flex items-center justify-between text-[10px]">
						<span>子任务</span>
						<span className="tabular-nums">
							{task.subtasks.done}/{task.subtasks.total}
						</span>
					</div>
					<ReProgress value={(task.subtasks.done / task.subtasks.total) * 100} className="h-1" />
				</div>
			)}

			<div className="text-muted-foreground mt-3 flex items-center justify-between gap-2 border-t pt-2.5 text-[10px]">
				<div className="flex min-w-0 items-center gap-1.5">
					<span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-[8px] font-semibold", task.assignee.color)}>
						{task.assignee.name.slice(0, 1)}
					</span>
					<span className="truncate">{task.assignee.name}</span>
				</div>
				<div className="flex shrink-0 items-center gap-2.5">
					{task.due && (
						<span className={cn("flex items-center gap-1", task.due === "今天" && "text-destructive font-medium")}>
							<CalendarDays className="size-3" />
							{task.due}
						</span>
					)}
					{task.comments > 0 && (
						<span className="flex items-center gap-1 tabular-nums">
							<MessageSquare className="size-3" />
							{task.comments}
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

function KanbanPage() {
	const [board, setBoard] = useState<Record<string, KanbanTask[]>>(() => structuredClone(INITIAL_BOARD));
	const [dialogOpen, setDialogOpen] = useState(false);
	const [newTitle, setNewTitle] = useState("");
	const [newPriority, setNewPriority] = useState<KanbanTask["priority"]>("medium");
	const [newColumn, setNewColumn] = useState("planning");

	const allTasks = useMemo(() => Object.values(board).flat(), [board]);
	const total = allTasks.length;
	const done = board.done?.length ?? 0;
	const progressCount = board.progress?.length ?? 0;
	const reviewCount = board.review?.length ?? 0;
	const urgent = allTasks.filter((task) => task.priority === "urgent").length;
	const completion = total === 0 ? 0 : Math.round((done / total) * 100);

	function addTask() {
		const title = newTitle.trim();
		if (!title) {
			toast.error("请输入任务标题");
			return;
		}
		const task: KanbanTask = {
			id: `task-${Date.now()}`,
			title,
			priority: newPriority,
			assignee: { name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
			tags: ["new"],
			comments: 0,
		};
		setBoard((current) => ({ ...current, [newColumn]: [...(current[newColumn] ?? []), task] }));
		setNewTitle("");
		setDialogOpen(false);
		toast.success("任务已创建", { description: `已添加到「${KANBAN_COLUMNS.find((column) => column.id === newColumn)?.label}」` });
	}

	return (
		<>
			<RePageHeader
				eyebrow="Board"
				title="模型接入看板"
				description="Sprint 42 · 10 月 14 日至 10 月 27 日。拖拽卡片可跨列移动，拖拽列头可调整顺序。"
				actions={
					<>
						<ReButton variant="outline" className="gap-1.5" onClick={() => toast.info("筛选器：可按负责人、优先级和标签过滤")}>
							<Filter className="size-3.5" />
							筛选
						</ReButton>
						<ReButton variant="outline" className="gap-1.5" onClick={() => toast.success("看板链接已复制")}>
							<Share2 className="size-3.5" />
							分享
						</ReButton>
						<ReButton className="gap-1.5" onClick={() => setDialogOpen(true)}>
							<Plus className="size-3.5" />
							新建任务
						</ReButton>
					</>
				}
			/>

			<div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Sparkles} tone="dark" />
					<div>
						<p className="text-muted-foreground text-[11px]">全部任务</p>
						<p className="text-xl font-semibold tabular-nums">{total}</p>
					</div>
					<ReBadge tone="outline" className="ml-auto">+3 本周</ReBadge>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={Filter} tone="blue" />
					<div>
						<p className="text-muted-foreground text-[11px]">进行中</p>
						<p className="text-xl font-semibold tabular-nums">{progressCount}</p>
					</div>
					<span className="text-muted-foreground ml-auto text-[10px]">{urgent} 个紧急</span>
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={CheckCircle2} tone="emerald" />
					<div>
						<p className="text-muted-foreground text-[11px]">完成率</p>
						<p className="text-xl font-semibold tabular-nums">{completion}%</p>
					</div>
					<ReProgress value={completion} className="ml-auto w-20" tone="bg-emerald-500" />
				</ReCard>
				<ReCard className="flex items-center gap-3 p-4">
					<ReIconTile icon={MessageSquare} tone="violet" />
					<div>
						<p className="text-muted-foreground text-[11px]">待审核</p>
						<p className="text-xl font-semibold tabular-nums">{reviewCount}</p>
					</div>
					<span className="text-muted-foreground ml-auto text-[10px]">平均 1.2 天</span>
				</ReCard>
			</div>

			<Kanban value={board} onValueChange={setBoard} getItemValue={(task) => task.id}>
				<KanbanBoard className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
					{KANBAN_COLUMNS.map((column) => {
						const tasks = board[column.id] ?? [];
						const meta = COLUMN_META[column.id];
						return (
							<KanbanColumn key={column.id} value={column.id}>
								<ReCard className="flex min-h-[220px] flex-1 flex-col bg-secondary/40 shadow-none">
									<ReCardHeader className="p-3.5 pb-2">
										<div className="flex min-w-0 items-center gap-2">
											<span className={cn("size-2 shrink-0 rounded-full", meta.accent)} />
											<ReCardTitle className="truncate text-[13px]">{column.label}</ReCardTitle>
											<span className="bg-card text-muted-foreground rounded-md border px-1.5 py-0.5 font-mono text-[10px] tabular-nums">
												{tasks.length}
											</span>
										</div>
										<div className="flex shrink-0 items-center gap-0.5">
											<KanbanColumnHandle asChild>
												<button
													type="button"
													aria-label={`拖动「${column.label}」列`}
													className="text-muted-foreground hover:bg-accent grid size-6 cursor-grab place-items-center rounded-md active:cursor-grabbing"
												>
													<GripVertical className="size-3.5" />
												</button>
											</KanbanColumnHandle>
											<button
												type="button"
												aria-label={`在「${column.label}」中新建任务`}
												onClick={() => {
													setNewColumn(column.id);
													setDialogOpen(true);
												}}
												className="text-muted-foreground hover:bg-accent hover:text-foreground grid size-6 cursor-pointer place-items-center rounded-md transition-colors"
											>
												<Plus className="size-3.5" />
											</button>
										</div>
									</ReCardHeader>
									<p className="text-muted-foreground px-3.5 pb-2 text-[10px]">{column.hint}</p>
									<KanbanColumnContent value={column.id} className="flex flex-1 flex-col gap-2.5 px-2.5 pb-2.5">
										{tasks.map((task) => (
											<KanbanItem key={task.id} value={task.id}>
												<TaskCard task={task} />
											</KanbanItem>
										))}
										{tasks.length === 0 && (
											<div className="grid flex-1 place-items-center rounded-lg border border-dashed py-8">
												<p className="text-muted-foreground text-[10px]">拖拽任务到这里</p>
											</div>
										)}
									</KanbanColumnContent>
								</ReCard>
							</KanbanColumn>
						);
					})}
				</KanbanBoard>

				<KanbanOverlay>
					{({ value }) => {
						const task = allTasks.find((item) => item.id === value);
						if (!task) return null;
						return (
							<div className="w-[280px]">
								<TaskCard task={task} overlay />
							</div>
						);
					}}
				</KanbanOverlay>
			</Kanban>

			<ReCard className="mt-4">
				<ReCardHeader className="pb-4">
					<div>
						<ReCardTitle className="flex items-center gap-2">
							<Sparkles className="size-4 text-violet-500" />
							看板提示
						</ReCardTitle>
						<p className="text-muted-foreground mt-0.5 text-xs">本周 Sprint 的健康度与风险</p>
					</div>
					<ReBadge tone="success" dot>按计划进行</ReBadge>
				</ReCardHeader>
				<ReCardContent className="grid gap-4 pt-0 md:grid-cols-3">
					<div className="rounded-xl border bg-secondary/40 p-4">
						<p className="text-xs font-medium">风险关注</p>
						<p className="text-muted-foreground mt-1 text-[11px] leading-5">
							「请求重试策略可配置化」已阻塞 2 天，等待网关组确认退避曲线。
						</p>
					</div>
					<div className="rounded-xl border bg-secondary/40 p-4">
						<p className="text-xs font-medium">本周完成</p>
						<p className="text-muted-foreground mt-1 text-[11px] leading-5">
							已完成 3 张卡片，其中 2 张来自 Anthropic 适配相关工作。
						</p>
					</div>
					<div className="rounded-xl border bg-secondary/40 p-4">
						<p className="text-xs font-medium">成员负载</p>
						<div className="mt-2 flex items-center gap-2">
							<ReAvatarStack
								people={[
									{ name: "陈晓", color: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
									{ name: "王一鸣", color: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
									{ name: "林嘉", color: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
									{ name: "周雨", color: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
								]}
							/>
							<span className="text-muted-foreground text-[10px]">4 人参与</span>
						</div>
					</div>
				</ReCardContent>
			</ReCard>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="rounded-xl sm:max-w-[440px]">
					<DialogHeader>
						<DialogTitle className="text-base">新建任务</DialogTitle>
						<DialogDescription className="text-xs">任务会出现在所选列的最上方。</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="task-title" className="text-xs">任务标题</Label>
							<Input
								id="task-title"
								value={newTitle}
								onChange={(event) => setNewTitle(event.target.value)}
								placeholder="例如：支持 GPT-5 的流式工具调用"
								className="mt-1.5 h-10 rounded-lg"
								onKeyDown={(event) => {
									if (event.key === "Enter") addTask();
								}}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<Label className="text-xs">优先级</Label>
								<Select value={newPriority} onValueChange={(value) => setNewPriority(value as KanbanTask["priority"])}>
									<SelectTrigger className="mt-1.5 h-10 w-full rounded-lg">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-lg">
										<SelectItem value="urgent">紧急</SelectItem>
										<SelectItem value="high">高</SelectItem>
										<SelectItem value="medium">中</SelectItem>
										<SelectItem value="low">低</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label className="text-xs">所在列</Label>
								<Select value={newColumn} onValueChange={setNewColumn}>
									<SelectTrigger className="mt-1.5 h-10 w-full rounded-lg">
										<SelectValue />
									</SelectTrigger>
									<SelectContent className="rounded-lg">
										{KANBAN_COLUMNS.map((column) => (
											<SelectItem key={column.id} value={column.id}>
												{column.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
					<DialogFooter>
						<ReButton variant="outline" onClick={() => setDialogOpen(false)}>
							取消
						</ReButton>
						<ReButton onClick={addTask}>
							<Plus className="size-3.5" />
							创建任务
						</ReButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
