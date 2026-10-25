export interface ColorToken {
  name: string;
  variable: string;
  tailwindClass: string;
  lightHex: string;
  darkHex: string;
  description: string;
  category: "surface" | "text" | "border" | "brand" | "semantic";
}

export const NEW_COLOR_TOKENS: ColorToken[] = [
  // Surfaces & Canvases (Solid only, zero gradients)
  {
    name: "canvas",
    variable: "--bg-canvas",
    tailwindClass: "bg-canvas",
    lightHex: "#F6F8FA",
    darkHex: "#0C0E12",
    description: "Main page body background (solid technical slate/paper)",
    category: "surface",
  },
  {
    name: "surface",
    variable: "--bg-surface",
    tailwindClass: "bg-surface",
    lightHex: "#FFFFFF",
    darkHex: "#151921",
    description: "Primary container and card surface (solid clean container)",
    category: "surface",
  },
  {
    name: "surface-elevated",
    variable: "--bg-surface-elevated",
    tailwindClass: "bg-surface-elevated",
    lightHex: "#EDF1F5",
    darkHex: "#1D232E",
    description: "Elevated surfaces, dropdowns, and navigation pills",
    category: "surface",
  },
  {
    name: "surface-subtle",
    variable: "--bg-surface-subtle",
    tailwindClass: "bg-surface-subtle",
    lightHex: "#E2E7ED",
    darkHex: "#252D3B",
    description: "Inset code blocks, secondary chips, and inactive tabs",
    category: "surface",
  },

  // Text & Typography (Solid, high contrast)
  {
    name: "text-heading",
    variable: "--text-heading",
    tailwindClass: "text-heading",
    lightHex: "#0F172A",
    darkHex: "#F8FAFC",
    description: "Primary headings, titles, and maximum-contrast copy",
    category: "text",
  },
  {
    name: "text-body",
    variable: "--text-body",
    tailwindClass: "text-body",
    lightHex: "#475569",
    darkHex: "#94A3B8",
    description: "Standard body paragraphs and descriptions",
    category: "text",
  },
  {
    name: "text-muted",
    variable: "--text-muted",
    tailwindClass: "text-muted",
    lightHex: "#94A3B8",
    darkHex: "#64748B",
    description: "Metadata, timestamps, and captions",
    category: "text",
  },

  // Borders & Hairlines (Solid, architectural)
  {
    name: "border-subtle",
    variable: "--border-subtle",
    tailwindClass: "border-subtle",
    lightHex: "#D1D8E0",
    darkHex: "#2A3444",
    description: "Hairline borders for cards and sections",
    category: "border",
  },
  {
    name: "border-strong",
    variable: "--border-strong",
    tailwindClass: "border-strong",
    lightHex: "#94A3B8",
    darkHex: "#43526A",
    description: "Active borders, input outlines, and dividers",
    category: "border",
  },

  // Brand Primary: Signal Amber / Safety Ochre (Solid, unique developer identity)
  {
    name: "brand-primary",
    variable: "--brand-primary",
    tailwindClass: "bg-brand-primary text-brand-on-primary",
    lightHex: "#B45309",
    darkHex: "#E5A00D",
    description: "Signature primary brand accent for CTAs and highlights",
    category: "brand",
  },
  {
    name: "brand-hover",
    variable: "--brand-hover",
    tailwindClass: "bg-brand-hover",
    lightHex: "#92400E",
    darkHex: "#D99404",
    description: "Hover state for brand actions",
    category: "brand",
  },
  {
    name: "brand-subtle",
    variable: "--brand-subtle",
    tailwindClass: "bg-brand-subtle text-brand-primary",
    lightHex: "#FEF3C7",
    darkHex: "#2B220C",
    description: "Subtle background container for active badges and tags",
    category: "brand",
  },

  // Semantic Status Colors (Solid colors only)
  {
    name: "success",
    variable: "--color-success",
    tailwindClass: "text-color-success",
    lightHex: "#059669",
    darkHex: "#10B981",
    description: "Production-ready and success status indicators",
    category: "semantic",
  },
  {
    name: "info",
    variable: "--color-info",
    tailwindClass: "text-color-info",
    lightHex: "#0284C7",
    darkHex: "#38BDF8",
    description: "Informational notes and architecture markers",
    category: "semantic",
  },
  {
    name: "warning",
    variable: "--color-warning",
    tailwindClass: "text-color-warning",
    lightHex: "#EA580C",
    darkHex: "#FB923C",
    description: "Warning and attention flags",
    category: "semantic",
  },
  {
    name: "error",
    variable: "--color-error",
    tailwindClass: "text-color-error",
    lightHex: "#DC2626",
    darkHex: "#F87171",
    description: "Errors and destructive operations",
    category: "semantic",
  },
];

export const TYPOGRAPHY_SCALE = [
  { element: "Hero Display", weight: "800", utility: "font-extrabold text-5xl sm:text-6xl lg:text-7xl", description: "Main portfolio hero title (solid color, no gradients)" },
  { element: "Section Heading", weight: "700", utility: "font-bold text-3xl sm:text-4xl", description: "Section titles and major landmarks" },
  { element: "Card Title", weight: "600", utility: "font-semibold text-lg sm:text-xl", description: "Project, skill and timeline card headers" },
  { element: "Navigation & Tabs", weight: "600", utility: "font-semibold text-xs sm:text-sm tracking-wide", description: "Nav bar links, filter tabs, breadcrumbs" },
  { element: "Buttons & CTAs", weight: "700", utility: "font-bold text-sm tracking-wide", description: "Solid interactive button labels" },
  { element: "Body Large", weight: "400", utility: "font-normal text-base leading-relaxed", description: "Hero paragraph and about bio lead text" },
  { element: "Body Standard", weight: "400", utility: "font-normal text-sm leading-relaxed", description: "Project descriptions, timeline notes" },
  { element: "Caption / Meta", weight: "500", utility: "font-medium text-xs", description: "Timestamps, tags, statistics labels" },
  { element: "Micro / Overline", weight: "700", utility: "font-bold text-[10px] uppercase tracking-widest", description: "Category pills, status overlines" },
];
