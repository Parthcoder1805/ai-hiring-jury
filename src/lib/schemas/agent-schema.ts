import { z } from "zod";
import { EvidenceQuoteSchema } from "./profile-schema";

export const PreliminaryRecommendationSchema = z.string().transform((val) => {
  const v = (val || "").toLowerCase();
  if (v.includes("strong hire")) return "Strong Hire";
  if (v.includes("reject")) return "Reject";
  if (v.includes("hold") || v.includes("evidence") || v.includes("more")) return "Hold / Need More Evidence";
  if (v.includes("next") || v.includes("proceed") || v.includes("round")) return "Proceed to Next Round";
  return "Hire";
});

export const AgentEvaluationSchema = z.object({
  agentRole: z.enum(["technical", "hr", "hiring_manager", "skeptic"]),
  agentName: z.string(),
  avatar: z.string().default("🧑‍💼"),
  title: z.string().default("Evaluator"),
  overallAssessment: z.string(),
  confidenceScore: z.number().transform((n) => Math.min(100, Math.max(0, Math.round(n)))),
  recommendation: PreliminaryRecommendationSchema,
  strengths: z.array(
    z.object({
      point: z.string(),
      evidence: EvidenceQuoteSchema,
      reasoning: z.string().default(""),
    })
  ).default([]),
  concerns: z.array(
    z.object({
      point: z.string(),
      severity: z.string().transform((val) => {
        const v = (val || "").toLowerCase();
        if (v.includes("high")) return "high";
        if (v.includes("low")) return "low";
        return "medium";
      }),
      evidence: EvidenceQuoteSchema,
      reasoning: z.string().default(""),
    })
  ).default([]),
  skillObservations: z
    .array(
      z.object({
        skill: z.string(),
        assessment: z.string(),
        evidence: EvidenceQuoteSchema,
        reasoning: z.string().default(""),
      })
    )
    .optional(),
  behavioralObservations: z
    .array(
      z.object({
        trait: z.string(),
        assessment: z.string(),
        evidence: EvidenceQuoteSchema,
      })
    )
    .optional(),
  skepticFlags: z
    .array(
      z.object({
        issue: z.string(),
        status: z.string().transform((val) => {
          const v = (val || "").toLowerCase();
          if (v.includes("confirm")) return "Confirmed Issue";
          if (v.includes("no evidence") || v.includes("none")) return "No Evidence of Concern";
          return "Potential Concern";
        }),
        severity: z.string().transform((val) => {
          const v = (val || "").toLowerCase();
          if (v.includes("high")) return "high";
          if (v.includes("low")) return "low";
          return "medium";
        }),
        resumeEvidence: z.string().default(""),
        transcriptEvidence: z.string().default(""),
        reasoning: z.string().default(""),
      })
    )
    .optional(),
  timestamp: z.string().default(() => new Date().toISOString()),
  isolatedExecutionProof: z.object({
    callId: z.string(),
    startedAt: z.string(),
    finishedAt: z.string(),
    inputTokenEstimate: z.number(),
    outputTokenEstimate: z.number(),
    crossAgentContextReceived: z.literal(false),
  }),
});
