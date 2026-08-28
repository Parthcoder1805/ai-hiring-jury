import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        jury: {
          dark: "#0b0f19",
          card: "#111827",
          cardBorder: "#1f2937",
          accent: "#3b82f6",
          technical: "#38bdf8",
          hr: "#a855f7",
          hiringManager: "#10b981",
          skeptic: "#f59e0b",
          verdict: "#6366f1",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "Courier New", "monospace"],
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
