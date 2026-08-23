import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  MapPin, GripVertical, Info 
} from 'lucide-react';
import type { ForecastData } from '../utils/api';

interface DashboardGridProps {
  zoneData: ForecastData | null;
  activeZone: string;
  setActiveZone: (zone: string) => void;
  loading: boolean;
  isDriftActive: boolean;
}

// Initial order of the widgets
type WidgetId = 'map' | 'aqiRing' | 'forecast' | 'metrics';

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  zoneData,
  activeZone,
  setActiveZone,
  loading,
  isDriftActive
}) => {
  const [widgets, setWidgets] = useState<WidgetId[]>(['map', 'aqiRing', 'forecast', 'metrics']);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('widgetIndex', index.toString());
    setDraggedIdx(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('widgetIndex'), 10);
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return;

    const newWidgets = [...widgets];
    const [moved] = newWidgets.splice(sourceIndex, 1);
    newWidgets.splice(targetIndex, 0, moved);
    setWidgets(newWidgets);
    setDraggedIdx(null);
  };

  // Convert zone keys for display
  const getZoneLabel = (key: string) => {
    return key.replace('_', ' ');
  };

  const getAQIColor = (aqi: number) => {
    if (aqi < 50) return { border: 'border-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10' };
    if (aqi < 85) return { border: 'border-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10' };
    return { border: 'border-rose-500', text: 'text-rose-500', bg: 'bg-rose-500/10' };
  };

  const renderWidget = (id: WidgetId) => {
    switch (id) {
      case 'map':
        return (
          <div className="bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200 flex items-center">
                  <MapPin className="w-4.5 h-4.5 mr-2 text-aerova-blue" />
                  Smart City Zone Map
                </h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">
                  GIS Simulation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-450 mb-4">
                Select a zone pin on the sensor grid to load real-time micro-climate AQI telemetry.
              </p>
            </div>
            
            {/* Stylized Vector City Map */}
            <div className="relative w-full h-44 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full text-slate-350 dark:text-slate-850" viewBox="0 0 200 100" preserveAspectRatio="none">
                {/* Simulated streets grid */}
                <path d="M 0 20 L 200 20 M 0 50 L 200 50 M 0 80 L 200 80 M 40 0 L 40 100 M 100 0 L 100 100 M 160 0 L 160 100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                {/* City river block */}
                <path d="M 0 90 Q 60 70 120 85 T 200 70 L 200 100 L 0 100 Z" fill="rgba(28, 114, 147, 0.05)" />
              </svg>

              {/* Zone Pins */}
              {/* Zone A */}
              <button 
                onClick={() => setActiveZone('Zone_A')}
                className="absolute left-[25%] top-[30%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none z-15"
              >
                <div className={`p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 ${activeZone === 'Zone_A' ? 'bg-aerova-blue text-white ring-4 ring-aerova-blue/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-aerova-blue border border-slate-200 dark:border-slate-700'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-white dark:bg-slate-800">Zone A</span>
              </button>

              {/* Zone B */}
              <button 
                onClick={() => setActiveZone('Zone_B')}
                className="absolute left-[55%] top-[55%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none z-15"
              >
                <div className={`p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 ${activeZone === 'Zone_B' ? (isDriftActive ? 'bg-aerova-red text-white ring-4 ring-aerova-red/30 animate-bounce' : 'bg-aerova-blue text-white ring-4 ring-aerova-blue/30') : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-aerova-blue border border-slate-200 dark:border-slate-700'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-white dark:bg-slate-800">
                  {isDriftActive && activeZone !== 'Zone_B' ? '⚠️ Zone B' : 'Zone B'}
                </span>
              </button>

              {/* Zone C */}
              <button 
                onClick={() => setActiveZone('Zone_C')}
                className="absolute left-[80%] top-[40%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none z-15"
              >
                <div className={`p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 ${activeZone === 'Zone_C' ? 'bg-aerova-blue text-white ring-4 ring-aerova-blue/30' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-aerova-blue border border-slate-200 dark:border-slate-700'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900/90 text-white dark:bg-slate-800">Zone C</span>
              </button>
            </div>
          </div>
        );

      case 'aqiRing':
        const currentAQI = zoneData?.current_aqi || 0;
        const colorSet = getAQIColor(currentAQI);
        const maxAQI = 150;
        const percentage = Math.min(currentAQI / maxAQI, 1);

        return (
          <div className="bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 h-full flex flex-col shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">
                Air Quality Index ({getZoneLabel(activeZone)})
              </h3>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${colorSet.bg} ${colorSet.text}`}>
                {zoneData?.risk_level}
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-2 relative">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="50" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-850" fill="transparent" />
                  <motion.circle 
                    cx="72" 
                    cy="72" 
                    r="50" 
                    stroke="url(#aqiGradient)" 
                    strokeWidth="10" 
                    strokeDasharray="314.16"
                    initial={{ strokeDashoffset: 314.16 }}
                    animate={{ strokeDashoffset: 314.16 - (314.16 * percentage) }}
                    transition={{ type: 'spring', stiffness: 60, damping: 15 }}
                    strokeLinecap="round" 
                    fill="transparent" 
                  />
                  <defs>
                    <linearGradient id="aqiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22C55E" />
                      <stop offset="50%" stopColor="#F2994A" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Absolute Center Text */}
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-4xl font-display font-extrabold text-slate-850 dark:text-white">
                    {loading ? '...' : currentAQI}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
                    AQI Value
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'forecast':
        const chartData = zoneData?.forecast || [];
        const isRed = zoneData?.risk_level === 'red';

        return (
          <div className="bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 h-full flex flex-col shadow-sm md:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">
                  7-Hour AQI Trend Forecast
                </h3>
                <p className="text-[11px] text-slate-450">
                  Gradient maps expected local non-stationarity factors
                </p>
              </div>
              {isDriftActive && (
                <div className="flex items-center space-x-1 text-xs text-aerova-red font-semibold bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-aerova-red rounded-full"></span>
                  <span>Active Drift Injected</span>
                </div>
              )}
            </div>

            <div className="flex-1 w-full min-h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isRed ? "#EF4444" : "#1C7293"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isRed ? "#EF4444" : "#1C7293"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 'dataMax + 20']} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }} 
                  />
                  <Area type="monotone" dataKey="aqi" stroke={isRed ? "#EF4444" : "#1C7293"} strokeWidth={2.5} fillOpacity={1} fill="url(#colorAqi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'metrics':
        return (
          <div className="bg-white dark:bg-aerova-navy-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-200">
                Pollution Telemetry
              </h3>
              <Info className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-650 dark:hover:text-slate-200" />
            </div>

            <div className="space-y-4">
              {/* NO2 */}
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">Nitrogen Dioxide (NO₂)</span>
                  <div className="text-xl font-display font-bold text-slate-850 dark:text-slate-250 mt-0.5">
                    {loading ? '...' : `${zoneData?.current_no2} ppb`}
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${zoneData && zoneData.current_no2 > 40 ? 'bg-aerova-red animate-pulse' : 'bg-aerova-green'}`} />
              </div>

              {/* Traffic */}
              <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-450 font-medium">Traffic Density Index</span>
                  <div className="text-xl font-display font-bold text-slate-850 dark:text-slate-250 mt-0.5">
                    {loading ? '...' : `${zoneData?.current_traffic}%`}
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${zoneData && zoneData.current_traffic > 70 ? 'bg-aerova-red animate-pulse' : 'bg-aerova-green'}`} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Draggable grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map((widgetId, index) => {
          const isSpan = widgetId === 'forecast';
          return (
            <div
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className={`relative transition-all duration-300 ${isSpan ? 'md:col-span-2' : ''} ${draggedIdx === index ? 'opacity-40 scale-95 border-dashed border-aerova-blue' : ''}`}
            >
              {/* Drag handle overlay */}
              <div className="absolute top-3 right-3 z-20 cursor-grab text-slate-350 dark:text-slate-650 hover:text-slate-500 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="group h-full relative border border-transparent rounded-2xl">
                {/* Visual drag handle dot for UI affordance */}
                <div className="absolute top-2.5 right-2 opacity-30 group-hover:opacity-80 transition-opacity cursor-grab p-1">
                  <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                </div>
                {renderWidget(widgetId)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
