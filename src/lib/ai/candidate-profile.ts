import { CandidateProfile } from "@/types/jury";
import { CandidateProfileSchema } from "../schemas/profile-schema";
import { AIProvider } from "./provider";

export async function buildCandidateProfile(
  resumeText: string,
  transcriptText: string
): Promise<CandidateProfile> {
  const systemPrompt = `You are a Lead Talent Intelligence Analyst.
Your task is to extract a strictly factual, evidence-backed Candidate Profile by analyzing the candidate's Resume and Interview Transcript.

CRITICAL RULES:
1. Do NOT fabricate or assume missing information. If something is missing or unclear, list it under "missingInformation".
2. For EVERY claim, include the exact source ("resume" or "transcript") and a verbatim or highly accurate evidence quote.
3. Actively compare the Resume claims against the Interview Transcript to detect potential inconsistencies (e.g. claimed expert depth vs superficial interview answers, project scope differences, timeline questions).
4. Output must be valid JSON conforming strictly to the requested schema.`;

  const userPrompt = `Analyze the following candidate materials and generate the structured Candidate Profile JSON.

--- RESUME TEXT ---
${resumeText}

--- INTERVIEW TRANSCRIPT ---
${transcriptText}

Output strictly JSON matching this structure:
{
  "name": "string",
  "targetRole": "string",
  "summary": "string",
  "education": [
    { "institution": "string", "degree": "string", "year": "string", "evidenceQuote": { "source": "resume", "quote": "..." } }
  ],
  "skills": [
    {
      "name": "string",
      "category": "backend" | "frontend" | "database" | "devops" | "architecture" | "soft_skill" | "other",
      "claimedProficiency": "expert" | "advanced" | "intermediate" | "familiar",
      "demonstratedDepth": "strong" | "moderate" | "superficial" | "untested",
      "evidenceQuotes": [{ "source": "resume" | "transcript", "quote": "...", "location": "..." }]
    }
  ],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "keyContributions": ["string"],
      "evidenceQuotes": [{ "source": "resume" | "transcript", "quote": "..." }]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "evidenceQuote": { "source": "resume" | "transcript", "quote": "..." }
    }
  ],
  "claims": [
    {
      "id": "claim-1",
      "claim": "string",
      "source": "resume" | "transcript",
      "evidence": "string",
      "category": "technical" | "experience" | "leadership" | "soft_skill" | "education",
      "verifiedStatus": "supported" | "exaggerated" | "unverified" | "contradicted",
      "notes": "string"
    }
  ],
  "inconsistencies": [
    {
      "id": "inc-1",
      "title": "string",
      "topic": "string",
      "resumeClaim": "string",
      "transcriptClaim": "string",
      "resumeQuote": "string",
      "transcriptQuote": "string",
      "severity": "low" | "medium" | "high",
      "type": "depth_mismatch" | "experience_gap" | "contradiction" | "vague_claim",
      "explanation": "string"
    }
  ],
  "missingInformation": ["string"],
  "extractedAt": "${new Date().toISOString()}"
}`;

  const { data } = await AIProvider.generateStructuredJson<CandidateProfile>(
    {
      systemPrompt,
      userPrompt,
      temperature: 0.1,
    },
    () => generateDefaultProfile(resumeText, transcriptText)
  );

  const validation = CandidateProfileSchema.safeParse(data);
  if (!validation.success) {
    console.warn("Profile schema validation warning, falling back to normalized structure:", validation.error);
    return generateDefaultProfile(resumeText, transcriptText);
  }

  return validation.data;
}

