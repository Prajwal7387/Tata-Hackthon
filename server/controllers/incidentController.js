import Incident from '../models/Incident.js';
import { mockIncidents } from '../config/mockDb.js';

// Get all safety logs
export const getIncidents = async (req, res) => {
  try {
    if (global.useMockDb) {
      return res.json([...mockIncidents].sort((a, b) => b.createdAt - a.createdAt));
    }
    const incidents = await Incident.find({}).sort({ createdAt: -1 });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving safety logs', error: error.message });
  }
};

// Create an incident report
export const createIncident = async (req, res) => {
  try {
    const { title, description, machine, severity } = req.body;
    if (!title || !machine) {
      return res.status(400).json({ message: 'Title and machine target are required' });
    }

    if (global.useMockDb) {
      const newIncident = {
        _id: 'i_' + Math.random().toString(36).substr(2, 9),
        title,
        description,
        machine,
        severity: severity || 'Medium',
        status: 'Reported',
        loggedBy: 'Operator',
        createdAt: new Date(),
      };
      mockIncidents.push(newIncident);
      return res.status(201).json(newIncident);
    }

    const newIncident = new Incident({
      title,
      description,
      machine,
      severity,
      status: 'Reported',
    });
    const saved = await newIncident.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error logging safety incident', error: error.message });
  }
};

// Update incident status/resolution
export const updateIncident = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (global.useMockDb) {
      const idx = mockIncidents.findIndex(i => i._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Incident log not found' });
      if (status) mockIncidents[idx].status = status;
      return res.json(mockIncidents[idx]);
    }

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident log not found' });
    }

    if (status) incident.status = status;

    const updated = await incident.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating incident log', error: error.message });
  }
};

// Get summary for safety cards
export const getIncidentSummary = async (req, res) => {
  try {
    if (global.useMockDb) {
      const total = mockIncidents.length;
      const reported = mockIncidents.filter(i => i.status === 'Reported').length;
      const investigating = mockIncidents.filter(i => i.status === 'Investigating').length;
      const resolved = mockIncidents.filter(i => i.status === 'Resolved').length;
      return res.json({ total, reported, investigating, resolved });
    }
    const total = await Incident.countDocuments();
    const reported = await Incident.countDocuments({ status: 'Reported' });
    const investigating = await Incident.countDocuments({ status: 'Investigating' });
    const resolved = await Incident.countDocuments({ status: 'Resolved' });
    res.json({ total, reported, investigating, resolved });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching safety metrics', error: error.message });
  }
};
