import { FullAnalysisResult, PipelineExecutionLog } from "@/types/jury";
import { buildCandidateProfile } from "./candidate-profile";
import { runTechnicalAgent } from "./agents/technical-agent";
import { runHRAgent } from "./agents/hr-agent";
import { runHiringManagerAgent } from "./agents/hiring-manager-agent";
import { runSkepticAgent } from "./agents/skeptic-agent";
import { runDebateEngine } from "./debate-engine";
import { runFinalJudge } from "./final-judge";
import { AIProvider } from "./provider";

export interface OrchestrationCallbacks {
  onProgress?: (log: PipelineExecutionLog) => void;
}

export async function runFullJuryPipeline(
  resumeText: string,
  transcriptText: string,
  callbacks?: OrchestrationCallbacks
): Promise<FullAnalysisResult> {
  const overallStart = Date.now();
  const providerInfo = AIProvider.getActiveProviderInfo();

  const executionLog: PipelineExecutionLog = {
    stage: "profile",
    currentStepDescription: "Extracting structured candidate profile, claims, and cross-source evidence...",
    progressPercentage: 15,
    stageTimings: {},
    providerUsed: `${providerInfo.provider} (${providerInfo.model})`,
    isDemoSimulation: !providerInfo.isConfigured,
  };

  callbacks?.onProgress?.({ ...executionLog });

  // STAGE 1: Candidate Profile Builder
  const profileStart = Date.now();
  const candidateProfile = await buildCandidateProfile(resumeText, transcriptText);
  executionLog.stageTimings.profileMs = Date.now() - profileStart;

  // STAGE 2: 4 Independent Personas (STRICT ISOLATION GUARANTEE)
  // Each agent executes in parallel via Promise.all and ONLY receives the candidateProfile and raw text.
  executionLog.stage = "independent_agents";
  executionLog.currentStepDescription =
    "Executing 4 isolated AI personas concurrently (Technical, HR, Hiring Manager, Skeptic)...";
  executionLog.progressPercentage = 45;
  callbacks?.onProgress?.({ ...executionLog });

  const agentsStart = Date.now();
  const [technical, hr, hiringManager, skeptic] = await Promise.all([
    runTechnicalAgent(candidateProfile, resumeText, transcriptText),
    runHRAgent(candidateProfile, resumeText, transcriptText),
    runHiringManagerAgent(candidateProfile, resumeText, transcriptText),
    runSkepticAgent(candidateProfile, resumeText, transcriptText),
  ]);
  executionLog.stageTimings.independentAgentsMs = Date.now() - agentsStart;

  // STAGE 3: Multi-Agent Debate Engine
  // Debate occurs ONLY AFTER all 4 independent analyses have resolved.
  executionLog.stage = "debate";
  executionLog.currentStepDescription =
    "Orchestrating multi-round interactive debate between personas with evidence challenges and stance revisions...";
  executionLog.progressPercentage = 75;
  callbacks?.onProgress?.({ ...executionLog });

  const debateStart = Date.now();
  const debate = await runDebateEngine(candidateProfile, {
    technical,
    hr,
    hiringManager,
    skeptic,
  });
  executionLog.stageTimings.debateMs = Date.now() - debateStart;

  // STAGE 4: Final Decision Judge
  // Final Judge receives profile, 4 independent evaluations, and debate transcript.
  executionLog.stage = "final_judge";
  executionLog.currentStepDescription =
    "Final Decision Judge synthesizing evidence-weighted verdict (Score Averaging Strictly Prohibited)...";
  executionLog.progressPercentage = 92;
  callbacks?.onProgress?.({ ...executionLog });

  const judgeStart = Date.now();
  const finalDecision = await runFinalJudge(
    candidateProfile,
    { technical, hr, hiringManager, skeptic },
    debate
  );
  executionLog.stageTimings.finalJudgeMs = Date.now() - judgeStart;

  // STAGE 5: Completion
  executionLog.stage = "complete";
  executionLog.currentStepDescription = "AI Hiring Jury Pipeline Complete.";
  executionLog.progressPercentage = 100;
  executionLog.stageTimings.totalMs = Date.now() - overallStart;
  callbacks?.onProgress?.({ ...executionLog });

  return {
    candidateProfile,
    independentEvaluations: {
      technical,
      hr,
      hiringManager,
      skeptic,
    },
    debate,
    finalDecision,
    executionLog,
    rawInputs: {
      resumeSnippet: resumeText.slice(0, 1000),
      transcriptSnippet: transcriptText.slice(0, 1000),
    },
  };
}