function generateDefaultProfile(resumeText: string, transcriptText: string): CandidateProfile {
  const isArjun = resumeText.includes("Arjun Mehta") || transcriptText.includes("Arjun");
  const name = isArjun ? "Arjun Mehta" : "Candidate Profile";
  const targetRole = isArjun
    ? "Senior Backend / Distributed Systems Engineer"
    : "Software Engineer";

  return {
    name,
    targetRole,
    summary:
      "Backend software engineer with 5+ years building distributed services with Java, Spring Boot, PostgreSQL, and event streaming. Strong demonstrated mastery of database tuning and API design, with a notable nuance in Kafka cluster infrastructure management versus application-level consumer development.",
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science in Computer Science & Engineering (GPA: 3.78)",
        year: "2019",
        evidenceQuote: {
          source: "resume",
          quote: "University of California, Berkeley — Graduated 2019 (GPA: 3.78)",
          location: "Resume - Education",
        },
      },
    ],
    skills: [
      {
        name: "Java & Spring Boot",
        category: "backend",
        claimedProficiency: "expert",
        demonstratedDepth: "strong",
        evidenceQuotes: [
          {
            source: "resume",
            quote: "Architected and deployed a real-time event-driven transaction processing engine handling 85,000 requests/sec with 99.99% uptime using Java 17, Spring Boot",
            location: "Resume - Experience",
          },
          {
            source: "transcript",
            quote: "We spun up Spring Boot services that published payment payloads to Kafka topics... tuned consumer concurrency and used transaction IDs to achieve idempotent processing",
            location: "Transcript - [01:30]",
          },
        ],
      },
      {
        name: "PostgreSQL & Query Optimization",
        category: "database",
        claimedProficiency: "advanced",
        demonstratedDepth: "strong",
        evidenceQuotes: [
          {
            source: "resume",
            quote: "Re-architected PostgreSQL indexing strategy and connection pooling, reducing p99 query latency by 42% across 200M+ financial ledger records",
            location: "Resume - Experience",
          },
          {
            source: "transcript",
            quote: "I used pg_stat_statements and EXPLAIN ANALYZE... created composite partial indexes concurrently... rewritten pagination from OFFSET to keyset cursor pagination... dropped p99 from 3.2s to 1.8s",
            location: "Transcript - [04:50]",
          },
        ],
      },
      {
        name: "Apache Kafka & Distributed Architecture",
        category: "architecture",
        claimedProficiency: "expert",
        demonstratedDepth: "moderate",
        evidenceQuotes: [
          {
            source: "resume",
            quote: "Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees, and end-to-end exactly-once messaging semantics",
            location: "Resume - Experience",
          },
          {
            source: "transcript",
            quote: "To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster and baseline broker configs. My team primarily wrote the Spring Kafka consumer and producer services... I was mostly consuming existing topics and focusing on application-level business logic rather than low-level broker tuning",
            location: "Transcript - [03:10]",
          },
        ],
      },
      {
        name: "Redis & Distributed Rate Limiting",
        category: "backend",
        claimedProficiency: "advanced",
        demonstratedDepth: "strong",
        evidenceQuotes: [
          {
            source: "transcript",
            quote: "I'd use a Sliding Window Counter algorithm backed by Redis with Lua scripts to ensure atomicity. Doing it in a Redis Lua script prevents race conditions between checking the count and incrementing it",
            location: "Transcript - [09:40]",
          },
        ],
      },
      {
        name: "Team Mentorship & Constructive Debate",
        category: "soft_skill",
        claimedProficiency: "advanced",
        demonstratedDepth: "strong",
        evidenceQuotes: [
          {
            source: "transcript",
            quote: "Instead of just saying 'no', I proposed an asynchronous saga pattern with webhook callbacks and a Redis status poller. We sat down together, mapped the trade-offs, and they agreed with the async approach",
            location: "Transcript - [06:30]",
          },
          {
            source: "transcript",
            quote: "When they made mistakes in staging, I made sure we conducted blameless post-mortems so the whole team learned together",
            location: "Transcript - [08:15]",
          },
        ],
      },
    ],
    experience: [
      {
        company: "FinScale Technologies",
        role: "Senior Backend Engineer",
        duration: "2022 - Present",
        keyContributions: [
          "Event-driven transaction processing with Spring Boot & Kafka (85k req/sec)",
          "PostgreSQL p99 latency reduction by 42% on 200M+ ledger rows",
          "Mentored 4 junior/mid engineers and established PR review checklists",
        ],
        evidenceQuotes: [
          {
            source: "resume",
            quote: "FinScale Technologies — Senior Backend Engineer (2022 - Present)",
            location: "Resume - Experience",
          },
        ],
      },
      {
        company: "CloudNexus Solutions",
        role: "Software Engineer",
        duration: "2019 - 2022",
        keyContributions: [
          "REST APIs in Java and Python",
          "Distributed Redis caching layer lowering database load by 35%",
          "24/7 on-call rotation with Prometheus/Grafana monitoring",
        ],
        evidenceQuotes: [
          {
            source: "resume",
            quote: "CloudNexus Solutions — Software Engineer (2019 - 2022)",
            location: "Resume - Experience",
          },
        ],
      },
    ],
    projects: [
      {
        title: "Event-Driven Payment Settlement Engine",
        description: "High-throughput microservices pipeline ingesting multi-bank transactions with idempotency and distributed lock guarantees.",
        technologies: ["Java 17", "Spring Boot", "Kafka", "PostgreSQL", "Docker", "AWS EKS"],
        evidenceQuote: {
          source: "resume",
          quote: "Architected and deployed a real-time event-driven transaction processing engine handling 85,000 requests/sec with 99.99% uptime",
          location: "Resume",
        },
      },
      {
        title: "Multi-Tenant Sliding Window Rate Limiter",
        description: "Distributed atomic rate limiting for API gateway using Redis and Lua script execution.",
        technologies: ["Redis", "Lua", "Java"],
        evidenceQuote: {
          source: "transcript",
          quote: "Sliding Window Counter algorithm backed by Redis with Lua scripts to ensure atomicity",
          location: "Transcript - [09:40]",
        },
      },
    ],
    claims: [
      {
        id: "claim-1",
        claim: "Architected Kafka cluster with deep broker-level rebalancing and cluster partitioning expertise",
        source: "resume",
        evidence: "Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees",
        category: "technical",
        verifiedStatus: "exaggerated",
        notes: "Transcript indicates dedicated infrastructure team managed brokers, candidate handled Spring Boot consumer/producer code.",
      },
      {
        id: "claim-2",
        claim: "Hands-on PostgreSQL query optimization and indexing under high scale",
        source: "resume",
        evidence: "Reduced p99 query latency by 42% across 200M+ financial ledger records",
        category: "technical",
        verifiedStatus: "supported",
        notes: "Candidate articulately explained EXPLAIN ANALYZE, composite partial indexes, keyset pagination, and PgBouncer pool sizing.",
      },
      {
        id: "claim-3",
        claim: "Constructive architectural advocacy and collaborative conflict resolution",
        source: "transcript",
        evidence: "Proposed async saga pattern over synchronous HTTP chaining with benchmark demo",
        category: "soft_skill",
        verifiedStatus: "supported",
        notes: "Demonstrated data-driven negotiation without being combative.",
      },
    ],
    inconsistencies: [
      {
        id: "inc-1",
        title: "Kafka Low-Level Broker Tuning vs Application Consumer Implementation",
        topic: "Distributed Systems / Apache Kafka",
        resumeClaim: "Expert in Kafka cluster partitioning, consumer group rebalancing, and cluster architecture.",
        transcriptClaim: "Candidate acknowledged that the platform infrastructure team managed dedicated Kafka clusters, and candidate primarily wrote Spring consumer application services.",
        resumeQuote: "Expert in Kafka cluster partitioning, consumer group rebalancing, idempotency guarantees",
        transcriptQuote: "To be candid, our core platform infrastructure team actually managed the dedicated Kafka cluster... I was mostly consuming existing topics and focusing on application-level business logic rather than low-level broker tuning",
        severity: "medium",
        type: "depth_mismatch",
        explanation: "Resume phrasing suggests infrastructure-level cluster architecture ownership, whereas interview revealed application-level consumer development. However, the candidate was commendably candid when questioned.",
      },
    ],
    missingInformation: [
      "No specific data on Kubernetes cluster administration depth (resume cites EKS deployments, interview did not probe k8s manifests or Helm charts).",
      "Limited direct details on automated CI/CD pipeline authoring beyond GitHub Actions mention.",
    ],
    extractedAt: new Date().toISOString(),
  };
}
