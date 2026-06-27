import React from 'react';

export default function Header({ title, onMenuClick, micActive, systemHealth, isOffline }) {

  return (
    <header className="h-16 bg-industrial-panel border-b border-industrial-border flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-ind bg-industrial-steel text-industrial-text hover:bg-industrial-steelLight md:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg font-bold font-mono tracking-wider text-industrial-text uppercase">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Mock edge telemetry indicators (Touch / HMI style) */}
        <div className="hidden lg:flex items-center space-x-4 font-mono text-xs text-industrial-textMuted bg-industrial-bg px-3 py-1.5 border border-industrial-border rounded-ind">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-industrial-success"></span>
            <span>EDGE CPU: <span className="text-industrial-text font-bold">{systemHealth?.cpuUsage || 24}%</span></span>
          </div>
          <div className="h-3 border-l border-industrial-border"></div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-industrial-success"></span>
            <span>RAM: <span className="text-industrial-text font-bold">{systemHealth?.memUsage || 48}%</span></span>
          </div>
        </div>

        {/* Database Connectivity Status */}
        <div className="flex items-center space-x-2 bg-industrial-bg border border-industrial-border px-3 py-1.5 rounded-ind text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-industrial-warning animate-pulse' : 'bg-industrial-success'}`}></span>
          <span className="hidden sm:inline">DB STATE:</span>
          <span className={isOffline ? 'text-industrial-warning font-bold' : 'text-industrial-success font-bold'}>
            {isOffline ? 'OFFLINE (MOCK)' : 'CONNECTED'}
          </span>
        </div>

        {/* Voice Assistant Indicator - Designed for HMI Control screens */}
        <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-ind text-xs font-mono transition-all duration-300 ${
          micActive 
            ? 'bg-industrial-amber/15 border-industrial-amber text-industrial-amber' 
            : 'bg-industrial-bg border-industrial-border text-industrial-textMuted'
        }`}>
          <svg className={`w-4 h-4 ${micActive ? 'animate-pulse text-industrial-amber' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          <span className="hidden md:inline">MIC:</span>
          <span className={micActive ? 'text-industrial-amber font-bold' : 'text-industrial-textMuted font-bold'}>
            {micActive ? 'LISTENING' : 'STANDBY'}
          </span>
        </div>
      </div>
    </header>
  );
}
