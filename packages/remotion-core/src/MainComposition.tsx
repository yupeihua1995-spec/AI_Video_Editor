import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Basic entrance animation
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
        backgroundColor: '#09090b', // zinc-950
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: '#f4f4f5', // zinc-50
            fontSize: '80px',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            textShadow: '0 4px 24px rgba(79, 70, 229, 0.5)', // indigo-600 glow
          }}
        >
          AI Native Editor
        </h1>
        <p
          style={{
            color: '#a1a1aa', // zinc-400
            fontSize: '32px',
            maxWidth: '80%',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          Code-driven. AI-powered.
          <br />
          <span style={{ color: '#818cf8' }}>Remotion rendering engine.</span>
        </p>
      </div>

      {/* Decorative floating elements */}
      <AbsoluteFill
         style={{
           pointerEvents: 'none',
           justifyContent: 'flex-end',
           alignItems: 'flex-start',
           padding: '40px',
         }}
      >
         <div
           style={{
             width: '100px',
             height: '100px',
             borderRadius: '50%',
             backgroundColor: 'rgba(79, 70, 229, 0.15)',
             filter: 'blur(40px)',
             transform: `translate(${Math.sin(frame / 30) * 50}px, ${Math.cos(frame / 30) * 50}px)`,
           }}
         />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
