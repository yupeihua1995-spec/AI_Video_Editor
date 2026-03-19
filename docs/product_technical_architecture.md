# 在线AI Native视频编辑器 产品技术架构文档

## 1. 产品概述

本产品是一款在线的AI Native视频编辑器，其核心亮点在于**通过自然语言（Chat）的交互方式驱动视频剪辑与创意效果生成**。用户无需掌握复杂的专业剪辑软件，只需在编辑器侧边栏输入指令，AI即可理解意图，执行自动化剪辑（如去水词、字幕生成）以及通过动态代码生成（基于Remotion）实现个性化的创意特效。

### 1.1 核心特性
*   **交互模式**：基于可收起的Chat侧边栏进行指令输入与流式反馈，保留主视图用于视频预览与时间轴操作。
*   **基础AI能力**：接入商业多模态大语言模型（MLLM）API，实现精准的语音转文本、自动字幕对齐，以及智能识别并物理剔除“水词”（如“嗯”、“啊”）。
*   **Coding AI能力**：基于Remotion框架，AI根据用户指令实时生成React/Remotion代码，驱动前端沙盒动态渲染创意特效。具备沙盒隔离运行及失败自动回退机制，确保主剪辑流程的稳定性。
*   **极速渲染体验**：采用Serverless架构并发处理Remotion视频渲染，实现高可用与弹性扩缩容。

---

## 2. 总体系统架构图

系统采用前后端分离架构，核心分为：前端交互层、沙盒执行层、后端服务层（网关与长连接）、AI引擎层与Serverless渲染层。

```mermaid
graph TD
    subgraph 前端 (Frontend)
        UI[编辑器UI界面]
        Chat[Chat侧边栏 (WebSocket)]
        Timeline[时间轴 & 播放器 (Remotion Player)]
        Sandbox[前端沙盒环境 (WebContainers/Sandpack)]
    end

    subgraph 后端服务层 (Backend - Serverless)
        WS[WebSocket API Gateway]
        BFF[业务逻辑处理 & 鉴权]
        Task[任务分发引擎]
    end

    subgraph AI引擎层 (AI Engine)
        MLLM[商业MLLM API (代码生成/意图理解)]
        ASR[商业ASR/语音处理 API (字幕/去水词)]
    end

    subgraph 渲染层 (Rendering - Serverless)
        Lambda[@remotion/lambda 并发渲染池]
        Storage[对象存储 OSS/S3]
    end

    UI --> Chat
    Chat <-->|WebSocket| WS
    WS <--> BFF
    BFF <--> Task

    Task -->|意图分析/代码生成| MLLM
    Task -->|音视频解析| ASR

    MLLM -->|生成代码片段| Sandbox
    Sandbox -->|动态执行/实时预览| Timeline

    Task -->|触发最终导出| Lambda
    Lambda -->|输出视频| Storage
```

---

## 3. 核心模块详细设计

### 3.1 交互协议与长连接 (WebSocket)
为了实现纯粹的AI Native体验，系统强依赖WebSocket进行双向通信：
*   **协议格式**：统一采用JSON，定义消息类型（如 `chat_stream`, `code_generation`, `status_update`, `error_fallback`）。
*   **流式输出**：用户输入指令后，后端调用MLLM以Streaming模式返回AI的思考过程和代码片段。前端逐步解析并更新Chat界面。

### 3.2 基础AI能力：字幕与逻辑层物理裁剪
*   **语音识别**：前端上传音视频片段，后端调用商业API（如阿里云ASR或OpenAI Whisper）获取带时间戳的文本。
*   **去水词实现方案（基于Remotion）**：
    *   ASR识别出无意义的“水词”及其起止时间（例如 `[10.5s, 11.2s]`）。
    *   在Remotion中，我们不通过FFmpeg进行破坏性物理裁剪，而是**通过逻辑运算改变渲染时间轴**。
    *   利用Remotion的 `<Sequence>` 和 `<Video>` 组件，根据过滤掉水词后的时间段，动态拼接出新的播放序列。这实现了非破坏性的“逻辑物理裁剪”，不仅预览即时，也完全兼容最终的Remotion渲染机制。

### 3.3 Coding AI与前端沙盒环境 (Sandbox)
这是本产品的核心创新点。用户提出创意需求（如“加一个老电影滤镜并配上爆炸特效”），AI将直接生成代码。
*   **技术选型**：使用纯前端沙盒技术（如基于 WebAssembly 的 WebContainers 或 Sandpack）。
*   **工作流**：
    1.  AI生成包含特定Remotion组件（如特定的动画组合）的React代码片段。
    2.  代码通过WebSocket推送到前端，注入到沙盒环境中的临时文件。
    3.  沙盒实时编译代码，热更新（HMR）注入到Remotion Player中进行预览。
*   **失败回退机制 (Fallback)**：
    *   沙盒内拦截所有编译与运行期错误（Error Boundaries）。
    *   一旦检测到AI生成的代码导致崩溃（白屏或编译失败），系统立即触发回退，恢复到上一个稳定版本的组件状态，并在Chat侧边栏提示用户（例如：“抱歉，刚才的特效生成失败了，已为您恢复，是否重新尝试？”）。
    *   此机制确保了用户的剪辑资产不会因AI的幻觉或语法错误而受损。

### 3.4 视频渲染架构 (Serverless)
传统的视频渲染服务器空闲成本高，且面对突发流量容易排队。
*   **架构选择**：全面采用 Serverless 架构，依托 `@remotion/lambda` 解决方案（底层使用 AWS Lambda 或等效平台）。
*   **渲染机制**：
    *   将包含最终逻辑（去水词时间轴、动态生成的沙盒组件代码打包）的React项目部署至云端。
    *   发起渲染任务时，Remotion Lambda 根据视频总时长，将渲染任务切片（如每 100 帧一个 Lambda 实例）。
    *   成百上千个 Lambda 并发渲染图像帧。
    *   最后启动一个合并任务，结合音轨（已去除水词对应音频）合成最终视频并存入云存储。

---

## 4. 技术栈推荐

*   **前端**：React 18, TypeScript, TailwindCSS, Remotion (@remotion/player), Sandpack / WebContainers, Zustand (状态管理)。
*   **后端**：Node.js (NestJS / Express), Socket.io / ws (WebSocket管理), 阿里云/AWS SDK。
*   **AI/大模型**：OpenAI GPT-4o / Claude 3.5 Sonnet (负责逻辑理解与复杂Remotion代码生成), 商业ASR服务。
*   **基础设施**：AWS Lambda (视频渲染引擎), AWS API Gateway (WebSocket支持), S3 (存储)。
