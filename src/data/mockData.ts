import { CallScenario, CallRecord, SystemStats, IntegrationSettings } from '../types';

export const INITIAL_SYSTEM_STATS: SystemStats = {
  callsMonitoredToday: 248912,
  threatsFlagged: 142,
  averageRiskScore: 14.2,
  detectionAccuracy: 99.4,
  threatsBlockedValueInr: '₹8.42 Cr',
  avgLatencyMs: 18.4,
};

export const DEMO_SCENARIOS: CallScenario[] = [
  {
    id: 'scenario-clone-fraud',
    name: 'Cloned Voice — High Urgency Wire Fraud (CEO Clone)',
    category: 'clone_fraud',
    callerId: '+91 98201 44321',
    callerName: 'Vikramaditya Singhania (MD, Apex Logistics)',
    accountNumber: 'HDFC-CORP-992014',
    channel: 'Priority Banking Direct Inbound',
    description: 'AI-generated deepfake voice cloned from public YouTube executive address. Caller urges immediate ₹48,50,000 RTGS dispatch citing acquisition penalty deadline.',
    finalRiskScore: 94,
    finalRiskLevel: 'high',
    durationSec: 18,
    steps: [
      {
        second: 2,
        riskScore: 18,
        transcript: "Hello, this is Vikramaditya. I need an urgent RTGS approval for our vendor.",
        speaker: 'Caller',
        acousticScore: 32,
        prosodyScore: 82,
        voiceprintMatchScore: 78,
        triggerNote: 'Initial carrier handshake OK. Audio phase jitter under baseline.'
      },
      {
        second: 5,
        riskScore: 42,
        transcript: "Yes sir, please confirm the beneficiary account details for verification.",
        speaker: 'Agent / IVR',
        acousticScore: 35,
        prosodyScore: 80,
        voiceprintMatchScore: 75,
        triggerNote: 'Customer response buffer initialized. High-frequency rolloff detected at 7.8kHz.'
      },
      {
        second: 8,
        riskScore: 71,
        transcript: "Transfer forty-eight lakhs fifty thousand immediately to M/S Vertex Infra! I am in a board meeting, skip the OTP!",
        speaker: 'Caller',
        acousticScore: 88,
        prosodyScore: 41,
        voiceprintMatchScore: 46,
        triggerNote: 'ALERT: Neural vocoder diffusion artifact detected in formant transitions F1-F2.',
        alertActive: true
      },
      {
        second: 12,
        riskScore: 89,
        transcript: "Sir, corporate compliance requires biometric token confirmation on the registered device.",
        speaker: 'Agent / IVR',
        acousticScore: 89,
        prosodyScore: 39,
        voiceprintMatchScore: 38,
        triggerNote: 'Micro-prosody unnaturalness: zero natural breath intake prior to 22-syllable burst.'
      },
      {
        second: 16,
        riskScore: 94,
        transcript: "I don't have access to that phone right now! Override it or we lose the contract today!",
        speaker: 'Caller',
        acousticScore: 96,
        prosodyScore: 28,
        voiceprintMatchScore: 31,
        triggerNote: 'CRITICAL: Voiceprint d-vector cosine distance > 0.69. High confidence synthetic clone (ElevenLabs/XTTS model profile).',
        alertActive: true
      }
    ],
    acousticDetails: {
      name: 'Acoustic & Spectral Analysis',
      score: 96,
      status: 'critical',
      details: 'High-frequency phase discontinuities and characteristic neural vocoder artifact signature (diffusion noise floor at 14kHz-16kHz).',
      weight: 0.40,
      submetrics: [
        { label: 'Neural Vocoder Footprint', value: '98.2% synthetic match', anomaly: true },
        { label: 'Phase Jitter Variance', value: '4.8x baseline threshold', anomaly: true },
        { label: 'Spectral Tilt Anomaly', value: 'Abnormal rolloff at 7.8kHz', anomaly: true }
      ]
    },
    prosodyDetails: {
      name: 'Prosody & Micro-Rhythm Analysis',
      score: 84, // Suspicion score
      status: 'critical',
      details: 'Robotic cadence during high-urgency claim; absence of biological subglottal pressure variation and synthetic phoneme elongation.',
      weight: 0.30,
      submetrics: [
        { label: 'Phonetic Duration Naturalness', value: '31% (Monotone pacing)', anomaly: true },
        { label: 'Inhalation Acoustic Marker', value: '0 breathing pauses detected', anomaly: true },
        { label: 'Pitch Micro-Tremor (F0)', value: 'Synthetic mathematical curve', anomaly: true }
      ]
    },
    voiceprintDetails: {
      name: 'Speaker Voiceprint Biometric Match',
      score: 31, // Biometric similarity (low = fake)
      status: 'critical',
      details: 'Severe mismatch against enrolled 2024 voice biometric token. Cosine similarity 0.31 vs 0.85 genuine threshold.',
      weight: 0.30,
      submetrics: [
        { label: 'Enrolled Voiceprint Match', value: '31.4% (Threshold: 85%)', anomaly: true },
        { label: 'Formant Dispersion Distance', value: 'Δ 2.41 Bark', anomaly: true },
        { label: 'Enrolled Voice Token Date', value: 'Active (Updated Jan 2024)', anomaly: false }
      ]
    },
    contextSignals: {
      callerReputation: 'spoofed_sim_swap',
      carrierName: 'Virtual Roaming Gateway / Unknown Asterisk SIP',
      originatingCircle: 'New Delhi (Origin IP: Routed via Proxy)',
      requestTypeDetected: 'Urgent Wire Transfer (₹48,50,000) + Bypass 2FA',
      urgencyDetected: true,
      knownContactMatch: false,
      enrolledVoiceprintAge: '14 months (HDFC Core KYC Vault)',
      deviceFingerprint: 'VoIP Softswitch (Unrecognized IMSI)',
      spoofingConfidence: 94.7
    },
    recommendedAction: 'IMMEDIATE STEP-UP / BLOCK: Terminate transaction. Route outbound call to registered SIM device + escalate to Fraud Desk.',
    forensicSummary: 'Synthesized voice clone generated using modern zero-shot TTS model targeting corporate executive voiceprint. Real-time inference intercepted transfer before authorization.'
  },
  {
    id: 'scenario-genuine-call',
    name: 'Genuine Call — Standard Retail Banking Inquiry',
    category: 'genuine',
    callerId: '+91 94480 12890',
    callerName: 'Dr. Priya Nambiar',
    accountNumber: 'SBI-PREM-440192',
    channel: 'Toll-Free Interactive IVR Assist',
    description: 'Enrolled priority customer calling to activate international roaming and check fixed deposit renewal rates.',
    finalRiskScore: 6,
    finalRiskLevel: 'low',
    durationSec: 15,
    steps: [
      {
        second: 2,
        riskScore: 8,
        transcript: "Good morning, I wanted to inquire about my term deposit maturity date.",
        speaker: 'Caller',
        acousticScore: 5,
        prosodyScore: 95,
        voiceprintMatchScore: 92,
        triggerNote: 'Natural glottal pulse verified. Cellular GSM full-rate codec authenticated.'
      },
      {
        second: 6,
        riskScore: 7,
        transcript: "Certainly Dr. Nambiar. I can pull up your account linked to your registered Airtel mobile.",
        speaker: 'Agent / IVR',
        acousticScore: 4,
        prosodyScore: 96,
        voiceprintMatchScore: 94,
        triggerNote: 'Voiceprint d-vector matches historical baseline with 94.2% confidence.'
      },
      {
        second: 10,
        riskScore: 6,
        transcript: "Also, could you help me enable international card transactions for my upcoming trip to Singapore?",
        speaker: 'Caller',
        acousticScore: 5,
        prosodyScore: 94,
        voiceprintMatchScore: 95,
        triggerNote: 'Acoustic micro-inflections, natural inhalation pause (240ms) detected.'
      },
      {
        second: 14,
        riskScore: 6,
        transcript: "The international card limit is enabled. Is there anything else I can assist with today?",
        speaker: 'Agent / IVR',
        acousticScore: 5,
        prosodyScore: 95,
        voiceprintMatchScore: 96,
        triggerNote: 'All 3 biometric analysis layers verified authentic. Risk score stable at 6/100.'
      }
    ],
    acousticDetails: {
      name: 'Acoustic & Spectral Analysis',
      score: 4,
      status: 'normal',
      details: 'Clean organic vocal tract harmonics. Consistent glottal pulses and natural ambient room reverberation.',
      weight: 0.40,
      submetrics: [
        { label: 'Neural Vocoder Footprint', value: '0.8% (Organic voice)', anomaly: false },
        { label: 'Phase Jitter Variance', value: 'Nominal biological jitter', anomaly: false },
        { label: 'Spectral Tilt Anomaly', value: 'Natural organic slope (-6dB/oct)', anomaly: false }
      ]
    },
    prosodyDetails: {
      name: 'Prosody & Micro-Rhythm Analysis',
      score: 95, // High naturalness
      status: 'normal',
      details: 'Authentic prosodic flow, dynamic fundamental frequency (F0) contour, natural breath pauses.',
      weight: 0.30,
      submetrics: [
        { label: 'Phonetic Duration Naturalness', value: '96% (Organic pacing)', anomaly: false },
        { label: 'Inhalation Acoustic Marker', value: 'Authentic 240ms pauses', anomaly: false },
        { label: 'Pitch Micro-Tremor (F0)', value: 'Human laryngeal micro-vibrations', anomaly: false }
      ]
    },
    voiceprintDetails: {
      name: 'Speaker Voiceprint Biometric Match',
      score: 96, // High match
      status: 'normal',
      details: 'Strong match against enrolled voiceprint sample (SBI biometrics vault).',
      weight: 0.30,
      submetrics: [
        { label: 'Enrolled Voiceprint Match', value: '96.2% (Enrolled: Bangalore Circle)', anomaly: false },
        { label: 'Formant Dispersion Distance', value: 'Δ 0.08 Bark (Match)', anomaly: false },
        { label: 'Enrolled Voice Token Date', value: 'Active (Updated Aug 2025)', anomaly: false }
      ]
    },
    contextSignals: {
      callerReputation: 'clean',
      carrierName: 'Airtel India LTE (VoLTE Encrypted)',
      originatingCircle: 'Bengaluru, KA (Cell ID: KA-BLR-0941)',
      requestTypeDetected: 'Account Status Inquiry & Card Travel Flag',
      urgencyDetected: false,
      knownContactMatch: true,
      enrolledVoiceprintAge: '6 months (SBI Vault)',
      deviceFingerprint: 'Apple iPhone 15 Pro (Known IMSI/IMEI Match)',
      spoofingConfidence: 1.2
    },
    recommendedAction: 'ALLOW / TRUSTED: No voice anomalies detected. Safe to proceed without stepped-up friction.',
    forensicSummary: 'Biological voice confirmed across all acoustic, prosodic, and enrolled biometric layers. Clean telecom signaling.'
  },
  {
    id: 'scenario-clone-noisy',
    name: 'Cloned Voice — Noisy GSM Line & Pitch Glitch',
    category: 'clone_noisy',
    callerId: '+91 97110 88234',
    callerName: 'Sunil Verma',
    accountNumber: 'ICICI-RET-771890',
    channel: 'Tele-Banking Helpdesk',
    description: 'Adversary uses artificial background street noise overlay to disguise robotic TTS artifacts while requesting account credential reset.',
    finalRiskScore: 82,
    finalRiskLevel: 'high',
    durationSec: 16,
    steps: [
      {
        second: 2,
        riskScore: 24,
        transcript: "Hello, my phone screen broke. I need you to reset my internet banking password now.",
        speaker: 'Caller',
        acousticScore: 48,
        prosodyScore: 65,
        voiceprintMatchScore: 58,
        triggerNote: 'Synthetic noise injection detected: uncorrelated pink noise mixed over vocoder audio.'
      },
      {
        second: 6,
        riskScore: 58,
        transcript: "Sir, I can help with password reset. Let me verify your date of birth and mother's maiden name.",
        speaker: 'Agent / IVR',
        acousticScore: 52,
        prosodyScore: 61,
        voiceprintMatchScore: 54,
        triggerNote: 'Voice conversion artifact: pitch glitch (octave jump) at phoneme /r/.'
      },
      {
        second: 10,
        riskScore: 78,
        transcript: "15th August 1982. Just send the temp pass to my alternate email right away!",
        speaker: 'Caller',
        acousticScore: 84,
        prosodyScore: 46,
        voiceprintMatchScore: 42,
        triggerNote: 'ALERT: Audio spectrogram reveals spectral leakage and phase stitching at 4.2kHz.'
      },
      {
        second: 14,
        riskScore: 82,
        transcript: "Please hold while security protocol evaluates the authorization request.",
        speaker: 'Agent / IVR',
        acousticScore: 86,
        prosodyScore: 42,
        voiceprintMatchScore: 39,
        triggerNote: 'RVC / Voice-Conversion model detected despite synthetic traffic background noise.',
        alertActive: true
      }
    ],
    acousticDetails: {
      name: 'Acoustic & Spectral Analysis',
      score: 86,
      status: 'critical',
      details: 'Synthetic noise mask detected. Adversary attempted masking neural voice artifacts with artificial street ambience.',
      weight: 0.40,
      submetrics: [
        { label: 'Neural Vocoder Footprint', value: '88.4% synthetic match', anomaly: true },
        { label: 'Ambient Sound Phase', value: 'Artificial loop (2.4s period)', anomaly: true },
        { label: 'Pitch Stitching Glitch', value: 'High octave jump anomaly', anomaly: true }
      ]
    },
    prosodyDetails: {
      name: 'Prosody & Micro-Rhythm Analysis',
      score: 72,
      status: 'suspicious',
      details: 'Unnatural syllable transitions and clipped fricative sounds indicative of real-time voice conversion (RVC).',
      weight: 0.30,
      submetrics: [
        { label: 'Phonetic Duration Naturalness', value: '44% (Unnatural speed jumps)', anomaly: true },
        { label: 'Fricative Noise Consistency', value: 'Phase cutoff at /s/, /sh/', anomaly: true },
        { label: 'Pitch Micro-Tremor (F0)', value: 'Staircase quantization', anomaly: true }
      ]
    },
    voiceprintDetails: {
      name: 'Speaker Voiceprint Biometric Match',
      score: 39,
      status: 'critical',
      details: 'Biometric token mismatch. Converted voice shows high centroid shift from Sunil Verma enrolled voice profile.',
      weight: 0.30,
      submetrics: [
        { label: 'Enrolled Voiceprint Match', value: '39.1% (Threshold: 85%)', anomaly: true },
        { label: 'Formant Dispersion Distance', value: 'Δ 1.88 Bark', anomaly: true },
        { label: 'Enrolled Voice Token Date', value: 'Active (Updated Nov 2024)', anomaly: false }
      ]
    },
    contextSignals: {
      callerReputation: 'suspicious_carrier',
      carrierName: 'BSNL GSM / Roaming on Unverified Interconnect',
      originatingCircle: 'Kolkata, WB (Cell ID: WB-KOL-7721)',
      requestTypeDetected: 'Credential Reset + Alternate Email Override',
      urgencyDetected: true,
      knownContactMatch: false,
      enrolledVoiceprintAge: '9 months (ICICI Vault)',
      deviceFingerprint: 'VoIP Client disguised with GSM header',
      spoofingConfidence: 81.4
    },
    recommendedAction: 'BLOCK & CHALLENGE: Do not reset credentials. Trigger Video-KYC or branch visit challenge.',
    forensicSummary: 'Voice conversion tool (RVC v2) blended with looping background audio mask. Neutralized by multi-layer spectral and acoustic decomposition.'
  }
];

