import { create } from 'zustand'
import { DEFAULT_COMPOSITION_CODE } from '../lib/templates'
import type React from 'react'

export type CompilationStatus = 'idle' | 'compiling' | 'success' | 'error'

interface UIState {
  // Sidebar state
  isChatSidebarOpen: boolean
  toggleChatSidebar: () => void
  openChatSidebar: () => void
  closeChatSidebar: () => void

  // Sandbox & Code State
  currentCode: string
  setCurrentCode: (code: string) => void

  compilationStatus: CompilationStatus
  setCompilationStatus: (status: CompilationStatus) => void

  compilationError: string | null
  setCompilationError: (error: string | null) => void

  // This holds the actual React functional component returned by the sandbox
  ActiveComposition: React.FC | null
  setActiveComposition: (component: React.FC | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isChatSidebarOpen: true,
  toggleChatSidebar: () => set((state) => ({ isChatSidebarOpen: !state.isChatSidebarOpen })),
  openChatSidebar: () => set({ isChatSidebarOpen: true }),
  closeChatSidebar: () => set({ isChatSidebarOpen: false }),

  // Sandbox
  currentCode: DEFAULT_COMPOSITION_CODE,
  setCurrentCode: (code) => set({ currentCode: code }),

  compilationStatus: 'idle',
  setCompilationStatus: (status) => set({ compilationStatus: status }),

  compilationError: null,
  setCompilationError: (error) => set({ compilationError: error }),

  ActiveComposition: null,
  setActiveComposition: (component) => set({ ActiveComposition: component }),
}))
