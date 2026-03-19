import React from 'react';
import { useUIStore } from '../store/useUIStore';
import { X, Send, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const { isChatSidebarOpen, closeChatSidebar } = useUIStore();

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 z-10 w-80 bg-zinc-900 border-l border-zinc-800 transition-transform duration-300 flex flex-col shadow-2xl",
        isChatSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2 text-zinc-100">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span className="font-medium">AI Editor</span>
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
        <div className="bg-zinc-800/50 p-3 rounded-lg text-sm text-zinc-300">
          👋 Hi! I'm your AI editing assistant. Try asking me to:
          <ul className="list-disc pl-4 mt-2 space-y-1 text-zinc-400">
            <li>Remove filler words</li>
            <li>Generate subtitles</li>
            <li>Add a zoom-in effect to the first 5 seconds</li>
          </ul>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0">
        <div className="relative flex items-center bg-zinc-950 rounded-lg border border-zinc-800 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
          <input
            type="text"
            placeholder="Type your editing instruction..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-4 py-3 outline-none"
          />
          <button className="absolute right-2 p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded-md transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
