import { z } from "zod";

export const EvidenceSourceSchema = z.string().transform((val) => {
  const v = (val || "").toLowerCase();
  if (v.includes("resume")) return "resume";
  if (v.includes("transcript")) return "transcript";
  if (v.includes("debate")) return "debate";
  return "synthesis";
});

export const EvidenceQuoteSchema = z.object({
  source: EvidenceSourceSchema,
  quote: z.string().default(""),
  location: z.string().optional(),
  context: z.string().optional(),
});

export const CandidateClaimSchema = z.object({
  id: z.string().default(() => `claim-${Math.random().toString(36).substring(2, 7)}`),
  claim: z.string(),
  source: EvidenceSourceSchema,
  evidence: z.string().default(""),
  category: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("tech")) return "technical";
    if (v.includes("exp")) return "experience";
    if (v.includes("lead")) return "leadership";
    if (v.includes("soft")) return "soft_skill";
    if (v.includes("edu")) return "education";
    return "technical";
  }),
  verifiedStatus: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("support") || v.includes("verified")) return "supported";
    if (v.includes("exaggerat")) return "exaggerated";
    if (v.includes("contradict")) return "contradicted";
    return "unverified";
  }),
  notes: z.string().optional(),
});

export const InconsistencyFlagSchema = z.object({
  id: z.string().default(() => `inc-${Math.random().toString(36).substring(2, 7)}`),
  title: z.string(),
  topic: z.string().default("General"),
  resumeClaim: z.string().default(""),
  transcriptClaim: z.string().default(""),
  resumeQuote: z.string().optional(),
  transcriptQuote: z.string().optional(),
  severity: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("high")) return "high";
    if (v.includes("low")) return "low";
    return "medium";
  }),
  type: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("depth")) return "depth_mismatch";
    if (v.includes("gap")) return "experience_gap";
    if (v.includes("contradict")) return "contradiction";
    return "vague_claim";
  }),
  explanation: z.string().default(""),
});

export const SkillItemSchema = z.object({
  name: z.string(),
  category: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("back")) return "backend";
    if (v.includes("front")) return "frontend";
    if (v.includes("data")) return "database";
    if (v.includes("devop") || v.includes("infra") || v.includes("cloud")) return "devops";
    if (v.includes("arch")) return "architecture";
    if (v.includes("soft") || v.includes("cultur")) return "soft_skill";
    return "other";
  }),
  claimedProficiency: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("expert")) return "expert";
    if (v.includes("advanc")) return "advanced";
    if (v.includes("intermed")) return "intermediate";
    return "familiar";
  }),
  demonstratedDepth: z.string().transform((val) => {
    const v = (val || "").toLowerCase();
    if (v.includes("strong")) return "strong";
    if (v.includes("superf") || v.includes("weak")) return "superficial";
    if (v.includes("untest") || v.includes("miss")) return "untested";
    return "moderate";
  }),
  evidenceQuotes: z.array(EvidenceQuoteSchema).default([]),
});

export const WorkExperienceItemSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string().default(""),
  keyContributions: z.array(z.string()).default([]),
  evidenceQuotes: z.array(EvidenceQuoteSchema).default([]),
});

export const CandidateProfileSchema = z.object({
  name: z.string(),
  targetRole: z.string(),
  summary: z.string(),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string().optional(),
      evidenceQuote: EvidenceQuoteSchema.optional(),
    })
  ).default([]),
  skills: z.array(SkillItemSchema).default([]),
  experience: z.array(WorkExperienceItemSchema).default([]),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string().default(""),
      technologies: z.array(z.string()).default([]),
      evidenceQuote: EvidenceQuoteSchema.optional(),
    })
  ).default([]),
  claims: z.array(CandidateClaimSchema).default([]),
  inconsistencies: z.array(InconsistencyFlagSchema).default([]),
  missingInformation: z.array(z.union([z.string(), z.record(z.any())]).transform((v) => typeof v === "string" ? v : (v.topic ? `${v.topic}: ${v.description || JSON.stringify(v)}` : JSON.stringify(v)))).default([]),
  extractedAt: z.string().default(() => new Date().toISOString()),
});
