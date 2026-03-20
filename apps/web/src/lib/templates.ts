export const DEFAULT_COMPOSITION_CODE = `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    fps,
    frame,
    config: {
      damping: 12,
    },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#09090b',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          transform: \`scale(\${scale})\`,
          opacity: opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: '#f4f4f5',
            fontSize: '80px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '0 4px 24px rgba(79, 70, 229, 0.5)',
          }}
        >
          AI Native Editor
        </h1>
      </div>
    </AbsoluteFill>
  );
};
`;

export const AI_GENERATED_CODE = `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img } from 'remotion';

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Bouncing Animation
  const y = spring({
    fps,
    frame: frame % 60, // Loop every 60 frames
    config: { damping: 10, mass: 0.5, stiffness: 100 },
  });

  const yOffset = interpolate(y, [0, 1], [0, -100]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1e1b4b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      {/* Dynamic Background Pattern */}
      <AbsoluteFill style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)'
      }} />

      <div style={{ transform: \`translateY(\${yOffset}px)\`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'linear-gradient(135deg, #818cf8, #4f46e5)', boxShadow: '0 20px 40px rgba(79, 70, 229, 0.6)' }} />
         <h1 style={{ color: '#c7d2fe', fontSize: '48px', marginTop: '20px', fontWeight: 800, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '2px' }}>
            AI Generated Effect
         </h1>
      </div>
    </AbsoluteFill>
  );
};
`;
