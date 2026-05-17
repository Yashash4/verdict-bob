import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#08070b",
        surface: {
          1: "#100e15",
          2: "#161420",
        },
        hairline: {
          DEFAULT: "#23202b",
          strong: "#2e2a3a",
        },
        ink: {
          DEFAULT: "#f7f8f8",
          muted: "#b8bac0",
          subtle: "#7a7d85",
        },
        accent: {
          DEFAULT: "#6a5fc1",
          hover: "#8077d8",
        },
        signal: {
          danger: "#ff3b47",
          warning: "#ffb35a",
          success: "#4ade80",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["72px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "600" }],
        "display-lg": ["56px", { lineHeight: "1.10", letterSpacing: "-0.018em", fontWeight: "600" }],
        "display-md": ["40px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        headline: ["28px", { lineHeight: "1.20", letterSpacing: "-0.006em", fontWeight: "600" }],
        subhead: ["20px", { lineHeight: "1.40", letterSpacing: "-0.002em", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.55", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.55", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "1.40", letterSpacing: "0.04em", fontWeight: "500" }],
        mono: ["14px", { lineHeight: "1.50", fontWeight: "400" }],
      },
      spacing: {
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        48: "48px",
        64: "64px",
        96: "96px",
      },
      borderRadius: {
        4: "4px",
        6: "6px",
        8: "8px",
        12: "12px",
        16: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.4)",
        modal: "0 20px 40px rgba(0,0,0,0.6)",
        "killer-glow": "0 0 60px 20px rgba(255, 59, 71, 0.20)",
      },
      animation: {
        "killer-glow": "killer-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "killer-glow": {
          "0%, 100%": { boxShadow: "0 0 40px 15px rgba(255, 59, 71, 0.15)" },
          "50%": { boxShadow: "0 0 60px 20px rgba(255, 59, 71, 0.25)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
