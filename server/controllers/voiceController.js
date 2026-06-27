import CommandLog from '../models/CommandLog.js';
import { parseIntentOffline, getSystemPrompt } from '../utils/nlpHelper.js';

// Handler to query local Ollama model with offline fallback
export const parseSpeechIntent = async (req, res) => {
  const { text, ollamaUrl, model } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Operator voice query text is required' });
  }

  let resultIntent = null;
  let resolvedModel = 'rule-engine';

  try {
    const systemPrompt = getSystemPrompt(text);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const targetUrl = `${ollamaUrl || 'http://localhost:11434'}/api/generate`;
    const targetModel = model || 'phi3:mini';

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: targetModel,
        prompt: systemPrompt,
        stream: false,
        format: 'json'
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const content = JSON.parse(data.response.trim());
      if (content.intent) {
        resultIntent = content;
        resolvedModel = targetModel;
      }
    }
  } catch (err) {
    // Failover silently to offline engine
  }

  if (!resultIntent) {
    resultIntent = parseIntentOffline(text);
  }

  // Telemetry Log
  try {
    if (!global.useMockDb) {
      const log = new CommandLog({
        commandText: text,
        detectedIntent: resultIntent.intent,
        confidence: resultIntent.intent === 'UNKNOWN' ? 0.4 : 0.95,
        success: resultIntent.intent !== 'UNKNOWN',
        responseText: resultIntent.feedback,
        mode: resolvedModel === 'rule-engine' ? 'offline' : 'online'
      });
      await log.save();
    }
  } catch (logErr) {
    console.error('Failed logging command:', logErr.message);
  }

  res.json({
    ...resultIntent,
    resolvedModel
  });
};
