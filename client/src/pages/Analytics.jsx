import React from 'react';

export default function Analytics() {
  const commandsBreakdown = [
    { label: 'Navigation Commands', count: 68, pct: 45 },
    { label: 'Check Machine Status', count: 38, pct: 25 },
    { label: 'Raise Maintenance Ticket', count: 24, pct: 16 },
    { label: 'Search Safety SOPs', count: 18, pct: 14 }
  ];

  return (
    <div className="space-y-6">
      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        {[
          { label: 'Total Parse Commands', val: '148', detail: 'TODAY' },
          { label: 'Average NLP Latency', val: '240 ms', detail: 'LOCAL PHI-3 OLLAMA' },
          { label: 'Parser Accuracy', val: '97.2%', detail: 'VOSK + LLM CONFIDENCE' }
        ].map((card, i) => (
          <div key={i} className="bg-industrial-panel border border-industrial-border p-4 rounded-ind">
            <span className="text-xs text-industrial-textMuted uppercase">{card.label}</span>
            <span className="text-3xl font-bold text-white block mt-2">{card.val}</span>
            <span className="text-[10px] text-industrial-amber mt-1 block uppercase">{card.detail}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Command Breakdown */}
        <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind space-y-4">
          <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2">
            Voice Command Distribution
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {commandsBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-industrial-text">
                  <span>{item.label}</span>
                  <span className="text-industrial-textMuted">{item.count} calls ({item.pct}%)</span>
                </div>
                <div className="w-full bg-industrial-bg h-2.5 rounded-full overflow-hidden border border-industrial-border">
                  <div className="bg-industrial-amber h-full rounded-full" style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NLP Latency Timeline (Visual SVG Graph) */}
        <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind space-y-4">
          <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2">
            Local LLM Latency Timeline
          </h3>
          <div className="bg-industrial-bg border border-industrial-border p-2 rounded-ind">
            {/* SVG Line Chart */}
            <svg className="w-full h-36 text-industrial-amber" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path
                d="M0,80 L30,70 L60,85 L90,40 L120,45 L150,30 L180,60 L210,35 L240,40 L270,15 L300,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Reference Gridlines */}
              <line x1="0" y1="50" x2="300" y2="50" stroke="#333538" strokeDasharray="3,3" />
              <line x1="0" y1="20" x2="300" y2="20" stroke="#333538" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#333538" strokeDasharray="3,3" />
            </svg>
            <div className="flex justify-between font-mono text-[9px] text-industrial-textMuted mt-2 px-1">
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00 (CURRENT)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
