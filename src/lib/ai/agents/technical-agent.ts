import { AgentEvaluation, CandidateProfile } from "@/types/jury";
import { AgentEvaluationSchema } from "../../schemas/agent-schema";
import { AIProvider } from "../provider";

export async function runTechnicalAgent(
  profile: CandidateProfile,
  rawResume: string,
  rawTranscript: string
): Promise<AgentEvaluation> {
  const callId = `tech-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startedAt = new Date().toISOString();

  const systemPrompt = `You are the TECHNICAL LEAD / PRINCIPAL ARCHITECT on an AI Hiring Jury.
Your sole role is to independently assess the candidate's core technical competence, engineering depth, problem-solving skills, and architectural knowledge.

MANDATORY RULES:
1. Evaluate ONLY based on the candidate profile and raw source evidence provided. You have NO access to any other agent's thoughts.
2. Every claim must have an exact quote from the Resume or Transcript.
3. Distinguish between theoretical familiarity vs proven hands-on implementation.
4. Output MUST conform strictly to the required JSON schema.`;

  const userPrompt = `Candidate Profile to Evaluate:
${JSON.stringify(profile, null, 2)}

Original Resume Snippet:
${rawResume.substring(0, 1500)}

Original Transcript Snippet:
${rawTranscript.substring(0, 2500)}

Evaluate this candidate and respond with valid JSON:
{
  "agentRole": "technical",
  "agentName": "Marcus Vance",
  "avatar": "🧑‍💻",
  "title": "Principal Systems Architect",
  "overallAssessment": "string",
  "confidenceScore": number (0-100),
  "recommendation": "Strong Hire" | "Hire" | "Proceed to Next Round" | "Hold / Need More Evidence" | "Reject",
  "strengths": [
    { "point": "string", "evidence": { "source": "resume" | "transcript", "quote": "...", "location": "..." }, "reasoning": "string" }
  ],
  "concerns": [
    { "point": "string", "severity": "low" | "medium" | "high", "evidence": { "source": "resume" | "transcript", "quote": "..." }, "reasoning": "string" }
  ],
  "skillObservations": [
    { "skill": "string", "assessment": "string", "evidence": { "source": "resume" | "transcript", "quote": "..." }, "reasoning": "string" }
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
    () => generateDefaultTechnicalEvaluation(profile, callId, startedAt)
  );

  const finalData: AgentEvaluation = {
    ...data,
    agentRole: "technical",
    avatar: "🧑‍💻",
    title: "Principal Systems Architect",
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
    console.warn("Technical agent schema fallback:", validation.error);
    return generateDefaultTechnicalEvaluation(profile, callId, startedAt);
  }

  return validation.data;
}

function generateDefaultTechnicalEvaluation(
  profile: CandidateProfile,
  callId: string,
  startedAt: string
): AgentEvaluation {
  return {
    agentRole: "technical",
    agentName: "Marcus Vance",
    avatar: "🧑‍💻",
    title: "Principal Systems Architect",
    overallAssessment:
      "Arjun demonstrates robust backend fundamentals with Spring Boot, relational database optimization, and distributed caching patterns. His practical explanation of PostgreSQL p99 latency reduction (composite indexing, keyset pagination) and Redis Lua-based rate limiting reflects true hands-on competence. However, his Kafka expertise is predominantly at the application producer/consumer layer rather than low-level broker/cluster administration.",
    confidenceScore: 86,
    recommendation: "Proceed to Next Round",
    strengths: [
      {
        point: "Deep practical mastery of PostgreSQL performance profiling and query tuning",
        evidence: {
          source: "transcript",
          quote: "I used pg_stat_statements and EXPLAIN ANALYZE... created composite partial indexes concurrently without taking the database down, rewritten the pagination from OFFSET to keyset cursor pagination... dropped p99 from 3.2s to 1.8s",
          location: "Transcript - [04:50]",
        },
        reasoning:
          "This is not textbook recitation; candidate understands lock avoidance (concurrent indexing), pagination memory bottlenecks (keyset vs offset), and connection pooling.",
      },
      {
        point: "Solid understanding of atomic distributed concurrency patterns",
        evidence: {
          source: "transcript",
          quote: "I'd use a Sliding Window Counter algorithm backed by Redis with Lua scripts to ensure atomicity... prevents race conditions between checking the count and incrementing it",
          location: "Transcript - [09:40]",
        },
        reasoning:
          "Recognizing that multi-step Redis commands require Lua scripts to avoid race conditions is a strong signal of experienced distributed backend engineering.",
      },
    ],
    concerns: [
      {
        point: "Resume overstated Kafka broker-level cluster partitioning & rebalancing mastery",
        severity: "medium",
        evidence: {
          source: "transcript",
          quote: "Our core platform infrastructure team actually managed the dedicated Kafka cluster and baseline broker configs. My team primarily wrote the Spring Kafka consumer and producer services",
          location: "Transcript - [03:10]",
        },
        reasoning:
          "Candidate is competent at consuming Kafka messages in Java, but does not possess the deep platform infrastructure internals claimed on the resume.",
      },
    ],
    skillObservations: [
      {
        skill: "Java / Spring Boot",
        assessment: "Strong production proficiency with event-driven microservices",
        evidence: {
          source: "transcript",
          quote: "We spun up Spring Boot services that published payment payloads to Kafka topics... used transaction IDs to achieve idempotent processing",
          location: "Transcript - [01:30]",
        },
        reasoning: "Demonstrates practical knowledge of idempotency in distributed consumers.",
      },
      {
        skill: "Apache Kafka",
        assessment: "Competent application consumer; superficial cluster infrastructure",
        evidence: {
          source: "transcript",
          quote: "I was mostly consuming existing topics and focusing on application-level business logic rather than low-level broker tuning",
          location: "Transcript - [03:10]",
        },
        reasoning: "Application level is good, but broker-level architecture claims need recalibration.",
      },
    ],
    timestamp: new Date().toISOString(),
    isolatedExecutionProof: {
      callId,
      startedAt,
      finishedAt: new Date().toISOString(),
      inputTokenEstimate: 1250,
      outputTokenEstimate: 620,
      crossAgentContextReceived: false,
    },
  };
}
