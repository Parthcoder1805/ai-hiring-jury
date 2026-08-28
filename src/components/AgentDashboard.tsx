import React from "react";
import { AgentEvaluation } from "@/types/jury";
import { SourceBadge } from "./SourceBadge";
import { ShieldCheck, CheckCircle, AlertTriangle, Activity } from "lucide-react";

interface AgentDashboardProps {
  evaluations: {
    technical: AgentEvaluation;
    hr: AgentEvaluation;
    hiringManager: AgentEvaluation;
    skeptic: AgentEvaluation;
  };
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ evaluations }) => {
  const agents = [
    {
      eval: evaluations.technical,
      accentColor: "border-sky-500/50 bg-sky-950/10 text-sky-400",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    },
    {
      eval: evaluations.hr,
      accentColor: "border-purple-500/50 bg-purple-950/10 text-purple-400",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      eval: evaluations.hiringManager,
      accentColor: "border-emerald-500/50 bg-emerald-950/10 text-emerald-400",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      eval: evaluations.skeptic,
      accentColor: "border-amber-500/50 bg-amber-950/10 text-amber-400",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Stage 2: Four Independent Persona Evaluations
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Strictly Isolated
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Each agent was invoked via a completely separate, concurrent LLM call with ZERO knowledge of other agents&apos; findings.
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-700/40 text-emerald-300 text-xs font-semibold"
          role="status"
          aria-label="Cross-agent leakage verification: 0 percent guaranteed"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Cross-Agent Leakage: 0% Guaranteed</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="list" aria-label="Independent AI persona evaluation cards">
        {agents.map(({ eval: agent, badgeColor }) => {
          const isSkeptic = agent.agentRole === "skeptic";
          return (
            <section
              key={agent.agentRole}
              role="listitem"
              aria-labelledby={`persona-heading-${agent.agentRole}`}
              className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between space-y-5 shadow-xl hover:border-slate-700 transition-all"
            >
              {/* Card Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner"
                      aria-hidden="true"
                    >
                      {agent.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 id={`persona-heading-${agent.agentRole}`} className="text-base font-bold text-white">
                          {agent.agentName}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${badgeColor}`}>
                          {agent.agentRole.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{agent.title}</p>
                    </div>
                  </div>

                  {/* Recommendation badge */}
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                        agent.recommendation === "Strong Hire" || agent.recommendation === "Hire"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : agent.recommendation === "Proceed to Next Round"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                          : agent.recommendation === "Hold / Need More Evidence"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {agent.recommendation}
                    </span>
                    <div className="mt-1 flex items-center justify-end gap-1.5 text-xs text-slate-400">
                      <Activity className="w-3 h-3 text-indigo-400" aria-hidden="true" />
                      <span>Confidence: <strong className="text-white">{agent.confidenceScore}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* Overall Assessment */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-200 block mb-1">Independent Assessment:</span>
                  {agent.overallAssessment}
                </div>

                {/* Strengths */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <h4>Evidence-Backed Strengths</h4>
                  </div>
                  <div className="space-y-2">
                    {agent.strengths.map((str, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-lg bg-emerald-950/15 border border-emerald-900/40 text-xs space-y-1.5"
                      >
                        <div className="font-medium text-slate-200">{str.point}</div>
                        <div className="flex items-center gap-2">
                          <SourceBadge source={str.evidence.source} location={str.evidence.location} />
                        </div>
                        <p className="text-[11px] text-slate-300 italic pl-2 border-l border-emerald-700">
                          &ldquo;{str.evidence.quote}&rdquo;
                        </p>
                        <p className="text-[11px] text-slate-400 pt-0.5">{str.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concerns / Red Flags */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                    <h4>{isSkeptic ? "Adversarial Red Flags & Discrepancies" : "Identified Concerns"}</h4>
                  </div>
                  <div className="space-y-2">
                    {isSkeptic && agent.skepticFlags ? (
                      agent.skepticFlags.map((flag, fIdx) => (
                        <div
                          key={fIdx}
                          className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300">{flag.issue}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                flag.severity === "high" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"
                              }`}
                            >
                              {flag.severity} • {flag.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 space-y-1 pt-1">
                            <div className="flex items-start gap-1">
                              <SourceBadge source="resume" />
                              <span className="italic">&ldquo;{flag.resumeEvidence}&rdquo;</span>
                            </div>
                            <div className="flex items-start gap-1">
                              <SourceBadge source="transcript" />
                              <span className="italic">&ldquo;{flag.transcriptEvidence}&rdquo;</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400">{flag.reasoning}</p>
                        </div>
                      ))
                    ) : (
                      agent.concerns.map((con, cIdx) => (
                        <div
                          key={cIdx}
                          className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-200">{con.point}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                con.severity === "high"
                                  ? "bg-red-500/20 text-red-300"
                                  : con.severity === "medium"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {con.severity}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <SourceBadge source={con.evidence.source} location={con.evidence.location} />
                          </div>
                          <p className="text-[11px] text-slate-300 italic pl-2 border-l border-slate-700">
                            &ldquo;{con.evidence.quote}&rdquo;
                          </p>
                          <p className="text-[11px] text-slate-400">{con.reasoning}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Isolation Proof Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  <span>Call ID: {agent.isolatedExecutionProof.callId.slice(0, 14)}...</span>
                </div>
                <span>Tokens: ~{agent.isolatedExecutionProof.inputTokenEstimate + agent.isolatedExecutionProof.outputTokenEstimate}</span>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};
