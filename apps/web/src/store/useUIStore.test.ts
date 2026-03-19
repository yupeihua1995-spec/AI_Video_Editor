import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';

describe('useUIStore', () => {
  const initialStoreState = useUIStore.getState();

  beforeEach(() => {
    // Reset the store state before each test
    useUIStore.setState(initialStoreState, true);
  });

  it('should initialize with chat sidebar open', () => {
    const { isChatSidebarOpen } = useUIStore.getState();
    expect(isChatSidebarOpen).toBe(true);
  });

  it('should close the chat sidebar when closeChatSidebar is called', () => {
    const { closeChatSidebar } = useUIStore.getState();

    closeChatSidebar();

    const { isChatSidebarOpen } = useUIStore.getState();
    expect(isChatSidebarOpen).toBe(false);
  });

  it('should open the chat sidebar when openChatSidebar is called after being closed', () => {
    const { closeChatSidebar, openChatSidebar } = useUIStore.getState();

    closeChatSidebar();
    expect(useUIStore.getState().isChatSidebarOpen).toBe(false);

    openChatSidebar();

    const { isChatSidebarOpen } = useUIStore.getState();
    expect(isChatSidebarOpen).toBe(true);
  });

  it('should toggle the chat sidebar state when toggleChatSidebar is called', () => {
    const { toggleChatSidebar } = useUIStore.getState();

    // Initially true -> toggles to false
    toggleChatSidebar();
    expect(useUIStore.getState().isChatSidebarOpen).toBe(false);

    // Now false -> toggles to true
    toggleChatSidebar();
    expect(useUIStore.getState().isChatSidebarOpen).toBe(true);
  });
});
