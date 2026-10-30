"use client";

import { useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { useTheme } from "next-themes";
import { InteractiveGrid } from "@/components/interactive-grid";
import {
  NEW_COLOR_TOKENS,
  TYPOGRAPHY_SCALE,
  type ColorToken,
} from "@/design-system/tokens";
import {
  Check,
  Copy,
  Sparkles,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  Terminal,
} from "lucide-react";

export default function DesignSystemPlayground(): JSX.Element {
  const { theme, setTheme } = useTheme();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string>("button-primary");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2200);
  };

  const surfaces = NEW_COLOR_TOKENS.filter((t) => t.category === "surface");
  const brand = NEW_COLOR_TOKENS.filter((t) => t.category === "brand");
  const borders = NEW_COLOR_TOKENS.filter((t) => t.category === "border");
  const typography = NEW_COLOR_TOKENS.filter((t) => t.category === "text");
  const semantics = NEW_COLOR_TOKENS.filter((t) => t.category === "semantic");

  const getActiveComponentCode = () => {
    switch (selectedComponent) {
      case "button-primary":
        return `<button className="px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-brand-on-primary font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-sm">
  Primary Action
</button>`;
      case "button-secondary":
        return `<button className="px-5 py-2.5 bg-surface-elevated hover:bg-surface-subtle text-text-heading font-bold rounded-xl transition-all duration-200 border border-border-subtle active:scale-95">
  Secondary Action
</button>`;
      case "button-outline":
        return `<button className="px-5 py-2.5 bg-transparent hover:bg-brand-subtle text-text-heading font-bold rounded-xl transition-all duration-200 border-2 border-brand-primary active:scale-95">
  Outline Action
</button>`;
      case "button-error":
        return `<button className="px-5 py-2.5 bg-color-error text-white font-bold rounded-xl transition-all duration-200 shadow-sm active:scale-95">
  Danger Action
</button>`;
      case "badge-feature":
        return `<span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-brand-subtle text-brand-subtle-text border border-brand-primary/30">
  ⚡ Core Feature
</span>`;
      case "badge-success":
        return `<span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-color-success/10 text-color-success border border-color-success/30">
  🟢 Production Ready
</span>`;
      case "badge-info":
        return `<span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-color-info/10 text-color-info border border-color-info/30">
  ℹ️ Architecture Spec
</span>`;
      case "badge-warning":
        return `<span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-color-warning/10 text-color-warning border border-color-warning/30">
  ⚠️ Critical Metric
</span>`;
      case "alert-info":
        return `<div className="flex items-start gap-3 p-4 rounded-xl border border-color-info/30 bg-color-info/10 text-text-heading">
  <span className="text-lg">💡</span>
  <div>
    <h5 className="font-bold text-sm text-color-info">Solid Design Tokens</h5>
    <p className="text-xs text-text-body mt-0.5">High-contrast solid token pairings engineered without gradients for clean visual hierarchy.</p>
  </div>
</div>`;
      case "alert-success":
        return `<div className="flex items-start gap-3 p-4 rounded-xl border border-color-success/30 bg-color-success/10 text-text-heading">
  <span className="text-lg">✅</span>
  <div>
    <h5 className="font-bold text-sm text-color-success">Production Verified</h5>
    <p className="text-xs text-text-body mt-0.5">Clean TypeScript and Next.js App Router compilation verified across all viewports.</p>
  </div>
</div>`;
      case "alert-error":
        return `<div className="flex items-start gap-3 p-4 rounded-xl border border-color-error/30 bg-color-error/10 text-text-heading">
  <span className="text-lg">❌</span>
  <div>
    <h5 className="font-bold text-sm text-color-error">Execution Error</h5>
    <p className="text-xs text-text-body mt-0.5">Please check configuration environment variables and rebuild.</p>
  </div>
</div>`;
      case "card-interactive":
        return `<div className="p-6 rounded-2xl bg-surface border border-border-subtle hover:border-brand-primary shadow-sm hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
  <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-brand-primary mb-4 font-bold group-hover:scale-105 transition-transform">
    ⚡
  </div>
  <h4 className="font-bold text-lg text-text-heading group-hover:text-brand-primary transition-colors">
    Distributed Architecture
  </h4>
  <p className="text-sm text-text-body mt-2 leading-relaxed">
    Solid, cohesive design system tokens ensure robust readability and high contrast on all device displays.
  </p>
</div>`;
      default:
        return "";
    }
  };

  const renderTokenCard = (token: ColorToken) => (
    <div
      key={token.name}
      onClick={() => copyToClipboard(token.tailwindClass, token.name)}
      className="flex flex-col justify-between p-4 bg-surface-subtle border border-border-subtle rounded-xl hover:border-brand-primary transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="h-10 w-12 rounded-lg border border-border-subtle shadow-sm flex-shrink-0"
          style={{
            backgroundColor: theme === "light" ? token.lightHex : token.darkHex,
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text-heading group-hover:text-brand-primary transition-colors truncate">
            {token.name}
          </p>
          <p className="text-[11px] font-mono text-text-muted truncate mt-0.5">
            {token.variable}
          </p>
        </div>
      </div>
      <p className="text-xs text-text-body line-clamp-2 mb-3">
        {token.description}
      </p>
      <div className="pt-2.5 border-t border-border-subtle flex items-center justify-between font-mono text-[10px] text-text-muted">
        <span>L: {token.lightHex}</span>
        <span>D: {token.darkHex}</span>
      </div>
    </div>
  );

  return (
    <InteractiveGrid className="min-h-screen bg-background text-text-heading font-sans pb-24">
      <Nav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">
        {/* Header Hero Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12 p-8 sm:p-10 rounded-3xl bg-surface border border-border-subtle shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-brand-subtle text-brand-subtle-text rounded-full border border-brand-primary/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Solid Color Design System
              </span>
              <span className="text-xs font-mono text-text-muted">v2.1.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-heading font-heading">
              Apex Obsidian & Signal Amber
            </h1>
            <p className="text-text-body text-base sm:text-lg mt-3 leading-relaxed">
              Engineered with 100% solid color tokens (zero gradients). Features deep charcoal surfaces, crisp architectural hairlines, and high-visibility Signal Amber accents for an unmistakably professional developer identity.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link
                href="/design-system/skeletons"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-brand-on-primary hover:bg-brand-hover shadow-sm transition-all active:scale-95"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Skeleton Gallery (10 Screens)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-surface-elevated text-text-heading hover:bg-surface-subtle border border-border-subtle transition-colors"
              >
                <span>← Back to Portfolio</span>
              </Link>
            </div>
          </div>

          {/* Theme Quick Switcher Widget */}
          <div className="relative z-10 flex flex-col gap-2.5 bg-surface-elevated p-5 rounded-2xl border border-border-subtle shrink-0 sm:min-w-[220px]">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              Preview Mode Theme
            </span>
            <div className="flex gap-2">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                    theme === t
                      ? "bg-brand-primary text-brand-on-primary shadow-sm"
                      : "bg-surface text-text-muted hover:text-text-heading border border-border-subtle"
                  }`}
                >
                  {t === "dark" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-text-muted mt-1 leading-normal">
              Active mode: <span className="font-bold text-brand-primary capitalize">{theme || "dark"}</span>
            </p>
          </div>
        </div>

        {/* SECTION 1: SOLID COLOR TOKEN PALETTES */}
        <section className="mb-16 space-y-10">
          <div className="border-b border-border-subtle pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-heading font-heading">
                1. Solid Color Design Tokens
              </h2>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Zero gradients. Pure solid colors calibrated for light & dark environments. Click any card to copy its Tailwind utility.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-text-muted uppercase">
              Click Card = Copy Class
            </span>
          </div>

          {/* Group A: Brand Primary (Signal Amber) */}
          <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
              Brand Primary: Signal Amber Accent (Solid)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {brand.map(renderTokenCard)}
            </div>
          </div>

          {/* Group B: Surfaces & Canvases */}
          <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-text-heading" />
              Surfaces & Canvases (Solid Obsidian / Clean Paper)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {surfaces.map(renderTokenCard)}
            </div>
          </div>

          {/* Group C: Borders & Hairlines */}
          <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-border-strong" />
              Borders & Architectural Hairlines (Solid)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {borders.map(renderTokenCard)}
            </div>
          </div>

          {/* Group D: Text & Typography */}
          <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-text-muted" />
              Text & Typography Hierarchy (Solid High Contrast)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {typography.map(renderTokenCard)}
            </div>
          </div>

          {/* Group E: Semantic Status Colors */}
          <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-color-success" />
              Semantic Status Colors (Solid Emerald, Sky, Warm Coral, Error Red)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {semantics.map(renderTokenCard)}
            </div>
          </div>
        </section>

        {/* SECTION 2: TYPOGRAPHY SCALE */}
        <section className="mb-16">
          <div className="border-b border-border-subtle pb-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-heading font-heading">
              2. Typography System & Font Scale
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Engineered with <span className="font-bold text-brand-primary">Inter / Outfit</span> with crisp weights and solid colors.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border-subtle shadow-sm">
            <div className="overflow-x-auto border border-border-subtle rounded-2xl bg-surface-subtle">
              <table className="w-full border-collapse text-left text-sm text-text-heading">
                <thead>
                  <tr className="border-b border-border-subtle bg-surface-elevated font-bold text-[11px] uppercase tracking-wider text-text-muted">
                    <th className="p-3.5">Element</th>
                    <th className="p-3.5">Weight</th>
                    <th className="p-3.5">Utility Class</th>
                    <th className="p-3.5">Live Sample</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {TYPOGRAPHY_SCALE.map((row) => (
                    <tr key={row.element} className="hover:bg-surface transition-colors">
                      <td className="p-3.5 font-bold">{row.element}</td>
                      <td className="p-3.5 font-mono text-xs">{row.weight}</td>
                      <td className="p-3.5 font-mono text-xs text-brand-primary">{row.utility}</td>
                      <td className="p-3.5">
                        <span className={`${row.utility} text-text-heading`}>
                          Aa Quick Fox
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 3: COMPONENT DEMOS & INTERACTIVE CODE INSPECTOR */}
        <section className="mb-16">
          <div className="border-b border-border-subtle pb-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-heading font-heading">
              3. Interactive Component Playground
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Select any component to inspect its JSX code and copy it directly to your clipboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Cols: Component Gallery */}
            <div className="lg:col-span-2 space-y-6">
              {/* Buttons */}
              <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Button Variants (Solid Colors, Zero Gradients)
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedComponent("button-primary")}
                    className={`px-5 py-2.5 bg-brand-primary hover:bg-brand-hover text-brand-on-primary font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                      selectedComponent === "button-primary" ? "ring-2 ring-brand-primary ring-offset-2" : ""
                    }`}
                  >
                    Primary Action
                  </button>

                  <button
                    onClick={() => setSelectedComponent("button-secondary")}
                    className={`px-5 py-2.5 bg-surface-elevated hover:bg-surface-subtle text-text-heading font-bold rounded-xl transition-all duration-200 border border-border-subtle cursor-pointer ${
                      selectedComponent === "button-secondary" ? "ring-2 ring-brand-primary ring-offset-2" : ""
                    }`}
                  >
                    Secondary Action
                  </button>

                  <button
                    onClick={() => setSelectedComponent("button-outline")}
                    className={`px-5 py-2.5 bg-transparent hover:bg-surface-elevated text-text-heading font-bold rounded-xl transition-all duration-200 border-2 border-brand-primary cursor-pointer active:scale-95 ${
                      selectedComponent === "button-outline" ? "ring-2 ring-brand-primary ring-offset-2" : ""
                    }`}
                  >
                    Outline Action
                  </button>

                  <button
                    onClick={() => setSelectedComponent("button-error")}
                    className={`px-5 py-2.5 bg-color-error text-white font-bold rounded-xl transition-all duration-200 shadow-sm cursor-pointer ${
                      selectedComponent === "button-error" ? "ring-2 ring-brand-primary ring-offset-2" : ""
                    }`}
                  >
                    Danger Action
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Status Badges & Pills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "badge-feature", label: "⚡ Core Feature", class: "bg-brand-subtle text-brand-subtle-text border border-brand-primary/30" },
                    { id: "badge-success", label: "🟢 Production Ready", class: "bg-color-success/10 text-color-success border border-color-success/30" },
                    { id: "badge-info", label: "ℹ️ Architecture Spec", class: "bg-color-info/10 text-color-info border border-color-info/30" },
                    { id: "badge-warning", label: "⚠️ Critical Metric", class: "bg-color-warning/10 text-color-warning border border-color-warning/30" },
                  ].map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedComponent(b.id)}
                      className={`cursor-pointer px-3.5 py-1.5 rounded-full transition-all text-xs font-mono font-bold ${b.class} ${
                        selectedComponent === b.id ? "ring-2 ring-brand-primary" : ""
                      }`}
                    >
                      {b.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Callouts */}
              <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Alert & Callout Cards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "alert-info", icon: "💡", title: "Solid Design Tokens", border: "border-color-info/30", bg: "bg-color-info/10", text: "text-color-info" },
                    { id: "alert-success", icon: "✅", title: "Production Verified", border: "border-color-success/30", bg: "bg-color-success/10", text: "text-color-success" },
                    { id: "alert-error", icon: "❌", title: "Execution Error", border: "border-color-error/30", bg: "bg-color-error/10", text: "text-color-error" },
                  ].map((a) => (
                    <div
                      key={a.id}
                      onClick={() => setSelectedComponent(a.id)}
                      className={`cursor-pointer p-4 rounded-xl border ${a.border} ${a.bg} transition-all ${
                        selectedComponent === a.id ? "ring-2 ring-brand-primary shadow-sm" : ""
                      }`}
                    >
                      <span className="text-lg">{a.icon}</span>
                      <h5 className={`font-bold text-xs mt-1 ${a.text}`}>{a.title}</h5>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layout Container Card */}
              <div className="p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Interactive Layout Card
                </h3>
                <div
                  onClick={() => setSelectedComponent("card-interactive")}
                  className={`cursor-pointer p-6 rounded-2xl bg-surface border border-border-subtle hover:border-brand-primary shadow-sm transition-all duration-300 max-w-md ${
                    selectedComponent === "card-interactive" ? "ring-2 ring-brand-primary" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border-subtle flex items-center justify-center text-brand-primary mb-3 font-bold">
                    ⚡
                  </div>
                  <h4 className="font-bold text-lg text-text-heading">
                    Distributed Architecture
                  </h4>
                  <p className="text-xs text-text-body mt-1 leading-relaxed">
                    Solid semantic tokens ensure pixel-perfect readability and consistency across all viewports.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Code Inspector */}
            <div className="flex flex-col p-6 rounded-2xl bg-surface border border-border-subtle shadow-sm max-h-[620px]">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-brand-primary" />
                  <h3 className="text-xs font-bold text-text-heading uppercase tracking-wider">
                    JSX Code Inspector
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard(getActiveComponentCode(), "jsx-snippet")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-surface-elevated hover:bg-surface-subtle text-text-heading border border-border-subtle rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSX</span>
                </button>
              </div>

              <div className="flex-1 bg-surface-subtle p-4 rounded-xl overflow-auto border border-border-subtle font-mono">
                <pre className="text-xs text-text-heading whitespace-pre-wrap leading-relaxed">
                  {getActiveComponentCode()}
                </pre>
              </div>

              <div className="mt-4 p-3 bg-surface-elevated border border-border-subtle rounded-xl text-[11px] text-text-muted leading-relaxed">
                💡 Solid tokens map directly to unified CSS variables: <code className="font-bold text-brand-primary">var(--brand-primary)</code>, <code className="font-bold text-brand-primary">var(--bg-surface)</code>.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: LINK TO SKELETON GALLERY */}
        <section className="p-8 sm:p-10 rounded-3xl bg-surface border border-border-subtle shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-subtle text-brand-subtle-text rounded-full border border-brand-primary/30">
              Responsive Loading Skeletons
            </span>
            <h3 className="text-2xl font-bold text-text-heading font-heading">
              10 Full-Page Skeleton Screens
            </h3>
            <p className="text-sm text-text-body max-w-xl leading-relaxed">
              Explore the dedicated skeleton preview gallery containing live loading mocks for Dashboard, Lessons, Roadmaps, Interviews, and Engineering Notes.
            </p>
          </div>
          <Link
            href="/design-system/skeletons"
            className="px-6 py-3 rounded-xl font-bold text-sm bg-brand-primary hover:bg-brand-hover text-brand-on-primary shadow-sm transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            <span>Open Skeleton Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* Global Feedback Banner */}
        {copiedText && (
          <div className="fixed bottom-6 right-6 px-4 py-3 rounded-xl bg-surface-elevated text-text-heading text-xs font-bold border border-border-strong shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300 z-50">
            <Check className="w-4 h-4 text-color-success" />
            <span>Copied <span className="text-brand-primary">&quot;{copiedText}&quot;</span> to clipboard!</span>
          </div>
        )}
      </main>
    </InteractiveGrid>
  );
}
