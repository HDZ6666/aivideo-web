<p align="center">
  <a href="https://github.com/unibest-tech/unibest">
    <img width="160" src="./src/static/logo.svg">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/unibest-tech/unibest" target="_blank">aivideo_mobile - 基于 unibest 的 AI 视频移动端应用</a>
</h1>

<div align="center">

![node version](https://img.shields.io/badge/node-%3E%3D18-green)
![pnpm version](https://img.shields.io/badge/pnpm-%3E%3D7.30-green)
![GitHub package.json version](https://img.shields.io/badge/version-3.4.0-blue)
![GitHub License](https://img.shields.io/github/license/feige996/unibest)

</div>

基于 `unibest` 框架开发的 AI 视频移动端应用，采用 `uniapp` + `Vue3` + `TypeScript` + `Vite5` + `UnoCSS` + `sard-uniapp` + `z-paging` + `Alova` 技术栈，支持 H5、小程序、App 多端运行。

内置了 `约定式路由`、`layout布局`、`请求封装`、`状态管理`、`组件自动导入`、`代码规范` 等完整的开发解决方案。

![](https://raw.githubusercontent.com/andreasbm/readme/master/screenshots/lines/rainbow.png)

## 🚀 技术栈

### 核心框架
- **Vue 3** (^3.4.21) - 渐进式JavaScript框架，响应式数据绑定
- **UniApp** (3.0.0-4060620250520001) - 跨平台开发框架，一套代码多端运行
- **TypeScript** (^5.7.2) - 静态类型检查，提升代码质量
- **Vite** (5.2.8) - 现代化构建工具，极速开发体验

### UI & 样式
- **UnoCSS** (^0.65.4) - 原子化CSS引擎，按需生成样式
- **sard-uniapp** (^1.22.1) - 高质量UniApp UI组件库
- **z-paging** (2.8.7) - 高性能分页组件

### 状态管理 & 请求
- **Pinia** (2.0.36) - Vue 3官方状态管理库
- **Alova** (^3.3.3) - 轻量级请求策略库，支持缓存、重试
- **pinia-plugin-persistedstate** (3.2.1) - 状态持久化插件

### 开发工具
- **ESLint** + **@antfu/eslint-config** - 代码质量检查
- **Husky** + **lint-staged** - Git提交规范
- **unplugin-auto-import** - API自动导入

## 📱 平台兼容性

| H5  | iOS | 安卓 | 微信小程序 | 字节小程序 | 快手小程序 | 支付宝小程序 | 钉钉小程序 | 百度小程序 |
| --- | --- | ---- | ---------- | ---------- | ---------- | ------------ | ---------- | ---------- |
| ✅   | ✅   | ✅    | ✅          | ✅          | ✅          | ✅            | ✅          | ✅          |

## ⚙️ 环境要求

- **Node.js** >= 18
- **pnpm** >= 7.30
- **Vue Official** >= 2.1.10 (VSCode插件)
- **TypeScript** >= 5.0

## 🛠️ 内置功能

### 🔄 约定式路由
- 基于文件系统的路由，自动生成路由配置
- 支持路由元信息配置，如布局、导航栏等
```vue
<route lang="jsonc" type="page">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "页面标题"
  }
}
</route>
```

### 🎨 Layout布局系统
- **tabbar布局**: 底部导航栏布局，支持多种tabbar模式
- **default布局**: 默认页面布局
- 配置文件: `src/layouts/fg-tabbar/tabbarList.ts`

### 🌐 请求封装
- 基于Alova的请求封装，支持多种请求策略
- 自动Token管理、请求拦截、错误处理
- 支持请求缓存、重试、防抖等高级功能
```typescript
import { useRequest } from 'alova/client'
import { apiMethod } from '@/api/example'

const { loading, data, send } = useRequest(apiMethod, {
  immediate: true
})
```

### 📦 组件自动导入
- **easycom**: 支持 `fg-*`、`sar-*`、`z-paging*` 组件自动导入
- **unplugin-auto-import**: Vue API、UniApp API自动导入
- **unplugin-vue-components**: 组件自动导入和类型声明

### �️ 分包配置
- 支持分包加载，优化首屏加载速度
- 分包目录: `src/pages-sub`
- 自动识别分包页面，无需手动配置

## 📂 目录结构

```
aivideo_mobile/
├── src/
│   ├── components/          # 全局组件
│   ├── pages/              # 主包页面
│   ├── pages-sub/          # 分包页面
│   ├── layouts/            # 布局组件
│   │   └── fg-tabbar/      # tabbar布局
│   ├── http/               # 请求配置
│   ├── hooks/              # 组合式函数
│   ├── store/              # Pinia状态管理
│   ├── utils/              # 工具函数
│   ├── static/             # 静态资源
│   └── types/              # TypeScript类型定义
├── env/                    # 环境变量配置
│   ├── .env.development    # 开发环境
│   └── .env.production     # 生产环境
├── pages.config.ts         # 页面路由配置
├── manifest.config.ts      # 应用清单配置
├── vite.config.ts         # Vite构建配置
└── uno.config.ts          # UnoCSS配置
```

## 🚀 快速开始

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
pnpm install

# 启动H5开发服务器
pnpm dev

# 启动微信小程序开发
pnpm dev:mp-weixin
```

## 📦 开发命令

### 开发环境
```bash
pnpm dev                    # H5开发 (默认端口: 9000)
pnpm dev:h5                 # H5开发
pnpm dev:h5:ssr            # H5 SSR开发
pnpm dev:mp-weixin         # 微信小程序开发
pnpm dev:mp-alipay         # 支付宝小程序开发
pnpm dev:app               # App开发
pnpm dev:app-android       # Android开发
pnpm dev:app-ios           # iOS开发
```

### 生产构建
```bash
pnpm build                 # H5生产构建
pnpm build:h5              # H5生产构建
pnpm build:mp-weixin       # 微信小程序构建
pnpm build:mp-alipay       # 支付宝小程序构建
pnpm build:app             # App构建
```

### 代码质量
```bash
pnpm lint                  # ESLint检查
pnpm lint:fix              # 自动修复ESLint问题
pnpm type-check            # TypeScript类型检查
```

### 工具命令
```bash
pnpm uvm                   # UniApp版本升级
pnpm openapi-ts-request    # 生成API类型定义
```

## � 部署指南

### H5部署
1. 执行构建命令
```bash
pnpm build:h5
```
2. 将 `dist/build/h5` 目录部署到Web服务器
3. 配置nginx处理路由和API代理

### 微信小程序部署
1. 构建小程序代码
```bash
pnpm build:mp-weixin
```
2. 使用微信开发者工具打开 `dist/build/mp-weixin` 目录
3. 点击"上传"按钮提交代码审核

### App部署
1. 构建App代码
```bash
pnpm build:app
```
2. 使用HBuilderX打开 `dist/build/app` 目录
3. 选择"发行" → "App云打包"生成安装包

## 🔧 环境配置

### 开发环境变量 (env/.env.development)
```bash
VITE_APP_TITLE=应用标题
VITE_SERVER_BASEURL=开发环境API地址
VITE_APP_PROXY=true
VITE_APP_PROXY_PREFIX=/api
VITE_DELETE_CONSOLE=false
```

### 生产环境变量 (env/.env.production)
```bash
VITE_APP_TITLE=应用标题
VITE_SERVER_BASEURL=生产环境API地址
VITE_DELETE_CONSOLE=true
VITE_SHOW_SOURCEMAP=false
```

## 📄 License

[MIT](https://opensource.org/license/mit/)

Copyright (c) 2025 菲鸽

---

基于 [unibest](https://github.com/feige996/unibest) 框架开发 ❤️
