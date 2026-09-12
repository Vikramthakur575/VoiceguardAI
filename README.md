# VoiceGuard AI 🛡️
### Real-Time Zero-Day Voice Clone & Impersonation Attack Prevention Platform
*Smart India Hackathon 2026 | Problem Statement SIH260104*

VoiceGuard AI is a multi-signal, sub-20ms neural audio forensic and active fraud prevention platform designed to detect and intercept synthetic voice clones (e.g. ElevenLabs, XTTS-v2, VALL-E) and replay attacks before unauthorized financial transactions or account takeovers occur.

---

## 🚀 Key Features

- **Multi-Layer AI Forensic Engine**:
  - **RawNet3**: Time-domain Sinc-convolution analysis for vocoder phase discontinuities and high-frequency spectral artifacts (6kHz–8kHz).
  - **WavLM**: Self-supervised micro-prosody analysis detecting absence of organic pulmonary inhalation reflexes.
  - **ECAPA-TDNN**: 192-dimensional d-vector biometric speaker verification with cosine similarity matching against enrolled customer voiceprints.
- **Explainable Multi-Signal Risk Score (0–100)**: Transparent weighted formulation combining acoustic, biometric, prosodic, telecom carrier, NLP social engineering, and cross-session historical deviation metrics.
- **Active Fraud Interception & Step-Up MFA**: Real-time automated Core Banking API freeze triggers (`FRAUD_VOICE_CLONE_STOP`), out-of-band callbacks, mobile push MFA challenges, and active randomized sentence liveness reflex traps.
- **Privacy-by-Design & DPDP Act 2023 Compliance**: Zero-retention ephemeral audio stream processing with AES-256-GCM encrypted mathematical d-vectors.
- **Interactive SOC Suite**: Live call interception simulator, forensic voice spectrum analyzer, attack comparison lab, and biometric vault.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Recharts, Lucide React
- **Audio & DSP**: Web Audio API (AnalyserNode, BiquadFilterNode, 2048 FFT bins, G.711 / GSM 8kHz narrowband simulation)
- **Tooling & Build**: Vite, Node.js

---

## 📦 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or pnpm / yarn

### 2. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/voiceguard-ai.git
cd voiceguard-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables Setup
Copy the example environment file:
```bash
cp .env.example .env
```
*(Note: Never commit your real `.env` file containing private API keys or secrets to GitHub.)*

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🔒 Security & Privacy Notice

- **No Secrets in Repo**: All secrets and credentials should be provided via `.env` files (which are ignored by `.gitignore`).
- **Privacy-by-Design**: Raw audio buffers are processed in ephemeral memory and discarded immediately post-feature extraction.

---

## 📜 License

This project is licensed under the MIT License.
