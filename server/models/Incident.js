import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  machine: {
    type: String,
    required: true,
    trim: true,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Reported', 'Investigating', 'Resolved'],
    default: 'Reported',
  },
  loggedBy: {
    type: String,
    default: 'Operator',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Incident = mongoose.model('Incident', incidentSchema);
export default Incident;
