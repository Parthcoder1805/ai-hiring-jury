import React from "react";
import { EvidenceSource } from "@/types/jury";
import { FileText, MessageSquareQuote, ShieldAlert, Sparkles } from "lucide-react";

interface SourceBadgeProps {
  source: EvidenceSource;
  location?: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, location, className = "" }) => {
  switch (source) {
    case "resume":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50 ${className}`}
          title={location || "Verified from Resume"}
          aria-label={location ? `Verified from Resume at ${location}` : "Verified from Resume"}
        >
          <FileText className="w-3 h-3 text-blue-400" aria-hidden="true" />
          <span>Resume{location ? ` • ${location}` : ""}</span>
        </span>
      );
    case "transcript":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 ${className}`}
          title={location || "Verified from Interview Transcript"}
          aria-label={location ? `Verified from Interview Transcript at ${location}` : "Verified from Interview Transcript"}
        >
          <MessageSquareQuote className="w-3 h-3 text-emerald-400" aria-hidden="true" />
          <span>Transcript{location ? ` • ${location}` : ""}</span>
        </span>
      );
    case "debate":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-900/40 text-amber-300 border border-amber-700/50 ${className}`}
          title={location || "Formed during Debate Stage"}
          aria-label={location ? `Debate Concession from ${location}` : "Formed during Multi-Agent Debate"}
        >
          <ShieldAlert className="w-3 h-3 text-amber-400" aria-hidden="true" />
          <span>Debate Concession{location ? ` • ${location}` : ""}</span>
        </span>
      );
    case "synthesis":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-900/40 text-purple-300 border border-purple-700/50 ${className}`}
          title={location || "Synthesized by Final Decision Judge"}
          aria-label="Synthesized by Final Decision Judge"
        >
          <Sparkles className="w-3 h-3 text-purple-400" aria-hidden="true" />
          <span>Judge Synthesis</span>
        </span>
      );
  }
};
