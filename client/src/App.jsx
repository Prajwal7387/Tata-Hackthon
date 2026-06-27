import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import MachineStatus from './pages/MachineStatus';
import Maintenance from './pages/Maintenance';
import SafetyManuals from './pages/SafetyManuals';
import Inventory from './pages/Inventory';
import IncidentReports from './pages/IncidentReports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import api from './services/api';
import useVoiceController from './hooks/useVoiceController';
import CopilotOverlay from './components/CopilotOverlay';

// Layout wrapper for all authenticated application routes
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ cpuUsage: 22, memUsage: 46 });
  const [isOffline, setIsOffline] = useState(false);

  const [copilotStep, setCopilotStep] = useState(null);
  const [copilotReport, setCopilotReport] = useState(null);
  const [copilotTicket, setCopilotTicket] = useState(null);

  // Initialize global speech and action controller
  const speech = useVoiceController({ setCopilotStep, setCopilotReport, setCopilotTicket });

  const handleCopilotConfirm = async () => {
    if (!copilotTicket) return;
    try {
      await api.post('/tickets', copilotTicket);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance("Ticket submitted successfully."));
      }
      window.dispatchEvent(new CustomEvent('ticket-submitted'));
    } catch (err) {
      console.error('Failed to submit copilot ticket:', err);
    }
    setCopilotStep(null);
    setCopilotTicket(null);
    setCopilotReport(null);
  };

  const handleCopilotCancel = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Action cancelled. Ticket discarded."));
    }
    setCopilotStep(null);
    setCopilotTicket(null);
    setCopilotReport(null);
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await api.get('/status');
        setIsOffline(res.data.useMockDb);
      } catch (err) {
        console.error('Failed to contact backend status check:', err);
        setIsOffline(true);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-industrial-bg text-industrial-text flex">
      {/* Vertical navigation */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main console content */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <Header 
          title="Operational console" 
          onMenuClick={() => setSidebarOpen(true)} 
          micActive={speech.listening} 
          systemHealth={systemHealth} 
          isOffline={isOffline}
        />
        
        <main className="flex-grow p-4 md:p-6">
          <Outlet context={{ 
            speech, 
            systemHealth, 
            setSystemHealth, 
            isOffline,
            copilotStep,
            setCopilotStep,
            copilotReport,
            setCopilotReport,
            copilotTicket,
            setCopilotTicket
          }} />
        </main>

        <CopilotOverlay
          step={copilotStep}
          report={copilotReport}
          onConfirm={handleCopilotConfirm}
          onCancel={handleCopilotCancel}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Console Workspace */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="machines" element={<MachineStatus />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="safety" element={<SafetyManuals />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="incidents" element={<IncidentReports />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
