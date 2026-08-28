import { z } from "zod";
import { EvidenceQuoteSchema } from "./profile-schema";

const normalizeRole = (val: string) => {
  const v = (val || "").toLowerCase();
  if (v.includes("tech")) return "technical";
  if (v.includes("hr") || v.includes("cultur") || v.includes("people")) return "hr";
  if (v.includes("manag") || v.includes("lead") || v.includes("director")) return "hiring_manager";
  if (v.includes("skep") || v.includes("audit") || v.includes("adversar")) return "skeptic";
  return "general";
};

export const DebateMessageSchema = z.object({
  id: z.string().default(() => `deb-${Math.random().toString(36).substring(2, 7)}`),
  roundNumber: z.number().default(1),
  speaker: z.string().transform(normalizeRole as (val: string) => "technical" | "hr" | "hiring_manager" | "skeptic"),
  speakerName: z.string().default("Agent"),
  respondingTo: z.string().transform(normalizeRole),
  respondingToName: z.string().default("Jury"),
  position: z.string(),
  disagreementType: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("concess") || v.includes("revis") || v.includes("chang")) return "concession";
    if (v.includes("challeng")) return "challenge_evidence";
    if (v.includes("disagree")) return "direct_disagreement";
    if (v.includes("clarif")) return "clarification";
    return "synthesis";
  }),
  evidenceCitations: z.array(EvidenceQuoteSchema).default([]),
  changedMind: z.boolean().default(false),
  priorStance: z.string().optional(),
  revisedStance: z.string().optional(),
  confidenceDelta: z.number().optional(),
  reasonForChange: z.string().optional(),
  timestamp: z.string().default(() => new Date().toISOString()),
});

export const DebateSummarySchema = z.object({
  topicOfDebate: z.string(),
  rounds: z.array(DebateMessageSchema).default([]),
  keyDisagreementsExplored: z.array(z.string()).default([]),
  concessionsMade: z.array(
    z.object({
      agent: z.string().transform((v) => normalizeRole(v) as "technical" | "hr" | "hiring_manager" | "skeptic"),
      priorPosition: z.string(),
      revisedPosition: z.string(),
      reason: z.string().default(""),
    })
  ).default([]),
  unresolvedDisagreements: z.array(z.string()).default([]),
  consensusPoints: z.array(z.string()).default([]),
});
