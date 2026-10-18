import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AppShell } from "@/components/dashboard/appShell";
import { PageHeader } from "@/components/pageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wizard")({
	component: WizardPage,
});

const PROVIDERS = [
	{ id: "openai", name: "OpenAI", description: "GPT-4o、o 系列推理模型" },
	{ id: "anthropic", name: "Anthropic", description: "Claude Sonnet / Haiku" },
	{ id: "google", name: "Google", description: "Gemini 2.5 系列" },
	{ id: "deepseek", name: "DeepSeek", description: "V3 / R1 开源模型" },
] as const;

const MODELS = ["gpt-4o", "claude-sonnet-4-5", "deepseek-v3", "gemini-2.5-pro"];

const DEPARTMENTS = ["研发中心", "产品设计", "市场增长", "客户成功", "数据平台"];
const REGIONS = ["中国大陆", "亚太", "欧洲", "北美"];

const wizardSchema = z.object({
	name: z.string().min(2, "项目名称至少 2 个字符"),
	description: z.string().max(120, "描述不超过 120 字").optional(),
	department: z.string().min(1, "请选择所属部门"),
	owner: z.string().email("请输入有效的负责人邮箱"),
	providers: z.array(z.string()).min(1, "至少选择一个提供商"),
	model: z.string().min(1, "请选择默认模型"),
	budget: z.number().min(1, "预算需大于 0"),
	rateLimit: z.number().min(1, "速率限制需大于 0"),
	region: z.string().min(1, "请选择部署区域"),
	notify: z.boolean(),
});

type WizardValues = z.infer<typeof wizardSchema>;

const STEP_FIELDS: (keyof WizardValues)[][] = [
	["name", "description", "department", "owner"],
	["providers", "model", "budget", "rateLimit", "region"],
	[],
];

const STEPS = [
	{ title: "基本信息", description: "项目与负责人" },
	{ title: "模型与预算", description: "提供商与额度" },
	{ title: "确认提交", description: "检查并创建" },
];

function FieldError({ message }: { message?: string }) {
	if (!message) return null;
	return <p className="text-destructive mt-1.5 text-xs">{message}</p>;
}

