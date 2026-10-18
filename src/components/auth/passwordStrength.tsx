import { cn } from "@/lib/utils";

const LEVELS = [
	{ label: "太弱", color: "bg-destructive" },
	{ label: "一般", color: "bg-chart-warning" },
	{ label: "良好", color: "bg-chart-success" },
	{ label: "很强", color: "bg-chart-seq-2" },
];

export function scorePassword(password: string): number {
	if (!password) return -1;
	let score = 0;
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
	if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
	return Math.min(score, 4);
}

export function PasswordStrength({ password }: { password: string }) {
	const score = scorePassword(password);
	if (score < 0) return null;

	const level = LEVELS[Math.min(score, 3)];

	return (
		<div className="mt-2">
			<div className="flex gap-1.5" aria-hidden>
				{LEVELS.map((_, index) => (
					<span
						key={index}
						className={cn("h-1 flex-1 rounded-full bg-muted transition-colors duration-300", score >= index && level.color)}
					/>
				))}
			</div>
			<p className="mt-1.5 text-[11px] text-muted-foreground">
				密码强度：<span className="text-foreground/80">{level.label}</span>
				<span className="ml-1.5 text-muted-foreground/70">建议至少 8 位，包含字母、数字和符号</span>
			</p>
		</div>
	);
}
