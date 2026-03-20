// WebSocket Event Names
export const SocketEvents = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  USER_CHAT_REQUEST: 'user_chat_request',
  AI_STREAM_CHUNK: 'ai_stream_chunk',
  AI_CODE_GENERATED: 'ai_code_generated',
  AI_PROCESS_COMPLETE: 'ai_process_complete',
  ERROR: 'error',
} as const;

// Request Payload from Client -> Server
export interface ChatRequestPayload {
  messageId: string;
  content: string; // The user's prompt (e.g., "Add a glitch effect")
  timestamp: number;
}

// Stream Chunk Payload from Server -> Client
export interface AIStreamChunkPayload {
  messageId: string;
  chunk: string; // The tiny piece of text being typed out
  isComplete: boolean;
}

// Code Generation Result Payload from Server -> Client
export interface CodeGeneratedPayload {
  messageId: string;
  code: string; // The complete React/Remotion component string
  description?: string; // Optional explanation of what the code does
}

// Chat Message Type for Frontend State Management
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  hasCodeAttached?: boolean;
}
