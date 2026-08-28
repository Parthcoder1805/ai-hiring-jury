import { parsePlainText, ParsedDocument } from "./text-parser";

export async function parseDocxBuffer(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({ buffer });
    return parsePlainText(result.value);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn("DOCX parsing failed, falling back to plain string:", errorMsg);
    return parsePlainText(buffer.toString("utf-8"));
  }
}
