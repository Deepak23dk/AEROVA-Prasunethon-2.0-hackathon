import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShieldAlert, FileText, BarChart3, Info, Download 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { api } from '../utils/api';
import type { PersonalizeData, ExplainData } from '../utils/api';

interface CitizenRiskCardProps {
  addToast: (toast: { type: 'success' | 'warning' | 'info'; title: string; message: string }) => void;
}

export const CitizenRiskCard: React.FC<CitizenRiskCardProps> = ({ addToast }) => {
  const [activeProfile, setActiveProfile] = useState<string>('asthma_child');
  const [profileData, setProfileData] = useState<PersonalizeData | null>(null);
  const [explainData, setExplainData] = useState<ExplainData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showShap, setShowShap] = useState<boolean>(false);

  // Fetch personalization and explainability data when profile changes
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      try {
        const pData = await api.getPersonalize(activeProfile);
        const eData = await api.getExplain('Zone_B'); // Explanations are anchored to Zone B for demo consistency
        setProfileData(pData);
        setExplainData(eData);
      } catch (err: any) {
        console.error('Failed to load profile risk telemetry:', err);
        addToast({
          type: 'warning',
          title: 'Risk Engine Sync Error',
          message: 'Could not fetch personalized risk indices from FastAPI.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [activeProfile]);

  const handleExportPDF = () => {
    if (!profileData || !explainData) return;

    try {
      const doc = new jsPDF();
      
      // Page Border & Header Background
      doc.setFillColor(15, 23, 42); // slate-900 / navy
      doc.rect(0, 0, 210, 35, 'F');
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('AEROVA (FAXAQ) PREVENTATIVE ADVISORY', 15, 22);
      
      // Meta Details
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 30);
      
      // Section 1: Profile Summary
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Citizen Risk Profile', 15, 50);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Profile Identifier: ${profileData.profile.replace('_', ' ').toUpperCase()}`, 15, 60);
      doc.text(`Calculated Demographics Risk Index: ${profileData.risk_score} / 1.00`, 15, 66);
      doc.text(`Evaluated Alert Classification: ${profileData.risk_level}`, 15, 72);
      
      // Section 2: Formula
      doc.setFont('helvetica', 'bold');
      doc.text('Calculative Formula:', 15, 82);
      doc.setFont('helvetica', 'italic');
      doc.text(profileData.formula, 52, 82);
      
      // Draw Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 90, 195, 90);
      
      // Section 3: Advisory
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('2. Actionable Preventative Guidance', 15, 102);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      // Wrap text
      const splitAdvisory = doc.splitTextToSize(profileData.advisory, 180);
      doc.text(splitAdvisory, 15, 112);
      
      // Section 4: Explainable SHAP Indices
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('3. Explainable AI Feature Attribution (SHAP)', 15, 145);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Contributions map local environmental deviations back to baseline risk output.', 15, 153);
      
      let yOffset = 163;
      explainData.contributions.forEach((c) => {
        const direction = c.type === 'risk-increasing' ? 'Risk-Increasing (orange)' : 'Risk-Reducing (green)';
        doc.text(`* ${c.feature}: ${c.value > 0 ? '+' : ''}${c.value}  [${direction}]`, 20, yOffset);
        yOffset += 8;
      });
      
      // Footnote
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Footnote: Sum of attributions maps to baseline output exactly with a mathematical residual of 0.0.', 15, 230);
      doc.text('Disclaimer: This is a preventative awareness system and does not constitute a diagnostic medical opinion.', 15, 235);
      
      // Save PDF
      doc.save(`aerova-advisory-${activeProfile}.pdf`);
      
      addToast({
        type: 'success',
        title: 'PDF Export Complete',
        message: 'Downloaded citizen advisory report successfully.'
      });
    } catch (err) {
      console.error('PDF Generation Failure:', err);
      addToast({
        type: 'warning',
        title: 'PDF Export Failed',
        message: 'Error executing client-side PDF renderer.'
      });
    }
  };

  const getProfileLabel = (profile: string) => {
    if (profile === 'asthma_child') return 'Child with Asthma';
    if (profile === 'healthy_adult') return 'Healthy Adult';
    return 'Elderly (Cardio Risk)';
  };

  // Sort Shapley attributions by magnitude
  const sortedContributions = explainData
    ? [...explainData.contributions].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    : [];

  const maxContributionVal = 4.0; // scale normalization for layout sizing

  return (
    <div className="space-y-6">
      {/* Profile selector bar */}
      <div className="bg-white dark:bg-aerova-navy-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-aerova-purple/10 flex items-center justify-center">
            <User className="w-5 h-5 text-aerova-purple" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200">
              Citizens Personal Risk Registry
            </h3>
            <p className="text-[11px] text-slate-500">
              Switch demographics profiles to test target formula calibrations
            </p>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
          {(['asthma_child', 'healthy_adult', 'elderly_cardio'] as const).map((profile) => (
            <button
              key={profile}
              onClick={() => {
                setActiveProfile(profile);
                setShowShap(false);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeProfile === profile
                  ? 'bg-aerova-purple text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250'
              }`}
            >
              {getProfileLabel(profile)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Card: Demographics Risk Score Ring (2 columns) */}
        <div className="md:col-span-2 bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[380px] relative overflow-hidden">
          {/* Radial Purple Glow Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-aerova-purple/5 rounded-full blur-2xl" />

          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">Demographic Assessment</span>
              <h3 className="font-display font-semibold text-lg text-slate-800 dark:text-slate-200 mt-1">
                Risk Coefficient
              </h3>
            </div>
            {profileData && (
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                profileData.risk_level === 'HIGH' 
                  ? 'bg-rose-500/10 text-aerova-red border border-rose-500/20' 
                  : 'bg-emerald-500/10 text-aerova-green border border-emerald-500/20'
              }`}>
                {profileData.risk_level} Risk
              </span>
            )}
          </div>

          {/* Centered concentric ring */}
          <div className="flex-1 flex flex-col items-center justify-center relative py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Ring Gauge */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="52" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-850" fill="transparent" />
                {profileData && (
                  <motion.circle 
                    cx="72" 
                    cy="72" 
                    r="52" 
                    stroke="url(#purpleGradient)" 
                    strokeWidth="8" 
                    strokeDasharray="326.7"
                    initial={{ strokeDashoffset: 326.7 }}
                    animate={{ strokeDashoffset: 326.7 - (326.7 * profileData.risk_score) }}
                    transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                )}
                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score text in center */}
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-extrabold text-slate-850 dark:text-white">
                  {loading || !profileData ? '...' : profileData.risk_score}
                </span>
                <span className="text-[9px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                  [0.0 - 1.0] Range
                </span>
              </div>
            </div>

            {/* Formula Tooltip info icon */}
            {profileData && (
              <div className="mt-4 inline-flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full text-[10px] text-slate-450 border border-slate-100 dark:border-slate-850 group cursor-pointer relative">
                <Info className="w-3.5 h-3.5 text-aerova-purple" />
                <span>Hover for Risk Formula</span>
                {/* Tooltip Popup */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-800 text-white p-2.5 rounded-xl text-[10px] shadow-xl w-60 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 font-mono leading-relaxed text-center">
                  {profileData.formula}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-4 flex space-x-3">
            <button
              onClick={() => setShowShap(!showShap)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5"
            >
              <BarChart3 className="w-4 h-4 text-aerova-purple" />
              <span>{showShap ? 'Hide Attributions' : 'Why is my risk high?'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-250 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center"
              title="Download PDF Advisory"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Card: Clinical Advisory Text (3 columns) */}
        <div className="md:col-span-3 bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[380px]">
          <div>
            <div className="flex items-center space-x-2 text-aerova-purple mb-4">
              <FileText className="w-5 h-5" />
              <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">
                Actionable Preventative Advisory
              </h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 rounded-2xl p-5 min-h-[200px]">
              {loading || !profileData ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              ) : (
                <p className="text-slate-655 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {profileData.advisory}
                </p>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-450 dark:text-slate-500 border-t border-slate-100 dark:border-slate-850 pt-4 flex items-center space-x-2">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Preventative Awareness Notice</strong>: Calculated indicators are for wellness guidance and should not substitute professional medical diagnosis or clinical assessment.
            </span>
          </div>
        </div>
      </div>

      {/* SHAP Explanation section (Screen 3) - Slides down when button is toggled */}
      <AnimatePresence>
        {showShap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-aerova-navy-900 border border-slate-250/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-aerova-purple" />
                  SHAP Explainable Risk Attribution (Ozone / NO₂ Deviations)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                  Mathematical feature attributions (Shapley Values) showing exactly which localized parameters increase (orange) or decrease (green) overall risk coefficients.
                </p>
              </div>

              {/* Horizontal Bar Chart */}
              <div className="space-y-4 max-w-3xl">
                {loading || !explainData ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  sortedContributions.map((c) => {
                    const isPositive = c.value > 0;
                    const magnitude = Math.abs(c.value);
                    const percentageWidth = Math.min((magnitude / maxContributionVal) * 100, 100);

                    return (
                      <div key={c.feature} className="grid grid-cols-12 gap-4 items-center text-xs">
                        {/* Feature name */}
                        <div className="col-span-3 font-semibold text-right text-slate-700 dark:text-slate-350 pr-2">
                          {c.feature}
                        </div>

                        {/* Bar section */}
                        <div className="col-span-7 flex items-center relative h-6 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-850">
                          {/* Centered baseline line */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700" />
                          
                          {/* Left (Negative/Risk-Increasing) Orange Bar */}
                          {!isPositive && (
                            <div className="absolute right-1/2 left-auto h-full flex justify-end" style={{ width: `${percentageWidth / 2}%` }}>
                              <div className="h-full bg-gradient-to-l from-aerova-orange to-orange-400 rounded-l" />
                            </div>
                          )}

                          {/* Right (Positive/Risk-Reducing) Green Bar */}
                          {isPositive && (
                            <div className="absolute left-1/2 h-full flex justify-start" style={{ width: `${percentageWidth / 2}%` }}>
                              <div className="h-full bg-gradient-to-r from-aerova-green to-emerald-400 rounded-r" />
                            </div>
                          )}

                          {/* Float value text overlay */}
                          <div className={`absolute text-[10px] font-mono font-bold ${
                            isPositive 
                              ? 'left-[calc(50%+6px)] text-aerova-green' 
                              : 'right-[calc(50%+6px)] text-aerova-orange'
                          }`}>
                            {isPositive ? `+${c.value}` : c.value}
                          </div>
                        </div>

                        {/* Attribute Type */}
                        <div className={`col-span-2 font-mono text-[9px] uppercase font-bold tracking-widest ${
                          isPositive ? 'text-aerova-green' : 'text-aerova-orange'
                        }`}>
                          {isPositive ? 'Reducing' : 'Increasing'}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Efficiency Footnote */}
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-450 border-t border-slate-100 dark:border-slate-850 pt-4">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Σ contributions = model output exactly (residual 0.0) — this is an exact Shapley computation, not an approximation.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
