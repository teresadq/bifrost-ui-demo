# 设计规范（抽取自 Bifrost UI）

本文档记录本项目从 `bifrost/ui` 中抽取的前端技术栈、设计令牌与组件约定，新页面应遵循同样的规则。

## 1. 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript + Vite 8 |
| 路由 | TanStack Router（`createFileRoute` 文件式路由） |
| 样式 | Tailwind CSS v4（`@import "tailwindcss"` + `@theme inline`，无 config 文件） |
| 组件 | Radix UI primitives + `src/components/ui/*` 本地组件库（shadcn new-york 风格） |
| 状态/表单 | react-hook-form + zod（`@hookform/resolvers`） |
| 图表 | recharts |
| 主题 | next-themes，`attribute="class"`，`.dark` 选择器 |
| 通知 | sonner |
| 图标 | lucide-react |
| 字体 | 自托管 Geist / Geist Mono（variable woff2） |

## 2. 目录约定

- 路由与页面 → `src/routes/<route>.tsx`
- 复用组件 → `src/components/`（页面头部、指标卡、DataTable、状态标签、命令面板等）
- 设计系统基础组件 → `src/components/ui/`
- 工具函数与导航配置 → `src/lib/`（`navigation.tsx` 为侧边栏/命令面板/标题的唯一数据源）
- 全局样式与令牌 → `src/styles/globals.css`

## 3. 颜色令牌

所有颜色通过语义变量引用，组件内不写死色值；明暗主题只切换同一套变量。

| 令牌 | 用途 |
| --- | --- |
| `--background` | 页面底色（浅色 `#f4f4f5`，深色由 ink-900 派生） |
| `--foreground` | 正文文字 |
| `--card` / `--card-foreground` | 卡片表面 |
| `--popover` | 浮层（下拉、tooltip） |
| `--primary` | Bifrost 品牌墨绿 `oklch(0.5081 0.1049 165.61)`，**仅用于 primary 按钮、开关等关键操作** |
| `--secondary` / `--muted` / `--accent` | 次级、弱化、悬停表面 |
| `--muted-foreground` | 说明文字 |
| `--destructive` | 错误状态 |
| `--border` / `--input` / `--ring` | 边框、输入框、焦点环 |
| `--sidebar*` | 侧边栏专用语义色 |

图表色板（`--chart-*`）分四类：

- **semantic**：`success / error / warning / info / neutral`，只用于状态；另有 `*-ink` 版本供小字使用（保证 4.5:1 对比度）。
- **sequential**：`seq-1..5`，单色相明度阶梯，用于有序序列。
- **ordinal**：`ord-1..4`，百分位等有序分组。
- **categorical**：`cat-1..6` + `cat-other`，按排序分配；状态色相（0–70）不参与分类色，避免分类被误读为报错。

**中性优先**：结构色（背景、侧边栏、边框、文字、图标）全部使用 zinc 灰阶；绿色只出现在 primary 按钮和开关上，图表使用 indigo / purple / amber 等分类色，不把品牌绿用于装饰性区块。

## 4. 排版与尺寸

- 字号刻度在 `@theme inline` 中覆盖：`text-sm` = 0.825rem、`text-base` = 0.95rem，比 Tailwind 默认更紧凑。
- 字体：`font-sans` → Geist → PingFang SC / Microsoft YaHei 兜底；`font-mono` → Geist Mono。
- 圆角：`--radius: 0.5rem`，派生 `rounded-sm/md/lg/xl`；卡片、按钮、输入框统一使用 `rounded-sm`。
- 外壳尺寸：`--app-topbar-height`（3.25rem）与 `--app-content-viewport`；页面高度需要计算时使用后者，而不是 `100dvh`。
- 数字统一加 `tabular-nums`，时间/ID/金额使用 `font-mono`。

## 5. 组件约定

### Button（`components/ui/button.tsx`）

- CVA 变体：`default / destructive / outline / secondary / ghost / link`
- 尺寸：`default（h-7.5）/ sm / lg / icon`
- 内置：`focus-visible:ring-1`、`active:scale-[0.99]`、禁用态、图标尺寸约束
- 加载态通过 `isLoading` 属性显示 `Loader2` 旋转图标

