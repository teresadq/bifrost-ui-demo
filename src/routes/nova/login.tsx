import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chrome, Eye, EyeOff, Github, Sparkles } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout } from "@/components/auth/authLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/nova/login")({
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
		// 静态演示：模拟请求耗时，不发送任何网络请求
		await new Promise((resolve) => setTimeout(resolve, 800));
		localStorage.setItem("nova:user", JSON.stringify({ name: "陈晓", email: values.email }));
		toast.success("登录成功", { description: "正在进入控制台…" });
		void navigate({ to: "/nova/dashboard" });
	}

	function fillDemoAccount() {
		form.setValue("email", "demo@nova.dev", { shouldValidate: true });
		form.setValue("password", "nova1234", { shouldValidate: true });
		toast.info("已填入演示账号，点击登录即可");
	}

	return (
		<AuthLayout>
			<h1 className="text-2xl font-semibold tracking-tight">欢迎回来</h1>
			<p className="text-muted-foreground mt-2 text-sm">登录后继续管理你的模型网关。</p>

			<form className="mt-7 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<div>
					<Label htmlFor="email">邮箱</Label>
					<Input
						id="email"
						type="email"
						autoComplete="email"
						placeholder="you@company.com"
						className="mt-1.5 h-9.5"
						aria-invalid={!!form.formState.errors.email}
						{...form.register("email")}
					/>
					<FieldError message={form.formState.errors.email?.message} />
				</div>

				<div>
					<div className="flex items-center justify-between">
						<Label htmlFor="password">密码</Label>
						<button
							type="button"
							className="text-muted-foreground hover:text-foreground cursor-pointer text-xs underline-offset-4 hover:underline"
							onClick={() => toast.info("演示模式：密码重置邮件不会真的发送")}
						>
							忘记密码？
						</button>
					</div>
					<div className="relative mt-1.5">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							placeholder="输入密码"
							className="h-9.5 pr-9"
							aria-invalid={!!form.formState.errors.password}
							{...form.register("password")}
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="text-muted-foreground absolute top-1/2 right-1 size-7 -translate-y-1/2"
							aria-label={showPassword ? "隐藏密码" : "显示密码"}
							onClick={() => setShowPassword((value) => !value)}
						>
							{showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
						</Button>
					</div>
					<FieldError message={form.formState.errors.password?.message} />
				</div>

				<Controller
					control={form.control}
					name="remember"
					render={({ field }) => (
						<div className="flex items-center gap-2">
							<Checkbox
								id="remember"
								checked={field.value}
								onCheckedChange={(checked) => field.onChange(checked === true)}
								onBlur={field.onBlur}
							/>
							<Label htmlFor="remember" className="text-muted-foreground text-xs font-normal">
								记住这台设备
							</Label>
						</div>
					)}
				/>

				<Button type="submit" size="lg" className="h-10 w-full" isLoading={form.formState.isSubmitting}>
					登录
				</Button>
			</form>

			<div className="bg-muted/50 mt-6 flex items-center gap-3 rounded-sm border border-dashed p-3">
				<span className="bg-muted text-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
					<Sparkles className="size-4" />
				</span>
				<div className="min-w-0 flex-1">
					<p className="text-xs font-medium">演示账号</p>
					<p className="text-muted-foreground mt-0.5 font-mono text-[11px]">demo@nova.dev · nova1234</p>
				</div>
				<Button type="button" variant="outline" size="sm" onClick={fillDemoAccount}>
					一键填入
				</Button>
			</div>

			<div className="my-6 flex items-center gap-3">
				<Separator className="flex-1" />
				<span className="text-muted-foreground text-[11px] whitespace-nowrap">或使用以下方式登录</span>
				<Separator className="flex-1" />
			</div>

			<div className="grid grid-cols-2 gap-2">
				<Button
					type="button"
					variant="outline"
					className="h-9"
					onClick={() => toast.info("演示模式：暂不支持第三方登录")}
				>
					<Github className="size-4" />
					GitHub
				</Button>
				<Button
					type="button"
					variant="outline"
					className="h-9"
					onClick={() => toast.info("演示模式：暂不支持第三方登录")}
				>
					<Chrome className="size-4" />
					Google
				</Button>
			</div>

			<p className="text-muted-foreground mt-6 text-center text-xs">
				还没有账号？{" "}
				<Link to="/nova/register" className="text-foreground font-medium underline-offset-4 hover:underline">
					免费注册
				</Link>
			</p>
		</AuthLayout>
	);
}
