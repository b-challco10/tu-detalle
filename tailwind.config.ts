// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19", // slate-950 custom
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(to right, #2563eb, #22d3ee, #34d399)", // blue-600 → cyan-400 → emerald-400
        "gradient-primary-br": "linear-gradient(to bottom right, #2563eb, #22d3ee, #34d399)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(56, 189, 248, 0.25)",
        "glow-lg": "0 0 40px rgba(56, 189, 248, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;