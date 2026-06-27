import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSpeech from './useSpeech';
import api from '../services/api';

export default function useVoiceController({ setCopilotStep, setCopilotReport, setCopilotTicket } = {}) {
  const navigate = useNavigate();
  const [resolvedModel, setResolvedModel] = useState('rule-engine');

  const handleFinalResult = async (phrase) => {
    console.log(`Voice Engine Captured: "${phrase}"`);
    try {
      const storedUrl = localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
      const storedModel = localStorage.getItem('selectedModel') || 'phi3:mini';

      const response = await api.post('/voice/intent', { 
        text: phrase,
        ollamaUrl: storedUrl,
        model: storedModel
      });
      const { intent, target, feedback, resolvedModel: modelUsed, data } = response.data;
      setResolvedModel(modelUsed);

      const storedVoiceBack = localStorage.getItem('voiceBack') !== 'false';
      const speak = (msg) => {
        if (storedVoiceBack && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(new SynthesisConfirmation(msg));
        }
      };

      speak(feedback);

      // DOM Automation / AI Agent action dispatcher
      if (intent === 'NAVIGATE' && target) {
        navigate(target);
      } else if (intent === 'SCROLL_DOWN') {
        window.scrollBy({ top: 450, behavior: 'smooth' });
      } else if (intent === 'SCROLL_UP') {
        window.scrollBy({ top: -450, behavior: 'smooth' });
      } else if (intent === 'GO_BACK') {
        window.history.back();
      } else if (intent === 'CLICK' && target) {
        const btn = Array.from(document.querySelectorAll('button, a, input[type="submit"]')).find(el => 
          el.textContent.toLowerCase().includes(target.toLowerCase())
        );
        if (btn) btn.click();
      } else if (intent === 'COPILOT_CONFIRM') {
        const confirmBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes('confirm'));
        if (confirmBtn) confirmBtn.click();
      } else if (intent === 'COPILOT_CANCEL') {
        const cancelBtn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes('cancel'));
        if (cancelBtn) cancelBtn.click();
      } else if (intent === 'COPILOT_MODE' && data) {
        setCopilotStep('navigating');
        navigate('/app/machines');
        setTimeout(() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]');
          if (searchInput) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchInput, data.machine);
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
          setCopilotStep('fetching');
          setCopilotReport({
            machine: data.machine,
            date: '24-06-2026',
            finding: 'Pump bearing oscillation threshold exceeded by 18%. Priority overhaul advised.'
          });
          speak(`Fetching maintenance history for ${data.machine}. Warning: critical pump bearing oscillation.`);
          
          setTimeout(() => {
            setCopilotStep('drafting');
            setCopilotReport(null);
            navigate('/app/maintenance');
            speak(`Opening maintenance panel to draft work order.`);
            
            setTimeout(() => {
              const titleInput = document.querySelector('input[placeholder*="calibration"]');
              const selects = document.querySelectorAll('select');
              const descTextarea = document.querySelector('textarea');
              const setReactVal = (el, val) => {
                if (!el) return;
                const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
                if (setter) setter.call(el, val);
                else el.value = val;
                el.dispatchEvent(new Event('input', { bubbles: true }));
                el.dispatchEvent(new Event('change', { bubbles: true }));
              };
              const ticket = data.ticketData || {};
              if (ticket.title) setReactVal(titleInput, ticket.title);
              if (ticket.machine && selects[0]) setReactVal(selects[0], ticket.machine);
              if (ticket.severity && selects[1]) setReactVal(selects[1], ticket.severity);
              if (ticket.description) setReactVal(descTextarea, ticket.description);
              
              setCopilotStep('confirming');
              setCopilotTicket(ticket);
              speak(`Ticket drafted. Confirm or cancel to proceed.`);
            }, 800);
          }, 4500);
        }, 1000);
      } else if (intent === 'OPEN_PDF' && target) {
        if (window.location.pathname !== '/app/safety') navigate('/app/safety');
        setTimeout(() => {
          const card = Array.from(document.querySelectorAll('button')).find(el => {
            const txt = el.textContent.toLowerCase();
            return (target === 'emergency' && txt.includes('sop-011')) ||
                   (target === 'hydraulic' && txt.includes('sop-088')) ||
                   (target === 'conveyor' && txt.includes('sop-142'));
          });
          if (card) card.click();
          setTimeout(() => {
            const pdfBtn = Array.from(document.querySelectorAll('button')).find(el => 
              el.textContent.toLowerCase().includes('pdf') || el.textContent.toLowerCase().includes('view pdf')
            );
            if (pdfBtn) pdfBtn.click();
          }, 300);
        }, 500);
      } else if (intent === 'FORM_FILL' && target === 'maintenance_ticket') {
        if (window.location.pathname !== '/app/maintenance') navigate('/app/maintenance');
        setTimeout(() => {
          const titleInput = document.querySelector('input[placeholder*="calibration"]');
          const selects = document.querySelectorAll('select');
          const descTextarea = document.querySelector('textarea');
          const submitBtn = Array.from(document.querySelectorAll('button')).find(el => 
            el.textContent.toLowerCase().includes('raise') || el.textContent.toLowerCase().includes('submit')
          );
          const setReactVal = (el, val) => {
            if (!el) return;
            const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
            if (setter) setter.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          };
          const formData = response.data.data || {};
          if (formData.title) setReactVal(titleInput, formData.title);
          if (formData.machine && selects[0]) setReactVal(selects[0], formData.machine);
          if (formData.severity && selects[1]) setReactVal(selects[1], formData.severity);
          if (formData.description) setReactVal(descTextarea, formData.description);
          setTimeout(() => { if (submitBtn) submitBtn.click(); }, 800);
        }, 500);
      } else if (intent === 'SEARCH' && target) {
        const searchInput = document.querySelector('input[placeholder*="Search"], input[placeholder*="search"], input[placeholder*="Type"]');
        if (searchInput) {
          searchInput.focus();
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeInputValueSetter.call(searchInput, target);
          searchInput.dispatchEvent(new Event('input', { bubbles: true }));
          searchInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    } catch (err) {
      console.error('NLP translation command execution failed:', err);
    }
  };

  if (typeof window !== 'undefined') {
    window.__triggerVoiceCommand = handleFinalResult;
  }

  const speech = useSpeech({ onFinalResult: handleFinalResult });
  return { ...speech, resolvedModel };
}

class SynthesisConfirmation extends SpeechSynthesisUtterance {
  constructor(text) {
    super(text);
    this.rate = 1.0;
    this.pitch = 1.0;
    this.lang = 'en-US';
  }
}