export const MOCK_ACTIVE_CALLS: CallRecord[] = [
  {
    id: 'CALL-88219',
    callerId: '+91 98201 44321',
    callerName: 'Vikramaditya Singhania',
    accountNumber: 'HDFC-CORP-992014',
    timestamp: 'Just now',
    duration: '00:18',
    riskScore: 94,
    riskLevel: 'high',
    status: 'Flagged & Blocked',
    language: 'English-IN',
    channel: 'Priority Banking Direct',
    attackVector: 'Zero-shot TTS Clone (ElevenLabs)',
    scenarioId: 'scenario-clone-fraud'
  },
  {
    id: 'CALL-88218',
    callerId: '+91 94480 12890',
    callerName: 'Dr. Priya Nambiar',
    accountNumber: 'SBI-PREM-440192',
    timestamp: '1 min ago',
    duration: '01:42',
    riskScore: 6,
    riskLevel: 'low',
    status: 'Verified Genuine',
    language: 'Tamil / English',
    channel: 'Toll-Free IVR Assist',
    scenarioId: 'scenario-genuine-call'
  },
  {
    id: 'CALL-88217',
    callerId: '+91 97110 88234',
    callerName: 'Sunil Verma',
    accountNumber: 'ICICI-RET-771890',
    timestamp: '4 mins ago',
    duration: '00:46',
    riskScore: 82,
    riskLevel: 'high',
    status: 'Flagged & Blocked',
    language: 'Hindi (Delhi Circle)',
    channel: 'Tele-Banking Desk',
    attackVector: 'Real-time Voice Conversion (RVC)',
    scenarioId: 'scenario-clone-noisy'
  },
  {
    id: 'CALL-88216',
    callerId: '+91 98199 55012',
    callerName: 'Meera Deshmukh',
    accountNumber: 'AXIS-RET-310928',
    timestamp: '8 mins ago',
    duration: '02:14',
    riskScore: 12,
    riskLevel: 'low',
    status: 'Verified Genuine',
    language: 'Marathi / English',
    channel: 'Mobile App Call-In'
  },
  {
    id: 'CALL-88215',
    callerId: '+91 99001 77319',
    callerName: 'Ananya Reddy',
    accountNumber: 'KOTAK-WM-882390',
    timestamp: '12 mins ago',
    duration: '00:32',
    riskScore: 64,
    riskLevel: 'medium',
    status: 'Escalated to SOC',
    language: 'Telugu / English',
    channel: 'Wealth Desk Direct',
    attackVector: 'Suspected Pitch Shift & Deepfake Jitter'
  },
  {
    id: 'CALL-88214',
    callerId: '+91 98300 22119',
    callerName: 'Aarav Mukherjee',
    accountNumber: 'PNB-CORP-102948',
    timestamp: '17 mins ago',
    duration: '03:05',
    riskScore: 8,
    riskLevel: 'low',
    status: 'Verified Genuine',
    language: 'Bengali / English',
    channel: 'Commercial Banking Line'
  },
  {
    id: 'CALL-88213',
    callerId: '+91 93240 66192',
    callerName: 'Unknown Spoofed ID',
    accountNumber: 'BOB-RET-990145',
    timestamp: '25 mins ago',
    duration: '00:19',
    riskScore: 98,
    riskLevel: 'high',
    status: 'Flagged & Blocked',
    language: 'Hindi (Bhopal Accent)',
    channel: 'Automated Loan Inbound',
    attackVector: 'TTS Deepfake + SIM Swap Attack'
  },
  {
    id: 'CALL-88212',
    callerId: '+91 98450 11982',
    callerName: 'Karthik Raman',
    accountNumber: 'CANARA-RET-339012',
    timestamp: '32 mins ago',
    duration: '01:15',
    riskScore: 9,
    riskLevel: 'low',
    status: 'Verified Genuine',
    language: 'Kannada / English',
    channel: 'Retail Banking Helpdesk'
  }
];

