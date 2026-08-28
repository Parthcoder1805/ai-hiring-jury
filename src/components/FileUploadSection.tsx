import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { DEMO_CANDIDATE } from "@/lib/data/demo-candidate";

interface FileUploadSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  transcriptText: string;
  setTranscriptText: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  resumeText,
  setResumeText,
  transcriptText,
  setTranscriptText,
  onAnalyze,
  isLoading,
}) => {
  const [resumeTab, setResumeTab] = useState<"upload" | "text">("upload");
  const [transcriptTab, setTranscriptTab] = useState<"upload" | "text">("upload");
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [transcriptFileName, setTranscriptFileName] = useState<string>("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isParsingTranscript, setIsParsingTranscript] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const transcriptInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    file: File,
    type: "resume" | "transcript"
  ) => {
    setParseError(null);
    const formData = new FormData();
    formData.append("file", file);

    if (type === "resume") {
      setIsParsingResume(true);
      setResumeFileName(file.name);
    } else {
      setIsParsingTranscript(true);
      setTranscriptFileName(file.name);
    }

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to parse ${file.name}`);
      }

      const data = await res.json();
      if (type === "resume") {
        setResumeText(data.text);
      } else {
        setTranscriptText(data.text);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Parsing error";
      setParseError(msg);
    } finally {
      if (type === "resume") setIsParsingResume(false);
      else setIsParsingTranscript(false);
    }
  };

  const handleLoadDemo = () => {
    setResumeText(DEMO_CANDIDATE.resumeText);
    setTranscriptText(DEMO_CANDIDATE.transcriptText);
    setResumeFileName("Arjun_Mehta_Resume_Senior_Backend.pdf");
    setTranscriptFileName("Arjun_Mehta_Technical_Interview_Transcript.txt");
    setParseError(null);
  };

  const canProceed = resumeText.trim().length > 20 && transcriptText.trim().length > 20;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="text-center py-6 sm:py-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
          <span>Strict Multi-Agent Isolation Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Evidence-Backed Candidate Evaluation by <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">4 Independent AI Personas</span>
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400">
          Upload a candidate&apos;s resume and interview transcript. The system convenes 4 strictly isolated AI agents (Technical, HR, Hiring Manager, Skeptic), conducts a multi-round debate, and renders a reasoned verdict.
        </p>

        {/* Quick Demo Pill */}
        <div className="pt-2">
          <button
            onClick={handleLoadDemo}
            aria-label="Load sample candidate: Arjun Mehta (Senior Backend Engineer)"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 text-xs font-semibold transition-all shadow-md hover:border-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" aria-hidden="true" />
            <span>Load Sample Candidate: Arjun Mehta (Senior Backend Engineer)</span>
          </button>
        </div>
      </div>

      {parseError && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" aria-hidden="true" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Dual Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RESUME CARD */}
        <section aria-labelledby="resume-heading" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm" aria-hidden="true">
                1
              </div>
              <div>
                <h3 id="resume-heading" className="text-sm font-bold text-white">Candidate Resume</h3>
                <p className="text-xs text-slate-400">PDF, DOCX, or text file</p>
              </div>
            </div>

            {/* Tab switch */}
            <div role="tablist" aria-label="Resume input method" className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                role="tab"
                id="resume-tab-upload"
                aria-selected={resumeTab === "upload"}
                aria-controls="resume-panel-upload"
                onClick={() => setResumeTab("upload")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                  resumeTab === "upload" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Upload
              </button>
              <button
                role="tab"
                id="resume-tab-text"
                aria-selected={resumeTab === "text"}
                aria-controls="resume-panel-text"
                onClick={() => setResumeTab("text")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                  resumeTab === "text" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Text Editor
              </button>
            </div>
          </div>

          {resumeTab === "upload" ? (
            <div
              id="resume-panel-upload"
              role="button"
              tabIndex={0}
              aria-label="Upload Resume document file (PDF, DOCX, or TXT). Click or press Enter to browse files."
              onClick={() => resumeInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  resumeInputRef.current?.click();
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0], "resume");
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                resumeText.trim()
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-700 hover:border-blue-500/50 bg-slate-950/40 hover:bg-slate-950/70"
              }`}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                aria-label="Resume file upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "resume");
                }}
              />
              {isParsingResume ? (
                <div className="flex flex-col items-center gap-2" role="status" aria-label="Parsing resume text">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  <p className="text-xs text-slate-300">Parsing resume text...</p>
                </div>
              ) : resumeText.trim() ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
                  <p className="text-xs font-semibold text-emerald-300">
                    {resumeFileName || "Resume loaded successfully"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {resumeText.length} characters • Press Enter or click to replace file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-8 h-8 text-slate-400" aria-hidden="true" />
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drag & drop resume
                  </p>
                  <p className="text-[11px] text-slate-500">Supports PDF, DOCX, TXT</p>
                </div>
              )}
            </div>
          ) : (
            <div id="resume-panel-text">
              <label htmlFor="resume-textarea" className="sr-only">
                Paste or edit Candidate Resume text
              </label>
              <textarea
                id="resume-textarea"
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste candidate resume text here..."
                aria-label="Candidate resume text editor"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 font-mono resize-none"
              />
            </div>
          )}
        </section>

        {/* TRANSCRIPT CARD */}
        <section aria-labelledby="transcript-heading" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm" aria-hidden="true">
                2
              </div>
              <div>
                <h3 id="transcript-heading" className="text-sm font-bold text-white">Interview Transcript</h3>
                <p className="text-xs text-slate-400">Q&A transcript or notes</p>
              </div>
            </div>

            {/* Tab switch */}
            <div role="tablist" aria-label="Transcript input method" className="flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                role="tab"
                id="transcript-tab-upload"
                aria-selected={transcriptTab === "upload"}
                aria-controls="transcript-panel-upload"
                onClick={() => setTranscriptTab("upload")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                  transcriptTab === "upload" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Upload
              </button>
              <button
                role="tab"
                id="transcript-tab-text"
                aria-selected={transcriptTab === "text"}
                aria-controls="transcript-panel-text"
                onClick={() => setTranscriptTab("text")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 ${
                  transcriptTab === "text" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Text Editor
              </button>
            </div>
          </div>

          {transcriptTab === "upload" ? (
            <div
              id="transcript-panel-upload"
              role="button"
              tabIndex={0}
              aria-label="Upload Interview Transcript file (PDF, DOCX, or TXT). Click or press Enter to browse files."
              onClick={() => transcriptInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  transcriptInputRef.current?.click();
                }
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0], "transcript");
              }}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                transcriptText.trim()
                  ? "border-emerald-500/40 bg-emerald-950/10"
                  : "border-slate-700 hover:border-indigo-500/50 bg-slate-950/40 hover:bg-slate-950/70"
              }`}
            >
              <input
                ref={transcriptInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                aria-label="Transcript file upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "transcript");
                }}
              />
              {isParsingTranscript ? (
                <div className="flex flex-col items-center gap-2" role="status" aria-label="Parsing interview transcript">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  <p className="text-xs text-slate-300">Parsing interview transcript...</p>
                </div>
              ) : transcriptText.trim() ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
                  <p className="text-xs font-semibold text-emerald-300">
                    {transcriptFileName || "Transcript loaded successfully"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {transcriptText.length} characters • Press Enter or click to replace file
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-8 h-8 text-slate-400" aria-hidden="true" />
                  <p className="text-xs font-semibold text-slate-200">
                    Click to browse or drag & drop transcript
                  </p>
                  <p className="text-[11px] text-slate-500">Supports PDF, DOCX, TXT</p>
                </div>
              )}
            </div>
          ) : (
            <div id="transcript-panel-text">
              <label htmlFor="transcript-textarea" className="sr-only">
                Paste or edit Interview Transcript text
              </label>
              <textarea
                id="transcript-textarea"
                rows={8}
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder="Paste interview transcript text here..."
                aria-label="Interview transcript text editor"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 font-mono resize-none"
              />
            </div>
          )}
        </section>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500 flex items-center gap-2" aria-label="Pipeline feature summary">
          <span>✨ 4 Isolated LLM Calls</span>
          <span aria-hidden="true">•</span>
          <span>⚡ Multi-Agent Debate</span>
          <span aria-hidden="true">•</span>
          <span>⚖️ Reasoned Decision</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={!canProceed || isLoading}
          aria-label={isLoading ? "Convening AI Hiring Jury..." : "Convene AI Hiring Jury to analyze candidate"}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <span>Convening AI Jury...</span>
            </>
          ) : (
            <>
              <span>Convene AI Hiring Jury</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
