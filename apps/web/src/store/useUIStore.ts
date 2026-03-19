import { create } from 'zustand'

interface UIState {
  isChatSidebarOpen: boolean
  toggleChatSidebar: () => void
  openChatSidebar: () => void
  closeChatSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isChatSidebarOpen: true,
  toggleChatSidebar: () => set((state) => ({ isChatSidebarOpen: !state.isChatSidebarOpen })),
  openChatSidebar: () => set({ isChatSidebarOpen: true }),
  closeChatSidebar: () => set({ isChatSidebarOpen: false }),
}))
