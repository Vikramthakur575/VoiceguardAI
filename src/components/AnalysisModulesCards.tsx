import React from 'react';
import { AnalysisModuleScore } from '../types';
import { 
  AudioWaveform, 
  Activity, 
  Fingerprint, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface AnalysisModulesCardsProps {
  acoustic: { score: number; details?: string; submetrics?: { label: string; value: string; anomaly: boolean }[] };
  prosody: { score: number; details?: string; submetrics?: { label: string; value: string; anomaly: boolean }[] };
  voiceprint: { score: number; details?: string; submetrics?: { label: string; value: string; anomaly: boolean }[] };
  isActive: boolean;
}

export const AnalysisModulesCards: React.FC<AnalysisModulesCardsProps> = ({
  acoustic,
  prosody,
  voiceprint,
  isActive,
}) => {
  // Acoustic score: higher score = higher synthesis artifact = more dangerous
  const isAcousticCritical = acoustic.score > 70;
  const isAcousticSuspicious = acoustic.score >= 35 && acoustic.score <= 70;

  // Prosody score: Naturalness score (lower = more robotic/fake)
  const isProsodyCritical = prosody.score < 50;
  const isProsodySuspicious = prosody.score >= 50 && prosody.score < 80;

  // Voiceprint match: match % (lower = mismatch against registered voice)
  const isVoiceprintCritical = voiceprint.score < 60;
  const isVoiceprintSuspicious = voiceprint.score >= 60 && voiceprint.score < 85;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Module 1: Acoustic & Spectral Analysis */}
      <div className={`bg-[#0F172A] border rounded-lg p-4 transition-all duration-300 relative overflow-hidden ${
        isAcousticCritical
          ? 'border-red-500/50 shadow-sm'
          : isAcousticSuspicious
          ? 'border-amber-500/40'
          : 'border-[#1E293B]'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${
              isAcousticCritical ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
            }`}>
              <AudioWaveform className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E2E8F0] tracking-tight uppercase">
                Acoustic & Spectral
              </h3>
              <p className="text-[10px] text-[#64748B]">Synthesis Artifact Detection</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            isAcousticCritical
              ? 'bg-red-900/30 text-red-300 border-red-800'
              : isAcousticSuspicious
              ? 'bg-amber-900/30 text-amber-300 border-amber-800'
              : 'bg-green-900/30 text-green-300 border-green-800'
          }`}>
            {isAcousticCritical ? 'SYNTHETIC' : isAcousticSuspicious ? 'IRREGULAR' : 'ORGANIC'}
          </span>
        </div>

        {/* Progress Bar & Numeric Readout */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#64748B]">Synthesis Confidence</span>
            <span className={`font-bold ${isAcousticCritical ? 'text-red-400' : isAcousticSuspicious ? 'text-amber-400' : 'text-green-400'}`}>
              {acoustic.score}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isAcousticCritical ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.max(4, acoustic.score)}%` }}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-1.5 border-t border-[#1E293B] pt-2.5 text-[11px]">
          {acoustic.submetrics?.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-[#64748B]">{m.label}</span>
              <span className={`font-mono text-[10px] font-semibold ${m.anomaly ? 'text-red-400' : 'text-[#E2E8F0]'}`}>
                {m.value}
              </span>
            </div>
          )) || (
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Analyzes phase jitter variance, neural vocoder spectrogram footprint, and high-frequency spectral rolloff.
            </p>
          )}
        </div>
      </div>

      {/* Module 2: Prosody Analysis */}
      <div className={`bg-[#0F172A] border rounded-lg p-4 transition-all duration-300 relative overflow-hidden ${
        isProsodyCritical
          ? 'border-red-500/50 shadow-sm'
          : isProsodySuspicious
          ? 'border-amber-500/40'
          : 'border-[#1E293B]'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${
              isProsodyCritical ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E2E8F0] tracking-tight uppercase">
                Prosody Analysis
              </h3>
              <p className="text-[10px] text-[#64748B]">Naturalness & Cadence</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            isProsodyCritical
              ? 'bg-red-900/30 text-red-300 border-red-800'
              : isProsodySuspicious
              ? 'bg-amber-900/30 text-amber-300 border-amber-800'
              : 'bg-green-900/30 text-green-300 border-green-800'
          }`}>
            {isProsodyCritical ? 'ROBOTIC' : isProsodySuspicious ? 'DEVIANT' : 'HUMAN'}
          </span>
        </div>

        {/* Progress Bar & Readout */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#64748B]">Natural Rhythm Score</span>
            <span className={`font-bold ${isProsodyCritical ? 'text-red-400' : isProsodySuspicious ? 'text-amber-400' : 'text-green-400'}`}>
              {prosody.score}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isProsodyCritical ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.max(4, prosody.score)}%` }}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-1.5 border-t border-[#1E293B] pt-2.5 text-[11px]">
          {prosody.submetrics?.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-[#64748B]">{m.label}</span>
              <span className={`font-mono text-[10px] font-semibold ${m.anomaly ? 'text-red-400' : 'text-[#E2E8F0]'}`}>
                {m.value}
              </span>
            </div>
          )) || (
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Detects inhalation acoustic markers, dynamic pitch variance (F0), and unnatural syllable duration pacing.
            </p>
          )}
        </div>
      </div>

      {/* Module 3: Speaker Voiceprint Match */}
      <div className={`bg-[#0F172A] border rounded-lg p-4 transition-all duration-300 relative overflow-hidden ${
        isVoiceprintCritical
          ? 'border-red-500/50 shadow-sm'
          : isVoiceprintSuspicious
          ? 'border-amber-500/40'
          : 'border-[#1E293B]'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded flex items-center justify-center ${
              isVoiceprintCritical ? 'bg-red-900/30 text-red-400' : 'bg-purple-900/30 text-purple-400'
            }`}>
              <Fingerprint className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#E2E8F0] tracking-tight uppercase">
                Voiceprint Biometrics
              </h3>
              <p className="text-[10px] text-[#64748B]">Enrolled Sample Match</p>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            isVoiceprintCritical
              ? 'bg-red-900/30 text-red-300 border-red-800'
              : isVoiceprintSuspicious
              ? 'bg-amber-900/30 text-amber-300 border-amber-800'
              : 'bg-green-900/30 text-green-300 border-green-800'
          }`}>
            {isVoiceprintCritical ? 'MISMATCH' : isVoiceprintSuspicious ? 'MARGINAL' : 'VERIFIED'}
          </span>
        </div>

        {/* Progress Bar & Readout */}
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#64748B]">Biometric Similarity</span>
            <span className={`font-bold ${isVoiceprintCritical ? 'text-red-400' : isVoiceprintSuspicious ? 'text-amber-400' : 'text-green-400'}`}>
              {voiceprint.score}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0B0E14] rounded-full overflow-hidden border border-[#1E293B]">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isVoiceprintCritical ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.max(4, voiceprint.score)}%` }}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-1.5 border-t border-[#1E293B] pt-2.5 text-[11px]">
          {voiceprint.submetrics?.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-[#64748B]">{m.label}</span>
              <span className={`font-mono text-[10px] font-semibold ${m.anomaly ? 'text-red-400' : 'text-[#E2E8F0]'}`}>
                {m.value}
              </span>
            </div>
          )) || (
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Compares d-vector cosine distance against enrolled KYC voice biometric template stored in bank vault.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
