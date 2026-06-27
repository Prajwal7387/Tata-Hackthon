import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-industrial-bg text-industrial-text font-sans flex flex-col justify-between">
      {/* Top Banner */}
      <header className="border-b border-industrial-border bg-industrial-panel h-16 flex items-center justify-between px-6 md:px-12">
        <span className="font-mono text-xl font-bold tracking-wider text-industrial-amber">VOICEEDGE_AI</span>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="px-4 py-2 border border-industrial-amber text-industrial-amber hover:bg-industrial-amber hover:text-industrial-bg rounded-ind font-mono text-sm tracking-wide font-bold transition-all"
        >
          LAUNCH CONSOLE
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-industrial-amber bg-industrial-steel px-3 py-1 rounded-full uppercase">
            EDGE AI AT THE FACTORY FLOOR
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-4 text-white leading-tight uppercase font-mono">
            Hands-Free Voice Navigation For Industrial Systems
          </h2>
          <p className="text-industrial-textMuted mt-4 max-w-lg leading-relaxed text-sm md:text-base">
            VoiceEdge AI is an offline Edge-powered HMI interface. Control dashboards, check machine status, raise maintenance orders, and access manuals without lifting a finger. Built for safety, speed, and absolute autonomy.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="px-6 py-3.5 bg-industrial-amber text-industrial-bg rounded-ind font-mono text-sm font-bold tracking-wide hover:bg-industrial-amberHover transition-all flex items-center justify-center space-x-2"
            >
              <span>ACCESS WORKSPACE CONSOLE</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Visual Assistant Illustration */}
        <div className="flex justify-center">
          <div className="bg-industrial-panel p-6 rounded-ind border border-industrial-border max-w-sm w-full relative">
            <div className="flex items-center justify-between pb-4 border-b border-industrial-border">
              <span className="font-mono text-xs text-industrial-textMuted">SYSTEM_STATE: MONITORING</span>
              <span className="w-2.5 h-2.5 rounded-full bg-industrial-success animate-pulse"></span>
            </div>
            {/* Custom Soundwave/Gear Illustration */}
            <div className="h-48 my-6 flex items-center justify-center space-x-1.5 bg-industrial-bg rounded-ind border border-industrial-border relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                <svg className="w-36 h-36 animate-spin text-industrial-text" style={{ animationDuration: '20s' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12c0,0.31,0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                </svg>
              </div>
              {[4, 8, 5, 12, 16, 10, 6, 8, 14, 20, 16, 10, 6, 12, 4].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-industrial-amber rounded-full opacity-80"
                  style={{
                    height: `${h * 6}px`,
                    animation: `pulse 1.2s infinite ease-in-out alternate`,
                    animationDelay: `${i * 0.08}s`
                  }}
                ></div>
              ))}
            </div>
            <div className="text-center font-mono text-xs text-industrial-text mt-4">
              "OPEN SAFETY MANUAL"
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grids */}
      <section className="bg-industrial-panel border-t border-industrial-border py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-industrial-bg p-6 rounded-ind border border-industrial-border">
            <span className="text-industrial-amber font-mono font-bold text-lg">01 / HANDS-FREE NAVIGATION</span>
            <h3 className="text-white text-base font-bold mt-2 uppercase font-mono">Operator Safety Oriented</h3>
            <p className="text-industrial-textMuted text-xs mt-2 leading-relaxed">
              No keyboards or mice needed. Operators execute navigation and submit reporting using verbal commands, keeping hands on machinery and safety equipment.
            </p>
          </div>
          <div className="bg-industrial-bg p-6 rounded-ind border border-industrial-border">
            <span className="text-industrial-amber font-mono font-bold text-lg">02 / LOCAL EDGE AI</span>
            <h3 className="text-white text-base font-bold mt-2 uppercase font-mono">Zero Internet Reliance</h3>
            <p className="text-industrial-textMuted text-xs mt-2 leading-relaxed">
              Uses local models via Ollama (Phi-3) and Vosk offline voice recognition. Operation is immune to network dropouts and cloud latency bottlenecks.
            </p>
          </div>
          <div className="bg-industrial-bg p-6 rounded-ind border border-industrial-border">
            <span className="text-industrial-amber font-mono font-bold text-lg">03 / ROBUST HMI STYLE</span>
            <h3 className="text-white text-base font-bold mt-2 uppercase font-mono">Designed for Industry</h3>
            <p className="text-industrial-textMuted text-xs mt-2 leading-relaxed">
              High-contrast dashboard utilizing an amber and slate graphite HMI framework. Engineered for rugged tablets, industrial terminals, and extreme conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-industrial-border bg-industrial-bg py-6 text-center text-xs text-industrial-textMuted font-mono">
        VOICEEDGE AI PANEL - INNOVENT-27 EDGE SYSTEM MVP
      </footer>
    </div>
  );
}
