import React, { useState } from 'react';
import PdfViewerModal from '../components/PdfViewerModal';

const mockManuals = [
  {
    id: 'sm1',
    title: 'Emergency Machinery Shutdown Protocol',
    code: 'SOP-011-ESD',
    category: 'Safety Procedures',
    lastUpdated: '12-05-2026',
    sections: [
      { subtitle: 'Step 1: Locate E-Stop switch', text: 'Instantly push any red mushroom buttons located around station foundations.' },
      { subtitle: 'Step 2: Isolate circuits', text: 'Throw primary breaker levers located in Power Control Cabinet (PCC-A1).' }
    ]
  },
  {
    id: 'sm2',
    title: 'Hydraulic High Pressure Spill Response',
    code: 'SOP-088-HSR',
    category: 'Hazard Management',
    lastUpdated: '18-02-2026',
    sections: [
      { subtitle: 'Step 1: Safety Perimeter', text: 'Tape off a 10-meter perimeter surrounding the fluid weep location.' },
      { subtitle: 'Step 2: Absorb & Clean', text: 'Deploy spill pillows from secondary storage boxes. Avoid direct contact.' }
    ]
  },
  {
    id: 'sm3',
    title: 'Conveyor Drive System Calibration Guidelines',
    code: 'SOP-142-CDC',
    category: 'Maintenance Procedures',
    lastUpdated: '01-06-2026',
    sections: [
      { subtitle: 'Step 1: Lockout Tagout (LOTO)', text: 'Affix personal padlock tag to isolator circuit panel before maintenance.' },
      { subtitle: 'Step 2: Inspect Alignments', text: 'Measure tracking skew. Align adjusting bolts in 1/4 turns incrementally.' }
    ]
  }
];

export default function SafetyManuals() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(mockManuals[0]);
  const [pdfOpen, setPdfOpen] = useState(false);

  const filtered = mockManuals.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) || 
    m.code.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar search / titles */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind md:col-span-1 space-y-4">
        <div className="font-mono text-xs">
          <label className="block text-industrial-textMuted uppercase mb-1">Search SOP / Manual</label>
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Type code or keyword..."
            className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
          />
        </div>

        <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
          {filtered.map(m => (
            <button
              key={m.id}
              onClick={() => setSelected(m)}
              className={`w-full text-left p-3 rounded-ind font-mono text-xs border transition-colors block ${
                selected?.id === m.id
                  ? 'bg-industrial-amber/15 border-industrial-amber text-industrial-amber'
                  : 'bg-industrial-bg border-industrial-border hover:bg-industrial-steel text-white'
              }`}
            >
              <span className="block font-bold truncate uppercase">{m.title}</span>
              <span className="block text-[10px] text-industrial-textMuted mt-1">{m.code} • {m.category}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="text-center font-mono text-[10px] text-industrial-textMuted py-8">NO MANUALS FOUND</div>
          )}
        </div>
      </div>

      {/* Manual Content reader */}
      <div className="bg-industrial-panel border border-industrial-border p-5 rounded-ind md:col-span-2 space-y-6">
        {selected ? (
          <div className="space-y-4">
            <div className="border-b border-industrial-border pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-industrial-amber bg-industrial-steel px-2 py-1 rounded">
                  {selected.code}
                </span>
                <h2 className="text-xl font-bold font-mono tracking-wide text-white mt-3 uppercase">
                  {selected.title}
                </h2>
                <div className="text-[10px] font-mono text-industrial-textMuted mt-2">
                  CATEGORY: {selected.category} | REVISED: {selected.lastUpdated}
                </div>
              </div>
              <button
                onClick={() => setPdfOpen(true)}
                className="px-3 py-1.5 bg-industrial-steel hover:bg-industrial-border text-industrial-amber border border-industrial-border rounded-ind font-mono text-[10px] font-bold uppercase transition-colors flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>View PDF SOP</span>
              </button>
            </div>

            <div className="space-y-4">
              {selected.sections.map((sect, index) => (
                <div key={index} className="bg-industrial-bg border border-industrial-border p-4 rounded-ind space-y-2">
                  <h4 className="font-bold font-mono text-xs text-white uppercase">{sect.subtitle}</h4>
                  <p className="text-xs text-industrial-textMuted leading-relaxed font-sans">{sect.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center font-mono text-xs text-industrial-textMuted py-20">SELECT A SAFETY MANUAL TO READ</div>
        )}
      </div>

      <PdfViewerModal
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        title={selected?.title}
        code={selected?.code}
      />
    </div>
  );
}
