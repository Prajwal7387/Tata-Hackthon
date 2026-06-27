import React from 'react';

export default function AlertsPanel({ incidents }) {
  return (
    <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind">
      <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2 mb-4">
        Active Safety Alerts & Incident Reports
      </h3>
      <div className="space-y-3">
        {incidents?.length === 0 ? (
          <div className="text-xs font-mono text-industrial-textMuted text-center py-6">NO ACTIVE SAFETY ALERTS</div>
        ) : (
          incidents?.map((inc) => (
            <div key={inc._id} className="flex justify-between items-center p-3 bg-industrial-bg border border-industrial-border rounded-ind text-xs">
              <div>
                <span className="font-bold text-industrial-danger block uppercase">{inc.title}</span>
                <span className="text-industrial-textMuted font-mono block mt-1">{inc.machine} • Severity: {inc.severity}</span>
              </div>
              <span className="px-2 py-1 bg-industrial-steel font-mono rounded text-[10px] text-white uppercase">{inc.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
