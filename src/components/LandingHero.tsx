import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Compass, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onLaunch: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunch }) => {
  return (
    <div className="relative min-h-screen bg-aerova-navy-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Background gradients for premium glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-aerova-blue/20 to-transparent blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-aerova-teal/20 to-transparent blur-[120px]" />
      <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] rounded-full bg-aerova-purple/10 blur-[100px]" />

      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-aerova-blue to-aerova-teal flex items-center justify-center shadow-lg shadow-aerova-teal/30">
            <span className="font-display font-bold text-white text-lg">A</span>
          </div>
          <span className="font-display font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-350">
            AEROVA
          </span>
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-aerova-teal/20 text-aerova-teal font-semibold border border-aerova-teal/30">
            FAXAQ 2.0
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm text-slate-400">
          <span className="hover:text-white transition-colors cursor-pointer">Prasunethon 2.0 Demo</span>
          <span className="h-4 w-px bg-slate-800" />
          <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono text-aerova-blue">
            Model Accuracy: 82.6%
          </span>
        </div>
      </header>

      {/* Hero content */}
      <main className="container mx-auto px-6 py-12 flex-1 flex flex-col justify-center items-center relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-4 py-1.5 rounded-full text-xs text-slate-300 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-aerova-teal animate-pulse" />
            <span>Autonomous Data Drift Calibration & Mitigation System</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight tracking-tight mt-4">
            Breathe smarter.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-aerova-blue via-aerova-teal to-aerova-green">
              Decide safer.
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
            Real-time urban environmental risk forecasting powered by localized Federated Learning and autonomous agentic self-healing pipelines.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLaunch}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-aerova-blue to-aerova-teal text-white rounded-2xl font-semibold shadow-lg shadow-aerova-blue/30 flex items-center justify-center space-x-3 group transition-shadow hover:shadow-aerova-blue/50"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <button
              onClick={onLaunch}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 font-semibold hover:bg-slate-850 hover:text-white transition-all"
            >
              Explore Agent Sandbox
            </button>
          </div>
        </motion.div>

        {/* Feature widgets */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24 text-left max-w-4xl"
        >
          <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-aerova-blue/15 border border-aerova-blue/20 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-aerova-blue" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-100 mb-2">Real-time Forecasts</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Highly accurate, zone-specific particulate and gaseous monitoring mapping real environmental data.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-aerova-teal/15 border border-aerova-teal/20 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-aerova-teal" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-100 mb-2">Federated Self-Healing</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Autonomous agents monitor model residuals, triggering localized decentralized retraining on covariate shift.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-aerova-purple/15 border border-aerova-purple/20 flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 text-aerova-purple" />
            </div>
            <h3 className="font-display font-semibold text-lg text-slate-100 mb-2">Personalized Diagnostics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tailored environmental risk calculation and explainable SHAP attributions for high-risk demographics.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-6 text-center text-xs text-slate-500 relative z-10 border-t border-slate-900">
        <p>© 2026 Aerova (FAXAQ) Research System. Submission for Prasunethon 2.0 Round 2.</p>
      </footer>
    </div>
  );
};
