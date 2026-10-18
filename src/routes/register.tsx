import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Chrome, Eye, EyeOff, Github } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout } from "@/components/auth/authLayout";
import { PasswordStrength } from "@/components/auth/passwordStrength";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

const registerSchema = z
	.object({
		name: z.string().min(2, "请输入至少 2 个字符的姓名"),
		email: z.string().email("请输入有效的邮箱地址"),
		password: z
			.string()
			.min(8, "密码至少需要 8 位")
			.regex(/[A-Za-z]/, "密码需要包含字母")
			.regex(/\d/, "密码需要包含数字"),
		confirmPassword: z.string().min(1, "请再次输入密码"),
		agree: z.boolean(),
	})
	.refine((values) => values.password === values.confirmPassword, {
		path: ["confirmPassword"],
		message: "两次输入的密码不一致",
	})
	.refine((values) => values.agree, {
		path: ["agree"],
		message: "请先阅读并同意服务条款",
	});

type RegisterValues = z.infer<typeof registerSchema>;

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-destructive mt-1.5 text-xs">{message}</p>;
}

function RegisterPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: { name: "", email: "", password: "", confirmPassword: "", agree: false },
		mode: "onTouched",
	});

	const password = form.watch("password");

	async function onSubmit(values: RegisterValues) {
		// 静态演示：模拟请求耗时，不发送任何网络请求
		await new Promise((resolve) => setTimeout(resolve, 900));
		localStorage.setItem("nova:user", JSON.stringify({ name: values.name, email: values.email }));
		toast.success("账号创建成功", { description: "欢迎加入 Nova，正在进入控制台…" });
		void navigate({ to: "/dashboard" });
	}

	return (
		<AuthLayout>
			<Badge variant="secondary" className="mb-4">
				免费开始 · 无需信用卡
			</Badge>
			<h1 className="text-2xl font-semibold tracking-tight">创建你的账号</h1>
			<p className="text-muted-foreground mt-2 text-sm">几秒钟即可完成注册，立即体验 Nova 控制台。</p>

			<form className="mt-7 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<div>
					<Label htmlFor="name">姓名</Label>
					<Input
						id="name"
						autoComplete="name"
						placeholder="例如：陈晓"
						className="mt-1.5 h-9.5"
						aria-invalid={!!form.formState.errors.name}
						{...form.register("name")}
					/>
					<FieldError message={form.formState.errors.name?.message} />
				</div>

				<div>
					<Label htmlFor="email">工作邮箱</Label>
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
					<Label htmlFor="password">密码</Label>
					<div className="relative mt-1.5">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							autoComplete="new-password"
							placeholder="至少 8 位，包含字母和数字"
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
					{password ? <PasswordStrength password={password} /> : null}
					<FieldError message={form.formState.errors.password?.message} />
				</div>

				<div>
					<Label htmlFor="confirmPassword">确认密码</Label>
					<Input
						id="confirmPassword"
						type={showPassword ? "text" : "password"}
						autoComplete="new-password"
						placeholder="再次输入密码"
						className="mt-1.5 h-9.5"
						aria-invalid={!!form.formState.errors.confirmPassword}
						{...form.register("confirmPassword")}
					/>
					<FieldError message={form.formState.errors.confirmPassword?.message} />
				</div>

				<Controller
					control={form.control}
					name="agree"
					render={({ field }) => (
						<div>
							<div className="flex items-start gap-2">
								<Checkbox
									id="agree"
									checked={field.value}
									onCheckedChange={(checked) => field.onChange(checked === true)}
									onBlur={field.onBlur}
									className="mt-0.5"
									aria-invalid={!!form.formState.errors.agree}
								/>
								<Label htmlFor="agree" className="text-muted-foreground text-xs leading-5 font-normal">
									我已阅读并同意
									<span className="text-foreground mx-1 cursor-pointer underline underline-offset-2">服务条款</span>
									和
									<span className="text-foreground mx-1 cursor-pointer underline underline-offset-2">隐私政策</span>
								</Label>
							</div>
							<FieldError message={form.formState.errors.agree?.message} />
						</div>
					)}
				/>

				<Button type="submit" size="lg" className="h-10 w-full" isLoading={form.formState.isSubmitting}>
					创建账号
				</Button>
			</form>

			<div className="my-6 flex items-center gap-3">
				<Separator className="flex-1" />
				<span className="text-muted-foreground text-[11px] whitespace-nowrap">或使用以下方式注册</span>
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
				已有账号？{" "}
				<Link to="/login" className="text-foreground font-medium underline-offset-4 hover:underline">
					直接登录
				</Link>
			</p>
		</AuthLayout>
	);
}
