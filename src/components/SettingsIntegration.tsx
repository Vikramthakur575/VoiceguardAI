import React, { useState } from 'react';
import { IntegrationSettings } from '../types';
import { DEFAULT_INTEGRATION_SETTINGS } from '../data/mockData';
import { 
  Key, 
  Copy, 
  Check, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Bell, 
  Lock, 
  RefreshCw, 
  Send, 
  Sliders, 
  Server,
  Zap
} from 'lucide-react';

export const SettingsIntegration: React.FC = () => {
  const [settings, setSettings] = useState<IntegrationSettings>(DEFAULT_INTEGRATION_SETTINGS);
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'python' | 'node'>('curl');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [testWebhookStatus, setTestWebhookStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const handleCopyKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setSettings((prev) => ({
      ...prev,
      apiKey: `vg_live_${randomHex}`,
    }));
  };

  const handleTestWebhook = () => {
    setTestWebhookStatus('testing');
    setTimeout(() => {
      setTestWebhookStatus('success');
      setTimeout(() => setTestWebhookStatus('idle'), 3000);
    }, 1200);
  };

  const curlCode = `curl -X POST "https://api.voiceguard.ai/v1/analyze/stream" \\
  -H "Authorization: Bearer ${settings.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "caller_id": "+919820144321",
    "audio_stream_url": "rtp://telecom.gateway.internal:5004",
    "enrolled_voiceprint_id": "VP-HDFC-992014",
    "telecom_circle": "IN-MH-MUMBAI",
    "options": {
      "on_device_inference": ${settings.onDeviceInference},
      "multilingual_indian_models": ${settings.multilingualIndianAccents},
      "alert_webhook": "${settings.webhookUrl}"
    }
  }'`;

  const pythonCode = `import voiceguard

client = voiceguard.Client(
    api_key="${settings.apiKey}",
    inference_mode="${settings.onDeviceInference ? 'edge_on_premise' : 'cloud_hybrid'}"
)

# Intercept live stream from Asterisk / FreeSWITCH / Cisco telephony trunk
stream_session = client.start_stream_analysis(
    caller_id="+919820144321",
    enrolled_profile="VP-HDFC-992014",
    language_pack=["hi-IN", "en-IN", "ta-IN"]
)

# Receive real-time sub-20ms fraud callbacks
@stream_session.on_risk_update
def handle_risk(assessment):
    if assessment.risk_score > ${settings.sensitivityThreshold}:
        print(f"⚠ THREAT: Synthetic clone detected! Score: {assessment.risk_score}")
        client.trigger_sip_step_up_challenge(action="FORCE_OTP_CALLBACK")
`;

  const nodeCode = `import { VoiceGuardClient } from '@voiceguard/sdk';

const guard = new VoiceGuardClient({
  apiKey: '${settings.apiKey}',
  endpoint: 'https://api.voiceguard.ai',
});

// Hook into Banking IVR / Call Center Webhook
app.post('/api/ivr/voice-inspect', async (req, res) => {
  const { callSid, audioChunkBase64, callerPhone } = req.body;

  const result = await guard.inspectChunk({
    callId: callSid,
    callerId: callerPhone,
    audioBuffer: Buffer.from(audioChunkBase64, 'base64'),
    detectRegionalDialects: ${settings.multilingualIndianAccents},
  });

  if (result.isCloneDetected) {
    return res.json({ action: 'TRANSFER_TO_FRAUD_DESK', risk: result.riskScore });
  }
  return res.json({ action: 'CONTINUE_IVR' });
});`;

  const getActiveCode = () => {
    if (activeCodeTab === 'curl') return curlCode;
    if (activeCodeTab === 'python') return pythonCode;
    return nodeCode;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="bg-[#0F172A] border border-[#1E293B] p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer & Enterprise Integration</span>
          </div>
          <h2 className="text-lg font-bold text-[#E2E8F0] tracking-tight">
            Banking Core & Telecom Integration Settings
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Integrate VoiceGuard AI with your SIP trunks, Asterisk PBX, IVR workflows, and SOC SIEM pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-green-900/30 text-green-400 border border-green-800 text-xs px-2.5 py-1 rounded font-mono flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            API v2.4 Live & Operational
          </span>
        </div>
      </div>

      {/* Grid: Left Settings & Toggles, Right SDK Code Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API Keys & Configuration Toggles (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* API Key Management Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0] font-mono">
                  Production API Key
                </h3>
              </div>
              <button
                onClick={handleRegenerateKey}
                className="text-[11px] text-[#64748B] hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer font-mono uppercase"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Roll Key</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value={settings.apiKey}
                className="bg-[#0B0E14] border border-[#334155] rounded px-3 py-2 font-mono text-xs text-blue-300 w-full focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="bg-[#1E293B] hover:bg-[#334155] text-[#E2E8F0] px-3 py-2 rounded text-xs font-semibold border border-[#334155] transition-all flex items-center gap-1 shrink-0 cursor-pointer uppercase tracking-wider font-mono"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#64748B]">
              Authenticated for enterprise rate limits (10,000 concurrent SIP audio streams).
            </p>
          </div>

          {/* Webhook & SIEM Dispatch */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0] font-mono">
                  SOC SIEM Alert Webhook URL
                </h3>
              </div>
              <button
                onClick={handleTestWebhook}
                disabled={testWebhookStatus === 'testing'}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold font-mono flex items-center gap-1 cursor-pointer uppercase"
              >
                {testWebhookStatus === 'testing' ? (
                  <span>Sending Test...</span>
                ) : testWebhookStatus === 'success' ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 200 OK Received
                  </span>
                ) : (
                  <span>Test Ping</span>
                )}
              </button>
            </div>

            <input
              type="text"
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              className="bg-[#0B0E14] border border-[#334155] rounded px-3 py-2 font-mono text-xs text-[#E2E8F0] w-full focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Toggle Switches Configuration */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1E293B]">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#E2E8F0] font-mono">
                Inference & Detection Engine Toggles
              </h3>
            </div>

            {/* Toggle 1: On-Device Inference */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#E2E8F0] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span>On-Device / Edge Gateway Inference</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Process audio on local bank media gateway for ultra-low sub-20ms latency and maximum data sovereignty.
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, onDeviceInference: !settings.onDeviceInference })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.onDeviceInference ? 'bg-blue-600' : 'bg-[#334155]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    settings.onDeviceInference ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Multilingual Indian Accents */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1E293B]">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[#E2E8F0] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-green-400" />
                  <span>Multilingual Detection (Indian Accents & Dialects)</span>
                </div>
                <p className="text-[11px] text-[#64748B]">
                  Activates specialized acoustic phonetic embeddings trained on Hindi, Tamil, Telugu, Bengali, Kannada, and Hinglish.
                </p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, multilingualIndianAccents: !settings.multilingualIndianAccents })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  settings.multilingualIndianAccents ? 'bg-green-600' : 'bg-[#334155]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    settings.multilingualIndianAccents ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Alert Channels */}
            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <div className="text-xs font-bold text-[#E2E8F0] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px] uppercase tracking-wider">Automated Intercept Alert Channels</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { key: 'sms', label: 'SMS OTP' },
                  { key: 'email', label: 'Email Desk' },
                  { key: 'push', label: 'Bank App Push' },
                  { key: 'siemWebhook', label: 'SOC SIEM' },
                ].map((item) => {
                  const isChecked = settings.alertChannels[item.key as keyof typeof settings.alertChannels];
                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          alertChannels: {
                            ...settings.alertChannels,
                            [item.key]: !isChecked,
                          },
                        })
                      }
                      className={`px-2.5 py-1.5 rounded border text-xs font-semibold font-mono transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-blue-900/40 border-blue-600 text-blue-300'
                          : 'bg-[#0B0E14] border-[#1E293B] text-[#64748B]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Privacy & Compliance Highlight Box */}
          <div className="bg-[#0B0E14] border border-green-800/50 rounded-lg p-4 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-green-900/30 text-green-400 flex items-center justify-center shrink-0 mt-0.5 border border-green-800">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-green-300 uppercase tracking-wider font-mono">
                Data Privacy & Compliance Architecture (DPDP & RBI Guidelines)
              </h4>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                Voice data processed on-device. Not stored beyond session. Only cryptographic voiceprint hashes 
                and spectral anomaly metadata are retained for forensic audit. Fully compliant with Digital Personal Data Protection (DPDP) Act 2023.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Code Snippet & REST / WebSocket Examples (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
            {/* Snippet Header */}
            <div className="p-3 bg-[#0B0E14] border-b border-[#1E293B] flex items-center justify-between">
              {/* Language Tabs */}
              <div className="flex items-center gap-1">
                {[
                  { id: 'curl', label: 'cURL / REST' },
                  { id: 'python', label: 'Python SDK' },
                  { id: 'node', label: 'Node.js' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveCodeTab(t.id as any)}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all cursor-pointer uppercase tracking-wider ${
                      activeCodeTab === t.id
                        ? 'bg-[#1E293B] text-blue-400 border border-blue-500/30'
                        : 'text-[#64748B] hover:text-[#E2E8F0]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Copy Snippet */}
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[11px] text-[#E2E8F0] hover:text-white px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#334155] border border-[#334155] transition-colors cursor-pointer font-mono uppercase"
              >
                {copiedCode ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 bg-[#0B0E14] font-mono text-xs leading-relaxed text-[#CBD5E1] overflow-x-auto flex-1 select-all">
              <pre className="text-blue-300/90">
                <code>{getActiveCode()}</code>
              </pre>
            </div>

            {/* Integration Note */}
            <div className="p-3 bg-[#0F172A] border-t border-[#1E293B] text-[11px] text-[#64748B] flex items-center justify-between">
              <span>Supports SIP RTP, Twilio Media Streams & WebRTC</span>
              <span className="text-blue-400 font-mono font-bold">Latency SLA: &lt; 20ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
