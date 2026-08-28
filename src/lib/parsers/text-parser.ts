export interface ParsedDocument {
  text: string;
  charCount: number;
  wordCount: number;
  lines: string[];
}

export function parsePlainText(raw: string): ParsedDocument {
  const normalized = (raw || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();

  const lines = normalized.split("\n").map((l) => l.trim()).filter(Boolean);
  const words = normalized.split(/\s+/).filter(Boolean);

  return {
    text: normalized,
    charCount: normalized.length,
    wordCount: words.length,
    lines,
  };
}
