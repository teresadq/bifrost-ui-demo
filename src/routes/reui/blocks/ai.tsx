import { createFileRoute } from "@tanstack/react-router";

import { AiBlocks } from "@/components/reui/blocks/aiDemos";

export const Route = createFileRoute("/reui/blocks/ai")({
	component: AiPage,
});

function AiPage() {
	return (
		<>
			<div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
				<span className="text-foreground font-medium">3 个 AI 组件</span>
				<span>Agent 工具调用时间线、可交互 AI Chat 与 Token / 成本用量面板。</span>
			</div>
			<AiBlocks />
		</>
	);
}
