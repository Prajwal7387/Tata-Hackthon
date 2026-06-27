import React from 'react';

export default function TelemetryPanel({ machines }) {
  return (
    <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind">
      <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2 mb-4">
        Machinery Status Telemetry
      </h3>
      <div className="space-y-3">
        {machines?.map((m) => (
          <div key={m._id} className="flex justify-between items-center p-3 bg-industrial-bg border border-industrial-border rounded-ind text-sm">
            <div>
              <span className="font-bold text-white block">{m.name}</span>
              <span className="text-xs font-mono text-industrial-textMuted">{m.type}</span>
            </div>
            <div className="text-right">
              <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                m.status === 'Operational' ? 'bg-industrial-success' : m.status === 'Maintenance' ? 'bg-industrial-warning' : 'bg-industrial-danger'
              }`}></span>
              <span className="font-mono text-xs text-white uppercase">{m.status}</span>
            </div>
          </div>
        ))}
        {!machines?.length && (
          <div className="text-xs font-mono text-industrial-textMuted text-center py-6">NO TELEMETRY RECORDED</div>
        )}
      </div>
    </div>
  );
}
