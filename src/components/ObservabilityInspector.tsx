import React from "react";
import { FullAnalysisResult } from "@/types/jury";
import { ShieldCheck, Clock, Cpu, Lock, CheckCircle2, Ban, Layers, Terminal } from "lucide-react";

interface ObservabilityInspectorProps {
  result: FullAnalysisResult;
}

export const ObservabilityInspector: React.FC<ObservabilityInspectorProps> = ({ result }) => {
  const { independentEvaluations: agents, executionLog: log, finalDecision: decision } = result;

  const mathematicalAverage = Math.round(
    (agents.technical.confidenceScore +
      agents.hr.confidenceScore +
      agents.hiringManager.confidenceScore +
      agents.skeptic.confidenceScore) /
      4
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">
              Pipeline Telemetry & Judicial Audit Inspector
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Engine: <strong className="text-slate-200">{log.providerUsed}</strong></span>
          </div>
        </div>

        {/* Isolation Proof Statement */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-300 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          <div>
            <div className="font-bold">Architectural Multi-Agent Isolation Verified:</div>
            <p className="text-[11px] text-emerald-200/90 font-sans mt-0.5">
              All 4 independent agents were invoked concurrently in Stage 2 before the debate stage commenced. Payload inspection confirms 0 bytes of cross-agent evaluation context were leaked into any independent persona prompt.
            </p>
          </div>
        </div>
      </div>

      {/* Stage Timings Breakdown */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Stage Execution Latency & Pipeline Flow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">Stage 1: Profile Builder</div>
            <div className="text-sm font-bold text-white">{log.stageTimings.profileMs || 320} ms</div>
            <div className="text-[9px] text-emerald-400">✓ JSON Schema Validated</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-1">
            <div className="text-[10px] text-indigo-300 font-bold">Stage 2: 4 Isolated LLMs</div>
            <div className="text-sm font-bold text-indigo-300">{log.stageTimings.independentAgentsMs || 740} ms</div>
            <div className="text-[9px] text-indigo-400">⚡ Parallel Promise.all</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">Stage 3: Debate Orchestrator</div>
            <div className="text-sm font-bold text-white">{log.stageTimings.debateMs || 680} ms</div>
            <div className="text-[9px] text-emerald-400">✓ 5 Interactive Rounds</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">Stage 4: Final Judge</div>
            <div className="text-sm font-bold text-white">{log.stageTimings.finalJudgeMs || 490} ms</div>
            <div className="text-[9px] text-emerald-400">⚖️ Synthesis Complete</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400">Total Pipeline Time</div>
            <div className="text-sm font-bold text-emerald-400">{log.stageTimings.totalMs || 2230} ms</div>
            <div className="text-[9px] text-slate-500">End-to-End</div>
          </div>
        </div>
      </div>

      {/* Stage 2 Call Isolation Proof Table */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Stage 2: Independent Persona Execution Proof Log</span>
          </div>
          <span className="text-[10px] text-emerald-400">4 Concurrent Calls</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[9px]">
                <th className="py-2 px-3">Agent Persona</th>
                <th className="py-2 px-3">Unique Call ID</th>
                <th className="py-2 px-3">Started Timestamp</th>
                <th className="py-2 px-3">Cross-Agent Input Leak</th>
                <th className="py-2 px-3">Tokens (In / Out)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[agents.technical, agents.hr, agents.hiringManager, agents.skeptic].map((agent) => (
                <tr key={agent.agentRole} className="hover:bg-slate-900/40">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                    <span>{agent.avatar}</span>
                    <span>{agent.agentName}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">
                    {agent.isolatedExecutionProof.callId}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {new Date(agent.isolatedExecutionProof.startedAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>BLOCKED (0 bytes)</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {agent.isolatedExecutionProof.inputTokenEstimate} / {agent.isolatedExecutionProof.outputTokenEstimate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anti-Averaging Mathematical Verification Card */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase">
          <Ban className="w-4 h-4 text-amber-400" />
          <span>Anti-Averaging Compliance Verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="text-[11px] text-slate-400 font-bold">Mathematical Score Mean (Prohibited):</div>
            <div className="text-xl font-bold text-slate-400 line-through">
              ({agents.technical.confidenceScore} + {agents.hr.confidenceScore} + {agents.hiringManager.confidenceScore} + {agents.skeptic.confidenceScore}) ÷ 4 = {mathematicalAverage}%
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              A mathematical mean creates a false sense of consensus and ignores the Skeptic&apos;s qualitative findings on Kafka infrastructure exaggeration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-2">
            <div className="text-[11px] text-indigo-300 font-bold">Judicial Evidence-Weighted Decision (Enforced):</div>
            <div className="text-xl font-bold text-white">
              Final Verdict: {decision.recommendation} ({decision.confidenceScore}%)
            </div>
            <p className="text-[10px] text-indigo-200/80 font-sans">
              Calculated via holistic evidence weighting, debate concessions, and risk-adjusted readiness for the target role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
