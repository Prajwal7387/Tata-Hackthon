import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import machineRoutes from './routes/machineRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import voiceRoutes from './routes/voiceRoutes.js';
import Machine from './models/Machine.js';
import Ticket from './models/Ticket.js';
import Incident from './models/Incident.js';
import { mockMachines, mockTickets, mockIncidents } from './config/mockDb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/machines', machineRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/voice', voiceRoutes);

// Aggregated Dashboard Telemetry Endpoint
app.get('/api/dashboard/telemetry', async (req, res) => {
  try {
    let totalMachines, activeAlerts, openTickets, machines, tickets, incidents;

    if (global.useMockDb) {
      totalMachines = mockMachines.length;
      activeAlerts = mockIncidents.filter(i => i.status === 'Reported').length;
      openTickets = mockTickets.filter(t => t.status === 'Open').length;
      machines = mockMachines.slice(0, 4);
      tickets = [...mockTickets].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
      incidents = [...mockIncidents].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
    } else {
      totalMachines = await Machine.countDocuments();
      activeAlerts = await Incident.countDocuments({ status: 'Reported' });
      openTickets = await Ticket.countDocuments({ status: 'Open' });
      machines = await Machine.find({}).limit(4);
      tickets = await Ticket.find({}).sort({ createdAt: -1 }).limit(3);
      incidents = await Incident.find({}).sort({ createdAt: -1 }).limit(3);
    }
    
    // Mock CPU, memory, and model connection statuses for Edge system health display
    const systemHealth = {
      cpuUsage: Math.floor(Math.random() * 20) + 15, // 15-35%
      memUsage: Math.floor(Math.random() * 15) + 40, // 40-55%
      ollamaStatus: 'Connected',
      voskStatus: 'Initialized',
      activeSessionHours: 4.8
    };

    res.json({
      totalMachines,
      activeAlerts,
      openTickets,
      machines,
      recentTickets: tickets,
      recentIncidents: incidents,
      systemHealth
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving telemetry data', error: error.message });
  }
});

// System Status Route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Operational',
    useMockDb: global.useMockDb || false
  });
});

// Basic Root Route
app.get('/', (req, res) => {
  res.send('VoiceEdge AI Edge Server API running.');
});

// Listen
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
