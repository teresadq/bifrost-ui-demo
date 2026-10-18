import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RECENT_REQUESTS, type RequestStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const STATUS: Record<RequestStatus, { label: string; className: string; dot: string }> = {
	success: {
		label: "成功",
		className: "border-chart-info/25 bg-chart-info/10 text-chart-info-ink",
		dot: "bg-chart-info",
	},
	error: {
		label: "失败",
		className: "border-destructive/25 bg-destructive/10 text-destructive",
		dot: "bg-destructive",
	},
	retry: {
		label: "重试",
		className: "border-chart-warning/30 bg-chart-warning/10 text-chart-warning-ink",
		dot: "bg-chart-warning",
	},
};

function StatusBadge({ status }: { status: RequestStatus }) {
	const config = STATUS[status];
	return (
		<Badge variant="outline" className={cn("gap-1.5 border px-1.5 py-0 font-normal", config.className)}>
			<span className={cn("size-1.5 rounded-full", config.dot)} />
			{config.label}
		</Badge>
	);
}

export function RecentRequests() {
	return (
		<Card className="gap-0 py-0">
			<CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
				<div>
					<CardTitle className="text-sm">最近请求</CardTitle>
					<CardDescription className="mt-1 text-xs">实时更新的网关调用记录</CardDescription>
				</div>
				<Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => toast.info("日志页不在本次演示范围内")}>
					查看全部
					<ArrowRight className="size-3.5" />
				</Button>
			</CardHeader>
			<CardContent className="px-0 pb-1">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="pl-5">请求 ID</TableHead>
							<TableHead>模型</TableHead>
							<TableHead>状态</TableHead>
							<TableHead className="text-right">延迟</TableHead>
							<TableHead className="text-right">Token</TableHead>
							<TableHead className="pr-5 text-right">时间</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{RECENT_REQUESTS.map((request) => (
							<TableRow key={request.id}>
								<TableCell className="pl-5 font-mono text-xs text-muted-foreground">{request.id}</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<span className="text-xs font-medium">{request.model}</span>
										<span className="text-muted-foreground text-[11px]">{request.provider}</span>
									</div>
								</TableCell>
								<TableCell>
									<StatusBadge status={request.status} />
								</TableCell>
								<TableCell className="text-right font-mono text-xs tabular-nums">{request.latency}</TableCell>
								<TableCell className="text-right font-mono text-xs tabular-nums">{request.tokens}</TableCell>
								<TableCell className="text-muted-foreground pr-5 text-right font-mono text-xs tabular-nums">
									{request.time}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
