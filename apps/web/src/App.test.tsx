
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { useUIStore } from './store/useUIStore';

// Mock the components that might cause issues with JSDOM
// Especially the @remotion/player which relies on WebGL and Canvas internally
vi.mock('@remotion/player', () => {
  return {
    Player: () => <div data-testid="mock-remotion-player">Mock Player</div>
  };
});

describe('App Layout Integration', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useUIStore.setState({ isChatSidebarOpen: true });
  });

  it('renders the main layout correctly', () => {
    render(<App />);

    // Header Area
    expect(screen.getByText('AI Native Editor')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();

    // Sidebar Area (Should be initially open)
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();

    // Timeline Area
    expect(screen.getByText('Tracks')).toBeInTheDocument();
    expect(screen.getByText('AI Subtitles')).toBeInTheDocument();

    // Video Preview / Player Area
    expect(screen.getByTestId('mock-remotion-player')).toBeInTheDocument();
  });

  it('toggles the sidebar when the menu button in the header is clicked', () => {
    render(<App />);

    // Initial state: Sidebar should be open
    expect(useUIStore.getState().isChatSidebarOpen).toBe(true);

    // Find the toggle button in the header (has title "Close AI Sidebar" initially)
    const toggleButton = screen.getByTitle('Close AI Sidebar');

    // Click to close
    fireEvent.click(toggleButton);

    // Store state should reflect closed
    expect(useUIStore.getState().isChatSidebarOpen).toBe(false);

    // Title should update
    expect(screen.getByTitle('Open AI Sidebar')).toBeInTheDocument();

    // Click to open again
    fireEvent.click(screen.getByTitle('Open AI Sidebar'));

    // Store state should reflect opened
    expect(useUIStore.getState().isChatSidebarOpen).toBe(true);
  });
});
