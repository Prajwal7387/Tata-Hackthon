import express from 'express';
import { getMachines, updateMachine, getMachineSummary } from '../controllers/machineController.js';

const router = express.Router();

router.get('/', getMachines);
router.get('/summary', getMachineSummary);
router.patch('/:id', updateMachine);

export default router;
