import React from 'react';
import { ContextSignals } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  PhoneForwarded, 
  FileText, 
  Smartphone, 
  MapPin, 
  Zap, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface ContextSignalsPanelProps {
  signals: ContextSignals;
  riskScore: number;
}

export const ContextSignalsPanel: React.FC<ContextSignalsPanelProps> = ({
  signals,
  riskScore,
}) => {
  const isHighRisk = riskScore > 70;
  const isSuspicious = riskScore >= 35 && riskScore <= 70;

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E293B]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-900/30 border border-blue-800 flex items-center justify-center text-blue-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#E2E8F0] tracking-tight uppercase">
              Telecom & Contextual Risk Signals
            </h3>
            <p className="text-[10px] text-[#64748B]">
              Layer-2 Metadata, Signaling & NLP Intent Fusion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-[#64748B]">Spoofing Index:</span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            signals.spoofingConfidence > 75
              ? 'bg-red-900/30 text-red-400 border border-red-800'
              : signals.spoofingConfidence > 30
              ? 'bg-amber-900/30 text-amber-300 border border-amber-800'
              : 'bg-green-900/30 text-green-300 border border-green-800'
          }`}>
            {signals.spoofingConfidence}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Signal 1: Caller Number Reputation */}
        <div className="bg-[#0B0E14] border border-[#1E293B] rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#64748B] mb-1">
            <PhoneForwarded className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-[10px] uppercase tracking-wider font-mono">Carrier & Signaling</span>
          </div>
          <div>
            <div className="font-semibold text-[#E2E8F0] truncate">{signals.carrierName}</div>
            <div className="text-[11px] text-[#64748B] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#64748B]" />
              <span>{signals.originatingCircle}</span>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
            <span className="text-[#64748B]">Signaling Status:</span>
            <span className={`font-semibold font-mono ${
              signals.callerReputation === 'clean' ? 'text-green-400' : 'text-red-400'
            }`}>
              {signals.callerReputation === 'clean' ? 'STIR/SHAKEN Verified' : 'Spoofed SIP Gateway'}
            </span>
          </div>
        </div>

        {/* Signal 2: Request Intent Detected */}
        <div className={`bg-[#0B0E14] border rounded p-2.5 flex flex-col justify-between ${
          signals.urgencyDetected ? 'border-amber-500/40' : 'border-[#1E293B]'
        }`}>
          <div className="flex items-center gap-1.5 text-[#64748B] mb-1">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-[10px] uppercase tracking-wider font-mono">Intent & NLP Extraction</span>
          </div>
          <div>
            <div className="font-semibold text-[#E2E8F0] leading-snug">
              {signals.requestTypeDetected}
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
            <span className="text-[#64748B]">Urgency Stress:</span>
            <span className={`font-semibold px-1 rounded font-mono ${
              signals.urgencyDetected ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-[#1E293B] text-[#94A3B8]'
            }`}>
              {signals.urgencyDetected ? 'High Pressure Demand' : 'Normal Pacing'}
            </span>
          </div>
        </div>

        {/* Signal 3: Hardware / Device Fingerprint */}
        <div className="bg-[#0B0E14] border border-[#1E293B] rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#64748B] mb-1">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-[10px] uppercase tracking-wider font-mono">Device & IMSI Match</span>
          </div>
          <div>
            <div className="font-semibold text-[#E2E8F0] truncate font-mono text-[11px]">{signals.deviceFingerprint}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5">Hardware Signature</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
            <span className="text-[#64748B]">Known Device:</span>
            <span className={`font-semibold font-mono ${
              signals.knownContactMatch ? 'text-green-400' : 'text-red-400'
            }`}>
              {signals.knownContactMatch ? 'Enrolled SIM / Device' : 'Unregistered Intercept'}
            </span>
          </div>
        </div>

        {/* Signal 4: Biometric Token Status */}
        <div className="bg-[#0B0E14] border border-[#1E293B] rounded p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[#64748B] mb-1">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold text-[10px] uppercase tracking-wider font-mono">Biometric Vault Profile</span>
          </div>
          <div>
            <div className="font-semibold text-[#E2E8F0]">{signals.enrolledVoiceprintAge}</div>
            <div className="text-[10px] text-[#64748B] mt-0.5 font-mono">Profile Hash: 0x9f8...2b</div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-[#1E293B] flex items-center justify-between text-[10px]">
            <span className="text-[#64748B]">Vault Health:</span>
            <span className="text-green-400 font-semibold font-mono">Active & Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
