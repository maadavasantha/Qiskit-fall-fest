import React, { useState } from 'react';
import { ShieldAlert, Play, SlidersHorizontal, Download, Loader2 } from 'lucide-react';
import { ATTACK_SCENARIOS } from '../data/mockDatabase';
import { TransactionInput } from '../types';
import { downloadProjectZip } from '../services/zipExporter';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRunAttackScenario: (scenario: (typeof ATTACK_SCENARIOS)[0]) => void;
  adaptiveFactor: number;
  onToggleAdaptiveFactor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onRunAttackScenario,
  adaptiveFactor,
  onToggleAdaptiveFactor,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      await downloadProjectZip();
    } catch (err) {
      console.error('Failed to download project zip:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const tabs = [
    { id: 'analyzer', label: 'Transaction Analyzer' },
    { id: 'quantum', label: 'Quantum ML Lab' },
    { id: 'network', label: 'Fraud Graph & Mules' },
    { id: 'benchmark', label: 'Model Benchmark' },
    { id: 'explain', label: 'Explainability (XAI)' },
    { id: 'response', label: 'Response Center' },
    { id: 'workspace', label: 'Project Architecture' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm tracking-tighter shadow-sm shadow-cyan-900/30">
            Q5
          </div>
          <div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('analyzer');
              }}
              className="text-base font-bold tracking-tight text-slate-100 hover:text-cyan-400 transition-colors"
            >
              VNQFF-05
            </a>
            <span className="hidden sm:inline text-xs text-slate-400 ml-2">
              Quantum-Enhanced Payment Fraud Intelligence
            </span>
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-medium text-slate-400">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`transition-colors whitespace-nowrap pb-0.5 border-b-2 ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* 1-Click Download Project Zip */}
          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-md shadow-sm shadow-cyan-950/40 transition-all cursor-pointer"
            title="Download full VNQFF-05 Python project as a ZIP archive"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? 'Packaging...' : 'Download Project (.ZIP)'}</span>
          </button>

          {/* Quick attack simulator selector */}
          <div className="relative group">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-md transition-colors"
              title="Test predefined attack vectors"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Attack Simulation</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 p-1.5 bg-slate-900 border border-slate-800 rounded-lg shadow-xl shadow-black/60 hidden group-hover:block z-50">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800/80 mb-1">
                Select Attack Vector
              </div>
              {ATTACK_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => onRunAttackScenario(sc)}
                  className="w-full text-left px-2.5 py-1.5 text-xs rounded text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <div className="font-medium text-slate-200">{sc.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{sc.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Adaptive Risk Mode button */}
          <button
            onClick={onToggleAdaptiveFactor}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              adaptiveFactor > 1.0
                ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 shadow-sm shadow-amber-900/30'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
            title="Toggle between standard baseline and peak festival alert threshold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{adaptiveFactor > 1.0 ? 'Festival High Alert' : 'Standard Risk Mode'}</span>
          </button>
        </div>
      </div>

      {/* Mobile / tablet navigation strip */}
      <div className="xl:hidden flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-900/80 mt-2.5 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-2.5 py-1 text-xs rounded whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-slate-800 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
