import { NextResponse } from "next/server";
import { AIProvider } from "@/lib/ai/provider";

export async function GET() {
  const providerInfo = AIProvider.getActiveProviderInfo();
  return NextResponse.json({
    status: "ok",
    provider: providerInfo.provider,
    model: providerInfo.model,
    isConfigured: providerInfo.isConfigured,
    timestamp: new Date().toISOString(),
  });
}
