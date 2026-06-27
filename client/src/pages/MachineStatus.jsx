import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function MachineStatus() {
  const [machines, setMachines] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMachines = async () => {
    try {
      const res = await api.get('/machines');
      setMachines(res.data);
    } catch (err) {
      console.error('Error fetching machines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === 'Operational'
        ? 'Maintenance'
        : currentStatus === 'Maintenance'
        ? 'Offline'
        : 'Operational';
    try {
      const res = await api.patch(`/machines/${id}`, { status: nextStatus });
      setMachines(machines.map((m) => (m._id === id ? res.data : m)));
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const filteredMachines = machines.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.type.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center font-mono text-industrial-amber py-20">
        LOADING MACHINERY TELEMETRY SYSTEMS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header Container */}
      <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind font-mono text-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-white font-bold uppercase">Machinery Telemetry Grid</h2>
          <p className="text-[10px] text-industrial-textMuted mt-0.5">
            Real-time status overrides and station telemetry indicators
          </p>
        </div>
        <div className="w-full md:w-72">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Machinery..."
            className="w-full bg-industrial-bg border border-industrial-border p-2.5 rounded-ind text-white focus:border-industrial-amber text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachines.map((m) => (
          <div
            key={m._id}
            className="bg-industrial-panel border border-industrial-border p-4 rounded-ind space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white font-mono text-sm tracking-wide">
                  {m.name}
                </h3>
                <span className="text-[10px] text-industrial-textMuted uppercase font-mono">
                  {m.type}
                </span>
              </div>
              <button
                onClick={() => handleStatusChange(m._id, m.status)}
                className={`px-3 py-1.5 rounded-ind text-[10px] font-mono font-bold transition-all border ${
                  m.status === 'Operational'
                    ? 'bg-industrial-success/10 border-industrial-success text-industrial-success'
                    : m.status === 'Maintenance'
                    ? 'bg-industrial-warning/10 border-industrial-warning text-industrial-warning'
                    : 'bg-industrial-danger/10 border-industrial-danger text-industrial-danger'
                }`}
              >
                {m.status.toUpperCase()}
              </button>
            </div>

            {/* Grid of gauges */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-industrial-bg p-2 rounded-ind border border-industrial-border">
                <span className="text-industrial-textMuted block text-[10px]">
                  TEMPERATURE
                </span>
                <span className="text-white font-bold block mt-1">
                  {m.temperature} °C
                </span>
              </div>
              <div className="bg-industrial-bg p-2 rounded-ind border border-industrial-border">
                <span className="text-industrial-textMuted block text-[10px]">
                  PRESSURE
                </span>
                <span className="text-white font-bold block mt-1">
                  {m.pressure} bar
                </span>
              </div>
              <div className="bg-industrial-bg p-2 rounded-ind border border-industrial-border">
                <span className="text-industrial-textMuted block text-[10px]">
                  VIBRATION
                </span>
                <span className="text-white font-bold block mt-1">
                  {m.vibration} mm/s
                </span>
              </div>
              <div className="bg-industrial-bg p-2 rounded-ind border border-industrial-border">
                <span className="text-industrial-textMuted block text-[10px]">
                  EFFICIENCY
                </span>
                <span className="text-white font-bold block mt-1">
                  {m.efficiency}%
                </span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-industrial-textMuted flex justify-between border-t border-industrial-border pt-2">
              <span>OPERATOR: {m.operator}</span>
              <span>
                LAST REFIT: {new Date(m.lastMaintenance).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {filteredMachines.length === 0 && (
          <div className="col-span-full text-center font-mono text-xs text-industrial-textMuted py-8">
            NO STATION TELEMETRY RECORD MATCHES QUERY
          </div>
        )}
      </div>
    </div>
  );
}
