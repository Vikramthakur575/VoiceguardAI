import React, { useState } from 'react';
import { CallRecord, CallScenario, SystemStats, TabType } from '../types';
import { StatCards } from './StatCards';
import { MOCK_ACTIVE_CALLS, DEMO_SCENARIOS } from '../data/mockData';
import { 
  PhoneCall, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileSearch, 
  Radio, 
  Search, 
  Filter, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Globe, 
  Layers
} from 'lucide-react';

interface OverviewDashboardProps {
  stats: SystemStats;
  setCurrentTab: (tab: TabType) => void;
  setSelectedScenarioForDetail: (scenario: CallScenario) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  stats,
  setCurrentTab,
  setSelectedScenarioForDetail,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'genuine' | 'elevated'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCalls = MOCK_ACTIVE_CALLS.filter((call) => {
    // Filter matching
    if (filterType === 'flagged' && call.riskLevel !== 'high') return false;
    if (filterType === 'genuine' && call.riskLevel !== 'low') return false;
    if (filterType === 'elevated' && call.riskLevel !== 'medium') return false;

    // Search matching
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        call.callerId.toLowerCase().includes(q) ||
        call.callerName.toLowerCase().includes(q) ||
        call.accountNumber.toLowerCase().includes(q) ||
        call.language.toLowerCase().includes(q) ||
        call.channel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRowClick = (call: CallRecord) => {
    // If has associated demo scenario, select it
    if (call.scenarioId) {
      const found = DEMO_SCENARIOS.find((s) => s.id === call.scenarioId);
      if (found) {
        setSelectedScenarioForDetail(found);
      }
    } else {
      // Default to the first scenario adapted
      setSelectedScenarioForDetail(DEMO_SCENARIOS[0]);
    }
    setCurrentTab('explainability');
  };

  const handleSimulateCall = (call: CallRecord) => {
    if (call.scenarioId) {
      const found = DEMO_SCENARIOS.find((s) => s.id === call.scenarioId);
      if (found) {
        setSelectedScenarioForDetail(found);
      }
    }
    setCurrentTab('simulation');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / SIH Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F172A] p-5 rounded-lg border border-[#1E293B] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-900/40 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold border border-blue-800 uppercase tracking-widest flex items-center gap-1">
              <Radio className="w-3 h-3 text-blue-400 animate-pulse" />
              Live Enterprise Defense System
            </span>
            <span className="text-[#64748B] text-xs font-mono">• 24x7 Real-time Intercept</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E2E8F0] tracking-tight uppercase">
            VoiceGuard AI — Real-Time Voice Clone Detection
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-3xl">
            Protecting banking IVR, call centers, and telecom signaling from AI-generated deepfake voice clones, 
            SIM-swap impersonation, and real-time voice conversion attacks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('simulation')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Launch Live Call Demo</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <StatCards stats={stats} />

      {/* Active Calls Section */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg overflow-hidden shadow-sm">
        {/* Table Header & Controls */}
        <div className="p-4 bg-[#0F172A] border-b border-[#1E293B] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#E2E8F0]">
              Live Intercept & Active Calls Stream
            </h3>
            <span className="text-[10px] font-mono bg-[#1E293B] text-[#94A3B8] px-2 py-0.5 rounded border border-[#334155]">
              {filteredCalls.length} Active Feeds
            </span>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Caller ID, Name, Account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#334155] rounded px-3 pl-8 py-1.5 text-xs text-[#E2E8F0] placeholder-[#64748B] focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center bg-[#0B0E14] p-0.5 rounded border border-[#1E293B] text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] font-semibold ${
                  filterType === 'all' ? 'bg-blue-600/30 text-blue-400 border border-blue-800' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('flagged')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
                  filterType === 'flagged' ? 'bg-red-900/30 text-red-400 border border-red-800' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Flagged
              </button>
              <button
                onClick={() => setFilterType('elevated')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
                  filterType === 'elevated' ? 'bg-amber-900/30 text-amber-400 border border-amber-800' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Elevated
              </button>
              <button
                onClick={() => setFilterType('genuine')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-[11px] font-semibold flex items-center gap-1 ${
                  filterType === 'genuine' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Verified
              </button>
            </div>
          </div>
        </div>

        {/* Calls Feed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0E14] text-[#64748B] font-mono text-[10px] uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-3 px-4">Caller Identification</th>
                <th className="py-3 px-3">Account & Channel</th>
                <th className="py-3 px-3">Language / Circle</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-sans">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748B] text-xs">
                    No calls match your search filter.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => {
                  const isHigh = call.riskLevel === 'high';
                  const isMed = call.riskLevel === 'medium';
                  const isLow = call.riskLevel === 'low';

                  return (
                    <tr
                      key={call.id}
                      onClick={() => handleRowClick(call)}
                      className={`hover:bg-[#161F33] transition-colors cursor-pointer group ${
                        isHigh ? 'bg-red-950/20' : ''
                      }`}
                    >
                      {/* Caller Identification */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                            isHigh
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                              : isMed
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-green-500/10 text-green-400 border border-green-500/30'
                          }`}>
                            {isHigh ? (
                              <ShieldAlert className="w-4 h-4" />
                            ) : isMed ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#E2E8F0] group-hover:text-blue-400 transition-colors">
                              {call.callerName}
                            </div>
                            <div className="font-mono text-[11px] text-[#94A3B8] flex items-center gap-1.5">
                              <span>{call.callerId}</span>
                              <span className="text-[#334155]">•</span>
                              <span className="text-[10px] text-[#64748B]">{call.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Account & Channel */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono text-[#E2E8F0] text-[11px]">{call.accountNumber}</div>
                        <div className="text-[11px] text-[#94A3B8]">{call.channel}</div>
                      </td>

                      {/* Language & Dialect */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5 text-[#E2E8F0]">
                          <Globe className="w-3 h-3 text-blue-400 shrink-0" />
                          <span>{call.language}</span>
                        </div>
                        {call.attackVector && (
                          <span className="inline-block mt-0.5 text-[10px] font-mono text-red-400 bg-red-900/30 px-1.5 py-0.2 rounded border border-red-800">
                            {call.attackVector}
                          </span>
                        )}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-3 font-mono text-[#94A3B8] text-[11px]">
                        <Clock className="w-3 h-3 text-[#64748B] inline mr-1" />
                        {call.duration}
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold text-sm ${
                            isHigh ? 'text-red-500' : isMed ? 'text-amber-400' : 'text-green-500'
                          }`}>
                            {call.riskScore}
                          </span>
                          <div className="w-16 h-1.5 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
                            <div
                              className={`h-full rounded-full ${
                                isHigh
                                  ? 'bg-red-500'
                                  : isMed
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                              }`}
                              style={{ width: `${call.riskScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          isHigh
                            ? 'bg-red-900/30 text-red-400 border-red-800'
                            : isMed
                            ? 'bg-amber-900/30 text-amber-400 border-amber-800'
                            : 'bg-green-900/30 text-green-400 border-green-800'
                        }`}>
                          {call.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {call.scenarioId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSimulateCall(call);
                              }}
                              className="px-2 py-1 rounded bg-[#1E293B] hover:bg-blue-600 hover:text-white text-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider transition-all border border-[#334155]"
                              title="Re-simulate this exact call"
                            >
                              Simulate
                            </button>
                          )}
                          <button
                            onClick={() => handleRowClick(call)}
                            className="p-1.5 rounded text-[#94A3B8] group-hover:text-blue-400 hover:bg-[#1E293B] transition-colors"
                            title="Inspect Voiceprints & Explainability"
                          >
                            <FileSearch className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
