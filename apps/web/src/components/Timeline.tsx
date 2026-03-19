import React from 'react';

import { Layers, MousePointer2, Settings, Scissors } from 'lucide-react';

export const Timeline: React.FC = () => {
  return (
    <div className="h-64 shrink-0 bg-zinc-950 border-t border-zinc-800 flex flex-col relative z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">

      {/* Timeline Toolbar */}
      <div className="h-10 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 justify-between">
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-md hover:text-zinc-100 transition" title="Selection Tool">
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-md hover:text-zinc-100 transition" title="Split Tool (or use AI logic)">
            <Scissors className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-zinc-800 mx-2"></div>
          <button className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-md hover:text-zinc-100 transition flex items-center gap-2 text-xs font-medium">
            <Layers className="w-4 h-4" />
            Tracks
          </button>
        </div>

        <div className="flex items-center gap-3">
           <button className="p-1.5 text-zinc-400 hover:bg-zinc-800 rounded-md hover:text-zinc-100 transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Track Headers */}
        <div className="w-48 bg-zinc-900 border-r border-zinc-800 shrink-0 overflow-y-auto pt-8 flex flex-col">
          <div className="h-16 border-b border-zinc-800/50 flex items-center px-3 gap-2">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">V</div>
            <span className="text-xs text-zinc-300">Video Track 1</span>
          </div>
          <div className="h-16 border-b border-zinc-800/50 flex items-center px-3 gap-2">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">A</div>
            <span className="text-xs text-zinc-300">Audio Track 1</span>
          </div>
          <div className="h-16 border-b border-zinc-800/50 flex items-center px-3 gap-2">
            <div className="w-6 h-6 rounded bg-indigo-900/50 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-bold">T</div>
            <span className="text-xs text-indigo-300">AI Subtitles</span>
          </div>
        </div>

        {/* Tracks Area (Scrollable) */}
        <div className="flex-1 relative overflow-hidden bg-zinc-950">

          {/* Time Ruler (Placeholder) */}
          <div className="absolute top-0 left-0 right-0 h-8 border-b border-zinc-800/50 flex items-end overflow-hidden bg-zinc-900/30">
            {/* Tick marks */}
            {[...Array(20)].map((_, i) => (
              <div key={i} className="relative h-full flex items-end justify-between min-w-[100px] border-l border-zinc-800">
                <span className="absolute top-1 left-1 text-[10px] text-zinc-600 font-mono">00:{i.toString().padStart(2, '0')}:00</span>
                <div className="h-2 w-px bg-zinc-800/50 ml-auto"></div>
                <div className="h-2 w-px bg-zinc-800/50 ml-auto"></div>
                <div className="h-2 w-px bg-zinc-800/50 ml-auto"></div>
                <div className="h-4 w-px bg-zinc-800/80 ml-auto mr-0"></div>
              </div>
            ))}
          </div>

          {/* Clips Container */}
          <div className="absolute top-8 left-0 right-0 bottom-0 overflow-auto pt-0 pb-4">
             {/* Track 1 (Video) Placeholder */}
             <div className="h-16 border-b border-zinc-800/30 relative mt-0">
               <div className="absolute left-[100px] right-[400px] top-1 bottom-1 bg-indigo-600/20 border border-indigo-500/50 rounded flex items-center px-2 overflow-hidden shadow-sm group hover:bg-indigo-600/30 transition-colors cursor-pointer">
                 <div className="w-8 h-8 rounded shrink-0 bg-indigo-500/20 mr-2 border border-indigo-400/30 flex items-center justify-center text-indigo-300/50 text-xs">IMG</div>
                 <span className="text-xs text-indigo-200 font-medium truncate">main_camera_take1.mp4</span>
               </div>
             </div>

             {/* Track 2 (Audio) Placeholder */}
             <div className="h-16 border-b border-zinc-800/30 relative">
               <div className="absolute left-[100px] right-[400px] top-1 bottom-1 bg-teal-600/20 border border-teal-500/50 rounded flex items-center px-2 overflow-hidden shadow-sm group hover:bg-teal-600/30 transition-colors cursor-pointer">
                  {/* Waveform placeholder */}
                  <svg className="w-full h-full text-teal-500/40 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 20">
                     <path d="M0,10 L5,5 L10,15 L15,8 L20,12 L25,2 L30,18 L35,10 L40,6 L45,14 L50,9 L55,11 L60,4 L65,16 L70,8 L75,12 L80,5 L85,15 L90,10 L95,7 L100,13" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
               </div>
             </div>

             {/* Track 3 (Subtitles) Placeholder */}
             <div className="h-16 border-b border-zinc-800/30 relative">
               <div className="absolute left-[150px] w-[80px] top-1 bottom-1 bg-amber-600/20 border border-amber-500/50 rounded flex items-center justify-center px-1 overflow-hidden shadow-sm">
                 <span className="text-[10px] text-amber-200 truncate">Hello</span>
               </div>
               <div className="absolute left-[240px] w-[120px] top-1 bottom-1 bg-amber-600/20 border border-amber-500/50 rounded flex items-center justify-center px-1 overflow-hidden shadow-sm">
                 <span className="text-[10px] text-amber-200 truncate">Welcome to the video</span>
               </div>
             </div>
          </div>

          {/* Playhead Line */}
          <div className="absolute top-0 bottom-0 left-[200px] w-px bg-red-500 z-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 border-[6px] border-transparent border-t-red-500"></div>
          </div>

        </div>
      </div>

    </div>
  );
};
