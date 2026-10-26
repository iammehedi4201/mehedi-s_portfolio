"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sparkles,
  Check,
  RefreshCw,
  Save,
  Palette,
  Layers,
  Sliders,
  ExternalLink,
  Code2,
  Copy,
  FolderKanban,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import {
  DEFAULT_THEMES,
  ThemePreset,
  THEME_STORAGE_KEY,
  applyThemeToDocument,
  createCustomTheme,
} from "@/lib/theme";

export default function DashboardDesignSystemPage() {
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(DEFAULT_THEMES[0]);
  const [customHex, setCustomHex] = useState("#E5A00D");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try reading from localStorage first
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.primary) {
          setActiveTheme(parsed);
          setCustomHex(parsed.primary);
          applyThemeToDocument(parsed);
          return;
        }
      }
    } catch {
      // Ignore localStorage parse error
    }

    // 2. Fallback to API if not in storage
    fetch("/api/theme")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.theme) {
          setActiveTheme(json.theme);
          setCustomHex(json.theme.primary);
          applyThemeToDocument(json.theme);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectPreset = (preset: ThemePreset) => {
    setActiveTheme(preset);
    setCustomHex(preset.primary);
    applyThemeToDocument(preset);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preset));
    } catch {}
    toast.success(`Theme updated to ${preset.name}!`);
  };

  const handleApplyCustomHex = (hex: string) => {
    if (!/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex)) {
      toast.error("Please enter a valid HEX color (e.g. #3B82F6)");
      return;
    }
    const cleanHex = hex.startsWith("#") ? hex : `#${hex}`;
    const newTheme = createCustomTheme(cleanHex, "Custom Theme");
    setActiveTheme(newTheme);
    setCustomHex(cleanHex);
    applyThemeToDocument(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme));
    } catch {}
    toast.success(`Custom color applied: ${cleanHex}`);
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Saving theme configuration to portfolio...");
    try {
      const res = await fetch("/api/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeTheme),
      });
      const json = await res.json();
      if (json.success) {
        toast.dismiss(toastId);
        toast.success("Theme permanently saved as live portfolio default!");
      } else {
        toast.dismiss(toastId);
        toast.error("Failed to save theme to server");
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Network error while saving theme");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    const defaultTheme = DEFAULT_THEMES[0];
    setActiveTheme(defaultTheme);
    setCustomHex(defaultTheme.primary);
    applyThemeToDocument(defaultTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(defaultTheme));
    } catch {}
    toast.success("Reset to default Signal Gold theme!");
  };

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(label);
    toast.success(`Copied ${label}`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">
              Design System &amp; Theme
            </h1>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border transition-all"
              style={{
                backgroundColor: activeTheme.subtle,
                color: activeTheme.primary,
                borderColor: `${activeTheme.primary}40`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: activeTheme.primary }}
              />
              {activeTheme.name} ({activeTheme.primary})
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Switch your primary brand color, preview live interactive UI components, and save default accents across your dashboard and portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefault}
            className="h-9 text-xs border-border-subtle hover:bg-surface-elevated text-foreground"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset Default
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSaveToServer}
            disabled={isSaving}
            className="h-9 text-xs font-semibold px-4 transition-colors"
            style={{
              backgroundColor: activeTheme.primary,
              color: activeTheme.onPrimary,
            }}
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save as Default Theme"}
          </Button>
        </div>
      </div>

      {/* Main Feature: Primary Color Customizer Studio */}
      <Card className="bg-surface border-border-subtle rounded-2xl p-5 sm:p-6 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" style={{ color: activeTheme.primary }} />
              <h2 className="text-lg font-heading font-bold text-foreground">
                Primary Brand Accent Color
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select any curated preset below or input your own custom HEX color. Changes apply instantly across the whole application.
            </p>
          </div>

          {/* Custom Hex Picker Input */}
          <div className="flex items-center gap-2 bg-surface-subtle border border-border-subtle rounded-xl p-1.5">
            <input
              type="color"
              value={customHex.startsWith("#") ? customHex : `#${customHex}`}
              onChange={(e) => {
                setCustomHex(e.target.value);
                handleApplyCustomHex(e.target.value);
              }}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
              title="Click to open color picker"
            />
            <span className="text-xs font-mono text-muted-foreground">HEX:</span>
            <input
              type="text"
              value={customHex}
              onChange={(e) => setCustomHex(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApplyCustomHex(customHex);
              }}
              placeholder="#E5A00D"
              className="w-24 bg-surface border border-border-subtle rounded-lg px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:border-brand-primary"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => handleApplyCustomHex(customHex)}
              className="h-7 text-xs font-semibold px-2.5 transition-colors"
              style={{
                backgroundColor: activeTheme.primary,
                color: activeTheme.onPrimary,
              }}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Preset Color Swatches Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {DEFAULT_THEMES.map((preset) => {
            const isSelected = activeTheme.primary.toLowerCase() === preset.primary.toLowerCase();
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition-all duration-200 group ${
                  isSelected
                    ? "border-2 bg-surface-elevated scale-[1.03] shadow-md"
                    : "border-border-subtle bg-surface-subtle/50 hover:bg-surface-elevated hover:border-border-strong"
                }`}
                style={{
                  borderColor: isSelected ? preset.primary : undefined,
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm relative mb-2"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && (
                    <Check
                      className="h-5 w-5 font-bold"
                      style={{ color: preset.onPrimary }}
                    />
                  )}
                </div>
                <div className="w-full">
                  <p className="text-xs font-bold text-foreground truncate">{preset.name.split(" ")[0]}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{preset.primary}</p>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Live Component Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Interactive Components Showcase */}
        <div className="lg:col-span-7 flex flex-col">
          <Card className="bg-surface border-border-subtle rounded-2xl p-5 sm:p-6 shadow-card flex-1 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4" style={{ color: activeTheme.primary }} />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Live Component Previews
                </h3>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Tokens automatically bound
              </span>
            </div>

            {/* Buttons Showcase */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Action Buttons</label>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  style={{
                    backgroundColor: activeTheme.primary,
                    color: activeTheme.onPrimary,
                  }}
                >
                  Primary Action
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95"
                  style={{
                    borderColor: activeTheme.primary,
                    color: activeTheme.primary,
                    backgroundColor: "transparent",
                  }}
                >
                  Outline Action
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{
                    backgroundColor: activeTheme.subtle,
                    color: activeTheme.primary,
                  }}
                >
                  Subtle Action
                </button>
              </div>
            </div>

            {/* Badges & Pills Showcase */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Badges &amp; Status Indicators</label>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: activeTheme.subtle,
                    color: activeTheme.primary,
                    borderColor: `${activeTheme.primary}40`,
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured Badge
                </span>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: activeTheme.subtle,
                    color: activeTheme.primary,
                    borderColor: `${activeTheme.primary}30`,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: activeTheme.primary }}
                  />
                  Live Indicator
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-surface-subtle border border-border-subtle text-foreground">
                  tag: <span style={{ color: activeTheme.primary }}>Next.js 14</span>
                </span>
              </div>
            </div>

            {/* Interactive Card with Brand Hover Border */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Interactive Card Accent</label>
              <div
                className="p-4 rounded-xl border bg-surface-elevated/70 transition-all duration-200"
                style={{
                  borderLeftColor: activeTheme.primary,
                  borderLeftWidth: "4px",
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">Next-Gen Full Stack Portfolio</h4>
                  <span
                    className="text-[11px] font-semibold"
                    style={{ color: activeTheme.primary }}
                  >
                    Active Project
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Engineered with Next.js, React, Express.js, MongoDB, and customized solid design tokens.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Active CSS Variables Reference */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="bg-surface border-border-subtle rounded-2xl p-5 sm:p-6 shadow-card flex-1 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4" style={{ color: activeTheme.primary }} />
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Active CSS Variables
                </h3>
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">:root &amp; .dark</span>
            </div>

            <p className="text-xs text-muted-foreground">
              These variables are updated globally in the DOM and applied instantly across all Tailwind classes.
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { label: "--brand-primary", val: activeTheme.primary, color: activeTheme.primary },
                { label: "--brand-hover", val: activeTheme.hover, color: activeTheme.hover },
                { label: "--brand-subtle", val: activeTheme.subtle, color: activeTheme.subtle },
                { label: "--brand-on-primary", val: activeTheme.onPrimary, color: activeTheme.onPrimary },
                { label: "--primary (HSL)", val: activeTheme.hsl },
              ].map((token) => (
                <div
                  key={token.label}
                  onClick={() => copyCode(`${token.label}: ${token.val};`, token.label)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-subtle border border-border-subtle hover:bg-surface-elevated cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {token.color && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: token.color }}
                      />
                    )}
                    <span className="text-muted-foreground truncate">{token.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-foreground font-semibold">{token.val}</span>
                    <Copy className="h-3 w-3 text-muted-foreground group-hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity ml-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="p-3 rounded-xl bg-surface-subtle/50 border border-border-subtle text-[11px] text-muted-foreground leading-relaxed">
                💡 <span className="font-semibold text-foreground">Persistent Sync:</span> The selected color is stored in localStorage and synchronized with the server so all portfolio visitors see your chosen brand color.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
