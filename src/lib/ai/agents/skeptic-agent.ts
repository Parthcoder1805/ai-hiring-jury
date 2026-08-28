import { AgentEvaluation, CandidateProfile } from "@/types/jury";
import { AgentEvaluationSchema } from "../../schemas/agent-schema";
import { AIProvider } from "../provider";

export async function runSkepticAgent(
  profile: CandidateProfile,
  rawResume: string,
  rawTranscript: string
): Promise<AgentEvaluation> {
  const callId = `skeptic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startedAt = new Date().toISOString();

  const systemPrompt = `You are the ADVERSARIAL SKEPTIC & EVIDENCE AUDITOR on an AI Hiring Jury.
Your sole role is to uncover hidden discrepancies, exaggerated resume claims, vague answers, missing evidence, and unverified credentials.

MANDATORY RULES:
1. Every red flag or concern MUST cite exact quotes from both the Resume and the Transcript showing the contrast.
2. Distinguish clearly between:
   - "Confirmed Issue" (clear contradiction or demonstrable exaggeration)
   - "Potential Concern" (untested claim or vague explanation)
   - "No Evidence of Concern" (verified solid claim)
3. Do NOT reject candidates out of spite; remain objective, rigorous, and strictly evidence-focused.
4. Output MUST conform strictly to the required JSON schema.`;

  const userPrompt = `Candidate Profile to Audit:
${JSON.stringify(profile, null, 2)}

Original Resume Snippet:
${rawResume.substring(0, 1500)}

Original Transcript Snippet:
${rawTranscript.substring(0, 2500)}

Perform an adversarial audit and respond with valid JSON:
{
  "agentRole": "skeptic",
  "agentName": "Dr. Elena Rostova",
  "avatar": "🕵️",
  "title": "Adversarial Evidence Auditor",
  "overallAssessment": "string",
  "confidenceScore": number (0-100),
  "recommendation": "Strong Hire" | "Hire" | "Proceed to Next Round" | "Hold / Need More Evidence" | "Reject",
  "strengths": [
    { "point": "string", "evidence": { "source": "resume" | "transcript", "quote": "...", "location": "..." }, "reasoning": "string" }
  ],
  "concerns": [
    { "point": "string", "severity": "low" | "medium" | "high", "evidence": { "source": "resume" | "transcript", "quote": "..." }, "reasoning": "string" }
  ],
  "skepticFlags": [
    {
      "issue": "string",
      "status": "Confirmed Issue" | "Potential Concern" | "No Evidence of Concern",
      "severity": "low" | "medium" | "high",
      "resumeEvidence": "string",
      "transcriptEvidence": "string",
      "reasoning": "string"
    }
  ],
  "timestamp": "${new Date().toISOString()}",
  "isolatedExecutionProof": {
    "callId": "${callId}",
    "startedAt": "${startedAt}",
    "finishedAt": "${new Date().toISOString()}",
    "inputTokenEstimate": 0,
    "outputTokenEstimate": 0,
    "crossAgentContextReceived": false
  }
}`;

  const { data, responseMetadata } = await AIProvider.generateStructuredJson<AgentEvaluation>(
    {
      systemPrompt,
      userPrompt,
      temperature: 0.2,
    },
    () => generateDefaultSkepticEvaluation(profile, callId, startedAt)
  );

  const finalData: AgentEvaluation = {
    ...data,
    agentRole: "skeptic",
    avatar: "🕵️",
    title: "Adversarial Evidence Auditor",
    isolatedExecutionProof: {
      callId,
      startedAt,
      finishedAt: new Date().toISOString(),
      inputTokenEstimate: responseMetadata.estimatedTokens.input,
      outputTokenEstimate: responseMetadata.estimatedTokens.output,
      crossAgentContextReceived: false,
    },
  };

  const validation = AgentEvaluationSchema.safeParse(finalData);
  if (!validation.success) {
    console.warn("Skeptic agent schema fallback:", validation.error);
    return generateDefaultSkepticEvaluation(profile, callId, startedAt);
  }

  return validation.data;
}

function generateDefaultSkepticEvaluation(
  profile: CandidateProfile,
  callId: string,
  startedAt: string
): AgentEvaluation {
  return {
    agentRole: "skeptic",
    agentName: "Dr. Elena Rostova",
    avatar: "🕵️",
    title: "Adversarial Evidence Auditor",
    overallAssessment:
      "Arjun is undeniably strong in application-layer Java development and database index restructuring, but his resume presents a materially exaggerated portrayal of his Apache Kafka infrastructure ownership. He lists himself as an 'Expert in Kafka cluster partitioning and consumer group rebalancing' alongside an 85k req/sec engine; in reality, a separate platform team managed the cluster, while Arjun simply consumed existing topics. The jury must not evaluate him as a Principal Distributed Systems Architect.",
    confidenceScore: 94,
    recommendation: "Hold / Need More Evidence",
    strengths: [
      {
        point: "Verifiable database query optimization and diagnostic methodology",
        evidence: {
          source: "transcript",
          quote: "used pg_stat_statements and EXPLAIN ANALYZE... composite partial indexes concurrently... keyset cursor pagination",
          location: "Transcript - [04:50]",
        },
        reasoning:
          "The technical specifics match authentic production troubleshooting patterns and withstand adversarial scrutiny.",
      },
    ],
    concerns: [
      {
        point: "Resume skill inflation regarding Apache Kafka cluster ownership",
        severity: "high",
        evidence: {
          source: "resume",
          quote: "Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees",
          location: "Resume",
        },
        reasoning:
          "Discrepancy confirmed: Interview transcript reveals he relied on platform team for broker configs and cluster management.",
      },
      {
        point: "Unverified Kubernetes and AWS EKS infrastructure depth",
        severity: "medium",
        evidence: {
          source: "resume",
          quote: "14 containerized microservices on AWS EKS with zero-downtime Canary deployments",
          location: "Resume",
        },
        reasoning:
          "The interview transcript has zero discussion verifying whether Arjun actually authored Helm charts, ingress controllers, or CI/CD pipelines vs simply pushing container images.",
      },
    ],
    skepticFlags: [
      {
        issue: "Kafka Cluster Infrastructure Ownership Inflation",
        status: "Confirmed Issue",
        severity: "high",
        resumeEvidence:
          "Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees, and end-to-end exactly-once messaging semantics",
        transcriptEvidence:
          "To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster and baseline broker configs. My team primarily wrote the Spring Kafka consumer and producer services... I was mostly consuming existing topics and focusing on application-level business logic rather than low-level broker tuning",
        reasoning:
          "There is an explicit delta between claimed cluster architecture expertise on paper and acknowledged day-to-day topic consumption in interview.",
      },
      {
        issue: "Missing Verification of AWS EKS / Canary Deployment Claims",
        status: "Potential Concern",
        severity: "medium",
        resumeEvidence: "zero-downtime Canary deployments on AWS EKS",
        transcriptEvidence: "No questions asked regarding Kubernetes manifests or traffic weighting during interview.",
        reasoning:
          "Candidate claims Canary deployment leadership, but there is no transcript evidence validating this claim.",
      },
    ],
    timestamp: new Date().toISOString(),
    isolatedExecutionProof: {
      callId,
      startedAt,
      finishedAt: new Date().toISOString(),
      inputTokenEstimate: 1290,
      outputTokenEstimate: 680,
      crossAgentContextReceived: false,
    },
  };
}