function WizardPage() {
	const navigate = useNavigate();
	const [step, setStep] = useState(0);

	const form = useForm<WizardValues>({
		resolver: zodResolver(wizardSchema),
		defaultValues: {
			name: "",
			description: "",
			department: "",
			owner: "",
			providers: ["openai"],
			model: "gpt-4o",
			budget: 500,
			rateLimit: 60,
			region: "中国大陆",
			notify: true,
		},
		mode: "onTouched",
	});

	const values = form.watch();
	const selectedProviders = values.providers ?? [];

	async function next() {
		const valid = await form.trigger(STEP_FIELDS[step]);
		if (valid) setStep((current) => Math.min(current + 1, STEPS.length - 1));
	}

	async function onSubmit(data: WizardValues) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		toast.success("项目已创建", {
			description: `${data.name} · ${data.providers.length} 个提供商 · 月度预算 $${data.budget}`,
		});
		void navigate({ to: "/projects" });
	}

	function toggleProvider(id: string, checked: boolean) {
		const current = form.getValues("providers");
		form.setValue(
			"providers",
			checked ? [...current, id] : current.filter((value) => value !== id),
			{ shouldValidate: true, shouldDirty: true },
		);
	}

	return (
		<AppShell>
			<PageHeader
				title="分步配置"
				description="按照步骤创建一个新项目：基本信息 → 模型与预算 → 确认提交。"
				actions={
					<Button variant="outline" asChild>
						<Link to="/projects">取消</Link>
					</Button>
				}
			/>

			{/* 步骤条 */}
			<div className="mb-6 flex items-start gap-0 rounded-lg border p-4">
				{STEPS.map((item, index) => {
					const completed = index < step;
					const active = index === step;
					return (
						<Fragment key={item.title}>
							<div className="flex min-w-0 flex-1 flex-col items-center text-center">
								<span
									className={cn(
										"flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors",
										completed && "bg-foreground text-background border-foreground",
										active && "border-foreground text-foreground",
										!completed && !active && "text-muted-foreground/70",
									)}
								>
									{completed ? <Check className="size-3.5" /> : index + 1}
								</span>
								<p className={cn("mt-2 text-[13px] font-medium", !completed && !active && "text-muted-foreground")}>
									{item.title}
								</p>
								<p className="text-muted-foreground mt-0.5 hidden text-[11px] sm:block">{item.description}</p>
							</div>
							{index < STEPS.length - 1 && (
								<div className={cn("mt-3.5 h-px w-8 shrink-0 sm:w-16", completed ? "bg-foreground/40" : "bg-border")} />
							)}
						</Fragment>
					);
				})}
			</div>

			<form onSubmit={form.handleSubmit(onSubmit)} noValidate>
				<Card className="gap-0 py-0">
					<CardHeader className="border-b px-6 py-4">
						<CardTitle className="text-sm">
							第 {step + 1} 步 · {STEPS[step].title}
						</CardTitle>
						<CardDescription className="mt-1 text-xs">{STEPS[step].description}</CardDescription>
					</CardHeader>

					<CardContent className="px-6 py-6">
						{step === 0 && (
							<div className="grid max-w-2xl gap-5">
								<div>
									<Label htmlFor="name">项目名称</Label>
									<Input
										id="name"
										placeholder="例如：customer-support"
										className="mt-1.5"
										aria-invalid={!!form.formState.errors.name}
										{...form.register("name")}
									/>
									<FieldError message={form.formState.errors.name?.message} />
								</div>

								<div>
									<Label htmlFor="description">项目描述</Label>
									<Textarea
										id="description"
										placeholder="简要说明这个项目会调用哪些模型、服务于什么场景"
										className="mt-1.5"
										{...form.register("description")}
									/>
									<FieldError message={form.formState.errors.description?.message} />
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div>
										<Label>所属部门</Label>
										<Controller
											control={form.control}
											name="department"
											render={({ field }) => (
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger className="mt-1.5 w-full" aria-invalid={!!form.formState.errors.department}>
														<SelectValue placeholder="选择部门" />
													</SelectTrigger>
													<SelectContent>
														{DEPARTMENTS.map((department) => (
															<SelectItem key={department} value={department}>
																{department}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError message={form.formState.errors.department?.message} />
									</div>

									<div>
										<Label htmlFor="owner">负责人邮箱</Label>
										<Input
											id="owner"
											type="email"
											placeholder="owner@company.com"
											className="mt-1.5"
											aria-invalid={!!form.formState.errors.owner}
											{...form.register("owner")}
										/>
										<FieldError message={form.formState.errors.owner?.message} />
									</div>
								</div>
							</div>
						)}

						{step === 1 && (
							<div className="grid max-w-2xl gap-6">
								<div>
									<Label>启用的提供商</Label>
									<p className="text-muted-foreground mt-1 text-xs">至少选择一个，之后可以在项目设置中调整。</p>
									<div className="mt-2 grid gap-2 sm:grid-cols-2">
										{PROVIDERS.map((provider) => {
											const checked = selectedProviders.includes(provider.id);
											return (
												<label
													key={provider.id}
													className={cn(
														"flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
														checked ? "border-foreground/30 bg-secondary/50" : "hover:bg-muted/40",
													)}
												>
													<Checkbox
														checked={checked}
														onCheckedChange={(value) => toggleProvider(provider.id, value === true)}
														className="mt-0.5"
													/>
													<span>
														<span className="block text-[13px] font-medium">{provider.name}</span>
														<span className="text-muted-foreground mt-0.5 block text-xs">{provider.description}</span>
													</span>
												</label>
											);
										})}
									</div>
									<FieldError message={form.formState.errors.providers?.message} />
								</div>

								<div className="grid gap-5 sm:grid-cols-2">
									<div>
										<Label>默认模型</Label>
										<Controller
											control={form.control}
											name="model"
											render={({ field }) => (
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger className="mt-1.5 w-full">
														<SelectValue placeholder="选择模型" />
													</SelectTrigger>
													<SelectContent>
														{MODELS.map((model) => (
															<SelectItem key={model} value={model}>
																{model}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError message={form.formState.errors.model?.message} />
									</div>

									<div>
										<Label>部署区域</Label>
										<Controller
											control={form.control}
											name="region"
											render={({ field }) => (
												<Select value={field.value} onValueChange={field.onChange}>
													<SelectTrigger className="mt-1.5 w-full">
														<SelectValue placeholder="选择区域" />
													</SelectTrigger>
													<SelectContent>
														{REGIONS.map((region) => (
															<SelectItem key={region} value={region}>
																{region}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
										<FieldError message={form.formState.errors.region?.message} />
									</div>

									<div>
										<Label htmlFor="budget">月度预算（USD）</Label>
										<Input
											id="budget"
											type="number"
											min={1}
											className="mt-1.5 font-mono"
											aria-invalid={!!form.formState.errors.budget}
											{...form.register("budget", { valueAsNumber: true })}
										/>
										<FieldError message={form.formState.errors.budget?.message} />
									</div>

									<div>
										<Label htmlFor="rateLimit">速率限制（RPM）</Label>
										<Input
											id="rateLimit"
											type="number"
											min={1}
											className="mt-1.5 font-mono"
											aria-invalid={!!form.formState.errors.rateLimit}
											{...form.register("rateLimit", { valueAsNumber: true })}
										/>
										<FieldError message={form.formState.errors.rateLimit?.message} />
									</div>
								</div>

								<Controller
									control={form.control}
									name="notify"
									render={({ field }) => (
										<label className="flex cursor-pointer items-start gap-3">
											<Checkbox
												checked={field.value}
												onCheckedChange={(checked) => field.onChange(checked === true)}
												className="mt-0.5"
											/>
											<span>
												<span className="block text-[13px] font-medium">用量告警通知</span>
												<span className="text-muted-foreground mt-0.5 block text-xs">
													当项目用量达到预算的 80% 时，向负责人发送邮件提醒。
												</span>
											</span>
										</label>
									)}
								/>
							</div>
						)}

						{step === 2 && (
							<div className="max-w-2xl">
								<div className="rounded-md border">
									{[
										["项目名称", values.name || "—"],
										["项目描述", values.description || "—"],
										["所属部门", values.department || "—"],
										["负责人", values.owner || "—"],
										["提供商", selectedProviders.map((id) => PROVIDERS.find((p) => p.id === id)?.name ?? id).join("、") || "—"],
										["默认模型", values.model],
										["月度预算", `$${values.budget}`],
										["速率限制", `${values.rateLimit} RPM`],
										["部署区域", values.region],
										["用量告警", values.notify ? "已开启" : "已关闭"],
									].map(([label, value], index) => (
										<div
											key={label}
											className={cn(
												"flex items-start justify-between gap-6 px-4 py-3 text-[13px]",
												index > 0 && "border-t",
											)}
										>
											<span className="text-muted-foreground shrink-0">{label}</span>
											<span className="max-w-[70%] text-right break-words">{value}</span>
										</div>
									))}
								</div>
								<p className="text-muted-foreground mt-3 text-xs">
									确认无误后点击「提交配置」。创建后可在项目列表中随时调整预算和提供商。
								</p>
							</div>
						)}
					</CardContent>

					<div className="flex items-center justify-between gap-3 border-t px-6 py-3">
						<Button
							type="button"
							variant="ghost"
							disabled={step === 0}
							onClick={() => setStep((current) => Math.max(current - 1, 0))}
						>
							上一步
						</Button>
						<div className="flex items-center gap-2">
							<span className="text-muted-foreground text-xs">
								{step + 1} / {STEPS.length}
							</span>
							{step < STEPS.length - 1 ? (
								<Button type="button" onClick={next}>
									下一步
								</Button>
							) : (
								<Button type="submit" isLoading={form.formState.isSubmitting}>
									提交配置
								</Button>
							)}
						</div>
					</div>
				</Card>
			</form>
		</AppShell>
	);
}
