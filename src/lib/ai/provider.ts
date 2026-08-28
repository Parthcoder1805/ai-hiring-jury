import { GoogleGenerativeAI } from "@google/generative-ai";

export interface LLMRequestOptions {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  jsonSchemaName?: string;
}

export interface LLMResponse {
  rawText: string;
  parsedJson?: unknown;
  provider: "gemini" | "openai" | "fallback_simulator";
  model: string;
  durationMs: number;
  estimatedTokens: {
    input: number;
    output: number;
  };
}

export class AIProvider {
  private static get geminiKey(): string {
    return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  }
  private static get openAiKey(): string {
    return process.env.OPENAI_API_KEY || "";
  }
  private static get openAiBaseUrl(): string {
    return process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  }
  private static get defaultModel(): string {
    const raw = process.env.LLM_MODEL || "gemini-3.6-flash";
    if (raw === "gemini-1.5-flash" || raw === "gemini-2.5-flash") {
      return "gemini-3.6-flash";
    }
    return raw;
  }

  public static getActiveProviderInfo(): { provider: string; model: string; isConfigured: boolean } {
    if (this.geminiKey) {
      return {
        provider: "Google Gemini",
        model: this.defaultModel.includes("gemini") ? this.defaultModel : "gemini-3.6-flash",
        isConfigured: true,
      };
    }
    if (this.openAiKey) {
      return {
        provider: "OpenAI Compatible",
        model: this.defaultModel.includes("gpt") ? this.defaultModel : "gpt-4o-mini",
        isConfigured: true,
      };
    }
    return {
      provider: "Demo Simulation Engine (Deterministic Fallback)",
      model: "jury-engine-v1",
      isConfigured: false,
    };
  }

  public static async generateStructuredJson<T>(
    options: LLMRequestOptions,
    fallbackGenerator: () => T
  ): Promise<{ data: T; responseMetadata: LLMResponse }> {
    const startTime = Date.now();

    // 1. If Gemini key is configured, execute real Google Gemini request with transient retry (NO silent fallback)
    if (this.geminiKey) {
      const modelName = this.defaultModel.includes("gemini") ? this.defaultModel : "gemini-3.6-flash";
      let lastError: unknown = null;

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const genAI = new GoogleGenerativeAI(this.geminiKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: options.temperature ?? 0.2,
            },
            systemInstruction: options.systemPrompt,
          });

          const result = await model.generateContent(options.userPrompt);
          const text = result.response.text();
          const cleaned = this.extractAndCleanJson(text);
          const parsed = JSON.parse(cleaned) as T;

          const durationMs = Date.now() - startTime;
          return {
            data: parsed,
            responseMetadata: {
              rawText: text,
              parsedJson: parsed,
              provider: "gemini",
              model: modelName,
              durationMs,
              estimatedTokens: {
                input: Math.round((options.systemPrompt.length + options.userPrompt.length) / 4),
                output: Math.round(text.length / 4),
              },
            },
          };
        } catch (err: unknown) {
          lastError = err;
          const errorMsg = err instanceof Error ? err.message : String(err);
          const isTransient =
            errorMsg.includes("503") ||
            errorMsg.includes("429") ||
            errorMsg.includes("high demand") ||
            errorMsg.includes("ResourceExhausted") ||
            errorMsg.includes("fetch failed");

          if (attempt < 3 && isTransient) {
            console.warn(`Gemini attempt ${attempt} transient error (${errorMsg}), retrying in ${attempt * 1200}ms...`);
            await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
            continue;
          }
          break;
        }
      }

      const finalErrMsg = lastError instanceof Error ? lastError.message : String(lastError);
      console.error(`Gemini API request failed for model [${modelName}]:`, finalErrMsg);
      throw new Error(`Gemini LLM request failed (${modelName}): ${finalErrMsg}`);
    }

    // 2. If OpenAI key is configured, execute real OpenAI request (NO silent fallback)
    if (this.openAiKey) {
      const modelName = this.defaultModel.includes("gpt") ? this.defaultModel : "gpt-4o-mini";
      try {
        const response = await fetch(`${this.openAiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.openAiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            temperature: options.temperature ?? 0.2,
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `${options.systemPrompt}\n\nRespond strictly with valid JSON conforming to the requested schema.`,
              },
              { role: "user", content: options.userPrompt },
            ],
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenAI HTTP ${response.status}: ${errText}`);
        }

        const resJson = await response.json();
        const content = resJson.choices?.[0]?.message?.content || "{}";
        const cleaned = this.extractAndCleanJson(content);
        const parsed = JSON.parse(cleaned) as T;
        const durationMs = Date.now() - startTime;

        return {
          data: parsed,
          responseMetadata: {
            rawText: content,
            parsedJson: parsed,
            provider: "openai",
            model: modelName,
            durationMs,
            estimatedTokens: {
              input:
                resJson.usage?.prompt_tokens ||
                Math.round((options.systemPrompt.length + options.userPrompt.length) / 4),
              output:
                resJson.usage?.completion_tokens || Math.round(content.length / 4),
            },
          },
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`OpenAI API request failed for model [${modelName}]:`, errorMsg);
        throw new Error(`OpenAI LLM request failed (${modelName}): ${errorMsg}`);
      }
    }

    // 3. Fallback High-Fidelity Simulation ONLY when no API key is configured
    await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
    const fallbackData = fallbackGenerator();
    const durationMs = Date.now() - startTime;

    return {
      data: fallbackData,
      responseMetadata: {
        rawText: JSON.stringify(fallbackData, null, 2),
        parsedJson: fallbackData,
        provider: "fallback_simulator",
        model: "jury-engine-v1",
        durationMs,
        estimatedTokens: {
          input: Math.round((options.systemPrompt.length + options.userPrompt.length) / 4),
          output: Math.round(JSON.stringify(fallbackData).length / 4),
        },
      },
    };
  }

  private static extractAndCleanJson(raw: string): string {
    let text = raw.trim();
    if (text.startsWith("```json")) {
      text = text.substring(7);
    } else if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    return text.trim();
  }
}
