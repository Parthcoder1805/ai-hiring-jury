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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span className="text-sm font-bold text-white">Official Jury Decision Packet</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Markdown!" : "Copy Markdown"}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div id="printable-report" className="rounded-3xl bg-slate-900/95 border border-slate-800 p-8 sm:p-12 space-y-8 text-slate-200 shadow-2xl">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              AI Hiring Jury • Formal Evaluation Record
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Candidate: {profile.name}
            </h1>
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
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Executive Summary & Verdict</h2>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            {decision.executiveReasoning}
          </p>
        </div>

        {/* Section 2: Four Independent Perspectives */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Independent Persona Opinions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-400 text-xs">🧑‍💻 Technical ({agents.technical.agentName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300">{agents.technical.recommendation} ({agents.technical.confidenceScore}%)</span>
              </div>
              <p className="text-xs text-slate-300">{agents.technical.overallAssessment}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-400 text-xs">🤝 HR / Culture ({agents.hr.agentName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300">{agents.hr.recommendation} ({agents.hr.confidenceScore}%)</span>
              </div>
              <p className="text-xs text-slate-300">{agents.hr.overallAssessment}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-xs">👔 Hiring Manager ({agents.hiringManager.agentName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">{agents.hiringManager.recommendation} ({agents.hiringManager.confidenceScore}%)</span>
              </div>
              <p className="text-xs text-slate-300">{agents.hiringManager.overallAssessment}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-400 text-xs">🕵️ Skeptic Auditor ({agents.skeptic.agentName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300">{agents.skeptic.recommendation} ({agents.skeptic.confidenceScore}%)</span>
              </div>
              <p className="text-xs text-slate-300">{agents.skeptic.overallAssessment}</p>
            </div>
          </div>
        </div>

        {/* Section 3: Debate Highlights & Position Changes */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Debate Record & Stance Updates</h2>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3 text-xs">
            <div className="font-semibold text-slate-300">Debate Topic: {debate.topicOfDebate}</div>
            <div className="space-y-2">
              {debate.concessionsMade.map((conc, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[11px] space-y-1">
                  <div className="font-bold text-amber-300 capitalize">{conc.agent} Agent Reconciled Position:</div>
                  <div className="text-slate-400 line-through">Prior: {conc.priorPosition}</div>
                  <div className="text-emerald-300">Revised: {conc.revisedPosition}</div>
                  <div className="text-slate-400 italic">Reason: {conc.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Key Evidence Matrix */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">4. Key Evidence-Backed Findings</h2>
          <div className="space-y-2">
            {decision.keyStrengths.map((str, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-emerald-400">✓ {str.title}</div>
                <p className="text-slate-300 text-[11px]">{str.description}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <SourceBadge source={str.primaryEvidence.source} location={str.primaryEvidence.location} />
                  <span className="text-[10px] text-slate-400 italic">&ldquo;{str.primaryEvidence.quote}&rdquo;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Targeted Next Round Probes */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">5. Recommended Follow-Up Action Plan</h2>
          <div className="space-y-2">
            {decision.targetedNextRoundProbes.map((probe, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-indigo-300">{idx + 1}. {probe.area}</div>
                <div className="font-mono text-[11px] text-slate-300">&ldquo;{probe.suggestedQuestion}&rdquo;</div>
                <div className="text-[10px] text-slate-400">Focus: {probe.whatToLookFor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function generateMarkdownReport(result: FullAnalysisResult): string {
  const { candidateProfile: p, independentEvaluations: a, debate: d, finalDecision: f } = result;

  return `# AI HIRING JURY — OFFICIAL REPORT
**Candidate:** ${p.name}
**Target Role:** ${p.targetRole}
**Date:** ${new Date().toISOString()}

---

## 1. JURY VERDICT
- **Recommendation:** ${f.recommendation}
- **Confidence Score:** ${f.confidenceScore}% (Evidence-Weighted, Non-Averaged)
- **Executive Rationale:**
${f.executiveReasoning}

---

## 2. INDEPENDENT PERSONA OPINIONS (Isolated Stage 2 Calls)
- **Technical Agent (${a.technical.agentName}):** ${a.technical.recommendation} (${a.technical.confidenceScore}%)
  - *Assessment:* ${a.technical.overallAssessment}
- **HR / Culture Agent (${a.hr.agentName}):** ${a.hr.recommendation} (${a.hr.confidenceScore}%)
  - *Assessment:* ${a.hr.overallAssessment}
- **Hiring Manager (${a.hiringManager.agentName}):** ${a.hiringManager.recommendation} (${a.hiringManager.confidenceScore}%)
  - *Assessment:* ${a.hiringManager.overallAssessment}
- **Skeptic Auditor (${a.skeptic.agentName}):** ${a.skeptic.recommendation} (${a.skeptic.confidenceScore}%)
  - *Assessment:* ${a.skeptic.overallAssessment}

---

## 3. DEBATE RECORD & CONCESSIONS
**Debate Subject:** ${d.topicOfDebate}

${d.concessionsMade.map((c) => `- **${c.agent} concession:** Revised stance from "${c.priorPosition}" to "${c.revisedPosition}" because ${c.reason}`).join("\n")}

---

## 4. PRIMARY EVIDENCE-BACKED FINDINGS
${f.keyStrengths.map((s) => `### Strengths: ${s.title}\n- ${s.description}\n- *Evidence:* "${s.primaryEvidence.quote}" (${s.primaryEvidence.source})`).join("\n\n")}

${f.keyRisks.map((r) => `### Risk (${r.severity}): ${r.title}\n- ${r.description}\n- *Impact:* ${r.impactIfHired}\n- *Evidence:* "${r.primaryEvidence.quote}" (${r.primaryEvidence.source})`).join("\n\n")}

---

## 5. RECOMMENDED NEXT-ROUND PROBES
${f.targetedNextRoundProbes.map((pr, i) => `${i + 1}. **${pr.area}**: "${pr.suggestedQuestion}"\n   - *What to look for:* ${pr.whatToLookFor}`).join("\n")}

---
*Generated by AI Hiring Jury — 4 Independent Personas, Evidence-Backed Debate, Reasoned Judgment.*
`;
}
