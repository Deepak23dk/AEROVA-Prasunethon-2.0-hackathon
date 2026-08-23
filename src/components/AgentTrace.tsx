import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid 
} from 'recharts';
import { 
  Play, RefreshCw, Terminal, CheckCircle2, ShieldAlert, Cpu, AlertTriangle, MessageSquareCode
} from 'lucide-react';
import { api } from '../utils/api';
import type { AgentStep } from '../utils/api';
import type { ToastItem } from './Toast';

interface AgentTraceProps {
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  onDriftStateChange: (isActive: boolean) => void;
}

interface AccuracyPoint {
  step: number;
  time: string;
  aerova: number;
  staticFL: number;
}

export const AgentTrace: React.FC<AgentTraceProps> = ({ addToast, onDriftStateChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState<'idle' | 'injecting' | 'drift_detected' | 'orchestrating' | 'recovering' | 'stable'>('idle');
  const [currentAccuracy, setCurrentAccuracy] = useState(82.6);
  const [activeSteps, setActiveSteps] = useState<AgentStep[]>([]);
  const [chartData, setChartData] = useState<AccuracyPoint[]>([]);
  
  // Agent statuses
  const [agentStatuses, setAgentStatuses] = useState({
    Monitor: 'idle',
    Orchestrator: 'idle',
    Alert: 'idle',
    Policy: 'idle'
  });

  const traceEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll trace panel
  useEffect(() => {
    if (traceEndRef.current) {
      traceEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSteps]);

  // Seed normal chart data
  useEffect(() => {
    resetDemo();
  }, []);

  const resetDemo = () => {
    setIsPlaying(false);
    setProgress('idle');
    setCurrentAccuracy(82.6);
    setActiveSteps([]);
    onDriftStateChange(false);
    setAgentStatuses({
      Monitor: 'idle',
      Orchestrator: 'idle',
      Alert: 'idle',
      Policy: 'idle'
    });
    setChartData([
      { step: 1, time: 'T-10m', aerova: 82.6, staticFL: 82.6 },
      { step: 2, time: 'T-5m', aerova: 82.6, staticFL: 82.6 },
      { step: 3, time: 'Current', aerova: 82.6, staticFL: 82.6 },
    ]);
  };

  const handleSimulateSpike = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setProgress('injecting');
    onDriftStateChange(true);
    setActiveSteps([]);

    // Temporary storage for steps to avoid batching lags
    let tempSteps: AgentStep[] = [];

    const formatTime = () => new Date().toLocaleTimeString();

    try {
      // 1. Inject Drift
      await api.injectDrift('Zone_B', 10);
      
      setAgentStatuses(prev => ({ ...prev, Monitor: 'acting' }));
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. Fetch Monitor Anomaly
      const monitorData = await api.getMonitor('Zone_B');
      setProgress('drift_detected');
      
      const step1: AgentStep = {
        agent: 'Monitor',
        timestamp: formatTime(),
        thought: `Observe: Residual check triggered in Zone B. Residual is ${monitorData.residual} (threshold: ${monitorData.threshold}). Local non-stationarity / drift detected.`
      };
      tempSteps = [step1];
      setActiveSteps([...tempSteps]);
      setCurrentAccuracy(35.9);
      
      // Update chart to show accuracy drop
      setChartData(prev => [
        ...prev,
        { step: 4, time: 'Drift', aerova: 35.9, staticFL: 35.9 }
      ]);
      
      addToast({
        type: 'warning',
        title: 'Monitor Agent Triggered',
        message: `Residual is ${monitorData.residual} (threshold: 25.0) in Zone B. Drift detected.`
      });

      await new Promise(resolve => setTimeout(resolve, 1200));

      // 3. Orchestrate
      setProgress('orchestrating');
      setAgentStatuses(prev => ({ ...prev, Monitor: 'idle', Orchestrator: 'reasoning' }));
      
      const orchData = await api.orchestrate('Zone_B', monitorData);
      console.log('Orchestrator feedback action dispatched:', orchData.dispatched_action);
      
      const step2: AgentStep = {
        agent: 'Orchestrator',
        timestamp: formatTime(),
        thought: `Reason: Residual ${monitorData.residual} indicates significant covariate shift. Centralized retrain cost is too high. Dispatching local training parameters to Zone B FL client.`
      };
      tempSteps = [...tempSteps, step2];
      setActiveSteps([...tempSteps]);

      await new Promise(resolve => setTimeout(resolve, 1200));

      // 4. Alert & Policy Agents
      setAgentStatuses(prev => ({ ...prev, Orchestrator: 'idle', Alert: 'acting', Policy: 'acting' }));
      
      const step3: AgentStep = {
        agent: 'Alert',
        timestamp: formatTime(),
        thought: 'Act: Broadcasted localized health advisory to elderly & respiratory-sensitive citizens in Zone B.'
      };
      const step4: AgentStep = {
        agent: 'Policy',
        timestamp: formatTime(),
        thought: 'Act: Initiating target-calibrated FL weight refinement loop locally. Data isolation secured.'
      };
      
      tempSteps = [...tempSteps, step3, step4];
      setActiveSteps([...tempSteps]);
      
      addToast({
        type: 'info',
        title: 'Alert Agent: Public Warning',
        message: 'Localized health advisory broadcasted for Zone B.'
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      // 5. Accuracy Recovery Animation
      setProgress('recovering');
      setAgentStatuses(prev => ({ ...prev, Alert: 'idle', Policy: 'idle', Monitor: 'acting' }));
      
      // Animate accuracy recovery from 35.9% to 77.4%
      let startAcc = 35.9;
      const targetAcc = 77.4;
      const duration = 2000; // 2 seconds
      const stepsCount = 20;
      const stepDuration = duration / stepsCount;
      const increment = (targetAcc - startAcc) / stepsCount;

      for (let i = 1; i <= stepsCount; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        startAcc = Math.min(startAcc + increment, targetAcc);
        setCurrentAccuracy(parseFloat(startAcc.toFixed(1)));
      }

      // Add final recovery point to chart
      setChartData(prev => [
        ...prev,
        { step: 5, time: 'Recovered', aerova: 77.4, staticFL: 35.9 }
      ]);

      // 6. Complete Re-observe
      setProgress('stable');
      setAgentStatuses(prev => ({ ...prev, Monitor: 'idle' }));
      onDriftStateChange(false);
      
      const step5: AgentStep = {
        agent: 'Monitor',
        timestamp: formatTime(),
        thought: 'Re-observe: Local model weight calibration completed. Accuracy restored to 77.4%. Model residual returned to 12.1 (stable).'
      };
      
      setActiveSteps([...tempSteps, step5]);
      
      addToast({
        type: 'success',
        title: 'Drift Mitigated Successfully',
        message: 'Aerova restored model accuracy to 77.4%. Static model remains degraded.'
      });

    } catch (error: any) {
      addToast({
        type: 'warning',
        title: 'Simulation Error',
        message: error.message || 'An error occurred during agent execution.'
      });
      resetDemo();
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'Monitor': return 'text-aerova-teal bg-aerova-teal/10 border-aerova-teal/30';
      case 'Orchestrator': return 'text-aerova-orange bg-aerova-orange/10 border-aerova-orange/30';
      case 'Alert': return 'text-aerova-red bg-aerova-red/10 border-aerova-red/30';
      case 'Policy': return 'text-aerova-purple bg-aerova-purple/10 border-aerova-purple/30';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'reasoning': return 'bg-aerova-orange animate-pulse';
      case 'acting': return 'bg-aerova-red animate-pulse';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-100 min-h-[500px]">
      {/* Left 2 Columns: Agent trace, diagrams, execution console */}
      <div className="lg:col-span-2 bg-aerova-navy-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
        {/* Glowing background highlights */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-aerova-blue/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Console Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-aerova-red" />
            <div className="w-3 h-3 rounded-full bg-aerova-orange" />
            <div className="w-3 h-3 rounded-full bg-aerova-green" />
            <span className="font-mono text-xs text-slate-400 ml-2 flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1" />
              Agentic Sandbox (FAXAQ Pipeline)
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={resetDemo}
              disabled={!isPlaying || progress === 'recovering'}
              className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent"
              title="Reset Demo"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSimulateSpike}
              disabled={isPlaying}
              className="px-4 py-2 bg-gradient-to-r from-aerova-orange to-aerova-red text-white text-xs font-semibold rounded-xl flex items-center space-x-2 shadow-lg shadow-aerova-orange/20 hover:shadow-aerova-orange/45 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Pollution Spike</span>
            </button>
          </div>
        </div>

        {/* Dynamic Pipeline Diagram */}
        <div className="grid grid-cols-4 gap-2 py-4 relative">
          {/* Connecting Line Flow */}
          <div className="absolute top-8 left-[12%] right-[12%] h-[2px] bg-slate-800 -z-0">
            {progress === 'orchestrating' && (
              <div className="h-full bg-gradient-to-r from-aerova-orange to-aerova-purple animate-pulse w-full" />
            )}
            {progress === 'recovering' && (
              <div className="h-full bg-gradient-to-r from-aerova-purple to-aerova-teal animate-pulse w-full" />
            )}
          </div>

          {/* Monitor Agent Card */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              agentStatuses.Monitor !== 'idle' ? 'border-aerova-teal pulse-glow-monitor bg-aerova-teal/20' : 'border-slate-800 bg-slate-950'
            }`}>
              <Cpu className="w-6 h-6 text-aerova-teal" />
            </div>
            <span className="text-[11px] font-semibold mt-2">Monitor</span>
            <span className="text-[9px] text-slate-500 uppercase flex items-center mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(agentStatuses.Monitor)}`} />
              {agentStatuses.Monitor}
            </span>
          </div>

          {/* Orchestrator Agent Card */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              agentStatuses.Orchestrator !== 'idle' ? 'border-aerova-orange pulse-glow-monitor bg-aerova-orange/20' : 'border-slate-800 bg-slate-950'
            }`}>
              <MessageSquareCode className="w-6 h-6 text-aerova-orange" />
            </div>
            <span className="text-[11px] font-semibold mt-2">Orchestrator</span>
            <span className="text-[9px] text-slate-500 uppercase flex items-center mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(agentStatuses.Orchestrator)}`} />
              {agentStatuses.Orchestrator}
            </span>
          </div>

          {/* Alert Agent Card */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              agentStatuses.Alert !== 'idle' ? 'border-aerova-red pulse-glow-red bg-aerova-red/20' : 'border-slate-800 bg-slate-950'
            }`}>
              <ShieldAlert className="w-6 h-6 text-aerova-red" />
            </div>
            <span className="text-[11px] font-semibold mt-2">Alert</span>
            <span className="text-[9px] text-slate-500 uppercase flex items-center mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(agentStatuses.Alert)}`} />
              {agentStatuses.Alert}
            </span>
          </div>

          {/* Policy Agent Card */}
          <div className="flex flex-col items-center z-10">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              agentStatuses.Policy !== 'idle' ? 'border-aerova-purple pulse-glow-monitor bg-aerova-purple/20' : 'border-slate-800 bg-slate-950'
            }`}>
              <AlertTriangle className="w-6 h-6 text-aerova-purple" />
            </div>
            <span className="text-[11px] font-semibold mt-2">Policy</span>
            <span className="text-[9px] text-slate-500 uppercase flex items-center mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full mr-1 ${getStatusDot(agentStatuses.Policy)}`} />
              {agentStatuses.Policy}
            </span>
          </div>
        </div>

        {/* Live ReAct Trace Panel */}
        <div className="flex-1 bg-slate-950/80 rounded-xl p-4 border border-slate-850 h-56 overflow-y-auto font-mono text-xs flex flex-col space-y-3">
          {activeSteps.length === 0 ? (
            <div className="text-slate-500 flex-1 flex items-center justify-center">
              <span>Sandbox idle. Click "Simulate Pollution Spike" to run trace pipeline.</span>
            </div>
          ) : (
            <>
              {activeSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="border-l-2 border-slate-800 pl-3 py-1 space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${getAgentColor(step.agent)}`}>
                      {step.agent} Agent
                    </span>
                    <span className="text-[10px] text-slate-500">{step.timestamp}</span>
                  </div>
                  <p className="text-slate-350 leading-relaxed text-[11px]">
                    {step.thought}
                  </p>
                </motion.div>
              ))}
              <div ref={traceEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Right Column: Comparative Graph Panel */}
      <div className="bg-aerova-navy-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl relative">
        <div>
          <h3 className="font-display font-semibold text-base text-slate-200">
            Mitigation Performance
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Real-time accuracy comparison under drift: Static centralized model vs. Aerova self-healing federated update.
          </p>
        </div>

        {/* Accuracy Gauge Block */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-mono">Current Accuracy</span>
          <div className="text-5xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-aerova-teal to-aerova-blue my-2">
            {currentAccuracy}%
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono border-t border-slate-900 pt-2 mt-2">
            <span className="text-slate-500">Static model: 35.9%</span>
            <span className="text-aerova-teal">Target: 77.4%</span>
          </div>
        </div>

        {/* Line Chart comparing models */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
              <YAxis domain={[20, 100]} stroke="#64748b" fontSize={9} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#020617', 
                  border: '1px solid #1e293b', 
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '11px'
                }} 
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              <Line 
                name="Aerova (Self-Healing)" 
                type="monotone" 
                dataKey="aerova" 
                stroke="#0EA5A5" 
                strokeWidth={3} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                name="Static Model (No Agent)" 
                type="monotone" 
                dataKey="staticFL" 
                stroke="#64748b" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recovery Badge Banner */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {progress === 'stable' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center space-x-2 text-aerova-green bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-semibold"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Drift Mitigated to 77.4%</span>
              </motion.div>
            )}
            {progress === 'recovering' && (
              <div className="flex items-center space-x-2 text-aerova-orange animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-xs font-semibold font-mono">Calibrating Client weights...</span>
              </div>
            )}
            {progress === 'drift_detected' && (
              <div className="flex items-center space-x-2 text-aerova-red animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-semibold font-mono">Anomaly Active (35.9% Acc)</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
