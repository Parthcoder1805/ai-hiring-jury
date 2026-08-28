import { describe, it, expect } from "vitest";
import {
  CandidateProfileSchema,
  EvidenceQuoteSchema,
  CandidateClaimSchema,
  InconsistencyFlagSchema,
} from "@/lib/schemas/profile-schema";
import { AgentEvaluationSchema, PreliminaryRecommendationSchema } from "@/lib/schemas/agent-schema";
import { DebateSummarySchema, DebateMessageSchema } from "@/lib/schemas/debate-schema";
import { FinalDecisionSchema } from "@/lib/schemas/decision-schema";

describe("Zod Validation Schemas Suite", () => {
  describe("EvidenceQuoteSchema & Profile Schemas", () => {
    it("should parse valid EvidenceQuote with various sources", () => {
      const resumeQuote = {
        source: "resume",
        quote: "Designed high-throughput Kafka streaming pipeline",
        location: "Page 2",
      };
      const result = EvidenceQuoteSchema.safeParse(resumeQuote);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.source).toBe("resume");
        expect(result.data.quote).toBe("Designed high-throughput Kafka streaming pipeline");
      }
    });

    it("should transform source casing and fallback gracefully", () => {
      const quote = {
        source: "INTERVIEW_TRANSCRIPT",
        quote: "We had a dedicated DevOps team managing Kafka clusters.",
      };
      const result = EvidenceQuoteSchema.safeParse(quote);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.source).toBe("transcript");
      }
    });

    it("should parse CandidateClaim and InconsistencyFlag schemas", () => {
      const claim = {
        claim: "Architected distributed caching with Redis",
        source: "resume",
        evidence: "Resume Section: Technical Projects",
        category: "technical",
        verifiedStatus: "supported",
      };
      const claimResult = CandidateClaimSchema.safeParse(claim);
      expect(claimResult.success).toBe(true);

      const inconsistency = {
        title: "Kafka Cluster Ownership Mismatch",
        topic: "Distributed Streaming",
        resumeClaim: "Managed large-scale Kafka cluster infrastructure",
        transcriptClaim: "Admitted cluster was managed by central infra team",
        severity: "medium",
        type: "depth_mismatch",
        explanation: "Resume suggests infrastructure ownership, but transcript clarifies application consumption.",
      };
      const incResult = InconsistencyFlagSchema.safeParse(inconsistency);
      expect(incResult.success).toBe(true);
    });

    it("should validate a complete CandidateProfile object", () => {
      const fullProfile = {
        name: "Arjun Mehta",
        targetRole: "Senior Backend Engineer",
        summary: "8+ years in distributed backend systems and Java/Spring microservices.",
        education: [{ institution: "IIT Bombay", degree: "B.Tech Computer Science", year: "2016" }],
        skills: [
          {
            name: "PostgreSQL",
            category: "database",
            claimedProficiency: "expert",
            demonstratedDepth: "strong",
            evidenceQuotes: [
              {
                source: "transcript",
                quote: "Optimized complex query execution plans reducing latency by 45%.",
              },
            ],
          },
        ],
        experience: [
          {
            company: "FinTech Scaleup",
            role: "Lead Backend Engineer",
            duration: "2020 - Present",
            keyContributions: ["Led payment microservices overhaul"],
            evidenceQuotes: [],
          },
        ],
        projects: [],
        claims: [],
        inconsistencies: [],
        missingInformation: ["Cloud cost management depth"],
        extractedAt: new Date().toISOString(),
      };
      const result = CandidateProfileSchema.safeParse(fullProfile);
      expect(result.success).toBe(true);
    });
  });

  describe("AgentEvaluationSchema", () => {
    it("should normalize preliminary recommendations correctly", () => {
      expect(PreliminaryRecommendationSchema.parse("Strong Hire")).toBe("Strong Hire");
      expect(PreliminaryRecommendationSchema.parse("proceed to next round")).toBe("Proceed to Next Round");
      expect(PreliminaryRecommendationSchema.parse("REJECT")).toBe("Reject");
      expect(PreliminaryRecommendationSchema.parse("need more evidence")).toBe("Hold / Need More Evidence");
    });

    it("should validate an isolated agent evaluation with execution proof", () => {
      const evaluation = {
        agentRole: "technical",
        agentName: "Marcus Vance",
        avatar: "🧑‍💻",
        title: "Principal Systems Architect",
        overallAssessment: "Strong hands-on database optimization and API architecture.",
        confidenceScore: 88,
        recommendation: "Proceed to Next Round",
        strengths: [
          {
            point: "Deep PostgreSQL query planner knowledge",
            evidence: { source: "transcript", quote: "Explained index scan vs sequential scan nuances." },
            reasoning: "Demonstrates practical production debugging skills.",
          },
        ],
        concerns: [
          {
            point: "Kafka infrastructure management depth is limited",
            severity: "medium",
            evidence: { source: "transcript", quote: "Platform team handled partition tuning." },
            reasoning: "Not a blocker for application-level backend role.",
          },
        ],
        isolatedExecutionProof: {
          callId: "tech-test-call-123",
          startedAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          inputTokenEstimate: 1200,
          outputTokenEstimate: 350,
          crossAgentContextReceived: false,
        },
      };

      const result = AgentEvaluationSchema.safeParse(evaluation);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.confidenceScore).toBe(88);
        expect(result.data.isolatedExecutionProof.crossAgentContextReceived).toBe(false);
      }
    });
  });

  describe("DebateSummarySchema & DebateMessageSchema", () => {
    it("should validate debate rounds with concessions and stance changes", () => {
      const debateTurn = {
        id: "turn-1",
        roundNumber: 1,
        speaker: "skeptic",
        speakerName: "Dr. Elena Rostova",
        respondingTo: "technical",
        respondingToName: "Marcus Vance",
        position: "Arjun's resume claims Kafka cluster tuning, but transcript shows infra team managed it.",
        disagreementType: "challenge_evidence",
        evidenceCitations: [
          { source: "transcript", quote: "We had an infrastructure team handling cluster configuration." },
        ],
        changedMind: false,
        timestamp: new Date().toISOString(),
      };

      const turnResult = DebateMessageSchema.safeParse(debateTurn);
      expect(turnResult.success).toBe(true);

      const fullDebate = {
        topicOfDebate: "Kafka Infrastructure vs Application Depth",
        rounds: [debateTurn],
        keyDisagreementsExplored: ["Kafka operational responsibility"],
        concessionsMade: [
          {
            agent: "technical",
            priorPosition: "Assumed candidate was Kafka cluster tuning expert",
            revisedPosition: "Conceded candidate is strong consumer, not cluster admin",
            reason: "Transcript clarifies central infra ownership",
          },
        ],
        unresolvedDisagreements: [],
        consensusPoints: ["Candidate possesses exceptional database optimization skills."],
      };

      const debateResult = DebateSummarySchema.safeParse(fullDebate);
      expect(debateResult.success).toBe(true);
    });
  });

  describe("FinalDecisionSchema", () => {
    it("should strictly enforce calculatedAverageWasProhibited rule", () => {
      const finalDecision = {
        recommendation: "Proceed to Next Round",
        confidenceScore: 86,
        executiveReasoning: "Candidate demonstrates verified depth in PostgreSQL and Spring Boot.",
        synthesisBreakdown: {
          technicalWeighting: "Solid application architecture depth.",
          behavioralWeighting: "High intellectual honesty in interview.",
          businessImpactWeighting: "Ready to contribute immediately to core services.",
          skepticRiskWeighting: "Risk mitigated by role definition.",
        },
        keyStrengths: [
          {
            title: "Database Performance Tuning",
            description: "Demonstrated real-world query optimization.",
            supportingAgents: ["technical", "hiring_manager"],
            primaryEvidence: { source: "transcript", quote: "Reduced P99 latency from 1.2s to 180ms." },
          },
        ],
        keyRisks: [
          {
            title: "Kafka Operational Gap",
            description: "Will need onboarding if broker tuning is required.",
            severity: "low",
            impactIfHired: "Minimal as infrastructure team manages brokers.",
            primaryEvidence: { source: "transcript", quote: "Infrastructure managed by DevOps team." },
          },
        ],
        unresolvedDisagreements: [],
        targetedNextRoundProbes: [
          {
            area: "Distributed Transactions",
            suggestedQuestion: "How do you handle compensating transactions in saga patterns?",
            whatToLookFor: "Understanding of idempotent endpoints and outbox pattern.",
            reasonForProbe: "Verify architectural depth in event-driven systems.",
          },
        ],
        decisionAuditTrail: {
          calculatedAverageWasProhibited: true,
          rationaleForVerdictChoice: "Verdict synthesized based on evidence weight and debate concessions.",
          alternativesConsideredAndRejected: [
            {
              option: "Reject",
              rejectionReason: "Flaws identified are non-critical to target job description.",
            },
          ],
        },
        timestamp: new Date().toISOString(),
      };

      const result = FinalDecisionSchema.safeParse(finalDecision);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.decisionAuditTrail.calculatedAverageWasProhibited).toBe(true);
        expect(result.data.targetedNextRoundProbes.length).toBe(1);
      }
    });
  });
});
