"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Save, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CV_CATEGORIES = [
  { id: "frontend", label: "Frontend Developer" },
  { id: "backend", label: "Backend Developer" },
  { id: "fullstack", label: "Fullstack Developer" },
  { id: "mernstack", label: "MERN Stack Developer" },
  { id: "react", label: "React Developer" },
] as const;

type CvCategory = typeof CV_CATEGORIES[number]["id"];

export default function CVManagerPage() {
  const [cvUrl, setCvUrl] = useState(""); // The active one
  const [activeCategory, setActiveCategory] = useState(""); // The ID of selected category
  const [cvLinks, setCvLinks] = useState<Record<CvCategory, string>>({
    frontend: "",
    backend: "",
    fullstack: "",
    mernstack: "",
    react: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/cv")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCvUrl(json.cvUrl || "");
          setActiveCategory(json.activeCategory || "");
          if (json.cvLinks) setCvLinks(json.cvLinks);
        }
      })
      .catch(() => toast.error("Failed to fetch CV"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvUrl, cvLinks, activeCategory }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("CV settings updated");
      } else {
        toast.error(json.error || "Failed to update CV");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const selectActive = (catId: CvCategory) => {
    const url = cvLinks[catId];
    if (!url) {
      toast.error("Please provide a URL first");
      return;
    }
    if (activeCategory === catId) {
      // Unselect current category
      setActiveCategory("");
      setCvUrl("");
      toast.success("CV unselected. Click Save to persist the change.");
      return;
    }

    setCvUrl(url);
    setActiveCategory(catId);
    toast.success(`${catId} CV selected. Don't forget to Save!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-heading font-bold">CV Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage multiple CV versions and select which one to show on your portfolio.
          </p>
        </div>
        <Button onClick={handleUpdate} disabled={saving} size="sm" className="hidden md:flex">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-dash-card border-white/[0.06]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-500" /> Currently Active CV
                </div>
                {cvUrl ? (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                    Published
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                    None Selected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  readOnly
                  placeholder="Select a category CV below to set as active..."
                  value={cvUrl}
                  className="bg-black/20 border-white/[0.05] text-muted-foreground italic"
                />
                {cvUrl && (
                  <Button type="button" variant="outline" size="icon" asChild>
                    <a href={cvUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {CV_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={cn(
                "bg-dash-card/50 border-white/[0.04] transition-all",
                activeCategory === cat.id ? "border-emerald-500/30 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]" : ""
              )}>
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                  <Label className="text-sm font-semibold">{cat.label}</Label>
                  {activeCategory === cat.id && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Paste link here..."
                        value={cvLinks[cat.id] || ""}
                        onChange={(e) => setCvLinks({ ...cvLinks, [cat.id]: e.target.value })}
                        className="text-xs h-9 pr-14"
                      />
                      <div className="absolute right-0 top-0 h-full flex items-center pr-2 gap-1.5">
                        {cvLinks[cat.id] && (
                          <a 
                            href={cvLinks[cat.id]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors p-1"
                            title="Preview Link"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={activeCategory === cat.id ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => selectActive(cat.id)}
                      className="h-9 whitespace-nowrap text-xs"
                      disabled={!cvLinks[cat.id]}
                    >
                      {activeCategory === cat.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                  {cvLinks[cat.id] && (
                    <div className="mt-2 space-y-2">
                      <div className="bg-black/30 border border-white/5 rounded-md p-2 flex items-center justify-between group overflow-hidden">
                        <div className="flex items-center gap-2 truncate">
                          <div className="bg-primary/10 p-1.5 rounded text-primary">
                            <ExternalLink className="h-3 w-3" />
                          </div>
                          <span className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                            {cvLinks[cat.id]}
                          </span>
                        </div>
                        <a 
                          href={cvLinks[cat.id]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] bg-primary/20 hover:bg-primary text-primary hover:text-white px-2 py-1 rounded transition-all font-medium flex items-center gap-1"
                        >
                          Preview <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                      
                      {/* CV Thumbnail Visualizer - Styled like Google Drive Card */}
                      <div className="relative aspect-[4/3] w-full bg-[#E8F0FE] rounded-xl overflow-hidden shadow-sm border border-[#D2E3FC] p-4 group/preview">
                        {/* Status bar mock */}
                        <div className="absolute top-3 left-4 right-4 flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-[#EA4335] p-1 rounded text-white shadow-sm">
                              <FileText className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-[11px] font-medium text-[#1A73E8] truncate max-w-[120px]">
                              Mehedi&apos;s CV.pdf
                            </span>
                          </div>
                          <div className="bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20 p-1.5 rounded-full text-[#1A73E8] transition-colors cursor-pointer">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                          </div>
                        </div>

                        {/* White Paper Mock with actual Iframe */}
                        <div className="mt-8 w-full h-[180%] bg-white rounded-t-sm shadow-md overflow-hidden ring-1 ring-black/5">
                          {cvLinks[cat.id].includes('drive.google.com') ? (
                            <iframe 
                              src={cvLinks[cat.id].replace('/view', '/preview')} 
                              className="w-full h-full border-0 pointer-events-none opacity-90 group-hover/preview:opacity-100 transition-opacity"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-x-4 top-12 bottom-4 flex flex-col items-center justify-center text-center p-4 bg-white">
                                <FileText className="h-10 w-10 text-[#EA4335] mb-2" />
                                <p className="text-[11px] text-[#5F6368] font-medium px-4">Previewing External Link...</p>
                            </div>
                          )}
                        </div>

                        {/* Overlay to prevent interaction with iframe inside card */}
                        <div className="absolute inset-0 z-10" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex md:hidden justify-end">
          <Button onClick={handleUpdate} disabled={saving} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
