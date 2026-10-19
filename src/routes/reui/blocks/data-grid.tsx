import { createFileRoute } from "@tanstack/react-router";

import { DataGridBlocks } from "@/components/reui/blocks/dataGridDemos";

export const Route = createFileRoute("/reui/blocks/data-grid")({
	component: DataGridPage,
});

function DataGridPage() {
	return (
		<>
			<div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
				<span className="text-foreground font-medium">9 个数据表格示例</span>
				<span>基础、高级工具栏、列显示、行拖拽、行内编辑、展开行、筛选、分组与一万行虚拟滚动。</span>
			</div>
			<DataGridBlocks />
		</>
	);
}
