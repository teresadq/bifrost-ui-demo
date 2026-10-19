import { createFileRoute } from "@tanstack/react-router";

import { ChartBlocks } from "@/components/reui/blocks/chartDemos";

export const Route = createFileRoute("/reui/blocks/charts")({
	component: ChartsPage,
});

function ChartsPage() {
	return (
		<>
			<div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
				<span className="text-foreground font-medium">10 个图表区块</span>
				<span>面积、柱状、组合、折线、饼图、径向、桑基、斜率、迷你图与状态追踪条，全部使用 ReUI 图表色板。</span>
			</div>
			<ChartBlocks />
		</>
	);
}
