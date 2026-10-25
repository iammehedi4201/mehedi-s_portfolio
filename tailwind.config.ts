import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/design-system/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Standard shadcn HSL mappings
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

        // New Custom Solid Palette (Zero gradients, completely distinct)
        canvas: "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        "surface-elevated": "var(--bg-surface-elevated)",
        "surface-subtle": "var(--bg-surface-subtle)",

        heading: "var(--text-heading)",
        "text-heading": "var(--text-heading)",
        body: "var(--text-body)",
        "text-body": "var(--text-body)",
        "text-muted": "var(--text-muted)",

        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",

        "brand-primary": "var(--brand-primary)",
        "brand-hover": "var(--brand-hover)",
        "brand-on-primary": "var(--brand-on-primary)",
        "brand-subtle": "var(--brand-subtle)",

        "color-success": "var(--color-success)",
        "color-success-subtle": "var(--color-success-subtle)",
        "color-info": "var(--color-info)",
        "color-info-subtle": "var(--color-info-subtle)",
        "color-warning": "var(--color-warning)",
        "color-warning-subtle": "var(--color-warning-subtle)",
        "color-error": "var(--color-error)",
        "color-error-subtle": "var(--color-error-subtle)",

        // Retro compatibility aliases mapped to solid theme
        electric: "var(--color-info)",
        violet: "var(--brand-primary)",
        cyan: "var(--color-info)",
        "deep-dark": "var(--bg-canvas)",
        "sidebar-bg": "var(--bg-surface)",
        "dash-bg": "var(--bg-canvas)",
        "dash-card": "var(--bg-surface)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
        heading: ["var(--font-manrope)", "var(--font-syne)", "sans-serif"],
        body: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.12)",
        "card-hover": "0 6px 16px -4px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
