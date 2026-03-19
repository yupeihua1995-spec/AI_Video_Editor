import React, { useMemo } from 'react';

import { Play, SkipBack, SkipForward, Volume2, Expand } from 'lucide-react';
import { Player } from '@remotion/player';
import { MainComposition } from '@ai-editor/remotion-core';

export const VideoPreview: React.FC = () => {


  const fps = 30;
  const durationInFrames = 300; // 10 seconds at 30fps

  // Define the style for the player to ensure it scales correctly within the container
  const playerStyle = useMemo(() => ({
     width: '100%',
     height: '100%',
     backgroundColor: 'transparent', // The composition itself handles the background
  }), []);

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 p-6 relative z-0">
      {/* Container for the Remotion Player */}
      <div className="flex-1 flex flex-col min-h-0 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden relative shadow-inner">

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between px-4 z-10 pointer-events-none">
          <span className="text-zinc-200 text-sm font-medium drop-shadow-md">Remotion Player (Sandbox Preview)</span>
        </div>

        {/* Video Area (Remotion Player) */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-black/50">
            <Player
               component={MainComposition}
               durationInFrames={durationInFrames}
               fps={fps}
               compositionWidth={1920}
               compositionHeight={1080}
               style={playerStyle}
               controls={true}
               autoPlay={true}
               loop={true}
            />
        </div>

        {/* Playback Controls Area (Placeholder UI, we'll hook this to Player ref later) */}
        <div className="h-14 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 flex items-center px-4 justify-between shrink-0">

          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition">
              <SkipBack className="w-4 h-4" fill="currentColor" />
            </button>
            <button className="p-2 text-white hover:bg-zinc-800 rounded-full transition bg-indigo-600 hover:bg-indigo-500">
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition">
              <SkipForward className="w-4 h-4" fill="currentColor" />
            </button>
            <span className="text-zinc-400 text-xs font-mono ml-2 border border-zinc-800 px-2 py-1 rounded bg-zinc-900">
              00:00:00 / 00:10:00
            </span>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
             <button className="p-2 hover:text-white transition">
               <Volume2 className="w-4 h-4" />
             </button>
             <button className="p-2 hover:text-white transition">
               <Expand className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
