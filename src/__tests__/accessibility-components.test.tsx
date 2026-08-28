import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";
import { FileUploadSection } from "@/components/FileUploadSection";
import { PipelineProgress } from "@/components/PipelineProgress";
import { SourceBadge } from "@/components/SourceBadge";
import { CandidateProfileView } from "@/components/CandidateProfileView";
import { ObservabilityInspector } from "@/components/ObservabilityInspector";
import { FinalDecisionCard } from "@/components/FinalDecisionCard";
import { PipelineExecutionLog, FullAnalysisResult } from "@/types/jury";

describe("Component Accessibility & Phase 1 Verification Suite", () => {
  describe("Navbar Component A11y", () => {
    it("should render role='banner' and accessible engine status", () => {
      render(
        <Navbar
          providerName="Google Gemini"
          isDemoSimulation={false}
          onReset={vi.fn()}
          onSelectDemo={vi.fn()}
          isLoading={false}
        />
      );

      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();

      const engineStatus = screen.getByRole("status");
      expect(engineStatus).toHaveAttribute("aria-label", expect.stringContaining("Google Gemini"));

      const demoBtn = screen.getByRole("button", { name: /try sample demo candidate/i });
      expect(demoBtn).toBeInTheDocument();

      const resetBtn = screen.getByRole("button", { name: /reset evaluation/i });
      expect(resetBtn).toBeInTheDocument();
    });
  });

  describe("FileUploadSection Component A11y", () => {
    it("should render keyboard-accessible dropzone buttons and tablists", () => {
      const mockSetResume = vi.fn();
      const mockSetTranscript = vi.fn();
      const mockAnalyze = vi.fn();

      render(
        <FileUploadSection
          resumeText=""
          setResumeText={mockSetResume}
          transcriptText=""
          setTranscriptText={mockSetTranscript}
          onAnalyze={mockAnalyze}
          isLoading={false}
        />
      );

      // Verify tablists for input method switching
      const tablists = screen.getAllByRole("tablist");
      expect(tablists.length).toBe(2);

      // Verify keyboard-operable dropzone buttons for both Resume and Transcript
      const resumeDropzone = screen.getByRole("button", { name: /upload resume document file/i });
      expect(resumeDropzone).toBeInTheDocument();
      expect(resumeDropzone).toHaveAttribute("tabIndex", "0");

      const transcriptDropzone = screen.getByRole("button", { name: /upload interview transcript file/i });
      expect(transcriptDropzone).toBeInTheDocument();
      expect(transcriptDropzone).toHaveAttribute("tabIndex", "0");

      // Verify Convene Jury action button
      const conveneBtn = screen.getByRole("button", { name: /convene ai hiring jury/i });
      expect(conveneBtn).toBeInTheDocument();
      expect(conveneBtn).toBeDisabled(); // Disabled when empty
    });

    it("should allow tab switching to text editor with accessible labels", () => {
      render(
        <FileUploadSection
          resumeText="Sample Resume"
          setResumeText={vi.fn()}
          transcriptText="Sample Transcript"
          setTranscriptText={vi.fn()}
          onAnalyze={vi.fn()}
          isLoading={false}
        />
      );

      // Switch to Text Editor tab
      const textEditorTabs = screen.getAllByRole("tab", { name: /text editor/i });
      fireEvent.click(textEditorTabs[0]);

      const textarea = screen.getByLabelText(/candidate resume text/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  describe("PipelineProgress Component A11y", () => {
    it("should render ARIA progressbar with aria-valuenow and live region", () => {
      const mockLog: PipelineExecutionLog = {
        stage: "independent_agents",
        currentStepDescription: "Running 4 isolated AI persona LLM calls concurrently...",
        progressPercentage: 45,
        stageTimings: { profileMs: 320 },
        providerUsed: "Google Gemini",
        isDemoSimulation: false,
      };

      render(<PipelineProgress log={mockLog} />);

      const region = screen.getByRole("region", { name: /evaluation pipeline progress/i });
      expect(region).toBeInTheDocument();

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "45");
      expect(progressbar).toHaveAttribute("aria-valuemin", "0");
      expect(progressbar).toHaveAttribute("aria-valuemax", "100");

      const stepsList = screen.getByRole("list", { name: /pipeline execution steps/i });
      expect(stepsList).toBeInTheDocument();
    });
  });

  describe("SourceBadge Component A11y", () => {
    it("should render descriptive aria-label for screen readers", () => {
      render(<SourceBadge source="resume" location="Page 2 - Section 3" />);
      const badge = screen.getByLabelText(/verified from resume at page 2 - section 3/i);
      expect(badge).toBeInTheDocument();
    });
  });

  describe("CandidateProfileView Component A11y", () => {
    it("should render claims table with accessible caption and header scopes", () => {
      const mockProfile = {
        name: "Arjun Mehta",
        targetRole: "Senior Backend Engineer",
        summary: "Profile summary",
        education: [],
        skills: [],
        experience: [],
        projects: [],
        claims: [
          {
            id: "claim-1",
            claim: "Optimized database queries",
            source: "transcript" as const,
            evidence: "Explained indexing strategies",
            category: "technical" as const,
            verifiedStatus: "supported" as const,
          },
        ],
        inconsistencies: [],
        missingInformation: [],
        extractedAt: new Date().toISOString(),
      };

      render(<CandidateProfileView profile={mockProfile} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(5);
      headers.forEach((th) => expect(th).toHaveAttribute("scope", "col"));
    });
  });

  describe("ObservabilityInspector Component A11y", () => {
    it("should render isolation proof table with column headers and row headers", () => {
      const mockResult: FullAnalysisResult = {
        candidateProfile: {
          name: "Arjun Mehta",
          targetRole: "Senior Backend Engineer",
          summary: "Summary",
          education: [],
          skills: [],
          experience: [],
          projects: [],
          claims: [],
          inconsistencies: [],
          missingInformation: [],
          extractedAt: new Date().toISOString(),
        },
        independentEvaluations: {
          technical: {
            agentRole: "technical",
            agentName: "Marcus Vance",
            avatar: "🧑‍💻",
            title: "Principal Architect",
            overallAssessment: "Assessment",
            confidenceScore: 88,
            recommendation: "Proceed to Next Round",
            strengths: [],
            concerns: [],
            isolatedExecutionProof: {
              callId: "call-1",
              startedAt: new Date().toISOString(),
              finishedAt: new Date().toISOString(),
              inputTokenEstimate: 100,
              outputTokenEstimate: 50,
              crossAgentContextReceived: false,
            },
          },
          hr: {
            agentRole: "hr",
            agentName: "Sarah Jenkins",
            avatar: "🤝",
            title: "Culture Lead",
            overallAssessment: "Assessment",
            confidenceScore: 85,
            recommendation: "Hire",
            strengths: [],
            concerns: [],
            isolatedExecutionProof: {
              callId: "call-2",
              startedAt: new Date().toISOString(),
              finishedAt: new Date().toISOString(),
              inputTokenEstimate: 100,
              outputTokenEstimate: 50,
              crossAgentContextReceived: false,
            },
          },
          hiringManager: {
            agentRole: "hiring_manager",
            agentName: "David Chen",
            avatar: "👔",
            title: "Hiring Manager",
            overallAssessment: "Assessment",
            confidenceScore: 86,
            recommendation: "Hire",
            strengths: [],
            concerns: [],
            isolatedExecutionProof: {
              callId: "call-3",
              startedAt: new Date().toISOString(),
              finishedAt: new Date().toISOString(),
              inputTokenEstimate: 100,
              outputTokenEstimate: 50,
              crossAgentContextReceived: false,
            },
          },
          skeptic: {
            agentRole: "skeptic",
            agentName: "Dr. Elena Rostova",
            avatar: "🕵️",
            title: "Audit Skeptic",
            overallAssessment: "Assessment",
            confidenceScore: 84,
            recommendation: "Proceed to Next Round",
            strengths: [],
            concerns: [],
            isolatedExecutionProof: {
              callId: "call-4",
              startedAt: new Date().toISOString(),
              finishedAt: new Date().toISOString(),
              inputTokenEstimate: 100,
              outputTokenEstimate: 50,
              crossAgentContextReceived: false,
            },
          },
        },
        debate: {
          topicOfDebate: "Topic",
          rounds: [],
          keyDisagreementsExplored: [],
          concessionsMade: [],
          unresolvedDisagreements: [],
          consensusPoints: [],
        },
        finalDecision: {
          recommendation: "Proceed to Next Round",
          confidenceScore: 86,
          executiveReasoning: "Reasoning",
          synthesisBreakdown: {
            technicalWeighting: "tech",
            behavioralWeighting: "hr",
            businessImpactWeighting: "biz",
            skepticRiskWeighting: "risk",
          },
          keyStrengths: [],
          keyRisks: [],
          unresolvedDisagreements: [],
          targetedNextRoundProbes: [],
          decisionAuditTrail: {
            calculatedAverageWasProhibited: true,
            rationaleForVerdictChoice: "Rationale",
            alternativesConsideredAndRejected: [],
          },
          timestamp: new Date().toISOString(),
        },
        executionLog: {
          stage: "complete",
          currentStepDescription: "Complete",
          progressPercentage: 100,
          stageTimings: { totalMs: 1500 },
          providerUsed: "Google Gemini",
          isDemoSimulation: false,
        },
        rawInputs: { resumeSnippet: "resume", transcriptSnippet: "transcript" },
      };

      render(<ObservabilityInspector result={mockResult} />);

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole("columnheader");
      expect(headers.length).toBe(5);

      const rowHeaders = screen.getAllByRole("rowheader");
      expect(rowHeaders.length).toBe(4);
    });
  });

  describe("FinalDecisionCard A11y", () => {
    it("should render verdict status and confidence region", () => {
      const mockDecision = {
        recommendation: "Proceed to Next Round" as const,
        confidenceScore: 88,
        executiveReasoning: "Verified technical capabilities.",
        synthesisBreakdown: {
          technicalWeighting: "Solid architecture",
          behavioralWeighting: "Transparent collaboration",
          businessImpactWeighting: "Ready for delivery",
          skepticRiskWeighting: "Manageable gaps",
        },
        keyStrengths: [],
        keyRisks: [],
        unresolvedDisagreements: [],
        targetedNextRoundProbes: [],
        decisionAuditTrail: {
          calculatedAverageWasProhibited: true as const,
          rationaleForVerdictChoice: "Verdict synthesized based on evidence.",
          alternativesConsideredAndRejected: [],
        },
        timestamp: new Date().toISOString(),
      };

      render(<FinalDecisionCard decision={mockDecision} />);
      const verdictBadges = screen.getAllByRole("status");
      expect(verdictBadges.length).toBeGreaterThanOrEqual(1);

      const confidenceRegion = screen.getByRole("region", { name: /evidence-weighted confidence score/i });
      expect(confidenceRegion).toBeInTheDocument();
    });
  });
});
