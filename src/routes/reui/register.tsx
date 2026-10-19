import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PasswordStrength } from "@/components/auth/passwordStrength";
import { ReuiAuthLayout, ReuiAuthSwitch } from "@/components/reui/reuiAuthLayout";
import { ReBadge, ReButton } from "@/components/reui/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reui/register")({
	component: RegisterPage,
});

const registerSchema = z
	.object({
		name: z.string().min(2, "姓名至少需要 2 个字符"),
		email: z.string().email("请输入有效的邮箱地址"),
		password: z.string().min(8, "密码至少需要 8 位"),
		confirm: z.string(),
		terms: z.boolean(),
	})
	.refine((values) => values.password === values.confirm, {
		path: ["confirm"],
		message: "两次输入的密码不一致",
	})
	.refine((values) => values.terms, {
		path: ["terms"],
		message: "请阅读并同意服务条款",
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
		defaultValues: { name: "", email: "", password: "", confirm: "", terms: false },
		mode: "onTouched",
	});

	const password = form.watch("password");

	async function onSubmit(values: RegisterValues) {
		await new Promise((resolve) => setTimeout(resolve, 850));
		localStorage.setItem("nova:user", JSON.stringify({ name: values.name, email: values.email }));
		toast.success("账号已创建", { description: "正在进入 ReUI 风格控制台…" });
		void navigate({ to: "/reui/dashboard" });
	}

	const submitting = form.formState.isSubmitting;

	return (
		<ReuiAuthLayout
			footer={
				<span className="inline-flex items-center gap-1">
					<Sparkles className="size-3" />
					ReUI Neutral 主题 · 静态演示
				</span>
			}
		>
			<div className="animate-rise">
				<ReBadge tone="outline" className="mb-5">
					<span className="bg-blue-500 size-1.5 rounded-full" />
					14 天免费试用 · 无需信用卡
				</ReBadge>
				<h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight">创建团队账号</h1>
				<p className="text-muted-foreground mt-2 text-sm">
					几秒钟完成设置，立即接入你的第一个模型提供商。
				</p>

				<form className="mt-7 space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
					<div>
						<Label htmlFor="reui-name" className="text-xs">姓名</Label>
						<Input
							id="reui-name"
							autoComplete="name"
							placeholder="陈晓"
							className="mt-1.5 h-10 rounded-lg"
							aria-invalid={!!form.formState.errors.name}
							{...form.register("name")}
						/>
						<FieldError message={form.formState.errors.name?.message} />
					</div>

					<div>
						<Label htmlFor="reui-register-email" className="text-xs">工作邮箱</Label>
						<Input
							id="reui-register-email"
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
						<Label htmlFor="reui-register-password" className="text-xs">密码</Label>
						<div className="relative mt-1.5">
							<Input
								id="reui-register-password"
								type={showPassword ? "text" : "password"}
								autoComplete="new-password"
								placeholder="至少 8 位字符"
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
						<PasswordStrength password={password ?? ""} />
						<FieldError message={form.formState.errors.password?.message} />
					</div>

					<div>
						<Label htmlFor="reui-confirm" className="text-xs">确认密码</Label>
						<Input
							id="reui-confirm"
							type="password"
							autoComplete="new-password"
							placeholder="再次输入密码"
							className="mt-1.5 h-10 rounded-lg"
							aria-invalid={!!form.formState.errors.confirm}
							{...form.register("confirm")}
						/>
						<FieldError message={form.formState.errors.confirm?.message} />
					</div>

					<div>
						<label className="flex cursor-pointer items-start gap-2.5 text-xs leading-5">
							<Checkbox
								className="mt-0.5"
								checked={form.watch("terms")}
								onCheckedChange={(checked) => form.setValue("terms", checked === true, { shouldValidate: true })}
							/>
							<span className="text-muted-foreground">
								我同意 <span className="text-foreground font-medium underline underline-offset-4">服务条款</span> 与{" "}
								<span className="text-foreground font-medium underline underline-offset-4">隐私政策</span>
							</span>
						</label>
						<FieldError message={form.formState.errors.terms?.message} />
					</div>

					<ReButton type="submit" size="lg" className="w-full" disabled={submitting}>
						{submitting ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
						{submitting ? "正在创建…" : "创建账号"}
					</ReButton>
				</form>

				<p className="text-muted-foreground mt-6 text-center text-xs">
					已经有账号？ <ReuiAuthSwitch to="/reui/login" label="直接登录" />
				</p>
			</div>
		</ReuiAuthLayout>
	);
}
