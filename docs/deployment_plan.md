# 在线AI Native视频编辑器 部署方案文档

## 1. 部署架构概述

由于本项目包含重度的前端交互（WebContainers/Sandpack 沙盒环境）、持久化的双向通信（WebSocket）以及高并发计算型任务（视频渲染），因此在部署上需要对不同层级采取不同的策略。整体原则：**前端依托CDN边缘加速，网关支持长连接，核心计算全面Serverless化。**

---

## 2. 前端部署方案

*   **部署平台推荐**：Vercel / Netlify / AWS CloudFront + S3
*   **构建与发布**：利用标准的 CI/CD 流程（如 GitHub Actions），将 React/TypeScript 项目构建为静态文件 (`dist` 或 `.next` 产物）并推送到 CDN。
*   **特殊环境要求（沙盒隔离）**：
    由于前端使用了 WebContainers（基于 WebAssembly），该技术要求浏览器启用**跨域隔离（Cross-Origin Isolation）**。
    因此，前端服务器或 CDN 必须配置以下 HTTP 响应头：
    ```http
    Cross-Origin-Embedder-Policy: require-corp
    Cross-Origin-Opener-Policy: same-origin
    ```
    *如果在Vercel部署，需在 `vercel.json` 的 headers 中配置此项。*

---

## 3. 后端服务部署方案（API与WebSocket）

*   **部署架构**：Node.js Server / Serverless WebSocket API
*   **挑战与对策**：传统的 Serverless 架构（如基础的 AWS Lambda HTTP API）不适合长时间保持连接。针对 WebSocket：
    *   **方案A (全Serverless - 推荐)**：使用 **AWS API Gateway (WebSocket API)** 结合 Lambda。API Gateway 负责维持连接池和处理实时流，事件到达时唤醒 Lambda 进行处理，保持无状态特性。
    *   **方案B (容器化)**：如果实时数据流过于复杂，可采用 Kubernetes (K8s) 或 AWS ECS (Fargate) 部署 Node.js / Socket.io 容器集群，配合 Redis 进行跨实例的消息 Pub/Sub 发布订阅。
*   **环境变量管理**：通过 AWS Parameter Store 或 GitHub Secrets 注入商业 MLLM (OpenAI/Anthropic) 和 ASR 服务的 API Keys。

---

## 4. 视频渲染架构部署 (@remotion/lambda)

视频最终的并发导出是本系统的技术难点。必须抛弃传统的单机 FFmpeg 方案，拥抱大规模分布式渲染。

*   **核心技术**：`@remotion/lambda`
*   **部署步骤**：
    1.  **基础设施初始化**：通过 AWS CLI 或 Terraform 部署 Remotion Lambda 所需的基础设施（IAM 权限、S3 桶等）。
    2.  **部署云端预编译环境 (Site)**：将包含最终“水词逻辑裁剪”功能以及所有基础内置组件的 Remotion React 项目，通过 `npx remotion lambda sites create` 部署打包至 S3。
    3.  **动态代码注入**：对于 AI 在运行时动态生成的特效代码片段，在发起渲染请求时，将其序列化并作为参数 (`inputProps`) 传递给云端的预编译 Site，在渲染前动态加载执行。
    4.  **渲染触发与并发**：
        *   当用户在前端点击“导出”时，调用后端服务。
        *   后端服务通过 `renderMediaOnLambda()` 发起渲染任务。
        *   自动水平扩展（例如分配 200 个并发的 Lambda 函数，每个渲染 10 帧）。
*   **存储与分发**：渲染完成后，合成的 MP4 文件自动回写至 AWS S3 桶，并通过 AWS CloudFront 提供下载链接返回给用户。

---

## 5. CI/CD 流水线设计 (基于 GitHub Actions)

构建全自动的交付流水线：

1.  **提交代码 (Push/PR)**：
    *   触发 `Code Linter` (ESLint/Prettier)。
    *   执行自动化测试集 (Unit Test & API Tests)。
2.  **构建沙盒与前置验证**：
    *   执行一个特制的集成测试，尝试编译并启动沙盒环境验证依赖。
3.  **自动化部署 (CD)**：
    *   前端：推送至 Vercel 触发 Preview/Production 构建。
    *   后端：使用 Serverless Framework 部署 WebSocket API 网关与函数。
    *   渲染层：检测若 Remotion 组件有更新，自动触发 `@remotion/lambda` 部署新版本的 Site 到 S3。

---

## 6. 监控与告警策略

*   **前端异常**：Sentry 捕获前端报错（特别是沙盒的编译/执行 Crash，用于改进 AI 失败回退率）。
*   **渲染服务**：监控 AWS Lambda 的 `ConcurrentExecutions` 和 `Throttles` 指标，防止并发超出账户限额导致渲染失败。
*   **资源成本**：设置 AWS/Vercel 的计费告警（Billing Alarms），防范因恶意调用或AI死循环导致的计算资源剧增（如 MLLM API 消耗及 Lambda 渲染成本）。
