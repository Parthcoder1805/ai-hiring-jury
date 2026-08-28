import { describe, it, expect } from "vitest";
import { runDebateEngine } from "@/lib/ai/debate-engine";
import { runFinalJudge } from "@/lib/ai/final-judge";
import { buildCandidateProfile } from "@/lib/ai/candidate-profile";
import { runTechnicalAgent } from "@/lib/ai/agents/technical-agent";
import { runHRAgent } from "@/lib/ai/agents/hr-agent";
import { runHiringManagerAgent } from "@/lib/ai/agents/hiring-manager-agent";
import { runSkepticAgent } from "@/lib/ai/agents/skeptic-agent";
import { DEMO_CANDIDATE } from "@/lib/data/demo-candidate";

describe("Debate Engine & Final Judicial Decision Suite", () => {
  it("should conduct interactive debate and track concessions/rebuttals", async () => {
    const profile = await buildCandidateProfile(
      DEMO_CANDIDATE.resumeText,
      DEMO_CANDIDATE.transcriptText
    );

    const [technical, hr, hiringManager, skeptic] = await Promise.all([
      runTechnicalAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runHRAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runHiringManagerAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runSkepticAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
    ]);

    const evaluations = { technical, hr, hiringManager, skeptic };
    const debate = await runDebateEngine(profile, evaluations);

    expect(debate).toBeDefined();
    expect(debate.rounds.length).toBeGreaterThanOrEqual(1);
    expect(debate.topicOfDebate).toBeDefined();
    expect(debate.consensusPoints.length).toBeGreaterThan(0);

    // Verify debate turns have valid speaker mappings
    debate.rounds.forEach((round) => {
      expect(["technical", "hr", "hiring_manager", "skeptic"]).toContain(round.speaker);
      expect(round.position).toBeDefined();
    });
  });

  it("should synthesize final decision enforcing the Anti-Averaging rule", async () => {
    const profile = await buildCandidateProfile(
      DEMO_CANDIDATE.resumeText,
      DEMO_CANDIDATE.transcriptText
    );

    const [technical, hr, hiringManager, skeptic] = await Promise.all([
      runTechnicalAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runHRAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runHiringManagerAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runSkepticAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
    ]);

    const evaluations = { technical, hr, hiringManager, skeptic };
    const debate = await runDebateEngine(profile, evaluations);
    const finalDecision = await runFinalJudge(profile, evaluations, debate);

    expect(finalDecision).toBeDefined();
    expect(finalDecision.recommendation).toBeDefined();
    expect(finalDecision.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(finalDecision.confidenceScore).toBeLessThanOrEqual(100);

    // CRITICAL: Verify Anti-Averaging prohibition flag
    expect(finalDecision.decisionAuditTrail.calculatedAverageWasProhibited).toBe(true);

    // Verify targeted next-round probes are generated
    expect(finalDecision.targetedNextRoundProbes.length).toBeGreaterThan(0);
    finalDecision.targetedNextRoundProbes.forEach((probe) => {
      expect(probe.area).toBeDefined();
      expect(probe.suggestedQuestion).toBeDefined();
    });
  });
});
