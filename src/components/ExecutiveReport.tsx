import React, { useState } from "react";
import { FullAnalysisResult } from "@/types/jury";
import { SourceBadge } from "./SourceBadge";
import { Download, Copy, Check, Printer, FileText } from "lucide-react";

interface ExecutiveReportProps {
  result: FullAnalysisResult;
}

export const ExecutiveReport: React.FC<ExecutiveReportProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const { candidateProfile: profile, independentEvaluations: agents, debate, finalDecision: decision } = result;

  const handleCopyMarkdown = () => {
    const md = generateMarkdownReport(result);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `AI_Hiring_Jury_Report_${profile.name.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Toolbar */}
      <div
        role="toolbar"
        aria-label="Report Export and Printing Actions"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" aria-hidden="true" />
          <span className="text-sm font-bold text-white">Official Jury Decision Packet</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            aria-label={copied ? "Markdown copied to clipboard" : "Copy decision report as Markdown"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>{copied ? "Copied Markdown!" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            aria-label="Download full analysis results JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            aria-label="Print candidate evaluation report"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <article
        id="printable-report"
        aria-label="Formal Candidate Evaluation Record"
        className="rounded-3xl bg-slate-900/95 border border-slate-800 p-8 sm:p-12 space-y-8 text-slate-200 shadow-2xl"
      >
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              AI Hiring Jury • Formal Evaluation Record
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Candidate: {profile.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Role: {profile.targetRole} • Date: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="text-right p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[10px] uppercase font-bold text-slate-400">Binding Recommendation</div>
            <div className="text-lg font-black text-indigo-300 uppercase">{decision.recommendation}</div>
            <div className="text-[11px] text-slate-400">Confidence: {decision.confidenceScore}%</div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section aria-labelledby="section-summary-heading" className="space-y-2">
          <h3 id="section-summary-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Executive Summary & Verdict
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            {decision.executiveReasoning}
          </p>
        </section>

        {/* Section 2: Four Independent Agent Findings */}
        <section aria-labelledby="section-agents-heading" className="space-y-4">
          <h3 id="section-agents-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Four Independent Persona Findings (Isolated Pre-Debate Stage)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[agents.technical, agents.hr, agents.hiringManager, agents.skeptic].map((agent) => (
              <div key={agent.agentRole} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">
                    {agent.avatar} {agent.agentName}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300">
                    {agent.recommendation} ({agent.confidenceScore}%)
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-3">{agent.overallAssessment}</p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Isolation Call ID: {agent.isolatedExecutionProof.callId}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Debate Highlights & Position Changes */}
        <section aria-labelledby="section-debate-heading" className="space-y-3">
          <h3 id="section-debate-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Multi-Agent Debate Highlights & Position Changes
          </h3>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
            <p className="text-slate-300">
              <strong>Core Debate Subject:</strong> {debate.topicOfDebate}
            </p>
            {debate.concessionsMade.length > 0 ? (
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-bold text-amber-300">Concessions Made During Debate:</div>
                {debate.concessionsMade.map((c, idx) => (
                  <div key={idx} className="p-2 rounded bg-amber-950/20 border border-amber-800/40 text-slate-300 text-[11px]">
                    <strong>{c.agent}:</strong> {c.reason}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">All 4 personas maintained alignment through multi-round cross-examination.</p>
            )}
          </div>
        </section>

        {/* Section 4: Recommended Next-Round Probes */}
        <section aria-labelledby="section-probes-heading" className="space-y-3">
          <h3 id="section-probes-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
            4. Recommended Next-Round Interview Deep-Dives
          </h3>
          <div className="space-y-2">
            {decision.targetedNextRoundProbes.map((probe, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-indigo-300">Probe #{idx + 1}: {probe.area}</div>
                <div className="font-mono text-slate-200">&ldquo;{probe.suggestedQuestion}&rdquo;</div>
                <div className="text-[11px] text-slate-400">Look for: {probe.whatToLookFor}</div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

function generateMarkdownReport(result: FullAnalysisResult): string {
  const { candidateProfile: profile, independentEvaluations: agents, debate, finalDecision: decision } = result;

  return `# AI Hiring Jury — Evaluation Packet
**Candidate**: ${profile.name}
**Target Role**: ${profile.targetRole}
**Date**: ${new Date().toISOString()}

---

## Final Binding Recommendation
- **Verdict**: ${decision.recommendation}
- **Evidence-Weighted Confidence**: ${decision.confidenceScore}%
- **Executive Rationale**: ${decision.executiveReasoning}

---

## Independent Persona Findings (Pre-Debate Stage)
- **Technical Lead (${agents.technical.agentName})**: ${agents.technical.recommendation} (${agents.technical.confidenceScore}%)
  - ${agents.technical.overallAssessment}
- **HR & Culture Lead (${agents.hr.agentName})**: ${agents.hr.recommendation} (${agents.hr.confidenceScore}%)
  - ${agents.hr.overallAssessment}
- **Hiring Manager (${agents.hiringManager.agentName})**: ${agents.hiringManager.recommendation} (${agents.hiringManager.confidenceScore}%)
  - ${agents.hiringManager.overallAssessment}
- **Adversarial Skeptic (${agents.skeptic.agentName})**: ${agents.skeptic.recommendation} (${agents.skeptic.confidenceScore}%)
  - ${agents.skeptic.overallAssessment}

---

## Multi-Agent Debate Summary
- **Topic**: ${debate.topicOfDebate}
- **Interactive Rounds**: ${debate.rounds.length}
- **Consensus Points**:
${debate.consensusPoints.map((cp) => `  - ${cp}`).join("\n")}
- **Unresolved Disagreements**:
${debate.unresolvedDisagreements.map((ud) => `  - ${ud}`).join("\n")}

---

## Recommended Next-Round Probes
${decision.targetedNextRoundProbes
  .map(
    (p, i) =>
      `### ${i + 1}. ${p.area}\n- **Question**: "${p.suggestedQuestion}"\n- **What to look for**: ${p.whatToLookFor}\n- **Reason**: ${p.reasonForProbe}`
  )
  .join("\n\n")}

---
*Generated by AI Hiring Jury — Multi-Agent Evidence-Backed Evaluation System*
`;
}
