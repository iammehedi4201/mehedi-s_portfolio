"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  FileText,
  ExternalLink,
  Download,
  Copy,
  Check,
  RefreshCw,
  CloudUpload,
  CheckCircle2,
  FileCheck,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function CVManagerPage() {
  const [cvUrl, setCvUrl] = useState("/Mehedi_Hasan_CV.pdf");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/cv", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.cvUrl) {
          setCvUrl(json.cvUrl);
        }
      })
      .catch(() => toast.error("Failed to load CV configuration"))
      .finally(() => setLoading(false));
  }, []);

  const uploadPdfFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a valid PDF document (.pdf)");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading new CV PDF to portfolio...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", "cv");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success) {
        const timestampedUrl = `${json.url}?t=${Date.now()}`;
        setCvUrl(timestampedUrl);
        setIframeKey((prev) => prev + 1);

        // Auto-save the new link in settings
        await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvUrl: json.url }),
        });

        toast.dismiss(toastId);
        toast.success("New CV uploaded and published successfully!");
      } else {
        toast.dismiss(toastId);
        toast.error(json.error || "Failed to upload CV");
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Network error during file upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPdfFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadPdfFile(file);
  }, []);

  const handleCopyLink = () => {
    const cleanUrl = cvUrl.split("?")[0];
    const fullUrl = cleanUrl.startsWith("http")
      ? cleanUrl
      : `${window.location.origin}${cleanUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Public CV link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanDisplayUrl = cvUrl.split("?")[0];
  const cleanFileName = cleanDisplayUrl.split("/").pop() || "Mehedi_Hasan_CV.pdf";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-72 gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
        <p className="text-xs text-muted-foreground">Loading CV configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full h-full flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Header Row — Balanced & Clean */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-heading font-bold text-foreground tracking-tight">
              CV Manager
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live on Portfolio
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your public portfolio resume document, upload revisions, and view real-time preview.
          </p>
        </div>

        {/* Global Resource Indicator Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle text-xs">
          <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
          <span className="text-muted-foreground">Linked File:</span>
          <span className="font-mono text-foreground font-medium">{cleanDisplayUrl}</span>
        </div>
      </div>

      {/* Dual Studio Workspace — Equal Height Columns (4-col Left / 8-col Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch flex-1 min-h-0 w-full">
        {/* LEFT COLUMN: Unified Management Studio Panel */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
          <Card className="bg-surface border-border-subtle rounded-2xl overflow-hidden shadow-card flex flex-col h-[calc(100vh-190px)] min-h-[500px]">
            {/* Matching Panel Header */}
            <div className="h-12 px-4 py-3 border-b border-border-subtle bg-surface-elevated flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-brand-primary" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Resume Controls
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Publicly Active
              </span>
            </div>

            {/* Panel Body: Cohesive, structured, zero awkward voids */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto justify-between">
              {/* Section 1: Active Document Info & Primary Actions */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-surface-elevated/70 border border-border-subtle">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center text-red-400 shrink-0">
                      <FileText className="h-4 w-4" />
                      <span className="text-[8px] font-bold tracking-wider uppercase -mt-0.5">PDF</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-bold text-foreground truncate" title={cleanFileName}>
                          {cleanFileName}
                        </h3>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-surface-subtle text-muted-foreground border border-border-subtle shrink-0">
                          194.7 KB
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>Verified Antopolis &amp; VIPB AMC</span>
                      </p>
                    </div>
                  </div>

                  {/* Immediate Action Buttons (Download & Copy Link directly connected to file) */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border-subtle">
                    <Button
                      type="button"
                      size="sm"
                      asChild
                      className="h-8 text-xs font-semibold bg-brand-primary hover:bg-brand-hover text-brand-on-primary transition-colors"
                    >
                      <a href={cvUrl} download={cleanFileName}>
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                      </a>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                      className="h-8 text-xs border-border-subtle hover:bg-surface-elevated text-foreground"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Section 2: Flex-Stretching Drag & Drop Upload Zone (Takes available space seamlessly) */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 min-h-[170px] border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? "border-brand-primary bg-brand-primary/10 scale-[1.01]"
                    : "border-border-subtle bg-surface-subtle/30 hover:bg-surface-elevated/80 hover:border-brand-primary/50"
                }`}
              >
                <div className="w-11 h-11 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary transition-transform group-hover:scale-105">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-primary" />
                  ) : (
                    <CloudUpload className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    {uploading ? "Uploading & Publishing..." : "Upload New Resume PDF"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Drag &amp; drop file here, or <span className="text-brand-primary font-semibold underline">browse</span>
                  </p>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground bg-surface-subtle px-2 py-0.5 rounded-full border border-border-subtle">
                  Overwrites live portfolio CV • Max 10MB
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Live Document Viewer Panel */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col">
          <Card className="bg-surface border-border-subtle rounded-2xl overflow-hidden shadow-card flex flex-col h-[calc(100vh-190px)] min-h-[500px]">
            {/* Matching Toolbar Header */}
            <div className="h-12 px-4 py-3 border-b border-border-subtle bg-surface-elevated flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-brand-primary" />
                <span className="text-xs font-bold text-foreground">Live Document Preview</span>
                <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
                  ({cleanDisplayUrl})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-subtle px-2"
                  onClick={() => setIframeKey((prev) => prev + 1)}
                  title="Reload preview"
                >
                  <RefreshCw className="mr-1.5 h-3 w-3" /> Refresh
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-subtle px-2"
                  title="Open full screen in new tab"
                >
                  <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1.5 h-3 w-3" /> Full Screen
                  </a>
                </Button>
              </div>
            </div>

            {/* PDF Viewer Frame — Soothing warm off-white canvas with dark theme backdrop */}
            <div className="flex-1 w-full bg-[#1e1e22] relative overflow-hidden">
              <iframe
                key={`${cvUrl}-${iframeKey}`}
                src={`${cvUrl}#toolbar=0&navpanes=0&view=Fit`}
                title="Mehedi Hasan CV Preview"
                className="w-full h-full border-0 absolute inset-0"
                style={{
                  filter: "sepia(0.24) brightness(0.92) contrast(1.02)",
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
