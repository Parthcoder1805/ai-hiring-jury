import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Hiring Jury — Multi-Agent Evidence-Backed Candidate Evaluation",
  description:
    "Four independent AI personas analyze resume & transcript, conduct a genuine multi-agent debate, and render an evidence-backed hiring recommendation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#07090e] text-slate-100 min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
