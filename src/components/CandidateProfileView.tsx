import React from "react";
import { CandidateProfile } from "@/types/jury";
import { SourceBadge } from "./SourceBadge";
import { User, Briefcase, GraduationCap, Code, AlertTriangle, CheckCircle, HelpCircle, Layers } from "lucide-react";

interface CandidateProfileViewProps {
  profile: CandidateProfile;
}

export const CandidateProfileView: React.FC<CandidateProfileViewProps> = ({ profile }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Target: {profile.targetRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">{profile.summary}</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-end justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px] text-slate-500">
              Extracted: {new Date(profile.extractedAt).toLocaleDateString()}
            </span>
            <span className="text-emerald-400 font-medium">✓ Structured & Evidence-Linked</span>
          </div>
        </div>

        {/* Education & Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Verified Education</span>
            </div>
            {profile.education.map((edu, idx) => (
              <div key={idx} className="text-xs text-slate-300">
                <div className="font-medium text-white">{edu.institution}</div>
                <div className="text-slate-400">{edu.degree} {edu.year ? `(${edu.year})` : ""}</div>
                {edu.evidenceQuote && (
                  <div className="mt-1">
                    <SourceBadge source={edu.evidenceQuote.source} location={edu.evidenceQuote.location} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Work Experience Track</span>
            </div>
            <div className="space-y-1.5">
              {profile.experience.map((exp, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-start justify-between">
                  <div>
                    <span className="font-medium text-white">{exp.role}</span>
                    <span className="text-slate-400"> @ {exp.company}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{exp.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DISCREPANCY & INCONSISTENCY HIGHLIGHTS (If any detected) */}
      {profile.inconsistencies.length > 0 && (
        <div className="rounded-2xl bg-amber-950/20 border border-amber-500/40 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Cross-Source Discrepancies & Depth Mismatches ({profile.inconsistencies.length})</span>
          </div>
          <p className="text-xs text-amber-200/80">
            The profile builder compared resume assertions against verbatim interview responses and detected the following nuances:
          </p>

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
        </div>
      )}

      {/* SKILLS BREAKDOWN: Claimed vs Demonstrated Depth */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>Skills Inventory: Claimed vs Demonstrated Depth</span>
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
      </div>

      {/* VERIFIED CLAIMS AUDIT TABLE */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Extracted Candidate Claims & Evidence Traceability</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Claim</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-3">Audit Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {profile.claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-200 max-w-xs">{claim.claim}</td>
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
                      {claim.verifiedStatus === "supported" && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                      {claim.verifiedStatus === "exaggerated" && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                      {claim.verifiedStatus === "unverified" && <HelpCircle className="w-3 h-3 text-slate-400" />}
                      <span>{claim.verifiedStatus}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-sm">{claim.notes || claim.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
