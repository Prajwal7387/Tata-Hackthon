import express from 'express';
import { getIncidents, createIncident, updateIncident, getIncidentSummary } from '../controllers/incidentController.js';

const router = express.Router();

router.get('/', getIncidents);
router.get('/summary', getIncidentSummary);
router.post('/', createIncident);
router.patch('/:id', updateIncident);

export default router;
