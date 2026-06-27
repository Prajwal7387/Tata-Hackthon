import express from 'express';
import { getTickets, createTicket, updateTicket, getTicketSummary } from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', getTickets);
router.get('/summary', getTicketSummary);
router.post('/', createTicket);
router.patch('/:id', updateTicket);

export default router;
