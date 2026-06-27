import React, { useState } from 'react';

const initialInventory = [
  { id: 'inv1', name: 'Pressure Transmitter P30', category: 'Electrical Sensors', stock: 14, minStock: 5, location: 'Rack A-3', unit: 'pcs' },
  { id: 'inv2', name: 'Hydraulic Cylinder Gaskets (12")', category: 'Seal Gaskets', stock: 3, minStock: 6, location: 'Rack B-1', unit: 'kits' },
  { id: 'inv3', name: 'Premium Synthetic Lube ISO-100', category: 'Lubricants', stock: 45, minStock: 20, location: 'Fluid Room 2', unit: 'liters' },
  { id: 'inv4', name: 'Optibelt V-Belts (Conveyor A)', category: 'Power Transmission', stock: 8, minStock: 10, location: 'Rack D-2', unit: 'pcs' },
  { id: 'inv5', name: 'Emergency Isolation Breaker (100A)', category: 'Electrical Breakers', stock: 2, minStock: 2, location: 'Electrical Crib', unit: 'pcs' }
];

export default function Inventory() {
  const [items, setItems] = useState(initialInventory);

  const handleRestock = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, stock: item.stock + 5 } : item));
  };

  return (
    <div className="bg-industrial-panel border border-industrial-border p-4 rounded-ind space-y-4">
      <h3 className="text-sm font-mono font-bold text-industrial-amber uppercase border-b border-industrial-border pb-2">
        Spare Parts & Spares Inventory Status
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-industrial-border text-industrial-textMuted uppercase text-left">
              <th className="py-3 px-2">Part Name</th>
              <th className="py-3 px-2">Category</th>
              <th className="py-3 px-2">Storage Location</th>
              <th className="py-3 px-2 text-right">In Stock</th>
              <th className="py-3 px-2 text-center">Status</th>
              <th className="py-3 px-2 text-center">Operational Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-industrial-border">
            {items.map(item => {
              const isLow = item.stock < item.minStock;
              return (
                <tr key={item.id} className="hover:bg-industrial-bg/30">
                  <td className="py-3 px-2 text-white font-bold">{item.name}</td>
                  <td className="py-3 px-2 text-industrial-textMuted">{item.category}</td>
                  <td className="py-3 px-2">{item.location}</td>
                  <td className="py-3 px-2 text-right text-white">{item.stock} {item.unit}</td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isLow ? 'bg-industrial-danger/10 text-industrial-danger border border-industrial-danger' : 'bg-industrial-success/10 text-industrial-success border border-industrial-success'
                    }`}>
                      {isLow ? 'LOW STOCK' : 'ADEQUATE'}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleRestock(item.id)}
                      className="px-2.5 py-1 bg-industrial-steel hover:bg-industrial-steelLight text-white rounded transition-colors text-[10px] uppercase font-bold"
                    >
                      Restock +5
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
