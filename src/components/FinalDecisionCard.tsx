import React from "react";
import { FinalDecision } from "@/types/jury";
import { SourceBadge } from "./SourceBadge";
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, BookOpen, Ban } from "lucide-react";

interface FinalDecisionCardProps {
  decision: FinalDecision;
}

export const FinalDecisionCard: React.FC<FinalDecisionCardProps> = ({ decision }) => {
  const getVerdictStyle = (rec: string) => {
    switch (rec) {
      case "Strong Hire":
        return {
          bg: "bg-emerald-950/40 border-emerald-500/60 text-emerald-300",
          pill: "bg-emerald-500 text-slate-950 font-black",
          glow: "shadow-emerald-500/20",
          icon: "🟢",
        };
      case "Hire":
        return {
          bg: "bg-emerald-950/30 border-emerald-500/50 text-emerald-300",
          pill: "bg-emerald-600 text-white font-bold",
          glow: "shadow-emerald-500/15",
          icon: "🟢",
        };
      case "Proceed to Next Round":
        return {
          bg: "bg-indigo-950/40 border-indigo-500/60 text-indigo-200",
          pill: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black",
          glow: "shadow-indigo-500/25",
          icon: "🔵",
        };
      case "Hold / Need More Evidence":
        return {
          bg: "bg-amber-950/40 border-amber-500/60 text-amber-200",
          pill: "bg-amber-500 text-slate-950 font-bold",
          glow: "shadow-amber-500/20",
          icon: "🟡",
        };
      case "Reject":
      default:
        return {
          bg: "bg-red-950/40 border-red-500/60 text-red-200",
          pill: "bg-red-600 text-white font-bold",
          glow: "shadow-red-500/20",
          icon: "🔴",
        };
    }
  };

  const style = getVerdictStyle(decision.recommendation);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* HERO VERDICT CARD */}
      <div className={`rounded-3xl border ${style.bg} p-6 sm:p-8 shadow-2xl ${style.glow} space-y-6 backdrop-blur-md`}>
        {/* Anti-Averaging Audit Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Stage 4: Final Jury Verdict & Synthesis
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 border border-white/15 text-[11px] text-slate-300">
            <Ban className="w-3.5 h-3.5 text-amber-400" />
            <span>Score Averaging Strictly Prohibited • Reasoned Synthesis</span>
          </div>
        </div>

        {/* Big Verdict Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Jury Recommendation
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl">{style.icon}</span>
              <div className={`px-5 py-2 rounded-2xl text-xl sm:text-2xl tracking-tight uppercase shadow-lg ${style.pill}`}>
                {decision.recommendation}
              </div>
            </div>
          </div>

          {/* Evidence-Weighted Confidence Meter */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center gap-5 min-w-[240px]">
            <div className="space-y-1">
              <div className="text-[11px] uppercase font-bold text-slate-400">
                Evidence-Weighted Confidence
              </div>
              <div className="text-3xl font-black text-white">
                {decision.confidenceScore}%
              </div>
              <div className="text-[10px] text-slate-400">
                Calibrated against source quotes
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-indigo-500/40 flex items-center justify-center font-bold text-sm text-indigo-300">
              {decision.confidenceScore}%
            </div>
          </div>
        </div>

        {/* Executive Reasoning */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
          <div className="text-xs uppercase font-bold text-indigo-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Executive Decision Rationale</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {decision.executiveReasoning}
          </p>
        </div>

        {/* Synthesis Weightings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-sky-900/40 text-xs space-y-1">
            <div className="font-bold text-sky-300">🧑‍💻 Technical Weighting</div>
            <p className="text-slate-300 text-[11px]">{decision.synthesisBreakdown.technicalWeighting}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-purple-900/40 text-xs space-y-1">
            <div className="font-bold text-purple-300">🤝 Behavioral Weighting</div>
            <p className="text-slate-300 text-[11px]">{decision.synthesisBreakdown.behavioralWeighting}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-emerald-900/40 text-xs space-y-1">
            <div className="font-bold text-emerald-300">👔 Business Impact</div>
            <p className="text-slate-300 text-[11px]">{decision.synthesisBreakdown.businessImpactWeighting}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-amber-900/40 text-xs space-y-1">
            <div className="font-bold text-amber-300">🕵️ Skeptic Risk Control</div>
            <p className="text-slate-300 text-[11px]">{decision.synthesisBreakdown.skepticRiskWeighting}</p>
          </div>
        </div>
      </div>

      {/* KEY STRENGTHS & KEY RISKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Primary Evidence-Backed Strengths</span>
          </div>

          <div className="space-y-3">
            {decision.keyStrengths.map((str, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-emerald-900/40 text-xs space-y-2"
              >
                <div className="font-bold text-slate-200 text-sm">{str.title}</div>
                <p className="text-slate-300 text-xs">{str.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <SourceBadge source={str.primaryEvidence.source} location={str.primaryEvidence.location} />
                  <span className="text-[10px] text-slate-400">
                    Supported by: {str.supportingAgents.join(", ")}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic pl-2 border-l border-emerald-700">
                  &ldquo;{str.primaryEvidence.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Operational & Technical Risks</span>
          </div>

          <div className="space-y-3">
            {decision.keyRisks.map((risk, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-amber-900/40 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-sm">{risk.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      risk.severity === "high"
                        ? "bg-red-500/20 text-red-300"
                        : risk.severity === "medium"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {risk.severity} Risk
                  </span>
                </div>
                <p className="text-slate-300 text-xs">{risk.description}</p>
                <div className="text-[11px] text-amber-300/90">
                  <strong>Impact if Hired:</strong> {risk.impactIfHired}
                </div>
                <div className="pt-1">
                  <SourceBadge source={risk.primaryEvidence.source} location={risk.primaryEvidence.location} />
                  <p className="text-[11px] text-slate-400 italic pl-2 border-l border-amber-700 mt-1">
                    &ldquo;{risk.primaryEvidence.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TARGETED NEXT-ROUND INTERVIEW PROBES */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-indigo-300">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>Recommended Next-Round Interview Probes (High-Signal Technical Deep-Dives)</span>
        </div>
        <p className="text-xs text-slate-400">
          Designed by the Jury to definitively resolve remaining uncertainties in the subsequent interview:
        </p>

        <div className="space-y-3">
          {decision.targetedNextRoundProbes.map((probe, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/40 text-xs space-y-2"
            >
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span>Area: {probe.area}</span>
              </div>
              <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-800/30 text-slate-200 text-xs font-mono">
                &ldquo;{probe.suggestedQuestion}&rdquo;
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                <div>
                  <strong className="text-slate-300">What to look for:</strong> {probe.whatToLookFor}
                </div>
                <div>
                  <strong className="text-slate-300">Reason for probe:</strong> {probe.reasonForProbe}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ALTERNATIVES CONSIDERED AUDIT */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 text-xs text-slate-400">
        <div className="font-bold text-slate-300 text-xs">
          Judicial Audit: Alternatives Considered & Rejected
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {decision.decisionAuditTrail.alternativesConsideredAndRejected.map((alt, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="text-red-400">✕</span>
                <span>{alt.option}</span>
              </div>
              <p className="text-[11px] text-slate-400">{alt.rejectionReason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
