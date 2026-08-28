import { NextRequest, NextResponse } from "next/server";
import { runFullJuryPipeline } from "@/lib/ai/orchestrator";
import { DEMO_CANDIDATE } from "@/lib/data/demo-candidate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let resumeText = body.resumeText || "";
    let transcriptText = body.transcriptText || "";
    const isDemo = Boolean(body.isDemo);

    if (isDemo || (!resumeText.trim() && !transcriptText.trim())) {
      resumeText = DEMO_CANDIDATE.resumeText;
      transcriptText = DEMO_CANDIDATE.transcriptText;
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text or document is required." },
        { status: 400 }
      );
    }

    if (!transcriptText.trim()) {
      return NextResponse.json(
        { error: "Interview transcript text or document is required." },
        { status: 400 }
      );
    }

    const result = await runFullJuryPipeline(resumeText, transcriptText);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("AI Hiring Jury Pipeline error:", err);
    return NextResponse.json(
      { error: `Evaluation pipeline failed: ${errorMsg}` },
      { status: 500 }
    );
  }
}
