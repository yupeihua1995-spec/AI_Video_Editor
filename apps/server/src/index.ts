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

// Mock AI Generated Code Template
const generateMockCode = (prompt: string) => `
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
  const mockResponseText = `I understand you want to "${request.content}". I am generating the Remotion React code for this effect now. Please wait a moment while I compile the composition...`;

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
          code: generateMockCode(request.content),
          description: "Generated a rotating geometric shape based on your prompt.",
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
