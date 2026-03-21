import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { X, Send, Sparkles, Wand2, RefreshCw, Loader2, Play } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_COMPOSITION_CODE } from '../lib/templates';
import { useChatSocket } from '../lib/useChatSocket';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar: React.FC = () => {
  const { isChatSidebarOpen, closeChatSidebar, setCurrentCode, currentCode, messages } = useUIStore();
  const { sendMessage, isConnected, isTyping } = useChatSocket();
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || !isConnected) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
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
          {!isConnected && <span className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Disconnected"></span>}
          {isConnected && <span className="ml-2 w-2 h-2 rounded-full bg-green-500" title="Connected"></span>}
        </div>
        <button
          onClick={closeChatSidebar}
          className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

        {/* Intro Message */}
        {messages.length === 0 && (
           <div className="bg-zinc-800/40 border border-zinc-700/50 p-4 rounded-xl text-sm text-zinc-300 shadow-sm leading-relaxed">
             <div className="flex items-center gap-2 font-medium text-indigo-300 mb-2">
               <Wand2 className="w-4 h-4" />
               <span>AI Engine Ready</span>
             </div>
             I'm connected! Try asking me to "给视频加上字幕" or "帮我去掉视频里的水词". I will stream the response and generate the Remotion video code in real-time.
           </div>
        )}

        {/* Message List */}
        {messages.map((msg, idx) => (
          <div key={idx} className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
            <div
              className={cn(
                "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed",
                msg.role === 'user'
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-tl-sm shadow-sm"
              )}
            >
              {msg.content}

              {/* Show code indicator if code was attached to this AI message */}
              {msg.role === 'assistant' && msg.hasCodeAttached && (
                <div className="mt-3 pt-3 border-t border-zinc-700/50 flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Code injected to Sandbox
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
           <div className="flex gap-1 items-center self-start text-zinc-500 px-4 py-2">
             <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
             <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
             <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
           </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Sandbox Test Controls (Always keep the reset button handy) */}
      {currentCode !== DEFAULT_COMPOSITION_CODE && (
          <div className="px-4 pb-2 shrink-0">
             <button
                 onClick={handleReset}
                 className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-1.5 px-3 rounded text-xs shadow-sm border border-zinc-700 transition-all active:scale-95"
              >
                 <RefreshCw className="w-3 h-3" />
                 Reset Composition to Default
              </button>
          </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 shrink-0">
        <div className="relative flex items-center bg-zinc-950 rounded-lg border border-zinc-800 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all shadow-inner">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isConnected ? "Ask AI to edit the video..." : "Connecting..."}
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 px-4 py-3 outline-none disabled:opacity-50"
            disabled={!isConnected || isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isConnected || isTyping}
            className="absolute right-2 p-1.5 text-zinc-500 hover:text-indigo-400 disabled:hover:text-zinc-500 cursor-pointer disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
