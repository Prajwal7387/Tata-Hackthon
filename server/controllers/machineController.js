import Machine from '../models/Machine.js';
import { mockMachines } from '../config/mockDb.js';

// Get all machines
export const getMachines = async (req, res) => {
  try {
    if (global.useMockDb) {
      return res.json(mockMachines);
    }
    const machines = await Machine.find({});
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving machines', error: error.message });
  }
};

// Update a machine
export const updateMachine = async (req, res) => {
  try {
    const { status, temperature, pressure, vibration, efficiency } = req.body;
    const { id } = req.params;

    if (global.useMockDb) {
      const idx = mockMachines.findIndex(m => m._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Machine not found' });
      if (status) mockMachines[idx].status = status;
      if (temperature !== undefined) mockMachines[idx].temperature = temperature;
      if (pressure !== undefined) mockMachines[idx].pressure = pressure;
      if (vibration !== undefined) mockMachines[idx].vibration = vibration;
      if (efficiency !== undefined) mockMachines[idx].efficiency = efficiency;
      return res.json(mockMachines[idx]);
    }

    const machine = await Machine.findById(id);
    if (!machine) {
      return res.status(404).json({ message: 'Machine not found' });
    }

    if (status) machine.status = status;
    if (temperature !== undefined) machine.temperature = temperature;
    if (pressure !== undefined) machine.pressure = pressure;
    if (vibration !== undefined) machine.vibration = vibration;
    if (efficiency !== undefined) machine.efficiency = efficiency;

    const updated = await machine.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating machine', error: error.message });
  }
};

// Get summary for dashboard
export const getMachineSummary = async (req, res) => {
  try {
    if (global.useMockDb) {
      const total = mockMachines.length;
      const operational = mockMachines.filter(m => m.status === 'Operational').length;
      const maintenance = mockMachines.filter(m => m.status === 'Maintenance').length;
      const offline = mockMachines.filter(m => m.status === 'Offline').length;
      return res.json({ total, operational, maintenance, offline });
    }
    const total = await Machine.countDocuments();
    const operational = await Machine.countDocuments({ status: 'Operational' });
    const maintenance = await Machine.countDocuments({ status: 'Maintenance' });
    const offline = await Machine.countDocuments({ status: 'Offline' });
    res.json({ total, operational, maintenance, offline });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching machine summary', error: error.message });
  }
};
