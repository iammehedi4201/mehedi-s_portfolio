import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Custom portfolio colors
        electric: "#3B82F6",
        violet: "#8B5CF6",
        cyan: "#06B6D4",
        "deep-dark": "#0A0A0F",
        "sidebar-bg": "#0F0F13",
        "dash-bg": "#141418",
        "dash-card": "#1C1C22",
      },
      fontFamily: {
        heading: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh-gradient": "radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(6, 182, 212, 0.1) 0, transparent 50%), radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.15) 0, transparent 50%)",
      },
      keyframes: {
        "aurora": {
          "0%, 100%": { backgroundPosition: "50% 50%, 50% 50%" },
          "50%": { backgroundPosition: "350% 50%, 350% 50%" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" },
        },
        "blink": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "currentColor" },
        },
        "count-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "aurora": "aurora 15s ease infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "typewriter": "typewriter 3s steps(30) forwards",
        "blink": "blink 1s step-end infinite",
        "count-up": "count-up 0.6s ease-out",
        "spin-slow": "spin-slow 20s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.svg')",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-violet": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-cyan": "0 0 20px rgba(6, 182, 212, 0.3)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
