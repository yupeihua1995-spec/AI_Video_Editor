import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Sidebar } from './Sidebar';
import { useUIStore } from '../store/useUIStore';

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Reset store state before each test to ensure a clean slate
    useUIStore.setState({ isChatSidebarOpen: true });
  });

  it('renders correctly when open', () => {
    render(<Sidebar />);

    // Check if main header is present
    expect(screen.getByText('AI Editor')).toBeInTheDocument();

    // Check if input area is present
    expect(screen.getByPlaceholderText('Type your editing instruction...')).toBeInTheDocument();

    // The sidebar container should have the 'translate-x-0' class when open
    const sidebarContainer = screen.getByText('AI Editor').closest('div')?.parentElement?.parentElement;
    expect(sidebarContainer).toHaveClass('translate-x-0');
    expect(sidebarContainer).not.toHaveClass('translate-x-full');
  });

  it('hides correctly when closed via store state', () => {
    // Manually set store state to closed
    useUIStore.setState({ isChatSidebarOpen: false });

    render(<Sidebar />);

    // The sidebar container should have the 'translate-x-full' class when closed
    const sidebarContainer = screen.getByText('AI Editor').closest('div')?.parentElement?.parentElement;
    expect(sidebarContainer).toHaveClass('translate-x-full');
    expect(sidebarContainer).not.toHaveClass('translate-x-0');
  });

  it('calls closeChatSidebar when the close button is clicked', () => {
    render(<Sidebar />);

    // Find the close button (the one inside the header containing the X icon)
    // We can target it by finding the button within the header that has the AI Editor text
    const headerElement = screen.getByText('AI Editor').parentElement?.parentElement;
    const closeButton = headerElement?.querySelector('button');

    expect(closeButton).toBeInTheDocument();

    // Initial state
    expect(useUIStore.getState().isChatSidebarOpen).toBe(true);

    // Click the close button
    fireEvent.click(closeButton!);

    // Store state should now be closed
    expect(useUIStore.getState().isChatSidebarOpen).toBe(false);
  });
});
