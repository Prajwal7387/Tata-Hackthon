import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TelemetryPanel from '../components/TelemetryPanel';
import AlertsPanel from '../components/AlertsPanel';

export default function Dashboard() {
  const { speech } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    listening,
    transcript,
    confidence,
    status: speechStatus,
    error: speechError,
    supported: speechSupported,
    start: startSpeech,
    stop: stopSpeech,
    resolvedModel,
    isOnline
  } = speech;

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await api.get('/dashboard/telemetry');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching dashboard telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleMicToggle = () => {
    if (!speechSupported) return;
    if (listening) {
      stopSpeech();
    } else {
      startSpeech();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 font-mono text-industrial-amber">
        LOADING EDGE CONSOLE TELEMETRY...
      </div>
    );
  }

  // Helper for console status displays
  const getLogDisplay = () => {
    if (!speechSupported) return "ERROR: Voice engine not supported on this browser context.";
    if (speechError) return `SYSTEM_FAULT: ${speechError}`;
    if (listening && transcript === 'Listening...') return "Ready. Awaiting operator voice command...";
    return transcript || "Standby. Speak commands like 'Open Maintenance' or 'Raise Ticket'";
  };

  return (
    <div className="space-y-6">
      {!isOnline && (
        <div className="bg-industrial-warning/10 border border-industrial-warning p-3.5 rounded-ind flex items-center space-x-2 text-xs font-mono text-industrial-warning animate-pulse">
          <span className="shrink-0 font-bold">⚠️ VOSK OFFLINE ASSISTANT ACTIVE</span>
          <span>Factory network connection lost. Local offline Vosk engine is monitoring and translating microphone streams.</span>
        </div>
      )}
      {/* Voice Control HMI Terminal */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-1">
          <button
            onClick={handleMicToggle}
            disabled={!speechSupported}
            className={`w-full py-3.5 px-4 font-mono font-bold text-sm rounded-ind flex items-center justify-center space-x-2 transition-all ${
              !speechSupported
                ? 'bg-industrial-steel text-industrial-textMuted cursor-not-allowed opacity-50'
                : listening
                ? 'bg-industrial-danger hover:bg-red-700 text-white animate-pulse'
                : 'bg-industrial-amber hover:bg-industrial-amberHover text-industrial-bg'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span>
              {!speechSupported ? 'NO SPEECH API' : listening ? 'HALT ASSISTANT' : speechStatus === 'processing' ? 'PROCESSING...' : 'START LISTENING'}
            </span>
          </button>
        </div>
        <div className="md:col-span-3 bg-industrial-bg border border-industrial-border p-3 rounded-ind flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs overflow-hidden">
            <span className={`font-bold ${speechError || !speechSupported ? 'text-industrial-danger' : 'text-industrial-amber'}`}>
              {speechError || !speechSupported ? 'ERROR_LOG >' : 'OPERATOR_LOG >'}
            </span>
            <span className="text-industrial-text truncate">{getLogDisplay()}</span>
            
            {/* Embedded custom soundwave visualizer active ONLY when listening */}
            {listening && (
              <div className="flex items-end space-x-1 pl-3 h-4">
                <span className="w-1 bg-industrial-amber rounded-full animate-bounce" style={{ height: '50%', animationDelay: '0.1s', animationDuration: '0.6s' }}></span>
                <span className="w-1 bg-industrial-amber rounded-full animate-bounce" style={{ height: '100%', animationDelay: '0.2s', animationDuration: '0.6s' }}></span>
                <span className="w-1 bg-industrial-amber rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0.3s', animationDuration: '0.6s' }}></span>
              </div>
            )}
          </div>
          <span className="text-[10px] font-mono text-industrial-textMuted bg-industrial-steel px-2 py-1 rounded-full uppercase shrink-0 ml-2 font-bold text-industrial-amber">
            {speechStatus === 'processing' ? 'EVALUATING...' : `${resolvedModel.toUpperCase()} (${listening ? confidence : '100'}%)`}
          </span>
        </div>
      </div>

      {/* Edge System Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Machinery', val: data?.totalMachines || 0, color: 'text-white', path: '/app/machines' },
          { label: 'Unresolved Alerts', val: data?.activeAlerts || 0, color: 'text-industrial-danger', path: '/app/incidents' },
          { label: 'Open Work Orders', val: data?.openTickets || 0, color: 'text-industrial-warning', path: '/app/maintenance' },
          { label: 'Edge System Status', val: '98%', color: 'text-industrial-success', path: '/app/analytics' }
        ].map((card, i) => (
          <div
            key={i}
            onClick={() => navigate(card.path)}
            className="bg-industrial-panel border border-industrial-border p-4 rounded-ind hover:border-industrial-amber cursor-pointer transition-colors"
          >
            <span className="text-xs font-mono text-industrial-textMuted uppercase block">{card.label}</span>
            <span className={`text-3xl font-mono font-bold mt-2 block ${card.color}`}>{card.val}</span>
          </div>
        ))}
      </div>

      {/* Detailed Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TelemetryPanel machines={data?.machines} />
        <AlertsPanel incidents={data?.recentIncidents} />
      </div>
    </div>
  );
}
