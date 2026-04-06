# ddgame

一个基于 Laravel + Inertia.js + React + TypeScript 的站点项目。

## 技术栈

- Laravel 13（PHP 8.3+）
- Inertia.js（`@inertiajs/react`）
- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Laravel Fortify（认证）

## 环境要求

- PHP `>= 8.3`
- Composer `>= 2`
- Node.js `>= 20`
- npm `>= 10`
- 可用数据库（MySQL / PostgreSQL / SQLite）

## 本地启动

1. 安装依赖

```bash
composer install
npm install
```

2. 初始化环境

```bash
cp .env.example .env
php artisan key:generate
```

3. 配置数据库后执行迁移

```bash
php artisan migrate
```

4. 启动开发环境

```bash
composer run dev
```

默认会并行启动：
- Laravel 开发服务器
- Queue 监听
- Vite 前端开发服务

## 常用命令

```bash
# 前端开发
npm run dev

# 前端构建
npm run build

# 类型检查
npm run types:check

# ESLint 检查
npx eslint resources/js/pages/home.tsx

# PHP 测试
php artisan test
```

## 项目结构（简要）

- `app/`：Laravel 后端代码
- `resources/js/`：React 页面与组件
- `routes/`：路由定义
- `tests/`：测试代码

## 说明

- 首页 UI 在 `resources/js/pages/home.tsx`。
- 仓库中可能存在本地调试临时文件（例如抓取站点源码产生的文件），默认不会参与发布流程。
