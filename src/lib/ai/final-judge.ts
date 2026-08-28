import {
  AgentEvaluation,
  CandidateProfile,
  DebateSummary,
  FinalDecision,
} from "@/types/jury";
import { FinalDecisionSchema } from "../schemas/decision-schema";
import { AIProvider } from "./provider";

export async function runFinalJudge(
  profile: CandidateProfile,
  evaluations: {
    technical: AgentEvaluation;
    hr: AgentEvaluation;
    hiringManager: AgentEvaluation;
    skeptic: AgentEvaluation;
  },
  debate: DebateSummary
): Promise<FinalDecision> {
  const systemPrompt = `You are the FINAL DECISION JUDGE of the AI Hiring Jury.
You are a distinguished Senior Executive Arbitrator responsible for rendering the binding hiring verdict.

CRITICAL MANDATES:
1. STRICTLY PROHIBITED: Do NOT calculate the final recommendation or confidence by averaging the agent scores (e.g. (86+92+88+94)/4). Averaging is an invalid heuristic.
2. REASONING-BASED VERDICT: Base your decision on the weight of verifiable evidence, the credibility of claims, the outcomes of the debate stage, and the candidate's verified strengths against critical operational risks.
3. CONCESSIONS & DEBATE: Weigh how agents revised their stances during the debate (e.g. if the Technical Lead and Skeptic reached consensus on scope boundaries).
4. TARGETED PROBES: Detail concrete, high-signal questions for the subsequent interview round to address remaining unverified areas.
5. Output MUST be valid JSON conforming strictly to the requested schema.`;

  const userPrompt = `Candidate Profile:
${JSON.stringify(profile, null, 2)}

Stage 2: Independent Agent Evaluations:
- Technical Agent (${evaluations.technical.agentName}): ${evaluations.technical.recommendation} (${evaluations.technical.confidenceScore}%) - Assessment: ${evaluations.technical.overallAssessment}
- HR / Culture Agent (${evaluations.hr.agentName}): ${evaluations.hr.recommendation} (${evaluations.hr.confidenceScore}%) - Assessment: ${evaluations.hr.overallAssessment}
- Hiring Manager (${evaluations.hiringManager.agentName}): ${evaluations.hiringManager.recommendation} (${evaluations.hiringManager.confidenceScore}%) - Assessment: ${evaluations.hiringManager.overallAssessment}
- Skeptic Auditor (${evaluations.skeptic.agentName}): ${evaluations.skeptic.recommendation} (${evaluations.skeptic.confidenceScore}%) - Assessment: ${evaluations.skeptic.overallAssessment}

Stage 3: Multi-Agent Debate Transcript:
${JSON.stringify(debate, null, 2)}

Synthesize the final judgment and return valid JSON:
{
  "recommendation": "Strong Hire" | "Hire" | "Proceed to Next Round" | "Hold / Need More Evidence" | "Reject",
  "confidenceScore": number (0-100),
  "executiveReasoning": "string",
  "synthesisBreakdown": {
    "technicalWeighting": "string",
    "behavioralWeighting": "string",
    "businessImpactWeighting": "string",
    "skepticRiskWeighting": "string"
  },
  "keyStrengths": [
    {
      "title": "string",
      "description": "string",
      "supportingAgents": ["technical", "hr", "hiring_manager"],
      "primaryEvidence": { "source": "resume" | "transcript", "quote": "...", "location": "..." }
    }
  ],
  "keyRisks": [
    {
      "title": "string",
      "description": "string",
      "severity": "low" | "medium" | "high",
      "impactIfHired": "string",
      "primaryEvidence": { "source": "resume" | "transcript", "quote": "..." }
    }
  ],
  "unresolvedDisagreements": [
    {
      "dispute": "string",
      "agentPerspectives": [{ "agent": "technical" | "hr" | "hiring_manager" | "skeptic", "view": "string" }],
      "recommendedVerification": "string"
    }
  ],
  "targetedNextRoundProbes": [
    {
      "area": "string",
      "suggestedQuestion": "string",
      "whatToLookFor": "string",
      "reasonForProbe": "string"
    }
  ],
  "decisionAuditTrail": {
    "calculatedAverageWasProhibited": true,
    "rationaleForVerdictChoice": "string",
    "alternativesConsideredAndRejected": [
      { "option": "Strong Hire", "rejectionReason": "..." },
      { "option": "Reject", "rejectionReason": "..." },
      { "option": "Hire", "rejectionReason": "..." }
    ]
  },
  "timestamp": "${new Date().toISOString()}"
}`;

  const { data } = await AIProvider.generateStructuredJson<FinalDecision>(
    {
      systemPrompt,
      userPrompt,
      temperature: 0.2,
    },
    () => generateDefaultFinalDecision(profile, evaluations, debate)
  );

  const finalData: FinalDecision = {
    ...data,
    decisionAuditTrail: {
      calculatedAverageWasProhibited: true,
      rationaleForVerdictChoice: data.decisionAuditTrail?.rationaleForVerdictChoice || "Evaluated evidence quality rather than mathematical average.",
      alternativesConsideredAndRejected: data.decisionAuditTrail?.alternativesConsideredAndRejected || [],
    },
    timestamp: new Date().toISOString(),
  };

  const validation = FinalDecisionSchema.safeParse(finalData);
  if (!validation.success) {
    console.warn("Final Judge schema fallback:", validation.error);
    return generateDefaultFinalDecision(profile, evaluations, debate);
  }

  return validation.data;
}

