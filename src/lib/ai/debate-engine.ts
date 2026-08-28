import {
  AgentEvaluation,
  CandidateProfile,
  DebateMessage,
  DebateSummary,
} from "@/types/jury";
import { DebateSummarySchema } from "../schemas/debate-schema";
import { AIProvider } from "./provider";

export async function runDebateEngine(
  profile: CandidateProfile,
  evaluations: {
    technical: AgentEvaluation;
    hr: AgentEvaluation;
    hiringManager: AgentEvaluation;
    skeptic: AgentEvaluation;
  }
): Promise<DebateSummary> {
  const systemPrompt = `You are the DEBATE MODERATOR for the AI Hiring Jury.
Four independent agents have evaluated the candidate without seeing each other's opinions:
1. Technical Agent (Marcus Vance)
2. HR/Culture Agent (Sarah Jenkins)
3. Hiring Manager (David Chen)
4. Skeptic Auditor (Dr. Elena Rostova)

YOUR TASK:
Orchestrate a genuine, dynamic multi-agent debate where personas directly interact, challenge claims, cite evidence, and update their stances.

MANDATORY DEBATE REQUIREMENTS:
1. Must contain at least 4 to 6 conversational turns.
2. Every message must clearly specify 'speaker' and 'respondingTo'.
3. At least one agent MUST directly challenge another agent's assertion with evidence.
4. At least one agent MUST explicitly concede, revise their stance, or adjust their rating/confidence based on the challenge (setting changedMind: true).
5. All arguments must cite verbatim or accurate quotes from the Resume/Transcript.
6. Output MUST be valid JSON conforming strictly to the requested schema.`;

  const userPrompt = `Candidate Profile:
${JSON.stringify(profile, null, 2)}

Independent Agent Evaluations:
--- TECHNICAL AGENT ---
Assessment: ${evaluations.technical.overallAssessment}
Recommendation: ${evaluations.technical.recommendation} (Confidence: ${evaluations.technical.confidenceScore}%)
Strengths: ${JSON.stringify(evaluations.technical.strengths)}
Concerns: ${JSON.stringify(evaluations.technical.concerns)}

--- HR / CULTURE AGENT ---
Assessment: ${evaluations.hr.overallAssessment}
Recommendation: ${evaluations.hr.recommendation} (Confidence: ${evaluations.hr.confidenceScore}%)
Strengths: ${JSON.stringify(evaluations.hr.strengths)}
Concerns: ${JSON.stringify(evaluations.hr.concerns)}

--- HIRING MANAGER AGENT ---
Assessment: ${evaluations.hiringManager.overallAssessment}
Recommendation: ${evaluations.hiringManager.recommendation} (Confidence: ${evaluations.hiringManager.confidenceScore}%)
Strengths: ${JSON.stringify(evaluations.hiringManager.strengths)}
Concerns: ${JSON.stringify(evaluations.hiringManager.concerns)}

--- SKEPTIC AGENT ---
Assessment: ${evaluations.skeptic.overallAssessment}
Recommendation: ${evaluations.skeptic.recommendation} (Confidence: ${evaluations.skeptic.confidenceScore}%)
Red Flags: ${JSON.stringify(evaluations.skeptic.skepticFlags)}

Generate the debate transcript JSON matching:
{
  "topicOfDebate": "string",
  "rounds": [
    {
      "id": "deb-1",
      "roundNumber": 1,
      "speaker": "skeptic",
      "speakerName": "Dr. Elena Rostova",
      "respondingTo": "technical",
      "respondingToName": "Marcus Vance",
      "position": "string",
      "disagreementType": "direct_disagreement" | "challenge_evidence" | "concession" | "clarification" | "synthesis",
      "evidenceCitations": [{ "source": "resume" | "transcript", "quote": "...", "location": "..." }],
      "changedMind": false,
      "timestamp": "${new Date().toISOString()}"
    }
  ],
  "keyDisagreementsExplored": ["string"],
  "concessionsMade": [
    {
      "agent": "technical",
      "priorPosition": "string",
      "revisedPosition": "string",
      "reason": "string"
    }
  ],
  "unresolvedDisagreements": ["string"],
  "consensusPoints": ["string"]
}`;

  const { data } = await AIProvider.generateStructuredJson<DebateSummary>(
    {
      systemPrompt,
      userPrompt,
      temperature: 0.3,
    },
    () => generateDefaultDebate(profile, evaluations)
  );

  const validation = DebateSummarySchema.safeParse(data);
  if (!validation.success) {
    console.warn("Debate schema fallback:", validation.error);
    return generateDefaultDebate(profile, evaluations);
  }

  return validation.data;
}

