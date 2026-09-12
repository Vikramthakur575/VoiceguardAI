import React, { useEffect, useRef } from 'react';
import { Radio, Activity, Zap, Volume2, AlertOctagon } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  isActive: boolean;
  riskScore: number;
  speaker: 'Caller' | 'Agent / IVR' | 'Idle';
  currentSecond: number;
  anomalyDetected?: string;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  isActive,
  riskScore,
  speaker,
  currentSecond,
  anomalyDetected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      phase += 0.08;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with dark navy background
      ctx.fillStyle = '#0B0E14';
      ctx.fillRect(0, 0, width, height);

      // Draw background grid lines (cyber SOC style)
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw center axis
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const isHighRisk = riskScore > 70;
      const isMediumRisk = riskScore >= 35 && riskScore <= 70;

      // Primary color choice
      let waveColor = '#3B82F6'; // blue-500
      let waveGlow = 'rgba(59, 130, 246, 0.4)';

      if (isHighRisk) {
        waveColor = '#ef4444'; // red
        waveGlow = 'rgba(239, 68, 68, 0.6)';
      } else if (isMediumRisk) {
        waveColor = '#f59e0b'; // amber
        waveGlow = 'rgba(245, 158, 11, 0.5)';
      } else if (speaker === 'Agent / IVR') {
        waveColor = '#60A5FA'; // light blue
        waveGlow = 'rgba(96, 165, 250, 0.4)';
      }

      // If active, draw dynamic spectral bars + layered wave curves
      if (isActive) {
        const barCount = 48;
        const barWidth = (width - 40) / barCount;

        // 1. Draw Spectrum Equalizer Bars
        for (let i = 0; i < barCount; i++) {
          const x = 20 + i * barWidth;
          const freq = (i / barCount) * Math.PI * 4;
          
          // Synthesize bar heights with dynamic harmonics
          let intensity = Math.sin(freq + phase * 1.5) * 0.5 + 0.5;
          intensity *= Math.cos(freq * 0.5 - phase * 0.8) * 0.4 + 0.6;
          
          // If high risk clone, inject high frequency noisy glitches
          if (isHighRisk && i > barCount * 0.65) {
            intensity += (Math.random() - 0.2) * 0.8;
          }

          const barHeight = Math.max(4, intensity * (height * 0.38));
          const y = height / 2 - barHeight / 2;

          // Bar color with gradient
          const barGrad = ctx.createLinearGradient(0, y, 0, y + barHeight);
          barGrad.addColorStop(0, waveColor);
          barGrad.addColorStop(1, '#0F172A');

          ctx.fillStyle = barGrad;
          ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }

        // 2. Draw Main Oscilloscope Waveform Line
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = waveColor;
        ctx.shadowColor = waveGlow;
        ctx.shadowBlur = 10;

        for (let x = 0; x < width; x += 3) {
          const normX = (x / width) * Math.PI * 8;
          
          // Organic voice harmonics
          let yOffset = Math.sin(normX + phase * 2) * 20;
          yOffset += Math.sin(normX * 2.3 - phase * 1.2) * 12;
          yOffset += Math.cos(normX * 0.6 + phase) * 8;

          // Synthetic jitter or glitch when cloned
          if (isHighRisk) {
            yOffset += (Math.sin(x * 0.4 + phase * 5) > 0.7 ? 15 : -10) * (Math.random() * 0.5 + 0.5);
          }

          const y = height / 2 + yOffset;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

        // 3. Draw Secondary Harmonic Envelope (Sub-glottal trace)
        ctx.beginPath();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = isHighRisk ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.3)';
        for (let x = 0; x < width; x += 4) {
          const normX = (x / width) * Math.PI * 4;
          const yOffset = Math.sin(normX - phase * 1.1) * 32 * Math.cos(normX * 0.5);
          const y = height / 2 + yOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

      } else {
        // Flatline idle state with tiny noise
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#334155';
        for (let x = 0; x < width; x += 5) {
          const y = height / 2 + Math.sin(x * 0.05 + phase * 0.2) * 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, riskScore, speaker]);

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg overflow-hidden shadow-sm relative">
      {/* Visualizer Header */}
      <div className="px-4 py-2.5 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isActive ? (riskScore > 70 ? 'bg-red-500 animate-ping' : 'bg-blue-400 animate-pulse') : 'bg-[#64748B]'}`} />
          <span className="text-xs font-semibold text-[#E2E8F0] uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            Live Audio Spectrogram & Formant Analyzer
          </span>
          <span className="text-[10px] font-mono bg-[#1E293B] text-[#94A3B8] px-2 py-0.5 rounded border border-[#334155]">
            48 kHz • PCM 24-bit
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {isActive ? (
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[#64748B]">Speaker:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                speaker === 'Caller' 
                  ? (riskScore > 70 ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-blue-900/30 text-blue-400 border border-blue-800')
                  : 'bg-[#1E293B] text-white border border-[#334155]'
              }`}>
                {speaker}
              </span>
              <span className="text-blue-400 ml-1">
                T+{currentSecond.toString().padStart(2, '0')}s
              </span>
            </div>
          ) : (
            <span className="text-[#64748B] text-xs font-mono">Stream Standby</span>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-44 bg-[#0B0E14]">
        <canvas
          ref={canvasRef}
          width={700}
          height={176}
          className="w-full h-full block"
        />

        {/* Overlay Badges for Anomaly Detection */}
        {isActive && riskScore > 70 && (
          <div className="absolute top-3 right-3 bg-red-950/80 border border-red-500/50 text-red-300 text-xs px-2.5 py-1 rounded flex items-center gap-1.5 backdrop-blur-sm shadow-md animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span className="font-mono font-bold text-[11px]">VOCAL TRACT PHASE INVERSION DETECTED</span>
          </div>
        )}

        {isActive && anomalyDetected && (
          <div className="absolute bottom-3 left-3 bg-[#0F172A]/90 border border-blue-500/40 text-blue-300 text-[11px] px-2.5 py-1 rounded flex items-center gap-1.5 backdrop-blur-sm shadow font-mono">
            <Zap className="w-3 h-3 text-blue-400 animate-bounce" />
            <span>{anomalyDetected}</span>
          </div>
        )}

        {/* Spectral Markers Axis */}
        <div className="absolute bottom-1 right-3 text-[9px] font-mono text-[#64748B] flex gap-4 pointer-events-none">
          <span>0Hz</span>
          <span>2.5kHz (F1)</span>
          <span>5kHz (F2)</span>
          <span>8kHz (F3)</span>
          <span>16kHz (Nyquist)</span>
        </div>
      </div>
    </div>
  );
};
