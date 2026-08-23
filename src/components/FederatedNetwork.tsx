import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Server, ShieldCheck, Database, Info 
} from 'lucide-react';

export const FederatedNetwork: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const stats = [
    { name: 'Centralized Baseline', value: '82.5%', desc: 'Unified global training pool' },
    { name: 'Standard FL-only', value: '82.6%', desc: 'Decentralized local nodes' },
    { name: 'Aerova (Self-Healing)', value: '82.6%', desc: 'Federated + Agentic calibration' }
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Topology Header Info */}
      <div className="bg-white dark:bg-aerova-navy-900 border border-slate-200/60 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-aerova-blue/10 flex items-center justify-center">
            <Network className="w-5 h-5 text-aerova-blue" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200">
              Federated Learning Network Topology
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-405">
              Visualizing the secure client-server weight-sharing pipeline mapping multi-city environmental nodes.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/20 text-aerova-green px-3.5 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy-Preserving Secured (0% raw logs shared)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Animated Topology (2 columns width) */}
        <div className="lg:col-span-2 bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[420px] relative overflow-hidden">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">
              Secure Aggregation Cycle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">
              Click on any regional node to audit its raw records privacy metrics.
            </p>
          </div>

          {/* Interactive Topology Graph Area */}
          <div className="flex-1 flex items-center justify-center py-6 relative">
            <svg className="w-full max-w-lg h-56" viewBox="0 0 300 160">
              {/* Flow Path Lines */}
              {/* City A -> Aggregator */}
              <path d="M 50 120 Q 90 90 150 70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" fill="none" className="dark:stroke-slate-700" />
              {/* City B -> Aggregator */}
              <path d="M 150 130 L 150 70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" fill="none" className="dark:stroke-slate-700" />
              {/* City C -> Aggregator */}
              <path d="M 250 120 Q 210 90 150 70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" fill="none" className="dark:stroke-slate-700" />

              {/* Pulsing signal bubbles representing weight transfers */}
              <motion.circle r="3" fill="#1C7293"
                animate={{ cx: [50, 150], cy: [120, 70] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              />
              <motion.circle r="3" fill="#0EA5A5"
                animate={{ cx: [150, 150], cy: [130, 70] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "linear", delay: 0.5 }}
              />
              <motion.circle r="3" fill="#8B5CF6"
                animate={{ cx: [250, 150], cy: [120, 70] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: "linear", delay: 1 }}
              />

              {/* Server Central Node (Aggregator) */}
              <g transform="translate(150, 60)" className="cursor-pointer" onClick={() => setActiveTooltip('server')}>
                <circle r="18" fill="#0f172a" className="stroke-2 stroke-aerova-blue shadow-lg" />
                <Server className="w-5 h-5 text-aerova-blue -translate-x-2.5 -translate-y-2.5" />
              </g>
              <text x="150" y="34" textAnchor="middle" className="text-[10px] font-bold fill-slate-700 dark:fill-slate-300 font-display">Secure Server Aggregator</text>

              {/* Client Node: City A */}
              <g transform="translate(50, 125)" className="cursor-pointer" onClick={() => setActiveTooltip('cityA')}>
                <circle r="14" fill="#0f172a" className="stroke-2 stroke-aerova-teal hover:fill-slate-800" />
                <Database className="w-4 h-4 text-aerova-teal -translate-x-2 -translate-y-2" />
              </g>
              <text x="50" y="152" textAnchor="middle" className="text-[9px] font-semibold fill-slate-600 dark:fill-slate-400">City A Client</text>

              {/* Client Node: City B */}
              <g transform="translate(150, 135)" className="cursor-pointer" onClick={() => setActiveTooltip('cityB')}>
                <circle r="14" fill="#0f172a" className="stroke-2 stroke-aerova-blue hover:fill-slate-800" />
                <Database className="w-4 h-4 text-aerova-blue -translate-x-2 -translate-y-2" />
              </g>
              <text x="150" y="160" textAnchor="middle" className="text-[9px] font-semibold fill-slate-600 dark:fill-slate-400">City B Client</text>

              {/* Client Node: City C */}
              <g transform="translate(250, 125)" className="cursor-pointer" onClick={() => setActiveTooltip('cityC')}>
                <circle r="14" fill="#0f172a" className="stroke-2 stroke-aerova-purple hover:fill-slate-800" />
                <Database className="w-4 h-4 text-aerova-purple -translate-x-2 -translate-y-2" />
              </g>
              <text x="250" y="152" textAnchor="middle" className="text-[9px] font-semibold fill-slate-600 dark:fill-slate-400">City C Client</text>
            </svg>

            {/* Tooltip Overlay panel */}
            <AnimatePresence>
              {activeTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute bottom-4 left-6 right-6 bg-slate-900 border border-slate-800 p-3.5 rounded-xl text-xs text-white shadow-xl z-20 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold block font-display text-aerova-blue">
                      {activeTooltip === 'server' ? 'Global Aggregate Server' : `Regional Node: ${activeTooltip.toUpperCase()}`}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {activeTooltip === 'server' 
                        ? 'Consolidates local encrypted weight parameters into global baseline weights.' 
                        : '0% of raw records leave this node — only model weights are shared.'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveTooltip(null)} 
                    className="text-[10px] text-slate-400 hover:text-white underline ml-3 font-semibold focus:outline-none"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 text-[10px] text-slate-450 dark:text-slate-555 flex items-center space-x-2">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              <strong>Secure Architecture Notice</strong>: Aerova nodes retrain client model segments locally over secure telemetry sockets, mapping weight updates directly while protecting all local personal identity logs.
            </span>
          </div>
        </div>

        {/* Right Column: Comparative Metrics Stats (1 column width) */}
        <div className="bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 min-h-[420px]">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">
              Accuracy Comparisons
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
              Decentralized Federated pipelines achieve target accuracy equivalents without central privacy risks.
            </p>
          </div>

          <div className="space-y-4">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-350">{stat.name}</span>
                  <span className="text-sm font-bold font-mono text-aerova-blue">{stat.value}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 text-[10px] font-mono leading-relaxed text-slate-400 text-center">
            🔒 Privacy Cost Overhead: ~0.0%<br />
            Baseline accuracy preserved.
          </div>
        </div>
      </div>
    </div>
  );
};
