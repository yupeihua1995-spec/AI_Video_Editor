import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUIStore } from '../store/useUIStore';
import {
  SocketEvents,
  ChatRequestPayload,
  AIStreamChunkPayload,
  CodeGeneratedPayload,
  ChatMessage,
} from '@ai-editor/shared-types';

const SOCKET_URL = 'http://localhost:4000';

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { addMessage, updateMessageContent, setCurrentCode, markMessageComplete } = useUIStore();

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to backend WebSocket');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Handle incoming streaming chunks
    socketRef.current.on(SocketEvents.AI_STREAM_CHUNK, (payload: AIStreamChunkPayload) => {
      updateMessageContent(payload.messageId, payload.chunk);
      if (payload.isComplete) {
         // Optionally do something when stream finishes before code generation starts
      }
    });

    // Handle code generation event
    socketRef.current.on(SocketEvents.AI_CODE_GENERATED, (payload: CodeGeneratedPayload) => {
      // 1. Immediately push the code to the sandbox for compilation
      setCurrentCode(payload.code);
      // 2. Mark the chat message as having code attached
      markMessageComplete(payload.messageId);
    });

    socketRef.current.on(SocketEvents.AI_PROCESS_COMPLETE, () => {
       setIsTyping(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [addMessage, updateMessageContent, setCurrentCode, markMessageComplete]);

  // Send a message to the backend
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !content.trim()) return;

    // 1. Generate a unique ID for this request flow
    const messageId = `msg_${Date.now()}`;

    // 2. Add user message locally
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };
    addMessage(userMsg);

    // 3. Prepare AI placeholder message
    const aiPlaceholder: ChatMessage = {
      id: messageId,
      role: 'assistant',
      content: '', // Will be filled via streaming
      timestamp: Date.now() + 1,
    };
    addMessage(aiPlaceholder);
    setIsTyping(true);

    // 4. Dispatch the request
    const payload: ChatRequestPayload = {
      messageId,
      content,
      timestamp: Date.now(),
    };

    socketRef.current.emit(SocketEvents.USER_CHAT_REQUEST, payload);

  }, [addMessage]);

  return { sendMessage, isConnected, isTyping };
}
