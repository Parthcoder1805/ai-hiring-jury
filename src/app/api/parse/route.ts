import { NextRequest, NextResponse } from "next/server";
import { parsePdfBuffer } from "@/lib/parsers/pdf-parser";
import { parseDocxBuffer } from "@/lib/parsers/docx-parser";
import { parsePlainText } from "@/lib/parsers/text-parser";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let parsed;
    if (fileName.endsWith(".pdf")) {
      parsed = await parsePdfBuffer(buffer);
    } else if (fileName.endsWith(".docx")) {
      parsed = await parseDocxBuffer(buffer);
    } else if (fileName.endsWith(".txt") || fileName.endsWith(".md")) {
      parsed = parsePlainText(buffer.toString("utf-8"));
    } else {
      // Fallback text extraction
      parsed = parsePlainText(buffer.toString("utf-8"));
    }

    return NextResponse.json({
      fileName: file.name,
      text: parsed.text,
      charCount: parsed.charCount,
      wordCount: parsed.wordCount,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("File parse error:", err);
    return NextResponse.json(
      { error: `File parsing failed: ${errorMsg}` },
      { status: 500 }
    );
  }
}
