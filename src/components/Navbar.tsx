import React from 'react';
import { TabType } from '../types';
import { 
  ShieldAlert, 
  Activity, 
  PhoneCall, 
  PieChart, 
  Settings, 
  Radio, 
  Zap, 
  Sparkles,
  Volume2,
  VolumeX,
  FileSearch
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  isSimulating: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isSimulating,
  soundEnabled,
  setSoundEnabled,
}) => {
  return (
    <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-40">
      {/* Top telemetry bar */}
      <div className="px-4 lg:px-6 py-1 bg-[#0B0E14] border-b border-[#1E293B] flex flex-wrap items-center justify-between text-xs text-[#94A3B8]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono text-green-500 font-bold uppercase tracking-wider text-[10px]">
              SYSTEM ONLINE
            </span>
          </div>
          <span className="text-[#334155] hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1.5 text-[#64748B] font-mono text-[11px]">
            <span>Uptime: 99.98%</span>
            <span>•</span>
            <span className="text-blue-400">Sub-20ms ML Inference Engine</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-blue-900/40 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" />
            FinTech & Telecom Track • SIH 2026
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1 text-[#94A3B8] hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-[#1E293B]"
            title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] text-blue-400 font-mono">Audio FX</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#64748B]" />
                <span className="text-[11px] text-[#64748B] font-mono">Muted</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="h-14 px-4 lg:px-6 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-[#E2E8F0] flex items-center gap-1">
              VOICEGUARD <span className="text-blue-500 font-black">AI</span>
            </h1>
            <span className="text-[10px] bg-blue-900/40 text-blue-400 border border-blue-800 px-2 py-0.5 rounded uppercase tracking-widest font-mono">
              PROTOTYPE V1.2
            </span>
          </div>
        </div>

        {/* Navigation Links / Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 h-full">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`h-14 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'overview'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Monitoring</span>
          </button>

          <button
            onClick={() => setCurrentTab('simulation')}
            className={`h-14 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer relative ${
              currentTab === 'simulation'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Simulation</span>
            {isSimulating && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-0.5"></span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('explainability')}
            className={`h-14 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'explainability'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Voiceprints</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`h-14 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'analytics'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setCurrentTab('settings')}
            className={`h-14 px-3 flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer ${
              currentTab === 'settings'
                ? 'border-b-2 border-blue-500 text-white font-semibold'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Integrations</span>
          </button>
        </nav>

        {/* Quick Simulator CTA */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            onClick={() => setCurrentTab('simulation')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Simulate Call</span>
          </button>
        </div>
      </div>
    </header>
  );
};
