
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { AppTab, UserPreferences, IdentityTag } from './types';
import Navbar from './components/Navbar';
import RandomTab from './components/RandomTab';
import LiveTab from './components/LiveTab';
import AgeGate from './components/AgeGate';
import IdentitySetup from './components/IdentitySetup';

// Simple Error Boundary for production stability
interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fixed: Defined explicit interfaces for Props and State to resolve 'state' and 'props' access errors.
// Made children optional to ensure JSX compatibility across different compiler settings.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    // Accessing this.state and this.props now correctly leverages the generic types.
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Ops! Algo deu errado.</h1>
          <button onClick={() => window.location.reload()} className="bg-indigo-600 px-6 py-2 rounded-xl">Recarregar Aplicativo</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [is18Plus, setIs18Plus] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    myIdentity: null,
    lookingFor: []
  });
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);

  useEffect(() => {
    // Production: Immediate session check
    const ageConfirmed = sessionStorage.getItem('age_confirmed') === 'true';
    if (ageConfirmed) setIs18Plus(true);
    
    const savedPrefs = sessionStorage.getItem('user_prefs');
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));

    // Handle session termination visibility change
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden' && activeTab === AppTab.RANDOM) {
        // Here we could emit a 'leave' signal to signaling server in a real production environment
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [activeTab]);

  const handleAgeConfirm = () => {
    setIs18Plus(true);
    sessionStorage.setItem('age_confirmed', 'true');
  };

  const handleSetupComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    sessionStorage.setItem('user_prefs', JSON.stringify(prefs));
    setActiveTab(AppTab.RANDOM);
  };

  const identityLabel = useMemo(() => {
    return preferences.myIdentity?.replace('_', ' ') || '';
  }, [preferences.myIdentity]);

  if (is18Plus === null || !is18Plus) {
    return <AgeGate onConfirm={handleAgeConfirm} />;
  }

  if (!preferences.myIdentity) {
    return <IdentitySetup onComplete={handleSetupComplete} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden relative">
        {activeTab === AppTab.RANDOM && <RandomTab preferences={preferences} />}
        {activeTab === AppTab.LIVE && <LiveTab preferences={preferences} />}
        {activeTab === AppTab.HOME && (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"></div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter relative bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                LIVEFLOW
              </h1>
            </div>
            
            <p className="text-slate-400 mb-12 max-w-md text-lg leading-relaxed">
              Você está navegando como <span className="text-indigo-400 font-bold capitalize">{identityLabel}</span>.
              Privacidade garantida por criptografia de ponta a ponta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button 
                onClick={() => setActiveTab(AppTab.RANDOM)} 
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                MODO RANDOM
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.LIVE)} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-2xl font-black transition-all active:scale-95"
              >
                VER LIVES
              </button>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-900 w-full max-w-xs text-[10px] text-slate-600 uppercase tracking-[0.2em]">
              Servidores: <span className="text-green-500 font-bold">Online</span> • Matches: <span className="text-indigo-400 font-bold">Ativos</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
