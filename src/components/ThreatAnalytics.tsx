import React, { useState } from 'react';
import { 
  MOCK_TRENDS_7_DAYS, 
  MOCK_TRENDS_30_DAYS, 
  MOCK_LANGUAGE_DISTRIBUTION, 
  MOCK_ATTACK_VECTORS 
} from '../data/mockData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  IndianRupee, 
  Radio, 
  Zap, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const ThreatAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  const trendData = timeRange === '7d' ? MOCK_TRENDS_7_DAYS : MOCK_TRENDS_30_DAYS;

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#64748b'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 mb-1">
            <PieChartIcon className="w-3.5 h-3.5" />
            <span>Telemetry & Forensic Intelligence</span>
          </div>
          <h2 className="text-lg font-bold text-[#E2E8F0] tracking-tight">
            Voice Clone Threat & Dialect Analytics
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Aggregated intelligence across 248,000+ monitored banking calls and telecom media sessions.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center bg-[#0B0E14] p-1 rounded border border-[#1E293B] text-xs">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1 rounded font-semibold font-mono transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
              timeRange === '7d' ? 'bg-blue-600 text-white shadow-sm' : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded font-semibold font-mono transition-all cursor-pointer uppercase tracking-wider text-[11px] ${
              timeRange === '30d' ? 'bg-blue-600 text-white shadow-sm' : 'text-[#64748B] hover:text-[#E2E8F0]'
            }`}
          >
            Past 30 Days
          </button>
        </div>
      </div>

      {/* Primary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Flagged Call Threat Trends (7 cols) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm text-[#E2E8F0] uppercase tracking-wider">
                Flagged Voice Clone Intercept Trends ({timeRange === '7d' ? 'Daily' : 'Weekly'})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-800 font-bold">
              100% Intercept Rate
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="threatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#E2E8F0',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="flaggedThreats"
                  name="Flagged Voice Clones"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#threatGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="avgRisk"
                  name="Avg Risk Score (/100)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#riskGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#1E293B] text-center">
            <div className="bg-[#0B0E14] p-2.5 rounded border border-[#1E293B]">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-mono">Total Threats Caught</span>
              <span className="font-mono text-sm font-bold text-red-400">142 Intercepts</span>
            </div>
            <div className="bg-[#0B0E14] p-2.5 rounded border border-[#1E293B]">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-mono">Prevented Fraud Loss</span>
              <span className="font-mono text-sm font-bold text-amber-400">₹8.42 Crores</span>
            </div>
            <div className="bg-[#0B0E14] p-2.5 rounded border border-[#1E293B]">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-mono">Avg Response Time</span>
              <span className="font-mono text-sm font-bold text-blue-400">18.4ms</span>
            </div>
          </div>
        </div>

        {/* Right: Attack Vector Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm text-[#E2E8F0] uppercase tracking-wider">
                Voice Clone Engine Attack Vectors
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">Fingerprinted</span>
          </div>

          <div className="space-y-3 pt-1">
            {MOCK_ATTACK_VECTORS.map((vec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#E2E8F0]">{vec.name}</span>
                  <span className="font-mono text-blue-400 font-bold">{vec.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0
                        ? 'bg-red-500'
                        : idx === 1
                        ? 'bg-amber-500'
                        : idx === 2
                        ? 'bg-blue-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${vec.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#0B0E14] rounded border border-[#1E293B] text-[11px] text-[#94A3B8] space-y-1">
            <span className="font-bold text-[#E2E8F0] flex items-center gap-1 font-mono text-[10px] uppercase">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Key Observation:
            </span>
            <p>
              Zero-shot diffusion TTS clones (e.g. ElevenLabs v2 / XTTS) account for nearly half of targeted attacks against high-net-worth customer lines.
            </p>
          </div>
        </div>
      </div>

      {/* Lower Section: Indian Language & Accent Breakdown */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-[#E2E8F0] uppercase tracking-wider">
              Indian Language & Regional Dialect Breakdown (Smart India Hackathon Focus)
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-blue-900/30 text-blue-300 px-2.5 py-0.5 rounded border border-blue-800 font-bold">
            8 Indic Language Models Deployed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {MOCK_LANGUAGE_DISTRIBUTION.map((lang, idx) => (
            <div
              key={idx}
              className="bg-[#0B0E14] border border-[#1E293B] rounded p-3.5 space-y-2 hover:border-[#334155] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#E2E8F0]">{lang.name}</span>
                <span className="font-mono text-xs text-blue-400 font-semibold">{lang.value}%</span>
              </div>

              <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${lang.value * 2}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] pt-1">
                <span>{lang.count}</span>
                <span className="text-red-400 font-bold">Threat: {lang.threatRate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
