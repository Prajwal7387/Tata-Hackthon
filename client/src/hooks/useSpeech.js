import { useState, useEffect, useRef } from 'react';
import { VoskOfflineEngine } from '../services/voskService.js';

export default function useSpeech({ onFinalResult } = {}) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(100);
  const [status, setStatus] = useState('idle'); // idle | listening | processing | error
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [micLevel, setMicLevel] = useState(0);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const onFinalResultRef = useRef(onFinalResult);
  const voskEngineRef = useRef(null);

  useEffect(() => {
    onFinalResultRef.current = onFinalResult;
  }, [onFinalResult]);

  useEffect(() => {
    const toggle = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', toggle);
    window.addEventListener('offline', toggle);
    voskEngineRef.current = new VoskOfflineEngine();
    return () => {
      window.removeEventListener('online', toggle);
      window.removeEventListener('offline', toggle);
    };
  }, []);

  useEffect(() => {
    if (!isSupported) {
      setStatus('error');
      setError('Web Speech API not supported.');
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setStatus('listening');
      setError(null);
    };
    rec.onresult = (event) => {
      let finalT = '';
      let interimT = '';
      let conf = 1.0;
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const res = event.results[i];
        if (res.isFinal) {
          finalT += res[0].transcript;
          conf = res[0].confidence;
          if (onFinalResultRef.current && res[0].transcript.trim()) {
            onFinalResultRef.current(res[0].transcript.trim());
          }
        } else {
          interimT += res[0].transcript;
        }
      }
      const live = interimT || finalT;
      if (live) setTranscript(live.trim());
      if (conf > 0) setConfidence(Math.round(conf * 100));
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech') return;
      if (e.error === 'network') {
        setIsOnline(false);
        return;
      }
      setError(e.error);
      setStatus('error');
      setListening(false);
      isListeningRef.current = false;
    };
    rec.onend = () => {
      if (isListeningRef.current && isOnline) {
        try {
          rec.start();
        } catch (err) {
          console.error(err);
        }
      } else if (!isListeningRef.current) {
        setStatus('idle');
      }
    };
    recognitionRef.current = rec;
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [isSupported, isOnline]);

  const start = () => {
    if (isListeningRef.current) return;
    setListening(true);
    isListeningRef.current = true;
    setTranscript('Listening...');
    if (isOnline) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    } else {
      setStatus('listening');
      voskEngineRef.current.onVolumeChange = (lvl) => setMicLevel(lvl);
      voskEngineRef.current.onResult = (res) => {
        setTranscript(res.text);
        setConfidence(res.confidence);
        if (onFinalResultRef.current) onFinalResultRef.current(res.text);
        stop();
      };
      voskEngineRef.current.start();
    }
  };

  const stop = () => {
    if (!isListeningRef.current) return;
    setListening(false);
    isListeningRef.current = false;
    setStatus('processing');
    if (isOnline) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error(err);
      }
    } else {
      voskEngineRef.current.stop();
      setStatus('idle');
      setMicLevel(0);
    }
  };

  return {
    listening,
    transcript,
    confidence,
    status,
    error,
    supported: isSupported,
    start,
    stop,
    isOnline,
    micLevel
  };
}
