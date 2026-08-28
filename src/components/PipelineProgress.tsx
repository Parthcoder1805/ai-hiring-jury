import React from "react";
import { PipelineExecutionLog } from "@/types/jury";
import { CheckCircle2, Circle, Loader2, ShieldCheck } from "lucide-react";

interface PipelineProgressProps {
  log: PipelineExecutionLog;
}

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ log }) => {
  const steps = [
    {
      id: "profile",
      title: "Profile Builder",
      description: "Extracting verified skills, claims & discrepancy quotes",
      isDone: log.stage === "independent_agents" || log.stage === "debate" || log.stage === "final_judge" || log.stage === "complete",
      isRunning: log.stage === "profile" || log.stage === "parsing" || log.stage === "idle",
      durationMs: log.stageTimings.profileMs,
    },
    {
      id: "independent_agents",
      title: "4 Isolated Personas",
      description: "Concurrent evaluation with 0 cross-agent context leakage",
      isDone: log.stage === "debate" || log.stage === "final_judge" || log.stage === "complete",
      isRunning: log.stage === "independent_agents",
      durationMs: log.stageTimings.independentAgentsMs,
    },
    {
      id: "debate",
      title: "Debate Chamber",
      description: "Cross-examination, evidence challenges & position revisions",
      isDone: log.stage === "final_judge" || log.stage === "complete",
      isRunning: log.stage === "debate",
      durationMs: log.stageTimings.debateMs,
    },
    {
      id: "final_judge",
      title: "Final Decision Judge",
      description: "Evidence-weighted verdict synthesis (Anti-Averaging rule)",
      isDone: log.stage === "complete",
      isRunning: log.stage === "final_judge",
      durationMs: log.stageTimings.finalJudgeMs,
    },
  ];

  return (
    <section
      role="region"
      aria-label="Evaluation Pipeline Progress"
      className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" aria-hidden="true" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Pipeline Execution Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1" aria-live="polite">
            Current Stage: <span className="font-semibold text-indigo-300">{log.currentStepDescription}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <ShieldCheck className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <span>Strict Isolation Guaranteed</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Overall Progress</span>
          <span className="font-semibold text-slate-200">{log.progressPercentage}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={log.progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Jury evaluation progress"
          className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800"
        >
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${log.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2"
        role="list"
        aria-label="Pipeline execution steps"
      >
        {steps.map((step, idx) => (
          <div
            key={step.id}
            role="listitem"
            aria-label={`Stage ${idx + 1}: ${step.title} (${step.isDone ? "completed" : step.isRunning ? "running" : "pending"})`}
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
              step.isRunning
                ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/40"
                : step.isDone
                ? "bg-slate-950/70 border-emerald-500/30"
                : "bg-slate-950/30 border-slate-800/60 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                Stage 0{idx + 1}
              </span>
              {step.isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />}
              {step.isRunning && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" aria-hidden="true" />}
              {!step.isDone && !step.isRunning && <Circle className="w-4 h-4 text-slate-700" aria-hidden="true" />}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-200 leading-tight">{step.title}</p>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                {step.description}
              </p>
            </div>

            {step.durationMs ? (
              <span className="text-[10px] font-mono text-slate-500">
                {step.durationMs}ms
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};
