import React from "react";
import { CheckCircle2, CircleDashed, Users, MessageSquare, Scale, FileSpreadsheet, Sparkles } from "lucide-react";
import { PipelineExecutionLog } from "@/types/jury";

interface PipelineProgressProps {
  log: PipelineExecutionLog;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ log }) => {
  const steps = [
    {
      id: "profile",
      label: "Candidate Profile",
      sublabel: "Cross-source claim mapping",
      icon: FileSpreadsheet,
      active: log.stage === "profile",
      completed: ["independent_agents", "debate", "final_judge", "complete"].includes(log.stage),
      timing: log.stageTimings.profileMs,
    },
    {
      id: "independent_agents",
      label: "4 Isolated AI Personas",
      sublabel: "Concurrent independent LLM calls",
      icon: Users,
      active: log.stage === "independent_agents",
      completed: ["debate", "final_judge", "complete"].includes(log.stage),
      timing: log.stageTimings.independentAgentsMs,
    },
    {
      id: "debate",
      label: "Multi-Agent Debate",
      sublabel: "Evidence challenge & revisions",
      icon: MessageSquare,
      active: log.stage === "debate",
      completed: ["final_judge", "complete"].includes(log.stage),
      timing: log.stageTimings.debateMs,
    },
    {
      id: "final_judge",
      label: "Final Decision Judge",
      sublabel: "Reasoning-weighted synthesis",
      icon: Scale,
      active: log.stage === "final_judge",
      completed: log.stage === "complete",
      timing: log.stageTimings.finalJudgeMs,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Jury Pipeline In Progress
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{log.currentStepDescription}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-400">{log.progressPercentage}%</span>
            <p className="text-[10px] text-slate-500">
              {log.providerUsed}
            </p>
          </div>
          <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${log.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all ${
                step.active
                  ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                  : step.completed
                  ? "bg-slate-950/60 border-emerald-500/30"
                  : "bg-slate-950/20 border-slate-800/60 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      step.completed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : step.active
                        ? "bg-indigo-500/20 text-indigo-300 animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{step.label}</div>
                    <div className="text-[10px] text-slate-400">{step.sublabel}</div>
                  </div>
                </div>

                <div>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : step.active ? (
                    <CircleDashed className="w-4 h-4 text-indigo-400 animate-spin" />
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono">0{idx + 1}</span>
                  )}
                </div>
              </div>

              {step.timing !== undefined && (
                <div className="mt-2 text-[10px] font-mono text-emerald-400/80 text-right">
                  {(step.timing / 1000).toFixed(2)}s
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
