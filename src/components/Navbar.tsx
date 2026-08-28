import React from "react";
import { Scale, Sparkles, Cpu, RefreshCw } from "lucide-react";

interface NavbarProps {
  providerName: string;
  isDemoSimulation: boolean;
  onReset: () => void;
  onSelectDemo: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  providerName,
  isDemoSimulation,
  onReset,
  onSelectDemo,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">AI Hiring Jury</h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Multi-Agent System
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Four independent AI perspectives. One evidence-backed hiring decision.
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Provider Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline text-slate-400">Engine:</span>
            <span className="font-medium text-slate-200">{providerName}</span>
            {isDemoSimulation && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Demo Mode
              </span>
            )}
          </div>

          {/* Quick Demo Button */}
          <button
            onClick={onSelectDemo}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Demo Candidate</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            disabled={isLoading}
            title="Reset to fresh candidate upload"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
