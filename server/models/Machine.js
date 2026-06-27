import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Operational', 'Maintenance', 'Offline'],
    default: 'Operational',
  },
  temperature: {
    type: Number,
    default: 25,
  },
  pressure: {
    type: Number,
    default: 1.0,
  },
  vibration: {
    type: Number,
    default: 0.0,
  },
  efficiency: {
    type: Number,
    default: 100,
  },
  operator: {
    type: String,
    default: 'System',
  },
  lastMaintenance: {
    type: Date,
    default: Date.now,
  },
});

const Machine = mongoose.model('Machine', machineSchema);
export default Machine;
