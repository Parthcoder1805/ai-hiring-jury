import { describe, it, expect } from "vitest";
import { runTechnicalAgent } from "@/lib/ai/agents/technical-agent";
import { runHRAgent } from "@/lib/ai/agents/hr-agent";
import { runHiringManagerAgent } from "@/lib/ai/agents/hiring-manager-agent";
import { runSkepticAgent } from "@/lib/ai/agents/skeptic-agent";
import { buildCandidateProfile } from "@/lib/ai/candidate-profile";
import { DEMO_CANDIDATE } from "@/lib/data/demo-candidate";

describe("Strict Multi-Agent Isolation Architecture Suite", () => {
  it("should generate a structured Candidate Profile from raw input texts", async () => {
    const profile = await buildCandidateProfile(
      DEMO_CANDIDATE.resumeText,
      DEMO_CANDIDATE.transcriptText
    );

    expect(profile).toBeDefined();
    expect(profile.name).toBe("Arjun Mehta");
    expect(profile.skills.length).toBeGreaterThan(0);
    expect(profile.inconsistencies.length).toBeGreaterThan(0);
  });

  it("should run 4 isolated agent personas concurrently with ZERO cross-agent leakage", async () => {
    const profile = await buildCandidateProfile(
      DEMO_CANDIDATE.resumeText,
      DEMO_CANDIDATE.transcriptText
    );

    // Stage 2: Execute all 4 personas in parallel via Promise.all
    const [technical, hr, hiringManager, skeptic] = await Promise.all([
      runTechnicalAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runHRAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runHiringManagerAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
      runSkepticAgent(profile, DEMO_CANDIDATE.resumeText, DEMO_CANDIDATE.transcriptText),
    ]);

    // 1. Verify all 4 personas executed and produced valid evaluations
    expect(technical.agentRole).toBe("technical");
    expect(hr.agentRole).toBe("hr");
    expect(hiringManager.agentRole).toBe("hiring_manager");
    expect(skeptic.agentRole).toBe("skeptic");

    // 2. Verify all 4 personas have unique callIds
    const callIds = new Set([
      technical.isolatedExecutionProof.callId,
      hr.isolatedExecutionProof.callId,
      hiringManager.isolatedExecutionProof.callId,
      skeptic.isolatedExecutionProof.callId,
    ]);
    expect(callIds.size).toBe(4);

    // 3. Verify crossAgentContextReceived is strictly FALSE for all 4
    expect(technical.isolatedExecutionProof.crossAgentContextReceived).toBe(false);
    expect(hr.isolatedExecutionProof.crossAgentContextReceived).toBe(false);
    expect(hiringManager.isolatedExecutionProof.crossAgentContextReceived).toBe(false);
    expect(skeptic.isolatedExecutionProof.crossAgentContextReceived).toBe(false);

    // 4. Verify confidence scores are within valid 0-100 bounds
    expect(technical.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(technical.confidenceScore).toBeLessThanOrEqual(100);
    expect(hr.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(hr.confidenceScore).toBeLessThanOrEqual(100);
    expect(hiringManager.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(hiringManager.confidenceScore).toBeLessThanOrEqual(100);
    expect(skeptic.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(skeptic.confidenceScore).toBeLessThanOrEqual(100);
  });
});
