import Ticket from '../models/Ticket.js';
import { mockTickets } from '../config/mockDb.js';

// Get all tickets
export const getTickets = async (req, res) => {
  try {
    if (global.useMockDb) {
      // return tickets sorted by newest first
      return res.json([...mockTickets].sort((a, b) => b.createdAt - a.createdAt));
    }
    const tickets = await Ticket.find({}).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tickets', error: error.message });
  }
};

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, machine, severity } = req.body;
    if (!title || !machine) {
      return res.status(400).json({ message: 'Title and machine are required' });
    }

    if (global.useMockDb) {
      const newTicket = {
        _id: 't_' + Math.random().toString(36).substr(2, 9),
        title,
        description,
        machine,
        severity: severity || 'Medium',
        status: 'Open',
        createdAt: new Date(),
      };
      mockTickets.push(newTicket);
      return res.status(201).json(newTicket);
    }

    const newTicket = new Ticket({
      title,
      description,
      machine,
      severity,
      status: 'Open',
    });
    const saved = await newTicket.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};

// Update ticket status/severity
export const updateTicket = async (req, res) => {
  try {
    const { status, severity } = req.body;
    const { id } = req.params;

    if (global.useMockDb) {
      const idx = mockTickets.findIndex(t => t._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Ticket not found' });
      if (status) mockTickets[idx].status = status;
      if (severity) mockTickets[idx].severity = severity;
      return res.json(mockTickets[idx]);
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (severity) ticket.severity = severity;

    const updated = await ticket.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
};

// Get summary counts
export const getTicketSummary = async (req, res) => {
  try {
    if (global.useMockDb) {
      const total = mockTickets.length;
      const open = mockTickets.filter(t => t.status === 'Open').length;
      const inProgress = mockTickets.filter(t => t.status === 'In Progress').length;
      const resolved = mockTickets.filter(t => t.status === 'Resolved').length;
      return res.json({ total, open, inProgress, resolved });
    }
    const total = await Ticket.countDocuments();
    const open = await Ticket.countDocuments({ status: 'Open' });
    const inProgress = await Ticket.countDocuments({ status: 'In Progress' });
    const resolved = await Ticket.countDocuments({ status: 'Resolved' });
    res.json({ total, open, inProgress, resolved });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ticket summary', error: error.message });
  }
};
