import React from 'react';
import { SystemStats } from '../types';
import { 
  PhoneIncoming, 
  ShieldAlert, 
  Gauge, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  IndianRupee 
} from 'lucide-react';

interface StatCardsProps {
  stats: SystemStats;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Calls Monitored */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg">
        <div className="text-[#64748B] text-[10px] uppercase tracking-wider mb-1 font-semibold">
          Calls Monitored Today
        </div>
        <div className="text-2xl font-bold font-mono text-[#E2E8F0] tracking-tight">
          {stats.callsMonitoredToday.toLocaleString()}
        </div>
        <div className="text-green-500 text-[10px] mt-1 font-mono flex items-center gap-1">
          <TrendingUp className="w-3 h-3" /> +14% from yesterday
        </div>
      </div>

      {/* Card 2: Threats Flagged */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg">
        <div className="text-[#64748B] text-[10px] uppercase tracking-wider mb-1 font-semibold">
          Threats Flagged
        </div>
        <div className="text-2xl font-bold font-mono text-red-500 tracking-tight">
          {stats.threatsFlagged}
        </div>
        <div className="text-red-400 text-[10px] mt-1 font-mono">
          4 Critical Alerts Today
        </div>
      </div>

      {/* Card 3: Average Risk Score */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg">
        <div className="text-[#64748B] text-[10px] uppercase tracking-wider mb-1 font-semibold">
          Avg. Risk Score
        </div>
        <div className="text-2xl font-bold font-mono text-[#E2E8F0] tracking-tight">
          {stats.averageRiskScore}
          <span className="text-sm text-[#64748B] font-normal ml-1 font-sans">/100</span>
        </div>
        <div className="text-blue-500 text-[10px] mt-1 font-mono">
          Nominal Operating Range
        </div>
      </div>

      {/* Card 4: Detection Accuracy */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg">
        <div className="text-[#64748B] text-[10px] uppercase tracking-wider mb-1 font-semibold">
          Detection Accuracy
        </div>
        <div className="text-2xl font-bold font-mono text-green-500 tracking-tight">
          {stats.detectionAccuracy}%
        </div>
        <div className="text-green-500 text-[10px] mt-1 font-mono">
          Validated by ML Core
        </div>
      </div>
    </div>
  );
};
