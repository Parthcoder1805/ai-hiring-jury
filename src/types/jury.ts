export type EvidenceSource = "resume" | "transcript" | "debate" | "synthesis";

export interface EvidenceQuote {
  source: EvidenceSource;
  quote: string;
  location?: string; // e.g. "Resume - Page 1", "Transcript - [04:15]"
  context?: string;
}

export interface CandidateClaim {
  id: string;
  claim: string;
  source: EvidenceSource;
  evidence: string;
  category: "technical" | "experience" | "leadership" | "soft_skill" | "education";
  verifiedStatus: "supported" | "exaggerated" | "unverified" | "contradicted";
  notes?: string;
}

export interface InconsistencyFlag {
  id: string;
  title: string;
  topic: string;
  resumeClaim: string;
  transcriptClaim: string;
  resumeQuote?: string;
  transcriptQuote?: string;
  severity: "low" | "medium" | "high";
  type: "depth_mismatch" | "experience_gap" | "contradiction" | "vague_claim";
  explanation: string;
}

export interface SkillItem {
  name: string;
  category: "backend" | "frontend" | "database" | "devops" | "architecture" | "soft_skill" | "other";
  claimedProficiency: "expert" | "advanced" | "intermediate" | "familiar";
  demonstratedDepth: "strong" | "moderate" | "superficial" | "untested";
  evidenceQuotes: EvidenceQuote[];
}

export interface WorkExperienceItem {
  company: string;
  role: string;
  duration: string;
  keyContributions: string[];
  evidenceQuotes: EvidenceQuote[];
}

export interface CandidateProfile {
  name: string;
  targetRole: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    year?: string;
    evidenceQuote?: EvidenceQuote;
  }[];
  skills: SkillItem[];
  experience: WorkExperienceItem[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    evidenceQuote?: EvidenceQuote;
  }[];
  claims: CandidateClaim[];
  inconsistencies: InconsistencyFlag[];
  missingInformation: string[];
  extractedAt: string;
}

export type AgentRole = "technical" | "hr" | "hiring_manager" | "skeptic";

export type PreliminaryRecommendation =
  | "Strong Hire"
  | "Hire"
  | "Proceed to Next Round"
  | "Hold / Need More Evidence"
  | "Reject";

export interface SkillObservation {
  skill: string;
  assessment: string;
  evidence: EvidenceQuote;
  reasoning: string;
}

export interface AgentEvaluation {
  agentRole: AgentRole;
  agentName: string;
  avatar: string;
  title: string;
  overallAssessment: string;
  confidenceScore: number; // 0 - 100
  recommendation: PreliminaryRecommendation;
  strengths: {
    point: string;
    evidence: EvidenceQuote;
    reasoning: string;
  }[];
  concerns: {
    point: string;
    severity: "low" | "medium" | "high";
    evidence: EvidenceQuote;
    reasoning: string;
  }[];
  skillObservations?: SkillObservation[];
  behavioralObservations?: {
    trait: string;
    assessment: string;
    evidence: EvidenceQuote;
  }[];
  skepticFlags?: {
    issue: string;
    status: "Confirmed Issue" | "Potential Concern" | "No Evidence of Concern";
    severity: "low" | "medium" | "high";
    resumeEvidence: string;
    transcriptEvidence: string;
    reasoning: string;
  }[];
  timestamp: string;
  isolatedExecutionProof: {
    callId: string;
    startedAt: string;
    finishedAt: string;
    inputTokenEstimate: number;
    outputTokenEstimate: number;
    crossAgentContextReceived: false; // strictly false
  };
}

export interface DebateMessage {
  id: string;
  roundNumber: number;
  speaker: AgentRole;
  speakerName: string;
  respondingTo: AgentRole | "general";
  respondingToName: string;
  position: string;
  disagreementType: "direct_disagreement" | "challenge_evidence" | "concession" | "clarification" | "synthesis";
  evidenceCitations: EvidenceQuote[];
  changedMind: boolean;
  priorStance?: string;
  revisedStance?: string;
  confidenceDelta?: number; // e.g. -10 or +5
  reasonForChange?: string;
  timestamp: string;
}

export interface DebateSummary {
  topicOfDebate: string;
  rounds: DebateMessage[];
  keyDisagreementsExplored: string[];
  concessionsMade: {
    agent: AgentRole;
    priorPosition: string;
    revisedPosition: string;
    reason: string;
  }[];
  unresolvedDisagreements: string[];
  consensusPoints: string[];
}

export interface FinalDecision {
  recommendation: PreliminaryRecommendation;
  confidenceScore: number; // 0 - 100 (Evidence-weighted, not mathematical average)
  executiveReasoning: string;
  synthesisBreakdown: {
    technicalWeighting: string;
    behavioralWeighting: string;
    businessImpactWeighting: string;
    skepticRiskWeighting: string;
  };
  keyStrengths: {
    title: string;
    description: string;
    supportingAgents: AgentRole[];
    primaryEvidence: EvidenceQuote;
  }[];
  keyRisks: {
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
    impactIfHired: string;
    primaryEvidence: EvidenceQuote;
  }[];
  unresolvedDisagreements: {
    dispute: string;
    agentPerspectives: { agent: AgentRole; view: string }[];
    recommendedVerification: string;
  }[];
  targetedNextRoundProbes: {
    area: string;
    suggestedQuestion: string;
    whatToLookFor: string;
    reasonForProbe: string;
  }[];
  decisionAuditTrail: {
    calculatedAverageWasProhibited: true;
    rationaleForVerdictChoice: string;
    alternativesConsideredAndRejected: {
      option: PreliminaryRecommendation;
      rejectionReason: string;
    }[];
  };
  timestamp: string;
}

export interface PipelineExecutionLog {
  stage: "idle" | "parsing" | "profile" | "independent_agents" | "debate" | "final_judge" | "complete" | "error";
  currentStepDescription: string;
  progressPercentage: number;
  stageTimings: {
    parsingMs?: number;
    profileMs?: number;
    independentAgentsMs?: number;
    debateMs?: number;
    finalJudgeMs?: number;
    totalMs?: number;
  };
  providerUsed: string;
  isDemoSimulation: boolean;
}

export interface FullAnalysisResult {
  candidateProfile: CandidateProfile;
  independentEvaluations: {
    technical: AgentEvaluation;
    hr: AgentEvaluation;
    hiringManager: AgentEvaluation;
    skeptic: AgentEvaluation;
  };
  debate: DebateSummary;
  finalDecision: FinalDecision;
  executionLog: PipelineExecutionLog;
  rawInputs: {
    resumeSnippet: string;
    transcriptSnippet: string;
  };
}
