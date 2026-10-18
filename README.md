# Nova Console Demo

一个纯静态的前端演示项目，使用与 [Bifrost](https://github.com/maximhq/bifrost) UI **完全一致的技术栈与设计系统**实现，包含注册、登录和一个控制台 Dashboard。

> 所有数据均为本地虚构数据。表单提交只做模拟延时，不会发送任何网络请求。

## 页面

### 认证

| 路由 | 说明 |
| --- | --- |
| `/register` | 注册页：姓名 / 邮箱 / 密码（强度提示）/ 确认密码 / 条款勾选，react-hook-form + zod 校验 |
| `/login` | 登录页：邮箱 / 密码 / 记住我，内置演示账号一键填入 |

### 工作台

| 路由 | 说明 |
| --- | --- |
| `/dashboard` | 概览：统计卡片（sparkline）、请求量趋势、模型使用占比、最近请求 |
| `/logs` | 请求日志：搜索 / 提供商 / 状态 / 类型筛选、实时模式、点击行打开请求响应详情抽屉 |
| `/analytics` | 分析报表：成本堆叠柱状图、模型成本环图、延迟分位折线、Token 用量面积图、成本明细表 |

### 项目

| 路由 | 说明 |
| --- | --- |
| `/projects` | 复杂表格：搜索、状态筛选、列显示自定义、排序、多选、批量操作、分页、行操作 |
| `/wizard` | 分步表单：基本信息 → 模型与预算 → 确认提交，逐步校验与配置摘要 |
| `/approvals` | 审批流：审批队列 + 详情、审批链时间线、意见填写、通过/驳回 |

### 模型

| 路由 | 说明 |
| --- | --- |
| `/providers` | 提供商：状态卡片、连通性测试、添加提供商弹窗 |
| `/models` | 模型目录：上下文 / 定价 / 状态，按提供商与模态筛选，可排序表格 |

### 访问与权限

| 路由 | 说明 |
| --- | --- |
| `/members` | 团队成员：邀请弹窗、角色分配、2FA 状态、批量暂停/移除 |
| `/roles` | 角色权限：角色列表 + 权限矩阵，分组全选、保存/重置、新建角色 |
| `/keys` | API 密钥：创建密钥（一次性展示）、范围勾选、有效期、复制/吊销 |
| `/audit-logs` | 审计日志：搜索与筛选、事件详情抽屉、导出 |

### 系统与个人

| 路由 | 说明 |
| --- | --- |
| `/alerts` | 告警规则：触发横幅、规则表格、启用开关、新建告警、最近事件 |
| `/billing` | 账单与用量：套餐与预算进度、成本拆分、发票列表 |
| `/status` | 系统状态：服务健康卡片、30 天可用性条、历史事件 |
| `/settings` | 复杂表单：工作区、安全策略、通知偏好，保存反馈 |
| `/notifications` | 通知中心：分类标签、未读标记、全部已读 |
| `/profile` | 个人资料：基本信息、偏好、修改密码、活跃会话 |
| `/help` | 帮助中心：快捷入口、常见问题手风琴、键盘快捷键 |

全局功能：`⌘K` 命令面板可搜索并跳转所有页面；未匹配路由展示 404 页面。

`/` 会自动跳转到 `/register`。

## 技术栈

- **React 19.2** + **TypeScript 5.9** + **Vite 8**
- **TanStack Router**（文件式路由，`@tanstack/router-plugin` 自动生成路由树）
- **Tailwind CSS v4**（CSS-first `@theme`，无 tailwind.config）
- **Radix UI** primitives + 仓库内 shadcn 风格组件库（`src/components/ui/`）
- **react-hook-form + zod** 表单校验
- **recharts** 图表
- **next-themes** 明暗主题（`.dark` class 策略）
- **sonner** toast 通知
- **Geist / Geist Mono** 自托管变量字体

版本与 `bifrost/ui/package.json` 保持一致。

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
│   ├── ui/                  # 设计系统基础组件（从 bifrost/ui 抽取）
│   ├── auth/                # 注册/登录共用的左右分栏布局、密码强度
│   ├── dashboard/           # 侧边栏、顶栏、统计卡片、图表、表格
│   ├── brand.tsx            # Logo / 品牌字标
│   └── themeProvider.tsx    # next-themes Provider
├── lib/
│   ├── mockData.ts          # 全部演示数据
│   └── utils.ts             # cn()
├── routes/                  # 文件式路由
│   ├── __root.tsx
│   ├── index.tsx
│   ├── register.tsx
│   ├── login.tsx
│   └── dashboard.tsx
└── styles/globals.css       # 设计令牌、字体、Tailwind 配置
```

更详细的设计规范抽取见 [DESIGN.md](./DESIGN.md)。
