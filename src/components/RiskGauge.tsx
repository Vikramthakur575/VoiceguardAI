import React from 'react';
import { RiskLevel } from '../types';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  riskLevel?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showZoneLabels?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 'md',
  showZoneLabels = true,
}) => {
  // Clamping score
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine color and status
  let statusText = 'Authentic / Low Risk';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let arcColor = '#10b981'; // emerald-500
  let glowClass = '';

  if (clampedScore > 70) {
    statusText = 'CRITICAL: Voice Clone Detected';
    badgeColor = 'text-red-400 bg-red-500/15 border-red-500/30';
    arcColor = '#ef4444'; // red-500
    glowClass = 'animate-pulse-danger';
  } else if (clampedScore >= 35) {
    statusText = 'SUSPICIOUS: Elevated Anomaly';
    badgeColor = 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    arcColor = '#f59e0b'; // amber-500
  }

  // Calculate arc parameters
  // Semi-circle gauge from 180 deg to 360 deg (or -180 to 0)
  const radius = size === 'lg' ? 95 : size === 'md' ? 80 : 55;
  const strokeWidth = size === 'lg' ? 14 : size === 'md' ? 12 : 8;
  const circumference = Math.PI * radius; // for 180 degree arc
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  // Needle angle from -90deg to +90deg (180deg sweep)
  const needleAngle = -90 + (clampedScore / 100) * 180;

  return (
    <div className={`flex flex-col items-center justify-center relative ${glowClass} rounded-lg p-4 transition-all duration-300 bg-[#0F172A] border border-[#1E293B]`}>
      {/* SVG Arc Gauge */}
      <div className="relative flex items-center justify-center">
        <svg
          width={radius * 2 + strokeWidth * 2 + 20}
          height={radius + strokeWidth + 25}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="40%" stopColor="#22c55e" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc (180 deg) */}
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${radius * 2 + strokeWidth + 10} ${radius + strokeWidth}`}
            fill="none"
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d={`M ${strokeWidth + 10} ${radius + strokeWidth} A ${radius} ${radius} 0 0 1 ${radius * 2 + strokeWidth + 10} ${radius + strokeWidth}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            filter={clampedScore > 70 ? "url(#gaugeGlow)" : undefined}
          />

          {/* Center Needle / Pointer */}
          <g transform={`translate(${radius + strokeWidth + 10}, ${radius + strokeWidth})`}>
            {/* Needle Pivot Center */}
            <circle r="7" fill="#0B0E14" stroke={arcColor} strokeWidth="3" />
            
            {/* Rotating Needle Line */}
            <g
              transform={`rotate(${needleAngle})`}
              className="transition-transform duration-700 ease-out"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2={-radius + 12}
                stroke={arcColor}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <polygon
                points={`-4,-${radius - 20} 4,-${radius - 20} 0,-${radius - 8}`}
                fill={arcColor}
              />
            </g>
          </g>
        </svg>

        {/* Big Score Readout in Center Bottom */}
        <div className="absolute -bottom-2 flex flex-col items-center">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[#E2E8F0] transition-all duration-300">
              {clampedScore}
            </span>
            <span className="text-xs font-mono text-[#64748B]">/100</span>
          </div>
        </div>
      </div>

      {/* Status Badge & Zone labels */}
      <div className="mt-4 flex flex-col items-center gap-1.5 w-full">
        <div className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border font-mono ${badgeColor}`}>
          {clampedScore > 70 ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          ) : clampedScore >= 35 ? (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
          )}
          <span>{statusText}</span>
        </div>

        {showZoneLabels && (
          <div className="flex justify-between w-full max-w-[240px] text-[10px] text-[#64748B] px-2 mt-1 font-mono">
            <span className="text-green-500">0 Safe</span>
            <span className="text-amber-500">35 Elevated</span>
            <span className="text-red-500">70+ Threat</span>
          </div>
        )}
      </div>
    </div>
  );
};
