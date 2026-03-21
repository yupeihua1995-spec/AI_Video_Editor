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

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // For local development, allow all origins
    methods: ['GET', 'POST'],
  },
});

// Helper to generate dynamic subtitle template
const getSubtitleCode = (prompt: string) => `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, interpolate, spring } from 'remotion';

// Mock Subtitle Data
const subtitles = [
  { start: 0, end: 60, text: "你好！欢迎体验 AI 原生视频编辑器。" },
  { start: 60, end: 150, text: "正在为您自动识别和生成字幕..." },
  { start: 150, end: 240, text: "完全基于浏览器和 React 构建。" },
  { start: 240, end: 300, text: "剪辑视频就像聊天一样简单！" }
];

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b' }}>
      {/* Background Simulation - Placeholder for real Video track */}
      <AbsoluteFill style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{
            width: '200px', height: '120px', backgroundColor: '#312e81', borderRadius: '16px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)', color: '#c7d2fe', fontSize: '24px', fontWeight: 'bold'
        }}>
            Original Video
        </div>
      </AbsoluteFill>

      {/* Subtitle Overlay Track */}
      {subtitles.map((sub, index) => {
        return (
          <Sequence key={index} from={sub.start} durationInFrames={sub.end - sub.start}>
            <Subtitle text={sub.text} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Subtitle = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simple pop-up animation for the subtitle
  const scale = spring({
    fps,
    frame,
    config: { damping: 12, mass: 0.5, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '80px' }}>
      <div style={{
        transform: \`scale(\${scale})\`,
        opacity,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '16px 32px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '36px',
          margin: 0,
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '1px'
        }}>
          {text}
        </h2>
      </div>
    </AbsoluteFill>
  );
};
`;

// Default / Fallback Code Template
const getDefaultCode = (prompt: string) => `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rotate Animation based on prompt: "${prompt}"
  const rotation = spring({
    fps,
    frame,
    config: { damping: 10, mass: 0.5, stiffness: 100 },
  });

  const rotationDegree = interpolate(rotation, [0, 1], [0, 360]);
  const scale = interpolate(rotation, [0, 1], [0.5, 1.2]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)'
      }} />

      <div style={{ transform: \`scale(\${scale}) rotate(\${rotationDegree}deg)\`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ width: '150px', height: '150px', borderRadius: '20%', background: 'linear-gradient(135deg, #34d399, #059669)', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.6)' }} />
         <h1 style={{ color: '#a7f3d0', fontSize: '48px', marginTop: '30px', fontWeight: 800, fontFamily: 'sans-serif', letterSpacing: '2px' }}>
            AI Code Activated!
         </h1>
      </div>
    </AbsoluteFill>
  );
};
`;

const simulateAIStream = (socket: Socket, request: ChatRequestPayload) => {
  const messageId = request.messageId;
  const isSubtitleRequest = request.content.toLowerCase().includes('字幕') || request.content.toLowerCase().includes('subtitle');

  const mockResponseText = isSubtitleRequest
    ? `我明白了，您希望为视频添加自动识别的字幕 ("${request.content}")。正在提取音频轨道并进行语音识别转换... 这将生成一系列带有时间戳的 Remotion React 字幕层。`
    : `收到指令："${request.content}"。我正在为您生成带有动画效果的 Remotion React 组件代码。请稍等片刻...`;

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
        const codePayload: CodeGeneratedPayload = {
          messageId,
          code: isSubtitleRequest ? getSubtitleCode(request.content) : getDefaultCode(request.content),
          description: isSubtitleRequest
             ? "成功生成字幕轨道！代码包含一个 `<Sequence>` 列表，按照时间戳将文字动画叠加在视频画面上方。"
             : "生成了基于您的提示词动态变化的 Remotion 创意特效组件。",
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
