import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col p-6 space-y-4 animate-pulse bg-white border border-slate-100 rounded-2xl dark:bg-aerova-navy-900 dark:border-slate-800">
      <div className="flex justify-between items-center">
        <div className="w-1/3 h-6 bg-slate-200 rounded dark:bg-slate-800"></div>
        <div className="w-10 h-10 bg-slate-200 rounded-full dark:bg-slate-800"></div>
      </div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-2 bg-slate-200 rounded dark:bg-slate-800"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-2 col-span-2 bg-slate-200 rounded dark:bg-slate-800"></div>
          <div className="h-2 col-span-1 bg-slate-200 rounded dark:bg-slate-800"></div>
        </div>
        <div className="h-2 bg-slate-200 rounded dark:bg-slate-800"></div>
      </div>
      <div className="h-24 bg-slate-100 rounded-xl dark:bg-slate-800"></div>
    </div>
  );
};

export const CardSkeleton: React.FC<{ height?: string }> = ({ height = 'h-48' }) => {
  return (
    <div className={`w-full ${height} animate-pulse bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between dark:bg-aerova-navy-900 dark:border-slate-850`}>
      <div className="h-4 w-1/4 bg-slate-200 rounded dark:bg-slate-800"></div>
      <div className="space-y-2">
        <div className="h-8 w-3/4 bg-slate-300 rounded dark:bg-slate-700"></div>
        <div className="h-3 w-1/2 bg-slate-200 rounded dark:bg-slate-800"></div>
      </div>
    </div>
  );
};
