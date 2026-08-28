import { describe, it, expect } from "vitest";
import { parsePlainText } from "@/lib/parsers/text-parser";

describe("Document Parsers Suite", () => {
  describe("Plain Text Parser", () => {
    it("should accurately parse plain text with word count, charCount, and line breakdown", () => {
      const sample = `John Doe
Senior Software Engineer
Experience:
- Architected cloud services
- Led agile development team`;

      const result = parsePlainText(sample);
      expect(result.text).toBe(sample);
      expect(result.wordCount).toBe(15);
      expect(result.charCount).toBe(sample.length);
      expect(result.lines.length).toBe(5);
    });

    it("should handle empty or whitespace-only inputs cleanly", () => {
      const result = parsePlainText("   \n\t  ");
      expect(result.wordCount).toBe(0);
      expect(result.charCount).toBe(0);
      expect(result.text).toBe("");
      expect(result.lines).toEqual([]);
    });

    it("should normalize carriage returns and split lines accurately", () => {
      const windowsNewlineText = "Line 1\r\nLine 2\r\nLine 3";
      const result = parsePlainText(windowsNewlineText);
      expect(result.wordCount).toBe(6);
      expect(result.charCount).toBe(20);
      expect(result.lines).toEqual(["Line 1", "Line 2", "Line 3"]);
    });
  });
});
