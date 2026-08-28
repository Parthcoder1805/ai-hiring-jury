"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FileUploadSection } from "@/components/FileUploadSection";
import { PipelineProgress } from "@/components/PipelineProgress";
import { CandidateProfileView } from "@/components/CandidateProfileView";
import { AgentDashboard } from "@/components/AgentDashboard";
import { DebateRoom } from "@/components/DebateRoom";
import { FinalDecisionCard } from "@/components/FinalDecisionCard";
import { ExecutiveReport } from "@/components/ExecutiveReport";
import { ObservabilityInspector } from "@/components/ObservabilityInspector";
import { FullAnalysisResult, PipelineExecutionLog } from "@/types/jury";
import { DEMO_CANDIDATE } from "@/lib/data/demo-candidate";
import {
  Scale,
  Users,
  MessageSquare,
  FileSpreadsheet,
  FileText,
  Activity,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function Home() {
  const [resumeText, setResumeText] = useState<string>("");
  const [transcriptText, setTranscriptText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<
    "verdict" | "profile" | "agents" | "debate" | "report" | "inspector"
  >("verdict");

  const [providerInfo, setProviderInfo] = useState<{
    provider: string;
    model: string;
    isConfigured: boolean;
  }>({
    provider: "Detecting AI Engine...",
    model: "",
    isConfigured: false,
  });

  const [loadingLog, setLoadingLog] = useState<PipelineExecutionLog>({
    stage: "idle",
    currentStepDescription: "Ready to analyze candidate materials.",
    progressPercentage: 0,
    stageTimings: {},
    providerUsed: "AI Engine",
    isDemoSimulation: true,
  });

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setProviderInfo({
          provider: data.provider || "Demo Simulation Engine",
          model: data.model || "jury-engine-v1",
          isConfigured: Boolean(data.isConfigured),
        });
      })
      .catch(() => {
        setProviderInfo({
          provider: "Demo Simulation Engine",
          model: "jury-engine-v1",
          isConfigured: false,
        });
      });
  }, []);

  const handleSelectDemo = () => {
    setResumeText(DEMO_CANDIDATE.resumeText);
    setTranscriptText(DEMO_CANDIDATE.transcriptText);
    setError(null);
    handleAnalyze(true);
  };

  const handleReset = () => {
    setResumeText("");
    setTranscriptText("");
    setResult(null);
    setError(null);
    setIsLoading(false);
    setActiveTab("verdict");
    setLoadingLog({
      stage: "idle",
      currentStepDescription: "Ready to analyze candidate materials.",
      progressPercentage: 0,
      stageTimings: {},
      providerUsed: providerInfo.provider,
      isDemoSimulation: !providerInfo.isConfigured,
    });
  };

  const handleAnalyze = async (forceDemo = false) => {
    setError(null);
    setIsLoading(true);

    const rText = forceDemo ? DEMO_CANDIDATE.resumeText : resumeText;
    const tText = forceDemo ? DEMO_CANDIDATE.transcriptText : transcriptText;

    if (!rText.trim() || !tText.trim()) {
      setError("Please provide both a resume and interview transcript.");
      setIsLoading(false);
      return;
    }

    // Interactive progress simulator for real-time visual feedback
    const progressInterval = setInterval(() => {
      setLoadingLog((prev) => {
        if (prev.stage === "idle" || prev.stage === "profile") {
          return {
            stage: "independent_agents",
            currentStepDescription: "Running 4 isolated AI persona LLM calls concurrently...",
            progressPercentage: 45,
            stageTimings: { ...prev.stageTimings, profileMs: 340 },
            providerUsed: providerInfo.provider,
            isDemoSimulation: !providerInfo.isConfigured,
          };
        } else if (prev.stage === "independent_agents") {
          return {
            stage: "debate",
            currentStepDescription: "Orchestrating multi-agent interactive debate and stance revisions...",
            progressPercentage: 75,
            stageTimings: { ...prev.stageTimings, independentAgentsMs: 760 },
            providerUsed: providerInfo.provider,
            isDemoSimulation: !providerInfo.isConfigured,
          };
        } else if (prev.stage === "debate") {
          return {
            stage: "final_judge",
            currentStepDescription: "Final Decision Judge synthesizing evidence-weighted verdict...",
            progressPercentage: 92,
            stageTimings: { ...prev.stageTimings, debateMs: 650 },
            providerUsed: providerInfo.provider,
            isDemoSimulation: !providerInfo.isConfigured,
          };
        }
        return prev;
      });
    }, 700);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: rText,
          transcriptText: tText,
          isDemo: forceDemo,
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Analysis pipeline failed.");
      }

      const data: FullAnalysisResult = await res.json();
      setResult(data);
      setLoadingLog(data.executionLog);
      setActiveTab("verdict");
    } catch (err: unknown) {
      clearInterval(progressInterval);
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar
        providerName={providerInfo.provider}
        isDemoSimulation={!providerInfo.isConfigured}
        onReset={handleReset}
        onSelectDemo={handleSelectDemo}
        isLoading={isLoading}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* View 1: Upload & Launch Section (When no result yet) */}
        {!result && (
          <div className="space-y-6">
            <FileUploadSection
              resumeText={resumeText}
              setResumeText={setResumeText}
              transcriptText={transcriptText}
              setTranscriptText={setTranscriptText}
              onAnalyze={() => handleAnalyze(false)}
              isLoading={isLoading}
            />

            {isLoading && (
              <div className="pt-4">
                <PipelineProgress log={loadingLog} />
              </div>
            )}
          </div>
        )}

        {/* View 2: Evaluation Results Dashboard (When analysis completes) */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Candidate Summary Header Bar */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                  ⚖️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{result.candidateProfile.name}</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {result.candidateProfile.targetRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Jury Verdict: <strong className="text-indigo-300">{result.finalDecision.recommendation}</strong> ({result.finalDecision.confidenceScore}% Confidence)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  Analyze New Candidate
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 overflow-x-auto gap-1 pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setActiveTab("verdict")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === "verdict"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>Final Verdict & Synthesis</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === "profile"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Candidate Profile ({result.candidateProfile.skills.length} Skills)</span>
              </button>

              <button
                onClick={() => setActiveTab("agents")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === "agents"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>4 Independent Personas</span>
              </button>

              <button
                onClick={() => setActiveTab("debate")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === "debate"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Debate Room ({result.debate.rounds.length} Turns)</span>
              </button>

              <button
                onClick={() => setActiveTab("report")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === "report"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Decision Packet</span>
              </button>

              <button
                onClick={() => setActiveTab("inspector")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === "inspector"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Observability Audit</span>
              </button>
            </div>

            {/* Active Tab Content */}
            <div className="pt-2">
              {activeTab === "verdict" && (
                <div className="space-y-6">
                  <FinalDecisionCard decision={result.finalDecision} />
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-6">
                  <CandidateProfileView profile={result.candidateProfile} />
                </div>
              )}

              {activeTab === "agents" && (
                <div className="space-y-6">
                  <AgentDashboard evaluations={result.independentEvaluations} />
                </div>
              )}

              {activeTab === "debate" && (
                <div className="space-y-6">
                  <DebateRoom debate={result.debate} />
                </div>
              )}

              {activeTab === "report" && (
                <div className="space-y-6">
                  <ExecutiveReport result={result} />
                </div>
              )}

              {activeTab === "inspector" && (
                <div className="space-y-6">
                  <ObservabilityInspector result={result} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">AI Hiring Jury</span>
            <span>— Multi-Agent Reasoning Architecture</span>
          </div>
          <div>
            Built with Next.js, TypeScript, Tailwind CSS & Multi-Provider AI (Google Gemini / OpenAI).
          </div>
        </div>
      </footer>
    </div>
  );
}
