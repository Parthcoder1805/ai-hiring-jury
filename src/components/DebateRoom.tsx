import React from "react";
import { DebateSummary, AgentRole } from "@/types/jury";
import { SourceBadge } from "./SourceBadge";
import { MessageSquare, ArrowDownRight, RefreshCw, AlertOctagon, CheckCircle2, ShieldCheck } from "lucide-react";

interface DebateRoomProps {
  debate: DebateSummary;
}

export const DebateRoom: React.FC<DebateRoomProps> = ({ debate }) => {
  const getAgentColor = (role: AgentRole | "general") => {
    switch (role) {
      case "technical":
        return { border: "border-sky-500/50", bg: "bg-sky-950/20", text: "text-sky-400", badge: "bg-sky-500/20 text-sky-300" };
      case "hr":
        return { border: "border-purple-500/50", bg: "bg-purple-950/20", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-300" };
      case "hiring_manager":
        return { border: "border-emerald-500/50", bg: "bg-emerald-950/20", text: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300" };
      case "skeptic":
        return { border: "border-amber-500/50", bg: "bg-amber-950/20", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-300" };
      default:
        return { border: "border-slate-700", bg: "bg-slate-900", text: "text-slate-300", badge: "bg-slate-800 text-slate-300" };
    }
  };

  const getAgentAvatar = (role: AgentRole | "general") => {
    switch (role) {
      case "technical":
        return "🧑‍💻";
      case "hr":
        return "🤝";
      case "hiring_manager":
        return "👔";
      case "skeptic":
        return "🕵️";
      default:
        return "⚖️";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Section Header */}
      <section
        aria-label="Debate Stage Overview"
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg"
              aria-hidden="true"
            >
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Stage 3: Genuine Multi-Agent Debate Chamber
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Interactive Revisions
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Personas actively cross-examine each other&apos;s findings, challenge evidence, and update confidence levels.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            <span>{debate.rounds.length} Interactive Turns</span>
          </div>
        </div>

        <div className="text-xs text-slate-300">
          <strong className="text-white">Debate Core Subject:</strong> {debate.topicOfDebate}
        </div>
      </section>

      {/* Debate Timeline Messages */}
      <section
        aria-label="Debate Turns Timeline"
        className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800/80 before:hidden sm:before:block"
        role="list"
      >
        {debate.rounds.map((round) => {
          const speakerTheme = getAgentColor(round.speaker);
          const responderTheme = getAgentColor(round.respondingTo);

          return (
            <article
              key={round.id}
              role="listitem"
              aria-label={`Round ${round.roundNumber}: ${round.speakerName} responding to ${round.respondingToName}`}
              className={`relative rounded-2xl bg-slate-900/95 border ${
                round.changedMind ? "border-amber-500/60 ring-1 ring-amber-500/20" : "border-slate-800"
              } p-5 space-y-3.5 shadow-xl transition-all hover:border-slate-700`}
            >
              {/* Turn Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner"
                    aria-hidden="true"
                  >
                    {getAgentAvatar(round.speaker)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{round.speakerName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${speakerTheme.badge}`}>
                        Round {round.roundNumber}
                      </span>
                    </div>

                    {/* Responding to indicator */}
                    {round.respondingTo !== "general" && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <ArrowDownRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                        <span>Responded directly to:</span>
                        <span className={`font-semibold ${responderTheme.text}`}>
                          {round.respondingToName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      round.disagreementType === "challenge_evidence"
                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : round.disagreementType === "concession"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : round.disagreementType === "direct_disagreement"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {round.disagreementType.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Argument Content */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1">
                &ldquo;{round.position}&rdquo;
              </div>

              {/* STANCE REVISION / CONCESSION CALLOUT (If agent changed mind) */}
              {round.changedMind && (
                <div
                  role="status"
                  aria-label="Agent position concession registered"
                  className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/50 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin-slow" aria-hidden="true" />
                    <span>Agent Position Revision Registered</span>
                    {round.confidenceDelta !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-200">
                        Δ Confidence: {round.confidenceDelta > 0 ? `+${round.confidenceDelta}%` : `${round.confidenceDelta}%`}
                      </span>
                    )}
                  </div>
                  {round.priorStance && (
                    <div className="text-xs text-slate-400">
                      <span className="text-slate-500 line-through mr-1">Prior Stance:</span> {round.priorStance}
                    </div>
                  )}
                  {round.revisedStance && (
                    <div className="text-xs text-amber-200">
                      <strong className="text-amber-300 mr-1">Revised Stance:</strong> {round.revisedStance}
                    </div>
                  )}
                  {round.reasonForChange && (
                    <p className="text-[11px] text-slate-300 pt-1 border-t border-amber-900/40">
                      <strong>Rationale:</strong> {round.reasonForChange}
                    </p>
                  )}
                </div>
              )}

              {/* Evidence Citations */}
              {round.evidenceCitations.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400">Citing Source Evidence:</div>
                  {round.evidenceCitations.map((ev, eIdx) => (
                    <div key={eIdx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <SourceBadge source={ev.source} location={ev.location} />
                      </div>
                      <p className="text-[11px] text-slate-300 italic pl-1 border-l border-slate-700">
                        &ldquo;{ev.quote}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>

      {/* Debate Synthesis & Unresolved Disagreements Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Consensus Points */}
        <section
          aria-labelledby="consensus-heading"
          className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            <h3 id="consensus-heading">Consensus Points Established</h3>
          </div>
          <ul className="space-y-2">
            {debate.consensusPoints.map((cp, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-950 text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" aria-hidden="true" />
                <span>{cp}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Unresolved Disagreements */}
        <section
          aria-labelledby="unresolved-tensions-heading"
          className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3 shadow-xl"
        >
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <AlertOctagon className="w-4 h-4" aria-hidden="true" />
            <h3 id="unresolved-tensions-heading">Remaining Unresolved Tensions</h3>
          </div>
          <ul className="space-y-2">
            {debate.unresolvedDisagreements.map((ud, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-amber-950 text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" aria-hidden="true" />
                <span>{ud}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
