import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LandingHero } from './components/LandingHero';
import { DashboardGrid } from './components/DashboardGrid';
import { AgentTrace } from './components/AgentTrace';
import { CitizenRiskCard } from './components/CitizenRiskCard';
import { FederatedNetwork } from './components/FederatedNetwork';
import { ToastContainer } from './components/Toast';
import type { ToastItem } from './components/Toast';
import type { ForecastData } from './utils/api';
import { api } from './utils/api';
import { Sun, Moon, AlertTriangle, Activity, Brain, User, Network } from 'lucide-react';

type Screen = 'landing' | 'dashboard' | 'agent' | 'personal' | 'federated';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeZone, setActiveZone] = useState<string>('Zone_A');
  const [zoneData, setZoneData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDriftActive, setIsDriftActive] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Apply dark mode styling class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Load telemetry forecast data on zone switch or drift active trigger
  useEffect(() => {
    if (currentScreen === 'landing') return;
    
    let isMounted = true;
    const fetchTelemetry = async () => {
      setLoading(true);
      try {
        const data = await api.getForecast(activeZone);
        if (isMounted) {
          setZoneData(data);
        }
      } catch (err: any) {
        console.error('Failed to fetch forecast telemetry:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTelemetry();
    
    // Poll forecast data every 8 seconds for realism
    const interval = setInterval(fetchTelemetry, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeZone, currentScreen, isDriftActive]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Skip the landing screen directly to the dashboard
  const handleLaunch = () => {
    setCurrentScreen('dashboard');
  };

  if (currentScreen === 'landing') {
    return <LandingHero onLaunch={handleLaunch} />;
  }

  // Define screen layout
  const isAgentScreen = currentScreen === 'agent';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isAgentScreen 
        ? 'bg-aerova-navy-950 text-slate-100' 
        : 'bg-slate-50 dark:bg-aerova-navy-950 text-slate-900 dark:text-slate-100'
    }`}>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header bar */}
      <header className={`border-b px-6 py-4 flex justify-between items-center z-30 ${
        isAgentScreen 
          ? 'bg-aerova-navy-950/80 border-slate-800 backdrop-blur' 
          : 'bg-white/80 dark:bg-aerova-navy-950/80 border-slate-200 dark:border-slate-850 backdrop-blur'
      } sticky top-0`}>
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentScreen('landing')}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-aerova-blue to-aerova-teal flex items-center justify-center shadow shadow-aerova-teal/20">
            <span className="font-display font-bold text-white text-sm">A</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-base tracking-wider">AEROVA</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-450 font-mono">FAXAQ Decision Dashboard</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setCurrentScreen('dashboard')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              currentScreen === 'dashboard'
                ? 'bg-aerova-blue/10 text-aerova-blue dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-250'
            }`}
          >
            City Ops Dashboard
          </button>

          <button
            onClick={() => setCurrentScreen('personal')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              currentScreen === 'personal'
                ? 'bg-aerova-purple/10 text-aerova-purple'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-250'
            }`}
          >
            Personal Risk Guard
          </button>
          
          <button
            onClick={() => setCurrentScreen('agent')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              currentScreen === 'agent'
                ? 'bg-aerova-orange/10 text-aerova-orange'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-250'
            }`}
          >
            Agent ReAct Sandbox
          </button>

          <button
            onClick={() => setCurrentScreen('federated')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              currentScreen === 'federated'
                ? 'bg-aerova-blue/10 text-aerova-blue dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-250'
            }`}
          >
            Federated Network
          </button>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Light/Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl border transition-all ${
              isAgentScreen
                ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Quick status indicator */}
          <div className={`hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-semibold ${
            isDriftActive 
              ? 'bg-rose-500/10 border-rose-500/20 text-aerova-red animate-pulse' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-aerova-green'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDriftActive ? 'bg-aerova-red' : 'bg-aerova-green'}`} />
            <span>{isDriftActive ? 'COVARIATE DRIFT' : 'SYSTEM HEALTHY'}</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 container mx-auto px-6 py-8 relative pb-20 md:pb-8">
        {isDriftActive && currentScreen === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-rose-500/15 border border-rose-500/20 rounded-2xl flex items-start space-x-3 text-aerova-red"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm font-display">Active Data Drift Alert (Zone B)</h4>
              <p className="text-xs text-rose-450 dark:text-rose-300 mt-1 leading-relaxed">
                The Monitor Agent has flagged abnormal residuals in the Zone B environmental stream. High NO₂ levels (+50.6 ppb) and Traffic density (+80.2%) detected. Go to the <span className="underline font-bold cursor-pointer" onClick={() => setCurrentScreen('agent')}>Agent Sandbox</span> to run the self-healing Federated retraining pipeline.
              </p>
            </div>
          </motion.div>
        )}

        {currentScreen === 'dashboard' && (
          <DashboardGrid
            zoneData={zoneData}
            activeZone={activeZone}
            setActiveZone={setActiveZone}
            loading={loading}
            isDriftActive={isDriftActive}
          />
        )}

        {currentScreen === 'personal' && (
          <CitizenRiskCard addToast={addToast} />
        )}

        {currentScreen === 'agent' && (
          <AgentTrace
            addToast={addToast}
            onDriftStateChange={setIsDriftActive}
          />
        )}

        {currentScreen === 'federated' && (
          <FederatedNetwork />
        )}
      </main>

      {/* Quick navigation bottom bar for mobile screens */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-2 flex justify-around items-center z-35 ${
        isAgentScreen 
          ? 'bg-aerova-navy-950/90 border-slate-850 backdrop-blur' 
          : 'bg-white/90 dark:bg-aerova-navy-950/90 border-slate-200 dark:border-slate-850 backdrop-blur'
      }`}>
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentScreen === 'dashboard' ? 'text-aerova-blue' : 'text-slate-400'
          }`}
        >
          <Activity className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setCurrentScreen('personal')}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentScreen === 'personal' ? 'text-aerova-purple' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Risk Guard</span>
        </button>
        <button
          onClick={() => setCurrentScreen('agent')}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentScreen === 'agent' ? 'text-aerova-orange' : 'text-slate-400'
          }`}
        >
          <Brain className="w-5 h-5 mb-0.5" />
          <span>Agent</span>
        </button>
        <button
          onClick={() => setCurrentScreen('federated')}
          className={`flex flex-col items-center p-1 text-[10px] font-semibold ${
            currentScreen === 'federated' ? 'text-aerova-blue' : 'text-slate-400'
          }`}
        >
          <Network className="w-5 h-5 mb-0.5" />
          <span>Network</span>
        </button>
      </div>
    </div>
  );
}
