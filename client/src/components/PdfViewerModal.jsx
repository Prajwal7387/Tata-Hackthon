import React, { useEffect } from 'react';

export default function PdfViewerModal({ isOpen, onClose, title, code }) {
  // Support ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-industrial-panel border border-industrial-border rounded-ind shadow-2xl flex flex-col h-[80vh] font-mono text-xs">
        {/* PDF Reader Toolbar */}
        <div className="bg-industrial-bg border-b border-industrial-border p-3 flex justify-between items-center text-white font-bold select-none">
          <div className="flex items-center space-x-2">
            <span className="bg-industrial-danger px-2 py-0.5 rounded text-[10px] text-white">PDF</span>
            <span>{code}_Official_SOP.pdf</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-industrial-textMuted text-[10px]">ZOOM: 100% | PAGE 1 OF 1</span>
            <button
              onClick={onClose}
              className="px-2.5 py-1 bg-industrial-steel hover:bg-industrial-border border border-industrial-border rounded text-industrial-amber transition-colors uppercase font-bold"
            >
              Close [ESC]
            </button>
          </div>
        </div>

        {/* PDF Content Canvas */}
        <div className="flex-grow overflow-y-auto p-8 bg-[#121315]/80">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-lg text-black font-sans leading-relaxed min-h-[600px] border border-gray-300 relative select-none">
            <div className="border-b-2 border-gray-900 pb-3 flex justify-between items-start">
              <div>
                <h1 className="text-sm font-bold text-gray-900 uppercase font-mono tracking-widest">{title}</h1>
                <span className="text-[10px] text-gray-500 font-mono block mt-1">{code} • INDUSTRIAL SAFETY CODE</span>
              </div>
              <span className="text-[10px] font-bold font-mono text-gray-900 border border-gray-900 px-2 py-0.5 uppercase">Controlled Doc</span>
            </div>
            
            <div className="mt-6 space-y-4">
              <h2 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 font-mono">1.0 SYSTEM OVERVIEW</h2>
              <p className="text-[11px] text-gray-700">This document specifies safety thresholds and operational overrides for factory floor automation controls. Unauthorized modifications to machinery states without verifying circuit locks are strictly prohibited.</p>
              
              <h2 className="text-xs font-bold text-gray-900 uppercase border-b border-gray-200 pb-1 font-mono">2.0 PRIMARY SAFETY OVERRIDES</h2>
              <p className="text-[11px] text-gray-700">Operator commands issued via Edge voice controllers must be verified and acknowledged. Any mechanical overrides trigger lockouts programmatically.</p>
            </div>

            <div className="absolute bottom-8 left-8 right-8 border-t border-gray-200 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-mono">
              <span>VOICEEDGE INDUSTRIAL PLATFORM • SECURED EDGE PROTOCOL</span>
              <span>PAGE 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
