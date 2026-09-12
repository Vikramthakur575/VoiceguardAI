import React, { useState } from 'react';
import { TabType, CallScenario, SystemStats } from './types';
import { INITIAL_SYSTEM_STATS, DEMO_SCENARIOS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { LiveCallSimulation } from './components/LiveCallSimulation';
import { CallDetailExplainability } from './components/CallDetailExplainability';
import { ThreatAnalytics } from './components/ThreatAnalytics';
import { SettingsIntegration } from './components/SettingsIntegration';
import { ShieldCheck, ShieldAlert, Sparkles, Radio, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<SystemStats>(INITIAL_SYSTEM_STATS);
  const [selectedScenarioForDetail, setSelectedScenarioForDetail] = useState<CallScenario>(DEMO_SCENARIOS[0]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E2E8F0] flex flex-col selection:bg-blue-500/30 selection:text-blue-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isSimulating={currentTab === 'simulation'}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'overview' && (
          <OverviewDashboard
            stats={stats}
            setCurrentTab={setCurrentTab}
            setSelectedScenarioForDetail={setSelectedScenarioForDetail}
          />
        )}

        {currentTab === 'simulation' && (
          <LiveCallSimulation
            setCurrentTab={setCurrentTab}
            setSelectedScenarioForDetail={setSelectedScenarioForDetail}
            soundEnabled={soundEnabled}
          />
        )}

        {currentTab === 'explainability' && (
          <CallDetailExplainability
            scenario={selectedScenarioForDetail}
            setCurrentTab={setCurrentTab}
            setSelectedScenarioForDetail={setSelectedScenarioForDetail}
          />
        )}

        {currentTab === 'analytics' && <ThreatAnalytics />}

        {currentTab === 'settings' && <SettingsIntegration />}
      </main>

      {/* Footer with Compliance & Hackathon Credentials */}
      <footer className="border-t border-[#1E293B] bg-[#0F172A] py-5 px-4 sm:px-8 mt-12 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-[#E2E8F0]">VoiceGuard AI Platform</span>
            <span className="text-[#334155]">•</span>
            <span className="text-[#94A3B8]">Smart India Hackathon Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#64748B] font-mono">
            <span>RBI Cyber Security Framework Compliant</span>
            <span className="text-[#334155]">•</span>
            <span>Zero-Retention Ephemeral Processing</span>
            <span className="text-[#334155]">•</span>
            <span className="text-blue-400">SOC Build 1.2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
