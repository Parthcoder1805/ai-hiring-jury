import { z } from "zod";
import { EvidenceQuoteSchema } from "./profile-schema";
import { PreliminaryRecommendationSchema } from "./agent-schema";

const normalizeRole = (val: string) => {
  const v = (val || "").toLowerCase();
  if (v.includes("tech")) return "technical";
  if (v.includes("hr") || v.includes("cultur") || v.includes("people")) return "hr";
  if (v.includes("manag") || v.includes("lead") || v.includes("director")) return "hiring_manager";
  if (v.includes("skep") || v.includes("audit") || v.includes("adversar")) return "skeptic";
  return "technical";
};

export const FinalDecisionSchema = z.object({
  recommendation: PreliminaryRecommendationSchema,
  confidenceScore: z.number().transform((n) => Math.min(100, Math.max(0, Math.round(n)))),
  executiveReasoning: z.string(),
  synthesisBreakdown: z.object({
    technicalWeighting: z.string().default("Strong technical evaluation."),
    behavioralWeighting: z.string().default("Constructive team alignment."),
    businessImpactWeighting: z.string().default("High operational impact."),
    skepticRiskWeighting: z.string().default("Risk-calibrated review."),
  }),
  keyStrengths: z.array(
    z.object({
      title: z.string(),
      description: z.string().default(""),
      supportingAgents: z.array(z.string().transform(normalizeRole)).default(["technical"]),
      primaryEvidence: EvidenceQuoteSchema,
    })
  ).default([]),
  keyRisks: z.array(
    z.object({
      title: z.string(),
      description: z.string().default(""),
      severity: z.string().transform((val) => {
        const v = (val || "").toLowerCase();
        if (v.includes("high")) return "high";
        if (v.includes("low")) return "low";
        return "medium";
      }),
      impactIfHired: z.string().default(""),
      primaryEvidence: EvidenceQuoteSchema,
    })
  ).default([]),
  unresolvedDisagreements: z.array(
    z.object({
      dispute: z.string(),
      agentPerspectives: z.array(
        z.object({
          agent: z.string().transform(normalizeRole),
          view: z.string(),
        })
      ).default([]),
      recommendedVerification: z.string().default(""),
    })
  ).default([]),
  targetedNextRoundProbes: z.array(
    z.object({
      area: z.string(),
      suggestedQuestion: z.string(),
      whatToLookFor: z.string().default(""),
      reasonForProbe: z.string().default(""),
    })
  ).default([]),
  decisionAuditTrail: z.object({
    calculatedAverageWasProhibited: z.literal(true).default(true),
    rationaleForVerdictChoice: z.string().default("Synthesized from debate and evidence credibility."),
    alternativesConsideredAndRejected: z.array(
      z.object({
        option: PreliminaryRecommendationSchema,
        rejectionReason: z.string().default(""),
      })
    ).default([]),
  }),
  timestamp: z.string().default(() => new Date().toISOString()),
});
