📈 智能云监控中心 · CloudPulse
现代企业级智能云监控平台，提供实时监控、秒级告警、日志流分析与可视化大屏，支持 Web 端与桌面客户端。
在线演示 · GitHub 仓库

✨ 项目简介
CloudPulse 是一款面向云原生环境的智能监控系统，旨在解决传统监控工具在实时性、交互体验和海量数据处理上的不足。通过统一的数据聚合层、WebSocket 实时推送和高效的前端渲染，为运维团队提供从全景监控到日志分析的一站式体验。

🛠️ 技术栈
层面	技术
前端框架	React 19 + TypeScript
BFF 层	Node.js (Express)
实时通信	WebSocket (ws 库)
可视化	ECharts + ResizeObserver
桌面端	Electron
状态管理	React Hooks + Context
样式	CSS Modules + Flex/Grid
工程化	Vite + ESLint + Prettier
🎯 核心功能
功能模块	描述
全景监控大屏	聚合多维度指标（CPU、内存、网络、业务 QPS），通过 ECharts 动态展示，支持自定义布局与全屏模式。
服务拓扑图	自动发现服务依赖关系，实时展示节点健康状态与调用链流量，异常节点高亮告警。
告警中心	集中展示所有触发告警，支持按级别、时间、资源筛选；提供告警确认与静默操作。
告警策略	灵活配置告警规则（阈值、环比、同比），支持多条件组合与通知渠道（钉钉、邮件、Webhook）。
日志实时分析	对接 ELK 或其他日志源，支持全文搜索、字段过滤、上下文查看；采用虚拟滚动渲染万级日志条目。
系统设置	用户管理、角色权限、系统配置（数据保留周期、告警全局参数）等。
📸 功能预览
📌 以下为功能模块示意图，实际截图存放在 screenshots/ 文件夹下。

全景监控大屏	服务拓扑图	告警中心

<img width="800" alt="屏幕截图 2026-03-17 213132" src="https://github.com/user-attachments/assets/1f564caf-168a-40b2-8bf7-75fcef8a5b7b" />

<img width="800" alt="屏幕截图 2026-03-17 213202" src="https://github.com/user-attachments/assets/fdc4dc76-51fa-404e-975d-cee68670df6d" />

<img width="800" alt="屏幕截图 2026-03-17 213217" src="https://github.com/user-attachments/assets/73017113-7c77-4eb8-aced-bf7310607a67" />


告警策略	日志实时分析	系统设置

<img width="800" alt="屏幕截图 2026-03-17 213358" src="https://github.com/user-attachments/assets/4e54b6cc-3130-4aa2-aeab-59e45b42d01b" />

<img width="800" alt="屏幕截图 2026-03-17 213419" src="https://github.com/user-attachments/assets/805ac250-3f85-4aad-b98f-0f3c488322c1" />

本地运行（全栈）
bash
# 克隆仓库
git clone https://github.com/Cynthia-eng-hue/cloudpulse.git
cd cloudpulse

# 安装前端依赖
npm install

# 安装 BFF 层依赖
cd server
npm install
cd ..

# 启动 BFF 服务（端口 3001）
npm run server

# 新开终端启动前端开发服务器（端口 3000）
npm run dev
访问 http://localhost:3000 即可预览。
