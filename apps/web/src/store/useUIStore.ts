import { create } from 'zustand';
import { DEFAULT_COMPOSITION_CODE } from '../lib/templates';
import type React from 'react';
import { ChatMessage } from '@ai-editor/shared-types';

export type CompilationStatus = 'idle' | 'compiling' | 'success' | 'error';

interface UIState {
  // Sidebar
  isChatSidebarOpen: boolean;
  toggleChatSidebar: () => void;
  openChatSidebar: () => void;
  closeChatSidebar: () => void;

  // Chat History
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessageContent: (id: string, chunk: string) => void;
  markMessageComplete: (id: string) => void;

  // Sandbox & Code
  currentCode: string;
  previousCode: string; // Store last known good code for fallback
  setCurrentCode: (code: string) => void;
  revertToPreviousCode: () => void;

  compilationStatus: CompilationStatus;
  setCompilationStatus: (status: CompilationStatus) => void;

  compilationError: string | null;
  setCompilationError: (error: string | null) => void;

  ActiveComposition: React.FC | null;
  setActiveComposition: (component: React.FC | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isChatSidebarOpen: true,
  toggleChatSidebar: () => set((state) => ({ isChatSidebarOpen: !state.isChatSidebarOpen })),
  openChatSidebar: () => set({ isChatSidebarOpen: true }),
  closeChatSidebar: () => set({ isChatSidebarOpen: false }),

  // Chat History
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessageContent: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, content: msg.content + chunk } : msg
      ),
    })),
  markMessageComplete: (id) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, hasCodeAttached: true } : msg
      ),
    })),

  // Sandbox
  currentCode: DEFAULT_COMPOSITION_CODE,
  previousCode: DEFAULT_COMPOSITION_CODE,
  setCurrentCode: (code) => set((state) => ({
    previousCode: state.currentCode,
    currentCode: code
  })),
  revertToPreviousCode: () => set((state) => ({
    currentCode: state.previousCode,
    compilationError: null,
    compilationStatus: 'idle'
  })),

  compilationStatus: 'idle',
  setCompilationStatus: (status) => set({ compilationStatus: status }),

  compilationError: null,
  setCompilationError: (error) => set({ compilationError: error }),

  ActiveComposition: null,
  setActiveComposition: (component) => set({ ActiveComposition: component }),
}));
