import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function IncidentReports() {
  const [incidents, setIncidents] = useState([]);
  const [machines, setMachines] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [incRes, macRes] = await Promise.all([api.get('/incidents'), api.get('/machines')]);
        setIncidents(incRes.data);
        setMachines(macRes.data);
        if (macRes.data.length > 0) setSelectedMachine(macRes.data[0].name);
      } catch (err) {
        console.error('Error fetching safety data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !selectedMachine) return;
    try {
      const res = await api.post('/incidents', { title, machine: selectedMachine, severity, description: desc });
      setIncidents([res.data, ...incidents]);
      setTitle('');
      setDesc('');
      setSeverity('Medium');
    } catch (err) {
      console.error('Error reporting safety incident:', err);
    }
  };

  if (loading) return <div className="text-center font-mono text-industrial-amber py-20">CONNECTING TO SAFETY SYSTEM LOGS...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Log incident Form */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind lg:col-span-1 h-fit">
        <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2 mb-4">
          Report Hazard / Incident
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Hazard Subject</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              placeholder="e.g. Oil slick on walk path"
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            />
          </div>
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Nearest Asset</label>
            <select
              value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)}
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            >
              {machines.map(m => <option key={m._id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Severity Rating</label>
            <select
              value={severity} onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            >
              {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Observation Notes</label>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              placeholder="Detail observations or remedial action..."
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-industrial-danger hover:bg-red-700 text-white font-bold rounded-ind transition-colors uppercase text-xs"
          >
            Submit Incident Report
          </button>
        </form>
      </div>

      {/* Incident logs list */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind lg:col-span-2">
        <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2 mb-4">
          Safety Incident Register
        </h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {incidents.length === 0 ? (
            <div className="text-center font-mono text-xs text-industrial-textMuted py-20">NO INCIDENTS REGISTERED</div>
          ) : (
            incidents.map((inc) => (
              <div key={inc._id} className="bg-industrial-bg border border-industrial-border p-4 rounded-ind flex justify-between items-start text-xs font-mono">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-industrial-danger block uppercase">{inc.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] bg-industrial-steel border border-industrial-border text-white`}>
                      {inc.severity}
                    </span>
                  </div>
                  <p className="text-industrial-textMuted leading-relaxed">{inc.description || 'No notes logged.'}</p>
                  <div className="text-[10px] text-industrial-textMuted">
                    NEAR ASSET: <span className="text-white">{inc.machine}</span> | REPORTED BY: {inc.loggedBy} | {new Date(inc.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className="px-2 py-1 bg-industrial-steel text-white rounded uppercase text-[10px] font-bold">
                  {inc.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
