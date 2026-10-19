import { createFileRoute } from "@tanstack/react-router";

import { ApplicationBlocks } from "@/components/reui/blocks/applicationDemos";

export const Route = createFileRoute("/reui/blocks/application")({
	component: ApplicationPage,
});

function ApplicationPage() {
	return (
		<>
			<div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
				<span className="text-foreground font-medium">23 个应用区块</span>
				<span>App Shell、认证、卡片、弹窗、空状态、日历、流程、表单、甘特图、看板、列表、导航、引导、资料、编辑器、日程、设置、Sheet、统计、时间线、白板、向导。</span>
			</div>
			<ApplicationBlocks />
		</>
	);
}
