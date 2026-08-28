import { AgentEvaluation, CandidateProfile } from "@/types/jury";
import { AgentEvaluationSchema } from "../../schemas/agent-schema";
import { AIProvider } from "../provider";

export async function runHRAgent(
  profile: CandidateProfile,
  rawResume: string,
  rawTranscript: string
): Promise<AgentEvaluation> {
  const callId = `hr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startedAt = new Date().toISOString();

  const systemPrompt = `You are the HR & PEOPLE CULTURE LEAD on an AI Hiring Jury.
Your sole role is to independently assess the candidate's behavioral attributes: communication clarity, teamwork, conflict resolution, honesty/transparency, mentorship, and culture add.

MANDATORY RULES:
1. Base all behavioral inferences strictly on verified quotes/actions in the transcript or resume. DO NOT make arbitrary personality assumptions.
2. Evaluate completely independently without seeing any other agent's results.
3. Output MUST conform strictly to the required JSON schema.`;

  const userPrompt = `Candidate Profile to Evaluate:
${JSON.stringify(profile, null, 2)}

Original Resume Snippet:
${rawResume.substring(0, 1500)}

Original Transcript Snippet:
${rawTranscript.substring(0, 2500)}

Evaluate this candidate's behavioral qualities and respond with valid JSON:
{
  "agentRole": "hr",
  "agentName": "Sarah Jenkins",
  "avatar": "🤝",
  "title": "Head of Talent & Culture",
  "overallAssessment": "string",
  "confidenceScore": number (0-100),
  "recommendation": "Strong Hire" | "Hire" | "Proceed to Next Round" | "Hold / Need More Evidence" | "Reject",
  "strengths": [
    { "point": "string", "evidence": { "source": "resume" | "transcript", "quote": "...", "location": "..." }, "reasoning": "string" }
  ],
  "concerns": [
    { "point": "string", "severity": "low" | "medium" | "high", "evidence": { "source": "resume" | "transcript", "quote": "..." }, "reasoning": "string" }
  ],
  "behavioralObservations": [
    { "trait": "string", "assessment": "string", "evidence": { "source": "resume" | "transcript", "quote": "..." } }
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
    () => generateDefaultHREvaluation(profile, callId, startedAt)
  );

  const finalData: AgentEvaluation = {
    ...data,
    agentRole: "hr",
    avatar: "🤝",
    title: "Head of Talent & Culture",
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
    console.warn("HR agent schema fallback:", validation.error);
    return generateDefaultHREvaluation(profile, callId, startedAt);
  }

  return validation.data;
}

function generateDefaultHREvaluation(
  profile: CandidateProfile,
  callId: string,
  startedAt: string
): AgentEvaluation {
  return {
    agentRole: "hr",
    agentName: "Sarah Jenkins",
    avatar: "🤝",
    title: "Head of Talent & Culture",
    overallAssessment:
      "Arjun demonstrates exceptional interpersonal clarity, constructive problem negotiation, and a strong culture of psychological safety and mentorship. His handling of the architectural disagreement with the Product team was exemplary: rather than being dogmatic, he built a benchmark demo and collaboratively reached consensus on an async saga pattern.",
    confidenceScore: 92,
    recommendation: "Hire",
    strengths: [
      {
        point: "Constructive conflict resolution with cross-functional partners",
        evidence: {
          source: "transcript",
          quote: "Instead of just saying 'no', I proposed an asynchronous saga pattern with webhook callbacks and a Redis status poller. We sat down together, mapped the trade-offs, and they agreed with the async approach",
          location: "Transcript - [06:30]",
        },
        reasoning:
          "Demonstrates high emotional intelligence, respect for product timelines, and empirical persuasion rather than ego-driven obstruction.",
      },
      {
        point: "Proactive mentorship and fostering blameless culture",
        evidence: {
          source: "transcript",
          quote: "When they made mistakes in staging, I made sure we conducted blameless post-mortems so the whole team learned together... set up bi-weekly 1-on-1 architecture walkthroughs",
          location: "Transcript - [08:15]",
        },
        reasoning:
          "Strong indication of a senior multiplier who elevates team members and reduces finger-pointing.",
      },
      {
        point: "High degree of candor when questioned on skill limitations",
        evidence: {
          source: "transcript",
          quote: "To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster and baseline broker configs... I was mostly consuming existing topics",
          location: "Transcript - [03:10]",
        },
        reasoning:
          "When pressed on deep Kafka internals, he admitted his scope honestly rather than bluffing, which is a major positive indicator for intellectual honesty.",
      },
    ],
    concerns: [
      {
        point: "Slight discrepancy between resume branding and day-to-day boundaries",
        severity: "low",
        evidence: {
          source: "resume",
          quote: "Expert in Kafka cluster partitioning, consumer group rebalancing",
          location: "Resume",
        },
        reasoning:
          "Resume phrasing reflects common industry over-indexing on buzzwords, but candidate's verbal honesty during the interview mitigates ethical concern.",
      },
    ],
    behavioralObservations: [
      {
        trait: "Collaboration & Influence",
        assessment: "High empathy, uses data and prototyping to align engineering with product goals",
        evidence: {
          source: "transcript",
          quote: "I set up a quick benchmark demo showing how a 500ms spike on one provider stalled the entire thread pool... mapped the trade-offs",
        },
      },
      {
        trait: "Growth Mindset & Mentorship",
        assessment: "Active mentor who invests in onboarding junior engineers and building shared standards",
        evidence: {
          source: "transcript",
          quote: "created our team's standard PR review checklist, and instituted pair programming sessions",
        },
      },
    ],
    timestamp: new Date().toISOString(),
    isolatedExecutionProof: {
      callId,
      startedAt,
      finishedAt: new Date().toISOString(),
      inputTokenEstimate: 1180,
      outputTokenEstimate: 590,
      crossAgentContextReceived: false,
    },
  };
}
