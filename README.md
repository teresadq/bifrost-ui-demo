# Nova Console Demo

一个纯静态的前端演示项目，使用与 [Bifrost](https://github.com/maximhq/bifrost) UI **完全一致的技术栈与设计系统**实现，包含注册、登录和一个控制台 Dashboard。

> 所有数据均为本地虚构数据。表单提交只做模拟延时，不会发送任何网络请求。

## 页面

### 认证

| 路由 | 说明 |
| --- | --- |
| `/nova/register` | 注册页：姓名 / 邮箱 / 密码（强度提示）/ 确认密码 / 条款勾选，react-hook-form + zod 校验 |
| `/nova/login` | 登录页：邮箱 / 密码 / 记住我，内置演示账号一键填入 |

### 工作台

| 路由 | 说明 |
| --- | --- |
| `/nova/dashboard` | 概览：统计卡片（sparkline）、请求量趋势、模型使用占比、最近请求 |
| `/nova/logs` | 请求日志：搜索 / 提供商 / 状态 / 类型筛选、实时模式、点击行打开请求响应详情抽屉 |
| `/nova/analytics` | 分析报表：成本堆叠柱状图、模型成本环图、延迟分位折线、Token 用量面积图、成本明细表 |

### 项目

| 路由 | 说明 |
| --- | --- |
| `/nova/projects` | 复杂表格：搜索、状态筛选、列显示自定义、排序、多选、批量操作、分页、行操作 |
| `/nova/wizard` | 分步表单：基本信息 → 模型与预算 → 确认提交，逐步校验与配置摘要 |
| `/nova/approvals` | 审批流：审批队列 + 详情、审批链时间线、意见填写、通过/驳回 |

### 模型

| 路由 | 说明 |
| --- | --- |
| `/nova/providers` | 提供商：状态卡片、连通性测试、添加提供商弹窗 |
| `/nova/models` | 模型目录：上下文 / 定价 / 状态，按提供商与模态筛选，可排序表格 |

### 访问与权限

| 路由 | 说明 |
| --- | --- |
| `/nova/members` | 团队成员：邀请弹窗、角色分配、2FA 状态、批量暂停/移除 |
| `/nova/roles` | 角色权限：角色列表 + 权限矩阵，分组全选、保存/重置、新建角色 |
| `/nova/keys` | API 密钥：创建密钥（一次性展示）、范围勾选、有效期、复制/吊销 |
| `/nova/audit-logs` | 审计日志：搜索与筛选、事件详情抽屉、导出 |

### 系统与个人

| 路由 | 说明 |
| --- | --- |
| `/nova/alerts` | 告警规则：触发横幅、规则表格、启用开关、新建告警、最近事件 |
| `/nova/billing` | 账单与用量：套餐与预算进度、成本拆分、发票列表 |
| `/nova/status` | 系统状态：服务健康卡片、30 天可用性条、历史事件 |
| `/nova/settings` | 复杂表单：工作区、安全策略、通知偏好，保存反馈 |
| `/nova/notifications` | 通知中心：分类标签、未读标记、全部已读 |
| `/nova/profile` | 个人资料：基本信息、偏好、修改密码、活跃会话 |
| `/nova/help` | 帮助中心：快捷入口、常见问题手风琴、键盘快捷键 |

全局功能：`⌘K` 命令面板可搜索并跳转所有页面；未匹配路由展示 404 页面。

`/` 是风格选择页，可进入 Bifrost（`/nova/*`）或 ReUI（`/reui/*`）两套演示。

## 两套风格

| 风格 | 路由前缀 | 设计语言 | 说明 |
| --- | --- | --- | --- |
| Bifrost | `/nova/*` | Geist、墨绿主色、8px 圆角、高密度 | 原有完整控制台，20+ 页面 |
| ReUI | `/reui/*` | Inter、近黑主色、10px 圆角、大留白 | 核心页面重构 + 可拖拽 Kanban 看板 |

ReUI 演示基于 [keenthemes/reui](https://github.com/keenthemes/reui)（MIT）的 **免费** 组件与 Neutral 主题，包括其开源 Kanban 组件（dnd-kit）。未使用任何 ReUI Pro 付费区块。

访问 `/` 可在两套风格之间选择；两套控制台的顶栏也都提供一键切换。

### ReUI 演示页面

| 路由 | 说明 |
| --- | --- |
| `/reui/login` / `/reui/register` | 分栏认证页，右侧深色产品展示面板 |
| `/reui/dashboard` | 概览：KPI、请求趋势、模型占比、动态与预算 |
| `/reui/kanban` | 拖拽看板：跨列移动、列排序、新建任务 |
| `/reui/projects` | 项目表格：搜索、筛选、排序、多选、分页、新建 |
| `/reui/analytics` | 分析：成本堆叠柱、成本环图、延迟分位、明细表 |
| `/reui/members` | 团队成员：搜索、角色切换、邀请、移除 |
| `/reui/settings` | 设置：工作区 / 安全 / 通知 / 计费四个分区 |

### ReUI Blocks 展厅

`/reui/blocks` 用 ReUI 的 MIT 免费组件与等价自建实现，覆盖 reui.io/blocks 中后台系统相关的 5 个分类，共 **56 个可交互示例**：

| 路由 | 分类 | 数量 | 示例 |
| --- | --- | --- | --- |
| `/reui/blocks/application` | Application | 23 | App Shell、Auth、Card、Dashboard、Dialog、Empty State、Event Calendar、Flow、Form、Gantt、Kanban、List、Navbar、Onboarding、Profile、Rich Text Editor、Schedule、Settings、Sheet、Stats、Timeline、Whiteboard、Wizard |
| `/reui/blocks/data-grid` | Data Grid | 9 | Base、Advanced、Columns、Drag & Drop、Editing、Expansion、Filtering、Grouping、Virtualization |
| `/reui/blocks/charts` | Chart | 10 | Area、Bar、Composed、Line、Pie、Radial、Sankey、Slope、Sparkline、Status Tracker |
| `/reui/blocks/solutions` | Solutions | 11 | Agents、AI Ops、Analytics、Billing、Bookings、CRM、DevOps、Digital Twin、Files、Inventory、Users |
| `/reui/blocks/ai` | AI Agents | 3 | Agent Activity、AI Chat、AI Usage |
| `/reui/blocks/pro` | Pro 仿照 | 6 组 / 24 个 | App Shell、Data Grid、AI Chat、CRM、AI Usage、Editor 六组 Pro 变体实验室；附 56 分类 / 500 变体的公开目录 |

> reui.io/blocks 的区块本身为 ReUI Pro 付费内容。展厅不包含任何付费源码，仅复刻其后台布局与交互模式；电商与营销分类不属于后台核心场景，未纳入。
> `/reui/blocks/pro` 中的变体目录仅提取公开分类页的标题与用途描述，用于理解 Pro 能力范围；仿照实现全部使用 ReUI MIT 免费组件、项目内依赖与自建代码。

## 技术栈

- **React 19.2** + **TypeScript 5.9** + **Vite 8**
- **TanStack Router**（文件式路由，`@tanstack/router-plugin` 自动生成路由树）
- **Tailwind CSS v4**（CSS-first `@theme`，无 tailwind.config）
- **Radix UI** primitives + 仓库内 shadcn 风格组件库（`src/components/ui/`）
- **react-hook-form + zod** 表单校验
- **recharts** 图表
- **next-themes** 明暗主题（`.dark` class 策略）
- **sonner** toast 通知
- **Geist / Geist Mono** 自托管变量字体；ReUI 演示使用 **Inter Variable**（`@fontsource-variable/inter`）
- **@dnd-kit**（`core` / `sortable` / `utilities`）驱动 ReUI 看板拖拽
- ReUI 风格组件与 Kanban 源码抽取自 [keenthemes/reui](https://github.com/keenthemes/reui)（MIT）

Bifrost 部分版本与 `bifrost/ui/package.json` 保持一致。

> ReUI 的 Application Blocks 属于其 Pro 付费内容，本项目没有抓取或包含任何付费区块；使用的全部是 MIT 仓库中的免费组件与示例。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 产出 dist/ 并执行 tsc 类型检查
npm run preview  # 预览构建产物
```

## 目录结构

```text
src/
├── components/
│   ├── ui/                  # Bifrost 设计系统基础组件
│   ├── auth/                # Bifrost 注册/登录布局、密码强度
│   ├── dashboard/           # Bifrost 控制台外壳与图表
│   ├── reui/                # ReUI 风格组件：外壳、UI primitives、图表、看板、数据
│   ├── styleScope.tsx       # 根据 /reui 路由切换 style-reui 设计令牌
│   ├── brand.tsx            # Bifrost Logo
│   └── themeProvider.tsx    # next-themes Provider
├── lib/
│   ├── mockData.ts          # Bifrost 演示数据
│   ├── navigation.tsx       # Bifrost 侧边栏 / 命令面板数据源
│   └── utils.ts             # cn()
├── routes/                  # 文件式路由
│   ├── __root.tsx
│   ├── index.tsx            # 风格选择页
│   ├── nova/                # Bifrost 风格（原有 20+ 页面）
│   └── reui/                # ReUI 风格（核心页面 + 看板）
└── styles/globals.css       # Bifrost + ReUI 两套设计令牌
```

`src/components/reui/kanban.tsx` 抽取自 ReUI 的 MIT 开源 Kanban 实现，仅调整了项目内导入路径。

更详细的设计规范抽取见 [DESIGN.md](./DESIGN.md)。
