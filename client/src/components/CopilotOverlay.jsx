import React from 'react';

export default function CopilotOverlay({ step, report, onConfirm, onCancel }) {
  if (!step) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-4 max-w-sm w-full font-mono text-xs select-none">
      {/* 1. Retrieval Modal for Inspection Report */}
      {step === 'fetching' && report && (
        <div className="bg-industrial-panel border-2 border-industrial-amber p-4 rounded-ind shadow-2xl space-y-3 animate-bounce">
          <div className="flex justify-between items-center border-b border-industrial-border pb-1.5">
            <span className="text-industrial-amber font-bold uppercase tracking-wider text-[10px]">
              📁 DATABASE RETRIEVAL: INSPECTION REPORT
            </span>
            <span className="text-industrial-textMuted text-[9px]">{report.date}</span>
          </div>
          <div className="space-y-1 text-white">
            <div className="flex justify-between">
              <span className="text-industrial-textMuted uppercase text-[9px]">Station:</span>
              <span className="font-bold">{report.machine}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-industrial-textMuted uppercase text-[9px]">Status:</span>
              <span className="text-industrial-danger font-bold uppercase text-[9px]">Critical Oscillations</span>
            </div>
          </div>
          <div className="bg-industrial-bg p-2 border border-industrial-border rounded-ind text-[10px] text-industrial-text">
            <span className="block font-bold text-white uppercase mb-1">Inspector Log:</span>
            {report.finding}
          </div>
        </div>
      )}

      {/* 2. Banner for operator Ticket Confirmation */}
      {step === 'confirming' && (
        <div className="bg-industrial-panel border-2 border-industrial-warning p-4 rounded-ind shadow-2xl space-y-3 animate-pulse">
          <div className="flex items-center space-x-2 border-b border-industrial-border pb-1.5">
            <div className="w-2.5 h-2.5 bg-industrial-warning rounded-full animate-ping"></div>
            <span className="text-industrial-warning font-bold uppercase tracking-wider text-[10px]">
              🤖 CO-PILOT: CONFIRM ACTION
            </span>
          </div>
          <p className="text-white text-[10px] leading-relaxed">
            I have pre-filled the maintenance ticket for <strong className="text-industrial-warning">Steam Boiler B-505</strong>. Should I submit the ticket?
          </p>
          <div className="flex space-x-2 pt-1">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-industrial-warning hover:bg-amber-600 text-industrial-bg font-bold rounded-ind uppercase text-[9px] transition-colors"
            >
              Confirm [Say "Confirm"]
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2 bg-industrial-steel hover:bg-industrial-border text-white font-bold rounded-ind border border-industrial-border uppercase text-[9px] transition-colors"
            >
              Cancel [Say "Cancel"]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
