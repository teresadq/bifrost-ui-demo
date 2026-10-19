import { createFileRoute } from "@tanstack/react-router";

import { SolutionBlocks } from "@/components/reui/blocks/solutionDemos";

export const Route = createFileRoute("/reui/blocks/solutions")({
	component: SolutionsPage,
});

function SolutionsPage() {
	return (
		<>
			<div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
				<span className="text-foreground font-medium">11 个解决方案区块</span>
				<span>Agents、AI Ops、Analytics、Billing、Bookings、CRM、DevOps、Digital Twin、Files、Inventory、Users。</span>
			</div>
			<SolutionBlocks />
		</>
	);
}
