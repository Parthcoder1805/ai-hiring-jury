import React from "react";
import { CandidateProfile } from "@/types/jury";
import { SourceBadge } from "./SourceBadge";
import {
  User,
  Briefcase,
  GraduationCap,
  AlertTriangle,
  CheckCircle,
  Code,
  Layers,
  HelpCircle,
} from "lucide-react";

interface CandidateProfileViewProps {
  profile: CandidateProfile;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Header Info Card */}
      <section
        aria-label="Candidate Profile Summary"
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20"
              aria-hidden="true"
            >
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-indigo-400 font-medium">{profile.targetRole}</span>
                <span className="text-xs text-slate-500" aria-hidden="true">•</span>
                <span className="text-xs text-slate-400">
                  Extracted {new Date(profile.extractedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Synthesized Profile Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{profile.summary}</p>
        </div>

        {/* Work Experience & Education Quick Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Work Experience */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              <h4>Recent Experience</h4>
            </div>
            <div className="space-y-1.5">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>{exp.role}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{exp.duration}</span>
                  </div>
                  <div className="text-[11px] text-indigo-300">{exp.company}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
              <h4>Education & Credentials</h4>
            </div>
            <div className="space-y-1.5">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                  <div className="font-semibold text-slate-200">{edu.degree}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{edu.institution}</span>
                    {edu.year && <span className="font-mono">{edu.year}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-SOURCE INCONSISTENCY HIGHLIGHTS */}
      {profile.inconsistencies.length > 0 && (
        <section
          aria-labelledby="inconsistencies-heading"
          className="rounded-2xl bg-slate-900/90 border border-amber-500/30 p-6 space-y-4 shadow-xl shadow-amber-950/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
              <h3 id="inconsistencies-heading" className="text-sm font-bold text-white">
                Cross-Source Discrepancies & Depth Mismatches ({profile.inconsistencies.length})
              </h3>
            </div>
            <span className="text-xs text-amber-400/80 font-medium">
              Flagged between Resume Claims and Interview Admissions
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {profile.inconsistencies.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-slate-950/80 border border-amber-900/50 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-300">{inc.title}</div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      inc.severity === "high"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : inc.severity === "medium"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    }`}
                  >
                    {inc.severity} Severity • {inc.type.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{inc.explanation}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-800/40 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-blue-300 font-semibold">
                      <span>Resume Assertion:</span>
                      <SourceBadge source="resume" />
                    </div>
                    <p className="text-slate-300 text-[11px] italic">&ldquo;{inc.resumeQuote || inc.resumeClaim}&rdquo;</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-emerald-300 font-semibold">
                      <span>Transcript Reality:</span>
                      <SourceBadge source="transcript" />
                    </div>
                    <p className="text-slate-300 text-[11px] italic">&ldquo;{inc.transcriptQuote || inc.transcriptClaim}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SKILLS BREAKDOWN: Claimed vs Demonstrated Depth */}
      <section
        aria-labelledby="skills-inventory-heading"
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Code className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <h3 id="skills-inventory-heading">Skills Inventory: Claimed vs Demonstrated Depth</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm text-white">{skill.name}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 uppercase">
                      Claimed: {skill.claimedProficiency}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        skill.demonstratedDepth === "strong"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : skill.demonstratedDepth === "moderate"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-red-500/20 text-red-300 border border-red-500/40"
                      }`}
                    >
                      Depth: {skill.demonstratedDepth}
                    </span>
                  </div>
                </div>
              </div>

              {/* Evidence Quotes */}
              <div className="space-y-1.5 pt-1 border-t border-slate-900">
                {skill.evidenceQuotes.map((eq, qIdx) => (
                  <div key={qIdx} className="text-[11px] text-slate-400 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <SourceBadge source={eq.source} location={eq.location} />
                    </div>
                    <p className="text-slate-300 italic pl-1 border-l-2 border-slate-700">
                      &ldquo;{eq.quote}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VERIFIED CLAIMS AUDIT TABLE */}
      <section
        aria-labelledby="claims-audit-heading"
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Layers className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <h3 id="claims-audit-heading">Extracted Candidate Claims & Evidence Traceability</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">
              Extracted candidate claims, sources, verification categories, and evidence audit notes
            </caption>
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th scope="col" className="py-2.5 px-3">Claim</th>
                <th scope="col" className="py-2.5 px-3">Source</th>
                <th scope="col" className="py-2.5 px-3">Category</th>
                <th scope="col" className="py-2.5 px-3">Verification Status</th>
                <th scope="col" className="py-2.5 px-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {profile.claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-950/40 transition-colors">
                  <th scope="row" className="py-3 px-3 font-medium text-slate-200 max-w-xs text-left font-normal">
                    {claim.claim}
                  </th>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <SourceBadge source={claim.source} />
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] text-slate-400">{claim.category}</td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        claim.verifiedStatus === "supported"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : claim.verifiedStatus === "exaggerated"
                          ? "bg-amber-500/20 text-amber-300"
                          : claim.verifiedStatus === "contradicted"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {claim.verifiedStatus === "supported" && <CheckCircle className="w-3 h-3 text-emerald-400" aria-hidden="true" />}
                      {claim.verifiedStatus === "exaggerated" && <AlertTriangle className="w-3 h-3 text-amber-400" aria-hidden="true" />}
                      {claim.verifiedStatus === "unverified" && <HelpCircle className="w-3 h-3 text-slate-400" aria-hidden="true" />}
                      <span>{claim.verifiedStatus}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-sm">{claim.notes || claim.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
