import { parsePlainText, ParsedDocument } from "./text-parser";

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedDocument> {
  try {
    // Dynamic import to prevent SSR bundling issues
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return parsePlainText(data.text);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn("PDF parsing failed, returning empty buffer string fallback:", errorMsg);
    // Fallback: try reading raw strings
    const rawString = buffer.toString("utf-8");
    const sanitized = rawString.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
    return parsePlainText(sanitized);
  }
}
