export const getFillerWordsRemovedCode = (prompt: string) => `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Series, interpolate, Easing } from 'remotion';

// Mock AI Audio Analysis result for Filler Words
// The original video is 300 frames long.
// We identified two filler words ("um", "ah") at 60-90 and 150-180.
// We will only render the valid speaking segments.
const validSegments = [
  { start: 0, end: 60, text: "大家好，" }, // 60 frames
  { start: 90, end: 150, text: "今天我们来演示" }, // 60 frames
  { start: 180, end: 300, text: "如何自动去掉视频里的水词！" } // 120 frames
];

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b', color: 'white', fontFamily: 'sans-serif' }}>

      {/* Background Simulation */}
      <AbsoluteFill style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
      }} />

      {/*
        We use <Series> to stitch the valid segments together.
        This automatically creates the jump-cut effect by skipping the filler word frames.
      */}
      <Series>
        {validSegments.map((segment, index) => {
          const duration = segment.end - segment.start;
          return (
            <Series.Sequence key={index} durationInFrames={duration}>
              <VideoSegment text={segment.text} segmentIndex={index + 1} duration={duration} />
            </Series.Sequence>
          );
        })}
      </Series>

      {/* Global Status Overlay */}
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }} />
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fca5a5' }}>
          AI Filler Word Removal Active (Jump Cuts: 2)
        </span>
      </div>
    </AbsoluteFill>
  );
};

const VideoSegment = ({ text, segmentIndex, duration }: { text: string, segmentIndex: number, duration: number }) => {
  const frame = useCurrentFrame();

  // A slight scale animation to make the jump cuts more obvious/dynamic
  const scale = interpolate(frame, [0, duration], [1, 1.05], {
    easing: Easing.linear,
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
          transform: \`scale(\${scale})\`,
          width: '60%', height: '50%', backgroundColor: '#7f1d1d', borderRadius: '24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          boxShadow: '0 20px 40px rgba(185, 28, 28, 0.4)',
          border: '2px solid #ef4444'
      }}>
          <div style={{ color: '#fca5a5', fontSize: '20px', marginBottom: '16px', letterSpacing: '2px' }}>
            VALID SEGMENT {segmentIndex}
          </div>
          <div style={{ color: '#ffffff', fontSize: '36px', fontWeight: 'bold', textAlign: 'center', padding: '0 20px' }}>
             "{text}"
          </div>
      </div>
    </AbsoluteFill>
  );
};
`;

export const getSubtitleCode = (prompt: string) => `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, interpolate, spring } from 'remotion';

// Mock Subtitle Data
const subtitles = [
  { start: 0, end: 60, text: "你好！欢迎体验 AI 原生视频编辑器。" },
  { start: 60, end: 150, text: "正在为您自动识别和生成字幕..." },
  { start: 150, end: 240, text: "完全基于浏览器和 React 构建。" },
  { start: 240, end: 300, text: "剪辑视频就像聊天一样简单！" }
];

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b' }}>
      {/* Background Simulation - Placeholder for real Video track */}
      <AbsoluteFill style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}>
        <div style={{
            width: '200px', height: '120px', backgroundColor: '#312e81', borderRadius: '16px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)', color: '#c7d2fe', fontSize: '24px', fontWeight: 'bold'
        }}>
            Original Video
        </div>
      </AbsoluteFill>

      {/* Subtitle Overlay Track */}
      {subtitles.map((sub, index) => {
        return (
          <Sequence key={index} from={sub.start} durationInFrames={sub.end - sub.start}>
            <Subtitle text={sub.text} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const Subtitle = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Simple pop-up animation for the subtitle
  const scale = spring({
    fps,
    frame,
    config: { damping: 12, mass: 0.5, stiffness: 120 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '80px' }}>
      <div style={{
        transform: \`scale(\${scale})\`,
        opacity,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '16px 32px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '36px',
          margin: 0,
          fontWeight: 600,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '1px'
        }}>
          {text}
        </h2>
      </div>
    </AbsoluteFill>
  );
};
`;

export const getCrashingCode = () => `
import React from 'react';
import { AbsoluteFill } from 'remotion';

export const MainComposition = () => {
  // Simulate a deliberate runtime error to trigger the ErrorBoundary
  const nonexistentVariable: any = undefined;

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Crash Test</h1>
      {nonexistentVariable.someProperty.thatCausesCrash}
    </AbsoluteFill>
  );
};
`;

export const getDefaultCode = (prompt: string) => `
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const MainComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Rotate Animation based on prompt: "${prompt}"
  const rotation = spring({
    fps,
    frame,
    config: { damping: 10, mass: 0.5, stiffness: 100 },
  });

  const rotationDegree = interpolate(rotation, [0, 1], [0, 360]);
  const scale = interpolate(rotation, [0, 1], [0.5, 1.2]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#18181b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px)'
      }} />

      <div style={{ transform: \`scale(\${scale}) rotate(\${rotationDegree}deg)\`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
         <div style={{ width: '150px', height: '150px', borderRadius: '20%', background: 'linear-gradient(135deg, #34d399, #059669)', boxShadow: '0 20px 40px rgba(16, 185, 129, 0.6)' }} />
         <h1 style={{ color: '#a7f3d0', fontSize: '48px', marginTop: '30px', fontWeight: 800, fontFamily: 'sans-serif', letterSpacing: '2px' }}>
            AI Code Activated!
         </h1>
      </div>
    </AbsoluteFill>
  );
};
`;