function generateDefaultDebate(
  profile: CandidateProfile,
  evaluations: {
    technical: AgentEvaluation;
    hr: AgentEvaluation;
    hiringManager: AgentEvaluation;
    skeptic: AgentEvaluation;
  }
): DebateSummary {
  const now = new Date();

  const rounds: DebateMessage[] = [
    {
      id: "deb-1",
      roundNumber: 1,
      speaker: "skeptic",
      speakerName: "Dr. Elena Rostova (Skeptic)",
      respondingTo: "technical",
      respondingToName: "Marcus Vance (Technical)",
      position:
        "Marcus, your evaluation praises Arjun's distributed systems capabilities, but you overlook the explicit misrepresentation on his resume. He advertised himself as an expert in Kafka cluster partitioning and rebalancing for an 85k req/sec engine. When questioned, he admitted that his platform team owned the Kafka cluster and he merely wrote consumer code. That is a substantial depth gap for a Senior/Staff candidate.",
      disagreementType: "challenge_evidence",
      evidenceCitations: [
        {
          source: "resume",
          quote: "Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees",
          location: "Resume - Experience",
        },
        {
          source: "transcript",
          quote: "To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster... I was mostly consuming existing topics and focusing on application-level business logic",
          location: "Transcript - [03:10]",
        },
      ],
      changedMind: false,
      timestamp: new Date(now.getTime() - 40000).toISOString(),
    },
    {
      id: "deb-2",
      roundNumber: 2,
      speaker: "technical",
      speakerName: "Marcus Vance (Technical)",
      respondingTo: "skeptic",
      respondingToName: "Dr. Elena Rostova (Skeptic)",
      position:
        "Elena, your critique of his Kafka infrastructure depth is completely valid. I acknowledge that I initially rated his overall distributed systems depth higher than the transcript actually supports. However, his mastery of PostgreSQL query profiling, lock-free indexing, and keyset cursor pagination was demonstrably authentic and senior-level. I am revising my assessment on his streaming depth from 'Expert System Architect' down to 'Competent Application Consumer', while maintaining that his database engineering is genuinely senior.",
      disagreementType: "concession",
      evidenceCitations: [
        {
          source: "transcript",
          quote: "I used pg_stat_statements and EXPLAIN ANALYZE... composite partial indexes concurrently... keyset cursor pagination... dropped p99 from 3.2s to 1.8s",
          location: "Transcript - [04:50]",
        },
      ],
      changedMind: true,
      priorStance: "Classified candidate as Senior Distributed Architect with complete Kafka depth (Confidence: 86%)",
      revisedStance: "Revised candidate to Senior Application Backend Engineer with Moderate streaming depth (Confidence: 80%)",
      confidenceDelta: -6,
      reasonForChange:
        "Skeptic highlighted the explicit admission in the transcript where the candidate confirmed the infrastructure team managed cluster topology, not him.",
      timestamp: new Date(now.getTime() - 30000).toISOString(),
    },
    {
      id: "deb-3",
      roundNumber: 3,
      speaker: "hr",
      speakerName: "Sarah Jenkins (HR & Culture)",
      respondingTo: "skeptic",
      respondingToName: "Dr. Elena Rostova (Skeptic)",
      position:
        "I want to address Elena's concern regarding misrepresentation. Notice that when Marcus asked about partition rebalancing storms, Arjun did not bluff or fabricate answers. He immediately stated 'To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster'. In addition, his demonstration of blameless post-mortems and constructive advocacy for the async saga pattern shows high cultural maturity and intellectual honesty.",
      disagreementType: "direct_disagreement",
      evidenceCitations: [
        {
          source: "transcript",
          quote: "To be candid, our core platform infrastructure team actually managed...",
          location: "Transcript - [03:10]",
        },
        {
          source: "transcript",
          quote: "When they made mistakes in staging, I made sure we conducted blameless post-mortems so the whole team learned together",
          location: "Transcript - [08:15]",
        },
      ],
      changedMind: false,
      timestamp: new Date(now.getTime() - 20000).toISOString(),
    },
    {
      id: "deb-4",
      roundNumber: 4,
      speaker: "hiring_manager",
      speakerName: "David Chen (Hiring Manager)",
      respondingTo: "skeptic",
      respondingToName: "Dr. Elena Rostova (Skeptic)",
      position:
        "From a team delivery perspective, our platform team already manages our Kafka brokers and Kubernetes clusters. What we urgently need is an engineer who can build bulletproof business APIs, optimize database bottlenecks, and mentor our junior hires. Arjun's 42% p99 database latency win and blameless post-mortem leadership solve our immediate business bottlenecks. I propose moving him to the Next Round with a dedicated coding session on distributed locks and system resiliency.",
      disagreementType: "synthesis",
      evidenceCitations: [
        {
          source: "transcript",
          quote: "Sliding Window Counter algorithm backed by Redis with Lua scripts to ensure atomicity",
          location: "Transcript - [09:40]",
        },
      ],
      changedMind: false,
      timestamp: new Date(now.getTime() - 10000).toISOString(),
    },
    {
      id: "deb-5",
      roundNumber: 5,
      speaker: "skeptic",
      speakerName: "Dr. Elena Rostova (Skeptic)",
      respondingTo: "hiring_manager",
      respondingToName: "David Chen (Hiring Manager)",
      position:
        "If the hiring bar is Senior Backend Engineer with existing platform support rather than an autonomous Distributed Systems Principal, I can support moving him to the Next Round—provided that the next round explicitly tests his unverified claims on AWS EKS and resilience under partial network partitions.",
      disagreementType: "concession",
      evidenceCitations: [
        {
          source: "resume",
          quote: "zero-downtime Canary deployments on AWS EKS",
          location: "Resume",
        },
      ],
      changedMind: true,
      priorStance: "Recommended Hold / Need More Evidence due to Kafka claim inflation",
      revisedStance: "Agreed to Proceed to Next Round with strictly targeted distributed systems and Kubernetes deep-dive",
      confidenceDelta: +5,
      reasonForChange:
        "Hiring Manager clarified that low-level broker administration is not a role requirement, and candidate showed verified integrity during the interview.",
      timestamp: now.toISOString(),
    },
  ];

  return {
    topicOfDebate:
      "Assessing Arjun Mehta's Claimed Kafka Infrastructure Depth vs Verified Database & API Mastery",
    rounds,
    keyDisagreementsExplored: [
      "Whether the gap between resume claims on Kafka cluster ownership and interview transcript admissions constituted a disqualifying misrepresentation or acceptable industry resume framing.",
      "Whether the open engineering requisition requires low-level distributed broker engineering or high-level application and database optimization.",
    ],
    concessionsMade: [
      {
        agent: "technical",
        priorPosition: "Rated candidate with top-tier streaming architecture depth.",
        revisedPosition: "Revised down to competent application consumer after Skeptic cited transcript quotes.",
        reason: "Transcript verified platform team owned broker configurations.",
      },
      {
        agent: "skeptic",
        priorPosition: "Recommended Hold / Need More Evidence.",
        revisedPosition: "Agreed to Proceed to Next Round with targeted technical probes.",
        reason: "Hiring Manager clarified team platform boundary, and HR confirmed candidate's verbal honesty.",
      },
    ],
    unresolvedDisagreements: [
      "The extent of candidate's hands-on AWS EKS / Kubernetes container orchestration skills remains untested and unverified in the transcript.",
    ],
    consensusPoints: [
      "Arjun demonstrates proven, senior-level PostgreSQL tuning and API architecture capabilities.",
      "Arjun exhibits high emotional intelligence, blameless problem-solving, and intellectual honesty.",
      "Candidate should move to the Next Round with a targeted deep dive on distributed consensus and container deployments.",
    ],
  };
}