### Input / Label

- 输入框高度 `h-9`（页面中按需 `h-9.5`），`focus-visible:border-primary`
- 校验失败时设置 `aria-invalid`，由样式统一显示红色边框与 ring
- Label 与输入框间距 `mt-1.5`，错误文案 `text-xs text-destructive mt-1.5`

### Select / Switch / Textarea

- `Select`：Radix Select，触发器 `h-9`，`data-placeholder` 时文字使用 muted 色；表单内使用 `Controller` 接入 react-hook-form
- `Switch`：默认 `md` 尺寸，开启态为 primary 绿，带异步加载态支持
- `Textarea`：`min-h-20`，`field-sizing-content` 随内容增高，等宽字体用于 CORS 等配置场景

### Card

- `rounded-sm border bg-card py-6 shadow-sm`
- 页内卡片常用 `gap-0 py-0` 自行控制 header/content 的内边距
- 标题 `text-sm font-semibold`，描述 `text-xs text-muted-foreground`

### Badge / 状态标记

- 状态使用「圆点 + 文字」而非纯色块：`bg-chart-success/10 text-chart-success-ink`
- 错误用 `bg-destructive/10 text-destructive`，重试/警告用 `chart-warning`

### Table

- 表头 `bg-muted/50`，行悬停 `hover:bg-muted/50`，行间 `border-b`
- 数字列右对齐 + `font-mono tabular-nums`
- 表格自身包在 `overflow-x-auto` 容器中，避免页面横向滚动

### 交互与可访问性

- 所有可点击元素必须有 `cursor-pointer`（按钮组件已内置）
- 焦点可见：`focus-visible:ring` 系列；不使用 `outline: none` 而不提供替代
- 动画克制：时长 ≤ 450ms，尊重 `prefers-reduced-motion`
- 图标按钮必须有 `aria-label`

## 6. 页面布局

### 认证页（`components/auth/authLayout.tsx`）

- 灰色页面背景 + 居中白色卡片（`max-w-[420px]`、`rounded-xl`、细边框 + `shadow-sm`）
- 顶部左侧品牌、右侧主题切换；底部注明演示性质
- 移动端卡片占满可用宽度，表单字段单列排布

### 控制台（`components/dashboard/appShell.tsx`）

- 左侧固定侧边栏（`w-60`，浅灰底），`md` 以下隐藏；品牌 + 全局搜索 + 分组导航 + 版本号 + 用户区
- 顶栏高度 `h-14`，白底、细边框，面包屑 + 搜索 + 主题/通知/账户
- 主内容区白底，`max-w-[1400px]`、`px-4 py-6 md:px-8`；页面卡片使用细边框而非重阴影
- 导航项激活态：`bg-sidebar-accent` + 前景色图标，不使用彩色高亮
- 页面标题使用 `text-xl font-semibold`，描述 `text-sm text-muted-foreground`

### 分步表单（`routes/wizard.tsx`）

- 顶部步骤条：完成态为黑底白勾，当前态为黑边空心圆，未开始为灰色
- 每步只校验本步字段（`form.trigger([...])`），最后一步展示只读摘要表
- 底部左侧「上一步」、右侧步数与「下一步 / 提交配置」

### 审批流（`routes/approvals.tsx`）

- 两栏布局：`lg:grid-cols-[360px_minmax(0,1fr)]`，左侧队列、右侧详情
- 审批链使用时间线：完成 = 黑底勾，进行中 = 空心圆 + Clock，待处理 = 灰点，驳回 = 红色 X
- 审批意见文本域与「驳回 / 通过申请」操作仅在待审批状态显示

### 复杂表格（`routes/projects.tsx`）

- 工具栏：搜索、状态 Select、列显示 Dropdown（`DropdownMenuCheckboxItem`）、数量统计
- 支持行多选（含不完整选择态）、批量操作条、列头排序、行内 Switch 与操作菜单
- 分页条展示 `当前范围 / 总数` 与页码；筛选变化时回到第一页

