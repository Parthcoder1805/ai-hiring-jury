import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { AIProvider } from "@/lib/ai/provider";

describe("AIProvider Suite", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should report Demo Simulation Engine when no API keys are set", () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const info = AIProvider.getActiveProviderInfo();
    expect(info.provider).toBe("Demo Simulation Engine (Deterministic Fallback)");
    expect(info.isConfigured).toBe(false);
    expect(info.model).toBe("jury-engine-v1");
  });

  it("should report Google Gemini when GEMINI_API_KEY is configured", () => {
    process.env.GEMINI_API_KEY = "test-mock-gemini-key";
    process.env.LLM_MODEL = "gemini-3.6-flash";

    const info = AIProvider.getActiveProviderInfo();
    expect(info.provider).toBe("Google Gemini");
    expect(info.isConfigured).toBe(true);
    expect(info.model).toBe("gemini-3.6-flash");
  });

  it("should normalize legacy model aliases to gemini-3.6-flash", () => {
    process.env.GEMINI_API_KEY = "test-mock-gemini-key";
    process.env.LLM_MODEL = "gemini-1.5-flash";

    const info = AIProvider.getActiveProviderInfo();
    expect(info.model).toBe("gemini-3.6-flash");
  });

  it("should report OpenAI Compatible when only OPENAI_API_KEY is set", () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.LLM_MODEL = "gpt-4o";

    const info = AIProvider.getActiveProviderInfo();
    expect(info.provider).toBe("OpenAI Compatible");
    expect(info.isConfigured).toBe(true);
    expect(info.model).toBe("gpt-4o");
  });

  it("should invoke fallbackGenerator in demo simulation mode when no API keys exist", async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const mockFallbackData = { status: "simulated_ok", value: 42 };
    const result = await AIProvider.generateStructuredJson(
      { systemPrompt: "test system", userPrompt: "test user" },
      () => mockFallbackData
    );

    expect(result.data).toEqual(mockFallbackData);
    expect(result.responseMetadata.provider).toBe("fallback_simulator");
    expect(result.responseMetadata.model).toBe("jury-engine-v1");
  });
});
