import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import {
  SocketEvents,
  ChatRequestPayload,
  AIStreamChunkPayload,
  CodeGeneratedPayload,
} from '@ai-editor/shared-types';

import { getFillerWordsRemovedCode, getSubtitleCode, getDefaultCode, getCrashingCode } from './templates';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For local development, allow all origins
    methods: ['GET', 'POST'],
  },
});

const simulateAIStream = (socket: Socket, request: ChatRequestPayload) => {
  const messageId = request.messageId;
  const contentLower = request.content.toLowerCase();

  const isSubtitleRequest = contentLower.includes('字幕') || contentLower.includes('subtitle');
  const isFillerWordsRequest = contentLower.includes('水词') || contentLower.includes('filler') || contentLower.includes('去水');
  const isCrashRequest = contentLower.includes('崩溃') || contentLower.includes('crash');

  let mockResponseText = `收到指令："${request.content}"。我正在为您生成带有动画效果的 Remotion React 组件代码。请稍等片刻...`;

  if (isSubtitleRequest) {
    mockResponseText = `我明白了，您希望为视频添加自动识别的字幕 ("${request.content}")。正在提取音频轨道并进行语音识别转换... 这将生成一系列带有时间戳的 Remotion React 字幕层。`;
  } else if (isFillerWordsRequest) {
    mockResponseText = `好的，正在为您一键去除视频中的水词 ("${request.content}")。AI 已识别出 2 处无效停顿。我将使用 Remotion <Series> 组件执行自动跳剪 (Jump Cut)，将有效片段拼接在一起。`;
  } else if (isCrashRequest) {
    mockResponseText = `[测试模式] 收到“崩溃”指令。即将生成一段包含致命语法/渲染错误的 React 代码，用于验证前端的容错与回退 (Fallback) 机制...`;
  }

  let i = 0;

  // 1. Simulate streaming text (typewriter effect)
  const streamInterval = setInterval(() => {
    if (i < mockResponseText.length) {
      const chunkPayload: AIStreamChunkPayload = {
        messageId,
        chunk: mockResponseText[i],
        isComplete: false,
      };
      socket.emit(SocketEvents.AI_STREAM_CHUNK, chunkPayload);
      i++;
    } else {
      clearInterval(streamInterval);

      // Send final chunk to close the stream
      socket.emit(SocketEvents.AI_STREAM_CHUNK, {
        messageId,
        chunk: '',
        isComplete: true,
      });

      // 2. Simulate a slight delay before sending the compiled code
      setTimeout(() => {
        let code = getDefaultCode(request.content);
        let description = "生成了基于您的提示词动态变化的 Remotion 创意特效组件。";

        if (isSubtitleRequest) {
          code = getSubtitleCode(request.content);
          description = "成功生成字幕轨道！代码包含一个 `<Sequence>` 列表，按照时间戳将文字动画叠加在视频画面上方。";
        } else if (isFillerWordsRequest) {
          code = getFillerWordsRemovedCode(request.content);
          description = "水词已清除！使用了 Remotion 的 `<Series>` 组件将有效发言片段进行跳剪拼接，整体视频时长已缩短。";
        } else if (isCrashRequest) {
          code = getCrashingCode();
          description = "此代码包含故意制造的渲染错误，前端 ErrorBoundary 应该会拦截它。";
        }

        const codePayload: CodeGeneratedPayload = {
          messageId,
          code,
          description,
        };
        socket.emit(SocketEvents.AI_CODE_GENERATED, codePayload);

        // Notify process complete
        socket.emit(SocketEvents.AI_PROCESS_COMPLETE, { messageId });
      }, 1500);
    }
  }, 30); // 30ms per character
};

io.on(SocketEvents.CONNECTION, (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on(SocketEvents.USER_CHAT_REQUEST, (payload: ChatRequestPayload) => {
    console.log(`[Socket.io] Received chat request from ${socket.id}:`, payload.content);
    // Trigger the mock AI engine
    simulateAIStream(socket, payload);
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
