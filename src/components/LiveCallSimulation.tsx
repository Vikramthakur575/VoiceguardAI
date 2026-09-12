import React, { useState, useEffect, useRef } from 'react';
import { CallScenario, TabType } from '../types';
import { DEMO_SCENARIOS } from '../data/mockData';
import { RiskGauge } from './RiskGauge';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';
import { AnalysisModulesCards } from './AnalysisModulesCards';
import { ContextSignalsPanel } from './ContextSignalsPanel';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  ShieldAlert, 
  PhoneCall, 
  PhoneOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileSearch,
  MessageSquare,
  Volume2
} from 'lucide-react';

interface LiveCallSimulationProps {
  setCurrentTab: (tab: TabType) => void;
  setSelectedScenarioForDetail: (scenario: CallScenario) => void;
  soundEnabled: boolean;
}

export const LiveCallSimulation: React.FC<LiveCallSimulationProps> = ({
  setCurrentTab,
  setSelectedScenarioForDetail,
  soundEnabled,
}) => {
  // Current active scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-clone-fraud');
  const scenario = DEMO_SCENARIOS.find(s => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  // Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 1.5x, 2x

  // Scores that animate smoothly
  const [displayRiskScore, setDisplayRiskScore] = useState<number>(scenario.steps[0].riskScore);
  const [displayAcousticScore, setDisplayAcousticScore] = useState<number>(scenario.steps[0].acousticScore);
  const [displayProsodyScore, setDisplayProsodyScore] = useState<number>(scenario.steps[0].prosodyScore);
  const [displayVoiceprintScore, setDisplayVoiceprintScore] = useState<number>(scenario.steps[0].voiceprintMatchScore);

  const audioContextRef = useRef<AudioContext | null>(null);

  // Trigger web audio sound beep on alert
  const playAlertSound = (freq = 880, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted
    }
  };

  // Reset when scenario changes
  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setElapsedSeconds(0);
    const newScen = DEMO_SCENARIOS.find(s => s.id === scenarioId) || DEMO_SCENARIOS[0];
    setDisplayRiskScore(newScen.steps[0].riskScore);
    setDisplayAcousticScore(newScen.steps[0].acousticScore);
    setDisplayProsodyScore(newScen.steps[0].prosodyScore);
    setDisplayVoiceprintScore(newScen.steps[0].voiceprintMatchScore);
  };

  const handleStartSimulation = () => {
    if (currentStepIndex >= scenario.steps.length - 1) {
      // restart if reached end
      setCurrentStepIndex(0);
      setElapsedSeconds(0);
    }
    setIsPlaying(true);
    playAlertSound(440, 'triangle');
  };

  const handlePauseSimulation = () => {
    setIsPlaying(false);
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setElapsedSeconds(0);
    setDisplayRiskScore(scenario.steps[0].riskScore);
    setDisplayAcousticScore(scenario.steps[0].acousticScore);
    setDisplayProsodyScore(scenario.steps[0].prosodyScore);
    setDisplayVoiceprintScore(scenario.steps[0].voiceprintMatchScore);
  };

  const handleStepForward = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setElapsedSeconds(scenario.steps[nextIdx].second);
      playAlertSound(520, 'sine');
    }
  };

  // Timer loop for simulation
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1800 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentStepIndex((prevIdx) => {
        if (prevIdx < scenario.steps.length - 1) {
          const nextIdx = prevIdx + 1;
          setElapsedSeconds(scenario.steps[nextIdx].second);
          if (scenario.steps[nextIdx].riskScore > 70) {
            playAlertSound(780, 'sawtooth');
          }
          return nextIdx;
        } else {
          setIsPlaying(false);
          return prevIdx;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, scenario]);

  // Sync scores with current step smoothly
  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];
  useEffect(() => {
    setDisplayRiskScore(currentStep.riskScore);
    setDisplayAcousticScore(currentStep.acousticScore);
    setDisplayProsodyScore(currentStep.prosodyScore);
    setDisplayVoiceprintScore(currentStep.voiceprintMatchScore);
  }, [currentStepIndex, currentStep]);

  const isHighRisk = displayRiskScore > 70;
  const isSimulationFinished = currentStepIndex === scenario.steps.length - 1;

  const handleInspectInExplainability = () => {
    setSelectedScenarioForDetail(scenario);
    setCurrentTab('explainability');
  };

  return (
    <div className="space-y-5">
      {/* Top Controls & Scenario Selector Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Scenario Dropdown & Info */}
        <div className="flex-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1.5 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3 h-3 text-blue-400" />
            Select Preset Demo Scenario
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
            <select
              value={selectedScenarioId}
              onChange={(e) => handleScenarioChange(e.target.value)}
              className="bg-[#0B0E14] border border-[#334155] text-[#E2E8F0] text-xs font-semibold rounded px-3 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-auto min-w-[320px] cursor-pointer font-sans"
            >
              {DEMO_SCENARIOS.map((scen) => (
                <option key={scen.id} value={scen.id}>
                  {scen.category === 'clone_fraud' ? '🔴' : scen.category === 'clone_noisy' ? '🟠' : '🟢'}{' '}
                  {scen.name}
                </option>
              ))}
            </select>

            <span className="text-xs text-[#94A3B8]">
              Target: <strong className="text-[#E2E8F0]">{scenario.callerName}</strong> ({scenario.accountNumber})
            </span>
          </div>
        </div>

        {/* Right: Playback Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {isPlaying ? (
            <button
              onClick={handlePauseSimulation}
              className="flex items-center gap-2 bg-amber-900/30 hover:bg-amber-900/40 text-amber-300 border border-amber-800 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Stream</span>
            </button>
          ) : (
            <button
              onClick={handleStartSimulation}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isSimulationFinished ? 'Replay Live Call' : 'Simulate Call'}</span>
            </button>
          )}

          <button
            onClick={handleStepForward}
            disabled={isPlaying || isSimulationFinished}
            className="flex items-center gap-1.5 bg-[#1E293B] hover:bg-[#334155] disabled:opacity-40 disabled:pointer-events-none text-[#E2E8F0] border border-[#334155] px-3 py-2 rounded text-xs font-semibold transition-all cursor-pointer uppercase tracking-wider"
            title="Step to next second"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Step</span>
          </button>

          <button
            onClick={handleResetSimulation}
            className="p-2 bg-[#1E293B] hover:bg-[#334155] text-[#94A3B8] hover:text-white border border-[#334155] rounded text-xs transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-[#0B0E14] border border-[#1E293B] rounded p-0.5 text-[11px] font-mono">
            {[1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  playbackSpeed === spd ? 'bg-blue-600/30 text-blue-400 font-bold border border-blue-800' : 'text-[#64748B] hover:text-[#E2E8F0]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Centerpiece Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Waveform Visualizer + Live Transcript + Action (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Audio Waveform */}
          <AudioWaveformVisualizer
            isActive={isPlaying || currentStepIndex > 0}
            riskScore={displayRiskScore}
            speaker={currentStep.speaker}
            currentSecond={elapsedSeconds}
            anomalyDetected={currentStep.triggerNote}
          />

          {/* Live Transcript & Real-Time Dialogue Box */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-[#E2E8F0] uppercase tracking-wider">
                  Live Stream Transcript & Utterance Timeline
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                Step {currentStepIndex + 1} of {scenario.steps.length}
              </span>
            </div>

            {/* Transcript Snippets List */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {scenario.steps.slice(0, currentStepIndex + 1).map((step, idx) => {
                const isLatest = idx === currentStepIndex;
                const isCaller = step.speaker === 'Caller';

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded text-xs transition-all ${
                      isLatest
                        ? isCaller && step.riskScore > 70
                          ? 'bg-red-950/40 border border-red-500/40 text-red-100 shadow-sm'
                          : 'bg-blue-950/30 border border-blue-500/30 text-blue-100'
                        : 'bg-[#0B0E14] border border-[#1E293B] text-[#94A3B8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold font-mono text-[11px] ${
                          isCaller ? 'text-blue-400' : 'text-slate-400'
                        }`}>
                          {step.speaker}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          +{step.second}s
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        step.riskScore > 70
                          ? 'bg-red-900/30 text-red-400 border border-red-800'
                          : step.riskScore >= 35
                          ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
                          : 'bg-green-900/30 text-green-400 border border-green-800'
                      }`}>
                        Risk: {step.riskScore}/100
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed font-sans">{step.transcript}</p>

                    {step.triggerNote && (
                      <div className="mt-1.5 pt-1.5 border-t border-[#1E293B] text-[11px] text-amber-300/90 flex items-start gap-1 font-mono">
                        <span className="text-amber-400 font-bold">⚡ Inference:</span>
                        <span>{step.triggerNote}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Risk Gauge + Live Caller Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-time Risk Score Gauge */}
          <RiskGauge score={displayRiskScore} size="lg" />

          {/* Caller Details Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="font-bold text-[#E2E8F0] uppercase tracking-wider text-[11px]">Active Inbound Intercept</span>
              <span className="font-mono text-blue-400 text-[11px]">{scenario.channel}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-[#64748B]">Caller ID:</span>
                <div className="font-mono font-semibold text-[#E2E8F0]">{scenario.callerId}</div>
              </div>
              <div>
                <span className="text-[#64748B]">Customer Identity:</span>
                <div className="font-semibold text-[#E2E8F0] truncate">{scenario.callerName}</div>
              </div>
              <div>
                <span className="text-[#64748B]">Account Tag:</span>
                <div className="font-mono text-[#94A3B8]">{scenario.accountNumber}</div>
              </div>
              <div>
                <span className="text-[#64748B]">Call Category:</span>
                <div className="font-semibold capitalize text-[#94A3B8]">
                  {scenario.category.replace('_', ' ')}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] bg-[#0B0E14] p-2.5 rounded border border-[#1E293B] leading-relaxed">
              {scenario.description}
            </p>
          </div>
        </div>
      </div>

      {/* Red Alert Banner When Threshold Crossed (>70) */}
      {isHighRisk && (
        <div className="bg-[#0F172A] border-2 border-red-500 rounded-lg p-4 shadow-xl animate-pulse-danger flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded bg-red-500 flex items-center justify-center text-slate-950 shrink-0 font-bold">
              <ShieldAlert className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-red-400 tracking-tight">
                  ⚠ CRITICAL ALERT: HIGH RISK OF VOICE CLONING DETECTED (Score: {displayRiskScore}/100)
                </h4>
                <span className="bg-red-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Zero-Day Intercept
                </span>
              </div>
              <p className="text-xs text-red-200 mt-0.5">
                Recommended Action: <strong className="text-white underline">{scenario.recommendedAction}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handleInspectInExplainability}
              className="flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-all shadow-md active:scale-95 cursor-pointer w-full md:w-auto uppercase tracking-wider"
            >
              <FileSearch className="w-4 h-4" />
              <span>Explain Why Flagged</span>
            </button>
          </div>
        </div>
      )}

      {/* Genuine Verified Banner when complete & safe */}
      {!isHighRisk && isSimulationFinished && scenario.category === 'genuine' && (
        <div className="bg-[#0F172A] border border-green-500/50 rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-green-500/20 text-green-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-green-400">
                Call Biometrically Verified Genuine (Score: {displayRiskScore}/100)
              </h4>
              <p className="text-xs text-[#94A3B8]">
                All 3 acoustic layers match human biological parameters. Safe to process transaction.
              </p>
            </div>
          </div>
          <button
            onClick={handleInspectInExplainability}
            className="text-xs text-blue-400 hover:text-white flex items-center gap-1 underline cursor-pointer"
          >
            <span>View Full Biometric Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Three Live Analysis Modules */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
            Multi-Layer Deepfake Forensic Engine (Progressive Evaluation)
          </h3>
          <span className="text-[10px] font-mono text-[#64748B]">
            Acoustic • Prosody • Biometric Vector
          </span>
        </div>

        <AnalysisModulesCards
          acoustic={{
            score: displayAcousticScore,
            details: scenario.acousticDetails.details,
            submetrics: scenario.acousticDetails.submetrics,
          }}
          prosody={{
            score: displayProsodyScore,
            details: scenario.prosodyDetails.details,
            submetrics: scenario.prosodyDetails.submetrics,
          }}
          voiceprint={{
            score: displayVoiceprintScore,
            details: scenario.voiceprintDetails.details,
            submetrics: scenario.voiceprintDetails.submetrics,
          }}
          isActive={isPlaying || currentStepIndex > 0}
        />
      </div>

      {/* Context Signals Panel */}
      <ContextSignalsPanel
        signals={scenario.contextSignals}
        riskScore={displayRiskScore}
      />
    </div>
  );
};
