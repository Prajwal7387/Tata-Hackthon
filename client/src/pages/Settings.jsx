import React, { useState, useEffect } from 'react';

export default function Settings() {
  const [voiceBack, setVoiceBack] = useState(() => localStorage.getItem('voiceBack') !== 'false');
  const [micThreshold, setMicThreshold] = useState(() => Number(localStorage.getItem('micThreshold')) || 40);
  const [ollamaUrl, setOllamaUrl] = useState(() => localStorage.getItem('ollamaUrl') || 'http://localhost:11434');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('selectedModel') || 'phi3:mini');
  const [showNotify, setShowNotify] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('voiceBack', voiceBack);
    localStorage.setItem('micThreshold', micThreshold);
    localStorage.setItem('ollamaUrl', ollamaUrl);
    localStorage.setItem('selectedModel', selectedModel);
    setShowNotify(true);
    setTimeout(() => setShowNotify(false), 3000);
  };

  return (
    <div className="max-w-2xl bg-industrial-panel border border-industrial-border p-5 rounded-ind space-y-6">
      <div className="border-b border-industrial-border pb-2 flex justify-between items-center">
        <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase">
          Edge Hardware & Model Settings
        </h3>
        {showNotify && (
          <span className="text-[10px] font-mono text-industrial-success bg-industrial-success/15 border border-industrial-success px-2 py-0.5 rounded uppercase font-bold animate-pulse">
            Settings Applied
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs font-mono">
        {/* Toggle Voice readbacks */}
        <div className="flex items-center justify-between p-3 bg-industrial-bg border border-industrial-border rounded-ind">
          <div>
            <span className="text-white block font-bold">SPEECH FEEDBACK SYNTHESIS</span>
            <span className="text-[10px] text-industrial-textMuted mt-0.5 block">Speak voice confirmations upon parsed commands</span>
          </div>
          <button
            type="button"
            onClick={() => setVoiceBack(!voiceBack)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors relative ${voiceBack ? 'bg-industrial-amber' : 'bg-industrial-steel'}`}
          >
            <div className={`w-5 h-5 bg-industrial-bg border border-industrial-border rounded-full transition-transform ${voiceBack ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* Input sliders */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-industrial-textMuted uppercase">Microphone Trigger Gate</span>
            <span className="text-white font-bold">{micThreshold}%</span>
          </div>
          <input
            type="range" min="10" max="100" value={micThreshold} onChange={(e) => setMicThreshold(e.target.value)}
            className="w-full h-1 bg-industrial-bg rounded-lg appearance-none cursor-pointer accent-industrial-amber"
          />
        </div>

        {/* Local Ollama settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Local Ollama URI</label>
            <input
              type="text" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} required
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            />
          </div>
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">NLP Inference Model</label>
            <select
              value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            >
              <option value="phi3:mini">Phi-3 Mini (3.8B)</option>
              <option value="gemma:2b">Gemma 2B (Default)</option>
              <option value="gemma:7b">Gemma 7B (High Spec)</option>
            </select>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="p-3 bg-industrial-bg border border-industrial-border rounded-ind space-y-2">
          <span className="text-white font-bold block uppercase text-[10px]">Active Voice Recognition Stack</span>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-industrial-textMuted">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-success"></span>
              <span>Web Speech API (Online mode)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-industrial-success"></span>
              <span>Vosk WASM Engine (Offline fallback)</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-industrial-amber hover:bg-industrial-amberHover text-industrial-bg font-bold rounded-ind uppercase transition-colors"
        >
          Commit Config
        </button>
      </form>
    </div>
  );
}
