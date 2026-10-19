import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Github, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ReuiAuthLayout, ReuiAuthSwitch } from "@/components/reui/reuiAuthLayout";
import { ReBadge, ReButton } from "@/components/reui/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reui/login")({
	component: LoginPage,
});

const loginSchema = z.object({
	email: z.string().email("请输入有效的邮箱地址"),
	password: z.string().min(6, "密码至少需要 6 位"),
	remember: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-destructive mt-1.5 text-xs">{message}</p>;
}

function LoginPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "", remember: true },
		mode: "onTouched",
	});

	async function onSubmit(values: LoginValues) {
		await new Promise((resolve) => setTimeout(resolve, 750));
		localStorage.setItem("nova:user", JSON.stringify({ name: "陈晓", email: values.email }));
		toast.success("登录成功", { description: "正在进入 ReUI 风格控制台…" });
		void navigate({ to: "/reui/dashboard" });
	}

	function fillDemo() {
		form.setValue("email", "demo@nova.dev", { shouldValidate: true });
		form.setValue("password", "nova1234", { shouldValidate: true });
		toast.info("已填入演示账号");
	}

	const submitting = form.formState.isSubmitting;

	return (
		<ReuiAuthLayout
			footer={
				<Link to="/nova/login" className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
					<Sparkles className="size-3" />
					查看 Bifrost 风格登录页
				</Link>
			}
		>
			<div className="animate-rise">
				<ReBadge tone="outline" className="mb-5">
					<span className="bg-emerald-500 size-1.5 rounded-full" />
					Nova Gateway · 团队版
				</ReBadge>
				<h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight">欢迎回来</h1>
				<p className="text-muted-foreground mt-2 text-sm">
					登录后继续管理你的模型网关、项目与团队。
				</p>

				<div className="mt-7 grid grid-cols-2 gap-2">
					<ReButton variant="outline" className="w-full gap-2" onClick={() => toast.info("演示模式：SSO 登录不可用")}>
						<Github className="size-4" />
						GitHub
					</ReButton>
					<ReButton variant="outline" className="w-full gap-2" onClick={() => toast.info("演示模式：SSO 登录不可用")}>
						<svg className="size-4" viewBox="0 0 24 24" aria-hidden>
							<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z" />
							<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
							<path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
							<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
						</svg>
						Google
					</ReButton>
				</div>

				<div className="my-6 flex items-center gap-3">
					<span className="bg-border h-px flex-1" />
					<span className="text-muted-foreground text-[10px] tracking-[0.12em] uppercase">或使用邮箱</span>
					<span className="bg-border h-px flex-1" />
				</div>

				<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<div>
						<Label htmlFor="reui-email" className="text-xs">邮箱</Label>
						<Input
							id="reui-email"
							type="email"
							autoComplete="email"
							placeholder="you@company.com"
							className="mt-1.5 h-10 rounded-lg"
							aria-invalid={!!form.formState.errors.email}
							{...form.register("email")}
						/>
						<FieldError message={form.formState.errors.email?.message} />
					</div>

					<div>
						<div className="flex items-center justify-between">
							<Label htmlFor="reui-password" className="text-xs">密码</Label>
							<button
								type="button"
								onClick={() => toast.info("演示模式：密码重置不可用")}
								className="text-muted-foreground hover:text-foreground cursor-pointer text-[11px] transition-colors"
							>
								忘记密码？
							</button>
						</div>
						<div className="relative mt-1.5">
							<Input
								id="reui-password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								placeholder="输入密码"
								className="h-10 rounded-lg pr-10"
								aria-invalid={!!form.formState.errors.password}
								{...form.register("password")}
							/>
							<button
								type="button"
								aria-label={showPassword ? "隐藏密码" : "显示密码"}
								onClick={() => setShowPassword((value) => !value)}
								className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
							>
								{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
							</button>
						</div>
						<FieldError message={form.formState.errors.password?.message} />
					</div>

					<div className="flex items-center justify-between">
						<label className="flex cursor-pointer items-center gap-2 text-xs">
							<Checkbox
								checked={form.watch("remember")}
								onCheckedChange={(checked) => form.setValue("remember", checked === true)}
							/>
							记住我 30 天
						</label>
						<button
							type="button"
							onClick={fillDemo}
							className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-[11px] underline-offset-4 hover:underline"
						>
							填入演示账号
						</button>
					</div>

					<ReButton type="submit" size="lg" className="w-full" disabled={submitting}>
						{submitting ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
						{submitting ? "正在登录…" : "登录控制台"}
					</ReButton>
				</form>

				<p className="text-muted-foreground mt-6 text-center text-xs">
					还没有账号？ <ReuiAuthSwitch to="/reui/register" label="创建团队账号" />
				</p>

				<div className="bg-secondary/60 mt-6 rounded-xl border p-3">
					<p className="text-[11px] leading-relaxed">
						<span className="font-medium">演示账号</span>
						<span className="text-muted-foreground"> — 邮箱 </span>
						<code className="bg-card rounded border px-1 py-0.5 font-mono text-[10px]">demo@nova.dev</code>
						<span className="text-muted-foreground">，密码 </span>
						<code className="bg-card rounded border px-1 py-0.5 font-mono text-[10px]">nova1234</code>
					</p>
				</div>
			</div>
		</ReuiAuthLayout>
	);
}