### 复杂表单（`routes/settings.tsx`）

- 信息提示条（Info 图标 + muted 背景）
- 设置卡片按「标题 + 说明 + 控制项」的行结构组织，行间用 `divide-y`
- 开关类设置放在行右侧；输入类设置放在说明文字下方
- 页头与页面底部均提供保存入口，保存按钮有 loading 状态和 toast 反馈

## 7. 通用数据展示约定

### DataTable（`components/dataTable.tsx`）

- 泛型表格，列定义 `{ key, header, cell, sortable?, sortValue? }`
- 内置：列头排序（ArrowUpDown）、分页（默认每页 8 条）、可选行多选（含半选态 header checkbox）
- 空状态、范围文案（`1-8 / 12 条`）统一由组件输出
- 页面只负责筛选数据、组装列定义和行操作

### StatusPill（`components/statusPill.tsx`）

- `tone`: `neutral / info / warning / danger / purple / solid`
- 默认带圆点，用于状态列；结构性标签用中性灰，不使用品牌绿

### 详情抽屉（请求日志、审计日志）

- 右侧固定面板 `max-w-[560px]`，带半透明遮罩，`animate-in slide-in-from-right`
- 头部：标题 + 元信息 + 状态 pill + 关闭按钮；底部：复制/后续操作
- 内容区使用两列信息栅格 + `<pre>` 展示 JSON

### 图表（分析报表、概览）

- 统一使用 recharts，颜色全部引用 `--chart-*` 令牌
- 图表都设置 `isAnimationActive={false}`，保证首屏与截图稳定
- Tooltip 使用 `var(--popover)` / `var(--border)` 派生样式，自动适配明暗主题
- 面积图渐变使用 `<defs>` + `stopColor="var(--chart-cat-*)"`

### 命令面板（`components/commandPalette.tsx`）

- 全局 `⌘K / Ctrl+K` 呼出，`Esc` 关闭，支持 ↑↓ + Enter
- 数据源统一来自 `lib/navigation.tsx` 的 `ALL_PAGES`，新增页面只需维护这一处
- 列表项展示页面名称与路径，当前项高亮

### 页面导航（`lib/navigation.tsx`）

- `NAV_GROUPS` 是侧边栏、命令面板和面包屑标题的唯一数据源
- 分组：工作台 / 项目 / 模型 / 访问与权限 / 系统
- 新页面：添加路由文件 → 在 `NAV_GROUPS` 增加一项 → `AppPath` 联合类型补充路径

## 8. 从 Bifrost 抽取的文件

| 本项目文件 | 来源 |
| --- | --- |
| `src/styles/globals.css` | `bifrost/ui/app/globals.css`（令牌、字体、工具类） |
| `src/lib/utils.ts` | `bifrost/ui/lib/utils.ts` |
| `src/components/ui/button.tsx` | `bifrost/ui/components/ui/button.tsx` |
| `src/components/ui/input.tsx` | 同上（移除 copy-button 依赖后简化） |
| `src/components/ui/{label,card,checkbox,separator,badge,avatar,table,dropdownMenu,tooltip}.tsx` | 原样复制 |
| `src/components/ui/select.tsx` / `switch.tsx` / `dialog.tsx` | 原样复制（Radix Select / Switch / Dialog） |
| `src/components/ui/textarea.tsx` | 参考原组件，移除 autosize 依赖后简化 |
| `public/static/fonts/*` | `bifrost/ui/public/static/fonts/*`（Geist，OFL 协议） |

未抽取：enterprise 相关代码、Redux/RTK Query 数据层、Monaco、ReactFlow、业务选择器等；演示项目不依赖后端。

## 9. 静态演示约定

- 提交表单：`await new Promise(r => setTimeout(r, 800~900))` 后 toast + 跳转
- 登录用户信息写入 `localStorage["nova:user"]`，Dashboard 读取姓名；退出登录时清除
- 未实现的入口统一 `toast.info("… 不在本次演示范围内")`