export const MOCK_TRENDS_7_DAYS = [
  { day: 'Mon', totalCalls: 32400, flaggedThreats: 18, avgRisk: 12.4, blockedAmountLakhs: 42.5 },
  { day: 'Tue', totalCalls: 34100, flaggedThreats: 22, avgRisk: 14.1, blockedAmountLakhs: 78.0 },
  { day: 'Wed', totalCalls: 36800, flaggedThreats: 29, avgRisk: 15.8, blockedAmountLakhs: 114.2 },
  { day: 'Thu', totalCalls: 35200, flaggedThreats: 25, avgRisk: 13.9, blockedAmountLakhs: 92.0 },
  { day: 'Fri', totalCalls: 38900, flaggedThreats: 34, avgRisk: 16.7, blockedAmountLakhs: 158.4 },
  { day: 'Sat', totalCalls: 29400, flaggedThreats: 19, avgRisk: 13.2, blockedAmountLakhs: 64.1 },
  { day: 'Sun', totalCalls: 24200, flaggedThreats: 14, avgRisk: 11.8, blockedAmountLakhs: 38.6 }
];

export const MOCK_TRENDS_30_DAYS = [
  { day: 'W1', totalCalls: 215000, flaggedThreats: 112, avgRisk: 13.2, blockedAmountLakhs: 480 },
  { day: 'W2', totalCalls: 228000, flaggedThreats: 134, avgRisk: 14.8, blockedAmountLakhs: 610 },
  { day: 'W3', totalCalls: 241000, flaggedThreats: 158, avgRisk: 15.6, blockedAmountLakhs: 795 },
  { day: 'W4', totalCalls: 248912, flaggedThreats: 142, avgRisk: 14.2, blockedAmountLakhs: 842 }
];

