import React, { useState } from 'react';
import { CallScenario, TabType } from '../types';
import { DEMO_SCENARIOS } from '../data/mockData';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  FileText, 
  PhoneCall, 
  Clock, 
  Activity, 
  AudioWaveform, 
  Fingerprint, 
  CheckCircle2, 
  Layers, 
  Share2, 
  Check, 
  Send,
  Zap,
  Sparkles
} from 'lucide-react';

interface CallDetailExplainabilityProps {
  scenario: CallScenario;
  setCurrentTab: (tab: TabType) => void;
  setSelectedScenarioForDetail: (scenario: CallScenario) => void;
}

export const CallDetailExplainability: React.FC<CallDetailExplainabilityProps> = ({
  scenario,
  setCurrentTab,
  setSelectedScenarioForDetail,
}) => {
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [siemPushed, setSiemPushed] = useState<boolean>(false);

  const isHighRisk = scenario.finalRiskScore > 70;
  const isSuspicious = scenario.finalRiskScore >= 35 && scenario.finalRiskScore <= 70;

  // Calculate explainability weights
  // Acoustic: synthesis anomaly score (higher = bad)
  // Prosody: naturalness deficiency (100 - score = bad)
  // Voiceprint: match deficiency (100 - score = bad)
  const acousticWeightScore = scenario.acousticDetails.score;
  const prosodyDeficiency = 100 - scenario.prosodyDetails.score;
  const voiceprintDeficiency = 100 - scenario.voiceprintDetails.score;

  const totalDeficiency = acousticWeightScore * 0.4 + prosodyDeficiency * 0.3 + voiceprintDeficiency * 0.3;

  const acousticContribution = totalDeficiency > 0 ? Math.round(((acousticWeightScore * 0.4) / totalDeficiency) * 100) : 33;
  const prosodyContribution = totalDeficiency > 0 ? Math.round(((prosodyDeficiency * 0.3) / totalDeficiency) * 100) : 33;
  const voiceprintContribution = totalDeficiency > 0 ? Math.round(((voiceprintDeficiency * 0.3) / totalDeficiency) * 100) : 34;

  const handleCopyReport = () => {
    const reportJson = {
      incidentId: `VG-INC-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      scenario: scenario.name,
      callerId: scenario.callerId,
      customerAccount: scenario.accountNumber,
      finalRiskScore: `${scenario.finalRiskScore}/100`,
      riskLevel: scenario.finalRiskLevel,
      recommendedAction: scenario.recommendedAction,
      analysisLayers: {
        acousticSynthesisScore: `${scenario.acousticDetails.score}%`,
        prosodyNaturalnessScore: `${scenario.prosodyDetails.score}%`,
        biometricVoiceprintMatch: `${scenario.voiceprintDetails.score}%`,
      },
      contextSignals: scenario.contextSignals,
      forensicSummary: scenario.forensicSummary,
      complianceNote: "VoiceGuard AI complies with RBI Cyber Security Framework & DPDP Act 2023. Audio processed in ephemeral volatile memory."
    };

    navigator.clipboard.writeText(JSON.stringify(reportJson, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const handlePushToSiem = () => {
    setSiemPushed(true);
    setTimeout(() => setSiemPushed(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Breadcrumbs & Scenario Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] mb-1">
            <span className="text-blue-400">Forensics & Explainability</span>
            <span>/</span>
            <span>Case ID: VG-INC-88219</span>
            <span>/</span>
            <span className="text-[#E2E8F0] font-semibold">{scenario.callerName}</span>
          </div>
          <h2 className="text-lg font-bold text-[#E2E8F0] tracking-tight flex items-center gap-2">
            <span>Call Forensic & Risk Explainability Audit</span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold border ${
              isHighRisk
                ? 'bg-red-900/30 text-red-400 border-red-800'
                : isSuspicious
                ? 'bg-amber-900/30 text-amber-300 border-amber-800'
                : 'bg-green-900/30 text-green-300 border-green-800'
            }`}>
              {isHighRisk ? 'HIGH RISK CLONE' : isSuspicious ? 'ELEVATED RISK' : 'AUTHENTIC BIOMETRICS'}
            </span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Scenario Selector */}
          <select
            value={scenario.id}
            onChange={(e) => {
              const found = DEMO_SCENARIOS.find((s) => s.id === e.target.value);
              if (found) setSelectedScenarioForDetail(found);
            }}
            className="bg-[#0B0E14] border border-[#334155] text-[#E2E8F0] text-xs font-mono rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            {DEMO_SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] text-[#E2E8F0] px-3 py-1.5 rounded text-xs font-semibold border border-[#334155] transition-all cursor-pointer uppercase tracking-wider"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{copiedReport ? 'JSON Report Copied!' : 'Export JSON'}</span>
          </button>

          <button
            onClick={handlePushToSiem}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-all shadow-sm cursor-pointer uppercase tracking-wider"
          >
            {siemPushed ? <Check className="w-3.5 h-3.5 text-white" /> : <Send className="w-3.5 h-3.5" />}
            <span>{siemPushed ? 'Dispatched to SIEM' : 'Push to Bank SOC'}</span>
          </button>
        </div>
      </div>

      {/* Main Explainability Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Multi-Layer Contribution Chart & Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Explainability Breakdown Bar Chart */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-[#E2E8F0] uppercase tracking-wider">
                  Visual Explainability: Risk Layer Contribution
                </h3>
              </div>
              <span className="text-[10px] text-[#64748B] font-mono">Weighted Multi-Vector Model</span>
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Why was this call assigned a risk score of <strong className="text-white font-mono">{scenario.finalRiskScore}/100</strong>? 
              The chart below breaks down the relative mathematical contribution of each detection layer to the final fraud classification.
            </p>

            {/* Horizontal Stacked & Layer Bars */}
            <div className="space-y-4 pt-2">
              {/* Layer 1: Acoustic & Spectral */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#E2E8F0]">
                    <AudioWaveform className="w-3.5 h-3.5 text-blue-400" />
                    <span>Layer 1: Acoustic & Spectral Analysis</span>
                  </div>
                  <span className="font-mono text-blue-400 font-bold">
                    {acousticContribution}% Contribution
                  </span>
                </div>
                <div className="w-full h-2 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${acousticContribution}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#64748B] flex items-center justify-between font-mono">
                  <span>Synthesis Confidence: <strong className="text-[#E2E8F0] font-mono">{scenario.acousticDetails.score}%</strong></span>
                  <span>Weight: 40%</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] bg-[#0B0E14] p-2.5 rounded border border-[#1E293B]">
                  {scenario.acousticDetails.details}
                </p>
              </div>

              {/* Layer 2: Prosody & Rhythm */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#E2E8F0]">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Layer 2: Prosody & Micro-Rhythm</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">
                    {prosodyContribution}% Contribution
                  </span>
                </div>
                <div className="w-full h-2 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${prosodyContribution}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#64748B] flex items-center justify-between font-mono">
                  <span>Naturalness Score: <strong className="text-[#E2E8F0] font-mono">{scenario.prosodyDetails.score}%</strong></span>
                  <span>Weight: 30%</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] bg-[#0B0E14] p-2.5 rounded border border-[#1E293B]">
                  {scenario.prosodyDetails.details}
                </p>
              </div>

              {/* Layer 3: Speaker Voiceprint Biometrics */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#E2E8F0]">
                    <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                    <span>Layer 3: Enrolled Voiceprint Match</span>
                  </div>
                  <span className="font-mono text-purple-400 font-bold">
                    {voiceprintContribution}% Contribution
                  </span>
                </div>
                <div className="w-full h-2 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-700"
                    style={{ width: `${voiceprintContribution}%` }}
                  />
                </div>
                <div className="text-[11px] text-[#64748B] flex items-center justify-between font-mono">
                  <span>Biometric Cosine Match: <strong className="text-[#E2E8F0] font-mono">{scenario.voiceprintDetails.score}%</strong> (Threshold 85%)</span>
                  <span>Weight: 30%</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] bg-[#0B0E14] p-2.5 rounded border border-[#1E293B]">
                  {scenario.voiceprintDetails.details}
                </p>
              </div>
            </div>
          </div>

          {/* Forensic Investigation Summary */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E2E8F0] uppercase tracking-wider font-mono">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>SOC Fraud Analyst Executive Summary</span>
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#0B0E14] p-3 rounded border border-[#1E293B]">
              {scenario.forensicSummary}
            </p>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1E293B] text-[#64748B] font-mono">
              <span>Originating Network: <strong className="text-[#E2E8F0]">{scenario.contextSignals.carrierName}</strong></span>
              <span>Circle: <strong className="text-[#E2E8F0]">{scenario.contextSignals.originatingCircle}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Risk Timeline of the Call (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Risk Progression Timeline Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-[#E2E8F0] uppercase tracking-wider">
                  Call Risk Progression Timeline
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">{scenario.durationSec}s Call Length</span>
            </div>

            <p className="text-[11px] text-[#64748B]">
              Step-by-step evolution of the risk score as voice samples and NLP intent tokens were evaluated:
            </p>

            {/* Timeline Vertical Track */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E293B]">
              {scenario.steps.map((step, idx) => {
                const isThreat = step.riskScore > 70;
                const isElevated = step.riskScore >= 35 && step.riskScore <= 70;

                return (
                  <div key={idx} className="relative group">
                    {/* Node Dot */}
                    <div
                      className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#0F172A] ${
                        isThreat
                          ? 'bg-red-500 ring-2 ring-red-500/30'
                          : isElevated
                          ? 'bg-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-green-400 ring-2 ring-green-400/30'
                      }`}
                    />

                    {/* Step Content */}
                    <div className={`p-3 rounded border text-xs transition-all ${
                      isThreat
                        ? 'bg-red-950/30 border-red-500/40 text-[#E2E8F0]'
                        : isElevated
                        ? 'bg-amber-950/20 border-amber-500/30 text-[#CBD5E1]'
                        : 'bg-[#0B0E14] border border-[#1E293B] text-[#94A3B8]'
                    }`}>
                      <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                        <span className="text-blue-400 font-bold">
                          T+{step.second}s ({step.speaker})
                        </span>
                        <span className={`px-1.5 py-0.2 rounded font-bold ${
                          isThreat
                            ? 'bg-red-900/30 text-red-400 border border-red-800'
                            : isElevated
                            ? 'bg-amber-900/30 text-amber-300 border border-amber-800'
                            : 'bg-green-900/30 text-green-300 border border-green-800'
                        }`}>
                          Risk: {step.riskScore}/100
                        </span>
                      </div>

                      <p className="text-xs italic text-[#E2E8F0] font-sans mb-1.5">
                        "{step.transcript}"
                      </p>

                      {step.triggerNote && (
                        <div className="text-[11px] font-mono text-amber-300/90 pt-1 border-t border-[#1E293B] flex items-start gap-1">
                          <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                          <span>{step.triggerNote}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-[#0F172A] border border-blue-500/30 rounded-lg p-4 flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider">Test with Live Interactive Simulator</h4>
              <p className="text-[11px] text-[#64748B]">Play this exact scenario with real-time animated waveforms and sound cues.</p>
            </div>
            <button
              onClick={() => setCurrentTab('simulation')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded text-xs transition-all shrink-0 cursor-pointer uppercase tracking-wider"
            >
              Simulate Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
