import express from 'express';
import { parseSpeechIntent } from '../controllers/voiceController.js';

const router = express.Router();

router.post('/intent', parseSpeechIntent);

export default router;