export const MOCK_LANGUAGE_DISTRIBUTION = [
  { name: 'Hindi & Dialects', value: 38, count: '94,586 calls', threatRate: '1.4%' },
  { name: 'English (Indian Accent)', value: 26, count: '64,717 calls', threatRate: '1.8%' },
  { name: 'Hinglish (Code-switched)', value: 14, count: '34,847 calls', threatRate: '2.1%' },
  { name: 'Tamil', value: 7, count: '17,423 calls', threatRate: '0.8%' },
  { name: 'Telugu', value: 6, count: '14,934 calls', threatRate: '0.9%' },
  { name: 'Marathi', value: 4, count: '9,956 calls', threatRate: '0.7%' },
  { name: 'Bengali', value: 3, count: '7,467 calls', threatRate: '1.1%' },
  { name: 'Kannada & Others', value: 2, count: '4,978 calls', threatRate: '0.6%' }
];

export const MOCK_ATTACK_VECTORS = [
  { name: 'Zero-shot Diffusion TTS (ElevenLabs v2/v3)', percentage: 48, severity: 'High' },
  { name: 'Real-time Voice Conversion (RVC / So-VITS)', percentage: 27, severity: 'High' },
  { name: 'Replay Attack + Noise Masking', percentage: 14, severity: 'Medium' },
  { name: 'Formant Pitch Shift & Parametric Vocoding', percentage: 11, severity: 'Medium' }
];

export const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  apiKey: 'YOUR_VOICEGUARD_API_KEY_HERE',
  webhookUrl: 'https://soc.hdfcbank.internal/api/v1/voiceguard/webhook',
  latencyBudgetMs: 25,
  onDeviceInference: true,
  multilingualIndianAccents: true,
  alertChannels: {
    sms: true,
    email: true,
    push: true,
    siemWebhook: true
  },
  sensitivityThreshold: 70,
  selectedLanguages: ['Hindi', 'English-IN', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada']
};
