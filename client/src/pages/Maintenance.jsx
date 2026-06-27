import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Maintenance() {
  const [tickets, setTickets] = useState([]);
  const [machines, setMachines] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [desc, setDesc] = useState('');
  const [severity, setSeverity] = useState('Medium');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketsRes, machinesRes] = await Promise.all([api.get('/tickets'), api.get('/machines')]);
        setTickets(ticketsRes.data);
        setMachines(machinesRes.data);
        if (machinesRes.data.length > 0) setSelectedMachine(machinesRes.data[0].name);
      } catch (err) {
        console.error('Error fetching maintenance console data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    window.addEventListener('ticket-submitted', loadData);
    return () => {
      window.removeEventListener('ticket-submitted', loadData);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !selectedMachine) return;
    try {
      const res = await api.post('/tickets', { title, description: desc, machine: selectedMachine, severity });
      setTickets([res.data, ...tickets]);
      setTitle('');
      setDesc('');
      setSeverity('Medium');
    } catch (err) {
      console.error('Error filing maintenance order:', err);
    }
  };

  if (loading) return <div className="text-center font-mono text-industrial-amber py-20">CONNECTING TO MAINTENANCE DATABASE...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Raise Ticket Form */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind lg:col-span-1 h-fit">
        <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2 mb-4">
          Raise Maintenance Ticket
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Ticket Title</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
              placeholder="e.g. Belt calibration needed"
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            />
          </div>
          <div>
            <label className="block text-industrial-textMuted uppercase mb-1">Target Machinery</label>
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
            <label className="block text-industrial-textMuted uppercase mb-1">Description / Notes</label>
            <textarea
              value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              placeholder="Describe telemetry anomaly..."
              className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-industrial-amber text-industrial-bg font-bold rounded-ind hover:bg-industrial-amberHover transition-colors uppercase text-xs"
          >
            Submit Order
          </button>
        </form>
      </div>

      {/* Ticket Logs List */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind lg:col-span-2">
        <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2 mb-4">
          Maintenance Operations Logs
        </h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {tickets.length === 0 ? (
            <div className="text-center font-mono text-xs text-industrial-textMuted py-20">NO WORK ORDERS LOGGED</div>
          ) : (
            tickets.map((t) => (
              <div key={t._id} className="bg-industrial-bg border border-industrial-border p-4 rounded-ind flex justify-between items-start text-xs font-mono">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white uppercase">{t.title}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      t.severity === 'Critical' ? 'bg-red-950 text-industrial-danger border border-industrial-danger' : 'bg-industrial-steel text-white'
                    }`}>
                      {t.severity}
                    </span>
                  </div>
                  <p className="text-industrial-textMuted leading-relaxed">{t.description || 'No description provided.'}</p>
                  <div className="text-[10px] text-industrial-textMuted">
                    ASSET: <span className="text-white">{t.machine}</span> | LOGGED: {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-industrial-steel border border-industrial-border text-white rounded uppercase text-[10px]">
                  {t.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
