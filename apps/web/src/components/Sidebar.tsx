import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { X, Send, Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AI_GENERATED_CODE, DEFAULT_COMPOSITION_CODE } from '../lib/templates';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const { isChatSidebarOpen, closeChatSidebar, setCurrentCode, currentCode } = useUIStore();

  const handleApplyAIEffect = () => {
     setCurrentCode(AI_GENERATED_CODE);
  };

  const handleReset = () => {
     setCurrentCode(DEFAULT_COMPOSITION_CODE);
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 z-10 w-80 bg-zinc-900 border-l border-zinc-800 transition-transform duration-300 flex flex-col shadow-2xl",
        isChatSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0 bg-zinc-950/50">
        <div className="flex items-center gap-2 text-zinc-100">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-medium tracking-wide">AI Assistant</span>
        </div>
        <button
          onClick={closeChatSidebar}
          className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History Area (Placeholder) */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* Intro Message */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 p-4 rounded-xl text-sm text-zinc-300 shadow-sm leading-relaxed">
          <div className="flex items-center gap-2 font-medium text-indigo-300 mb-2">
            <Wand2 className="w-4 h-4" />
            <span>Sandbox Ready</span>
          </div>
          Try the code sandbox integration. Click the button below to simulate an AI generating a dynamic Remotion effect, compiling it in the browser, and rendering it instantly in the player.
        </div>

        {/* Sandbox Test Controls */}
        <div className="flex flex-col gap-3 mt-4">
           {currentCode === DEFAULT_COMPOSITION_CODE ? (
              <button
                 onClick={handleApplyAIEffect}
                 className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg shadow-md transition-all active:scale-95"
              >
                 <Sparkles className="w-4 h-4" />
                 Simulate AI Code Gen
              </button>
           ) : (
              <button
                 onClick={handleReset}
                 className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium py-2.5 px-4 rounded-lg shadow-md border border-zinc-700 transition-all active:scale-95"
              >
                 <RefreshCw className="w-4 h-4" />
                 Reset Composition
              </button>
           )}
        </div>

      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0">
        <div className="relative flex items-center bg-zinc-950 rounded-lg border border-zinc-800 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-inner">
          <input
            type="text"
            placeholder="Type your editing instruction..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-4 py-3 outline-none"
            disabled
          />
          <button className="absolute right-2 p-1.5 text-zinc-500 cursor-not-allowed rounded-md transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
