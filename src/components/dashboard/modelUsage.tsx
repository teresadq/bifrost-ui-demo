import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MODEL_USAGE } from "@/lib/mockData";

export function ModelUsage() {
	return (
		<Card className="gap-0 py-0">
			<CardHeader className="border-b px-5 py-4">
				<CardTitle className="text-sm">模型使用占比</CardTitle>
				<CardDescription className="mt-1 text-xs">按请求数统计 · 最近 14 天</CardDescription>
			</CardHeader>
			<CardContent className="px-5 py-4">
				<ul className="space-y-4">
					{MODEL_USAGE.map((model) => (
						<li key={model.name}>
							<div className="mb-1.5 flex items-baseline justify-between gap-2">
								<div className="min-w-0">
									<span className="truncate text-xs font-medium">{model.name}</span>
									<span className="text-muted-foreground ml-1.5 text-[11px]">{model.provider}</span>
								</div>
								<span className="font-mono text-xs tabular-nums">{model.share}%</span>
							</div>
							<div className="bg-chart-track h-1.5 overflow-hidden rounded-full">
								<div
									className="h-full rounded-full transition-[width] duration-500"
									style={{ width: `${model.share}%`, background: model.color }}
								/>
							</div>
						</li>
					))}
				</ul>
				<p className="text-muted-foreground/80 mt-5 border-t pt-3 text-[11px] leading-5">
					共 5 个模型产生请求。GPT-4o 与 Claude Sonnet 4.5 贡献了 65% 的调用量。
				</p>
			</CardContent>
		</Card>
	);
}