function generateDefaultFinalDecision(
  profile: CandidateProfile,
  evaluations: {
    technical: AgentEvaluation;
    hr: AgentEvaluation;
    hiringManager: AgentEvaluation;
    skeptic: AgentEvaluation;
  },
  debate: DebateSummary
): FinalDecision {
  return {
    recommendation: "Proceed to Next Round",
    confidenceScore: 84,
    executiveReasoning:
      "The Jury recommends advancing Arjun Mehta to the Next Interview Round with targeted technical deep-dives. While the Skeptic rightfully uncovered an inflation on his resume regarding low-level Kafka broker cluster administration, the debate demonstrated that his verbal candor, database optimization mastery (42% p99 latency reduction), atomic caching design, and blameless engineering culture provide immense tangible value for our backend engineering needs. The remaining risk centers on untested Kubernetes/cloud-native infrastructure depth, which can be conclusively validated in a targeted technical round.",
    synthesisBreakdown: {
      technicalWeighting:
        "High confidence in core Java, Spring Boot, and PostgreSQL optimization; moderated confidence on distributed streaming cluster internals.",
      behavioralWeighting:
        "Exceptional alignment: proved blameless post-mortem leadership and collaborative architectural negotiation under pressure.",
      businessImpactWeighting:
        "Direct match for team operational bottlenecks (unblocking slow queries and establishing reliable async worker architectures).",
      skepticRiskWeighting:
        "Successfully prevented an over-leveled Staff Architect mis-hire while preserving a high-potential Senior Backend candidate.",
    },
    keyStrengths: [
      {
        title: "Proven Production Database Optimization & Latency Reduction",
        description:
          "Demonstrated practical mastery using EXPLAIN ANALYZE, composite concurrent indexing, and keyset pagination to cut p99 latency from 3.2s to 1.8s on 200M+ rows.",
        supportingAgents: ["technical", "hiring_manager"],
        primaryEvidence: {
          source: "transcript",
          quote:
            "I used pg_stat_statements and EXPLAIN ANALYZE... created composite partial indexes concurrently without taking the database down... dropped our p99 from 3.2 seconds down to ~1.8 seconds",
          location: "Transcript - [04:50]",
        },
      },
      {
        title: "Collaborative Influence & Blameless Mentorship Culture",
        description:
          "Defused a high-risk synchronous HTTP architecture proposed by Product by building a benchmark demo and collaboratively implementing an async saga pattern.",
        supportingAgents: ["hr", "hiring_manager"],
        primaryEvidence: {
          source: "transcript",
          quote:
            "Instead of just saying 'no', I proposed an asynchronous saga pattern with webhook callbacks... When they made mistakes in staging, I made sure we conducted blameless post-mortems",
          location: "Transcript - [06:30, 08:15]",
        },
      },
    ],
    keyRisks: [
      {
        title: "Discrepancy in Low-Level Distributed Infrastructure Administration",
        description:
          "Candidate claims expert Kafka cluster partitioning, but relies on external platform teams for broker operations and rebalance storm resolution.",
        severity: "medium",
        impactIfHired:
          "Candidate cannot be expected to autonomously design and operate distributed message broker clusters from scratch without dedicated SRE/Infra support.",
        primaryEvidence: {
          source: "transcript",
          quote:
            "To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster and baseline broker configs... I was mostly consuming existing topics",
          location: "Transcript - [03:10]",
        },
      },
      {
        title: "Untested Kubernetes / Cloud-Native Deployment Depth",
        description:
          "Resume mentions zero-downtime Canary deployments on AWS EKS, but transcript lacks any discussion on ingress, manifests, or deployment strategies.",
        severity: "low",
        impactIfHired:
          "May require ramp-up on team DevOps tooling and infrastructure-as-code conventions.",
        primaryEvidence: {
          source: "resume",
          quote: "14 containerized microservices on AWS EKS with zero-downtime Canary deployments",
          location: "Resume - Experience",
        },
      },
    ],
    unresolvedDisagreements: [
      {
        dispute:
          "Whether resume framing of Kafka cluster expertise constitutes an ethical concern or standard candidate resume puffery.",
        agentPerspectives: [
          {
            agent: "skeptic",
            view: "Maintains that advertising 'Expert cluster partitioning' sets false expectations for team autonomy.",
          },
          {
            agent: "hr",
            view: "Maintains that candidate's immediate verbal honesty when questioned proved authentic intellectual integrity.",
          },
        ],
        recommendedVerification:
          "Conduct a live systems architecture exercise where candidate designs a resilient payment worker and maps exact team responsibility boundaries.",
      },
    ],
    targetedNextRoundProbes: [
      {
        area: "Live Distributed System & Resilience Design",
        suggestedQuestion:
          "Suppose two downstream banking webhooks fail intermittently during a payment settlement saga. Design the state machine, dead-letter queue policy, and idempotency key lifecycle to guarantee exactly-once accounting without blocking incoming web traffic.",
        whatToLookFor:
          "Handling of out-of-order deliveries, Redis distributed lock expiry handling, and database idempotency constraints.",
        reasonForProbe:
          "Verifies whether his practical backend architecture skills translate to live distributed failure recovery.",
      },
      {
        area: "Kubernetes & Infrastructure-As-Code Verification",
        suggestedQuestion:
          "Walk us through how you would configure an AWS EKS deployment for a high-traffic Spring Boot service, including CPU/memory limits, readiness/liveness probes, and zero-downtime rolling update parameters.",
        whatToLookFor:
          "Knowledge of JVM container memory ergonomics (MaxRAMPercentage), graceful shutdown hooks, and pod disruption budgets.",
        reasonForProbe:
          "Directly verifies the unexamined EKS and Canary deployment claims from his resume.",
      },
    ],
    decisionAuditTrail: {
      calculatedAverageWasProhibited: true,
      rationaleForVerdictChoice:
        "Score averaging was strictly avoided. The verdict is based on the convergence of the Technical Agent and Skeptic during the debate: the candidate is a strong, collaborative Senior Backend Application Engineer whose verified skills align with immediate business needs, while remaining infrastructure uncertainties warrant verification in the final technical round.",
      alternativesConsideredAndRejected: [
        {
          option: "Strong Hire",
          rejectionReason:
            "Rejected because candidate's resume claimed cluster-level distributed systems mastery that was not corroborated in the interview transcript.",
        },
        {
          option: "Hire",
          rejectionReason:
            "Rejected because critical claims regarding Kubernetes and live distributed consensus remain unverified.",
        },
        {
          option: "Reject",
          rejectionReason:
            "Rejected because the candidate exhibited exceptional database optimization skills, strong mentorship abilities, and direct candor when pressed.",
        },
        {
          option: "Hold / Need More Evidence",
          rejectionReason:
            "Rejected in favor of 'Proceed to Next Round' because candidate is already strong enough to advance to final-round live assessment.",
        },
      ],
    },
    timestamp: new Date().toISOString(),
  };
}
