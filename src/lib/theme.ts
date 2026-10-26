export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  hover: string;
  subtle: string;
  onPrimary: string;
  hsl: string;
  description: string;
}

export const THEME_STORAGE_KEY = "portfolio_brand_primary";

export const DEFAULT_THEMES: ThemePreset[] = [
  {
    id: "signal-gold",
    name: "Signal Gold (Signature)",
    primary: "#E5A00D",
    hover: "#D99404",
    subtle: "#2B220C",
    onPrimary: "#0A0A0F",
    hsl: "41 90% 48%",
    description: "Signature developer amber & safety ochre",
  },
  {
    id: "emerald-mint",
    name: "Emerald Mint",
    primary: "#10B981",
    hover: "#059669",
    subtle: "#064E3B",
    onPrimary: "#0A0A0F",
    hsl: "158 64% 40%",
    description: "Fresh high-contrast technical green",
  },
  {
    id: "electric-blue",
    name: "Electric Azure",
    primary: "#3B82F6",
    hover: "#2563EB",
    subtle: "#1E3A8A",
    onPrimary: "#FFFFFF",
    hsl: "217 91% 60%",
    description: "Modern cloud and engineering blue",
  },
  {
    id: "neon-violet",
    name: "Neon Violet",
    primary: "#8B5CF6",
    hover: "#7C3AED",
    subtle: "#2E1065",
    onPrimary: "#FFFFFF",
    hsl: "258 90% 66%",
    description: "Vibrant creative full-stack purple",
  },
  {
    id: "radiant-rose",
    name: "Radiant Rose",
    primary: "#F43F5E",
    hover: "#E11D48",
    subtle: "#4C0519",
    onPrimary: "#FFFFFF",
    hsl: "350 89% 60%",
    description: "Bold dynamic crimson accent",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    primary: "#F97316",
    hover: "#EA580C",
    subtle: "#431407",
    onPrimary: "#0A0A0F",
    hsl: "25 95% 53%",
    description: "Warm energetic creative orange",
  },
  {
    id: "cyber-cyan",
    name: "Cyber Cyan",
    primary: "#06B6D4",
    hover: "#0891B2",
    subtle: "#164E63",
    onPrimary: "#0A0A0F",
    hsl: "189 94% 43%",
    description: "Sleek terminal & futuristic aqua",
  },
  {
    id: "amber-flame",
    name: "Amber Flame",
    primary: "#D97706",
    hover: "#B45309",
    subtle: "#451A03",
    onPrimary: "#FFFFFF",
    hsl: "38 92% 44%",
    description: "Deep industrial warm amber",
  },
];

export function hexToHsl(hex: string): string {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  if (c.length !== 6) return "41 90% 48%";

  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function adjustBrightness(hex: string, percent: number): string {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  if (c.length !== 6) return hex;

  const num = parseInt(c, 16);
  let r = (num >> 16) + Math.round(255 * (percent / 100));
  let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
  let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function getOnPrimaryColor(hex: string): string {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  if (c.length !== 6) return "#0A0A0F";

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  // Perceived luminance formula (YIQ)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#0A0A0F" : "#FFFFFF";
}

export function createCustomTheme(hex: string, name = "Custom Primary"): ThemePreset {
  const cleanHex = hex.startsWith("#") ? hex : `#${hex}`;
  const hsl = hexToHsl(cleanHex);
  const hover = adjustBrightness(cleanHex, -10);
  const subtle = `${cleanHex}26`; // ~15% opacity hex
  const onPrimary = getOnPrimaryColor(cleanHex);

  return {
    id: "custom",
    name,
    primary: cleanHex,
    hover,
    subtle,
    onPrimary,
    hsl,
    description: "Custom user-selected primary brand accent",
  };
}

export function applyThemeToDocument(theme: ThemePreset): void {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  root.style.setProperty("--brand-primary", theme.primary);
  root.style.setProperty("--brand-hover", theme.hover);
  root.style.setProperty("--brand-subtle", theme.subtle);
  root.style.setProperty("--brand-on-primary", theme.onPrimary);
  root.style.setProperty("--primary", theme.hsl);
  root.style.setProperty("--ring", theme.hsl);
}
