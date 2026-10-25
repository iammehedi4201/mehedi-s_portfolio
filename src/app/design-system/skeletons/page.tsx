"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LessonSkeleton } from "@/components/curriculum/LessonSkeleton";
import { RevisionSkeleton } from "@/components/revision/RevisionSkeleton";
import { TrackPracticeSkeleton } from "@/components/interview/TrackPracticeSkeleton";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { TopicCurriculumSkeleton } from "@/components/curriculum/TopicCurriculumSkeleton";
import { NotesSkeleton } from "@/components/notes/NotesSkeleton";
import { InterviewHubSkeleton } from "@/components/interview/InterviewHubSkeleton";
import { TrackBrowseSkeleton } from "@/components/interview/TrackBrowseSkeleton";
import { MockInterviewSkeleton } from "@/components/interview/MockInterviewSkeleton";
import { RoadmapsSkeleton } from "@/components/roadmap/RoadmapsSkeleton";
import { ArrowLeft } from "lucide-react";

type SkeletonType =
  | "lesson"
  | "flashcards-revision"
  | "flashcards-interview"
  | "dashboard"
  | "topic-curriculum"
  | "notes"
  | "interview-hub"
  | "interview-browse"
  | "mock-interview"
  | "roadmaps";

const SKELETON_ITEMS: {
  id: SkeletonType;
  label: string;
  tag: string;
  description: string;
}[] = [
  {
    id: "lesson",
    label: "Lesson Page",
    tag: "Updated: No Yellow",
    description:
      "2-column layout: 7-part module stepper sidebar + main concept card with dark glassmorphic callout, architecture table & code editor mockup.",
  },
  {
    id: "flashcards-revision",
    label: "Flashcards (Revision)",
    tag: "Flashcards Page",
    description:
      "Active recall flashcard view: progress bar, 3D flip card placeholder, question heading, and 4 SM-2 interval grading buttons.",
  },
  {
    id: "flashcards-interview",
    label: "Flashcards (Interview)",
    tag: "Interview Prep",
    description:
      "Technical interview practice flashcard: topic progress header, difficulty pill, question prompt, code snippet & SM-2 answer reveal.",
  },
  {
    id: "dashboard",
    label: "Dashboard",
    tag: "Core Analytics",
    description:
      "Hero telemetry card, continue learning recommendation, XP progression line chart, track mastery donut, and 52-week activity heatmap.",
  },
  {
    id: "topic-curriculum",
    label: "Topic Curriculum",
    tag: "Curriculum Hub",
    description:
      "Exact 1:1 match with CurriculumPath: Course header, Prerequisites checklist card, Current step spotlight, Current phase with lesson rows, Roadmap toggle, and Capstone card.",
  },
  {
    id: "notes",
    label: "Study Notes",
    tag: "Engineering Notes",
    description:
      "Top header with count badge, + New Note CTA, search bar, unified subtle filter chips, and 6-card masonry note grid with code blocks.",
  },
  {
    id: "interview-hub",
    label: "Interview Hub",
    tag: "Interview Center",
    description:
      "SuperMemo SM-2 banner, 4 quick stats cards (Total, Due, Mastered, Mastery), search input, and 6 interview topic cards with mastery bars.",
  },
  {
    id: "interview-browse",
    label: "Browse Q&A",
    tag: "Q&A Repository",
    description:
      "Topic header, search/filter toolbar (difficulty & category), and 5 expandable question accordion items with difficulty badges.",
  },
  {
    id: "mock-interview",
    label: "Mock Interview",
    tag: "Timed Simulator",
    description:
      "Header banner, track selector grid, question count selector (5/10/15/20), timer options (Untimed/30s/60s/90s), and Start button.",
  },
  {
    id: "roadmaps",
    label: "Roadmaps Hub",
    tag: "Skill Tracks",
    description:
      "Learning Roadmaps hero, category filter tabs row (Frontend, Backend, Database...), search input, and 8 skill cards matching SkillCard dimensions.",
  },
];

function SkeletonGalleryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") as SkeletonType | null;

  const [selectedSkeleton, setSelectedSkeleton] = useState<SkeletonType>(
    tabParam && SKELETON_ITEMS.some((s) => s.id === tabParam)
      ? tabParam
      : "lesson"
  );

  useEffect(() => {
    if (tabParam && SKELETON_ITEMS.some((s) => s.id === tabParam)) {
      setSelectedSkeleton(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (id: SkeletonType) => {
    setSelectedSkeleton(id);
    router.replace(`/design-system/skeletons?tab=${id}`, { scroll: false });
  };

  const currentItem = SKELETON_ITEMS.find((s) => s.id === selectedSkeleton) || SKELETON_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans">
      {/* Top Preview Control Bar */}
      <header className="sticky top-0 z-50 bg-[#0E121B]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <Link
                href="/design-system"
                className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  LearnCraft Skeleton Design System Preview
                </h1>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 font-bold">
                Design System Audit
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <div>
                Displaying: <span className="text-purple-300 font-bold">{currentItem.label}</span>
              </div>
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
              >
                Portfolio Home
              </Link>
            </div>
          </div>

          {/* Navigation Pills for all 10 Skeletons */}
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-thin">
            {SKELETON_ITEMS.map((item) => {
              const isSelected = selectedSkeleton === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25 scale-[1.02]"
                      : "bg-white/[0.03] text-slate-300 border-white/[0.06] hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === "lesson" && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-200 border border-purple-400/30 font-mono">
                      No Yellow
                    </span>
                  )}
                  {item.id.startsWith("flashcards") && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.1] text-slate-300 font-mono">
                      Flashcard
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Description banner */}
          <div className="py-2 text-xs text-slate-400 flex items-center gap-2">
            <span className="text-purple-400">ℹ</span>
            <span>{currentItem.description}</span>
          </div>
        </div>
      </header>

      {/* Rendered Skeleton Preview Window */}
      <div className="flex-1 w-full bg-[#07090E] py-8">
        {selectedSkeleton === "lesson" && <LessonSkeleton />}
        {selectedSkeleton === "flashcards-revision" && <RevisionSkeleton />}
        {selectedSkeleton === "flashcards-interview" && <TrackPracticeSkeleton />}
        {selectedSkeleton === "dashboard" && <DashboardSkeleton />}
        {selectedSkeleton === "topic-curriculum" && <TopicCurriculumSkeleton />}
        {selectedSkeleton === "notes" && <NotesSkeleton />}
        {selectedSkeleton === "interview-hub" && <InterviewHubSkeleton />}
        {selectedSkeleton === "interview-browse" && <TrackBrowseSkeleton />}
        {selectedSkeleton === "mock-interview" && <MockInterviewSkeleton />}
        {selectedSkeleton === "roadmaps" && <RoadmapsSkeleton />}
      </div>
    </div>
  );
}

export default function SkeletonPreviewGallery(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07090E] p-8 text-white">Loading Gallery...</div>}>
      <SkeletonGalleryContent />
    </Suspense>
  );
}
