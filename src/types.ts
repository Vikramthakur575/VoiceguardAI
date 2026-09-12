export type TabType = 'overview' | 'simulation' | 'explainability' | 'analytics' | 'settings';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface AnalysisModuleScore {
  name: string;
  score: number; // 0 to 100
  status: 'normal' | 'suspicious' | 'critical';
  details: string;
  weight: number;
  submetrics: { label: string; value: string; anomaly: boolean }[];
}

export interface ContextSignals {
  callerReputation: 'clean' | 'suspicious_carrier' | 'spoofed_sim_swap';
  carrierName: string;
  originatingCircle: string; // e.g. "Mumbai, MH (Jio 5G)"
  requestTypeDetected: string; // e.g. "Immediate Wire Transfer (₹4,50,000)"
  urgencyDetected: boolean;
  knownContactMatch: boolean;
  enrolledVoiceprintAge: string;
  deviceFingerprint: string;
  spoofingConfidence: number;
}

export interface TimelineEvent {
  timestamp: string;
  seconds: number;
  riskScore: number;
  transcriptSnippet: string;
  triggerEvent?: string;
  anomalyDetected?: string;
}

export interface CallScenario {
  id: string;
  name: string;
  category: 'genuine' | 'clone_fraud' | 'clone_noisy';
  callerId: string;
  callerName: string;
  accountNumber: string;
  channel: string;
  description: string;
  finalRiskScore: number;
  finalRiskLevel: RiskLevel;
  durationSec: number;
  steps: {
    second: number;
    riskScore: number;
    transcript: string;
    speaker: 'Caller' | 'Agent / IVR';
    acousticScore: number; // Synthesis artifact confidence (higher = more fake)
    prosodyScore: number; // Naturalness score (lower = less natural / more robotic)
    voiceprintMatchScore: number; // Match against registered voiceprint (lower = voice doesn't match)
    triggerNote?: string;
    alertActive?: boolean;
  }[];
  acousticDetails: AnalysisModuleScore;
  prosodyDetails: AnalysisModuleScore;
  voiceprintDetails: AnalysisModuleScore;
  contextSignals: ContextSignals;
  recommendedAction: string;
  forensicSummary: string;
}

export interface CallRecord {
  id: string;
  callerId: string;
  callerName: string;
  accountNumber: string;
  timestamp: string;
  duration: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: 'In Progress' | 'Flagged & Blocked' | 'Verified Genuine' | 'Escalated to SOC';
  language: string;
  channel: string;
  attackVector?: string;
  scenarioId?: string;
}

export interface SystemStats {
  callsMonitoredToday: number;
  threatsFlagged: number;
  averageRiskScore: number;
  detectionAccuracy: number;
  threatsBlockedValueInr: string;
  avgLatencyMs: number;
}

export interface IntegrationSettings {
  apiKey: string;
  webhookUrl: string;
  latencyBudgetMs: number;
  onDeviceInference: boolean;
  multilingualIndianAccents: boolean;
  alertChannels: {
    sms: boolean;
    email: boolean;
    push: boolean;
    siemWebhook: boolean;
  };
  sensitivityThreshold: number;
  selectedLanguages: string[];
}
