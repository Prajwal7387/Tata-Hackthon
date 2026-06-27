import mongoose from 'mongoose';

const commandLogSchema = new mongoose.Schema({
  commandText: {
    type: String,
    required: true,
  },
  detectedIntent: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    default: 1.0,
  },
  success: {
    type: Boolean,
    default: true,
  },
  responseText: {
    type: String,
  },
  mode: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CommandLog = mongoose.model('CommandLog', commandLogSchema);
export default CommandLog;
