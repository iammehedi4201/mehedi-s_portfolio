"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { SectionWrapper, SectionHeading } from "@/components/section-wrapper";
import { Briefcase, GraduationCap, Building2, Calendar, MapPin, CheckCircle2 } from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  company: string;
  location?: string;
  description: string;
  type: "work" | "education";
  skills?: string[];
}

const timelineItems: TimelineItem[] = [
  {
    year: "Oct 2024 — Sep 2026",
    title: "Software Engineer",
    company: "Antopolis",
    location: "Dhaka, Bangladesh",
    description:
      "Contributed as a core member of the development team, working on scalable web applications using Next.js, React, shadcn/ui, Express.js, and MongoDB. Planned and built real-world product features, dynamic CMS, admin dashboards, and customer-facing platforms with clean architecture and continuous integration workflows.",
    type: "work",
    skills: ["Next.js", "React", "Express.js", "MongoDB", "Clean Architecture"],
  },
  {
    year: "Apr 2024 — May 2024",
    title: "Full Stack Developer Intern",
    company: "Qwik IT",
    location: "Dhaka, Bangladesh",
    description:
      "Completed a full-stack development internship gaining practical experience building and maintaining web applications. Worked with frontend and backend technologies to implement application features and support development tasks.",
    type: "work",
    skills: ["Full Stack Development", "Web Applications", "Feature Implementation"],
  },
  {
    year: "2019 — 2023",
    title: "BSc in Computer Science and Engineering",
    company: "Daffodil International University",
    location: "CGPA 3.54 / 4.00",
    description:
      "Graduated with a CGPA of 3.54 / 4.00. Specialized in software engineering, algorithms, database systems, object-oriented programming, and modern web application development.",
    type: "education",
    skills: ["Software Engineering", "Algorithms", "Database Systems", "OOP"],
  },
];

/** Sleek Stylized Vector Rocket facing +X (0deg = Right) */
function RocketShip({ isMoving }: { isMoving: boolean }) {
  return (
    <div className="relative flex items-center justify-center filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
      {/* Dynamic Thruster Exhaust Plume */}
      <div
        className={`absolute -left-3 w-7 h-7 rounded-full bg-brand-primary/30 blur-xs pointer-events-none -z-10 transition-all duration-200 ${
          isMoving ? "opacity-100 scale-125" : "opacity-45 scale-95"
        }`}
      />

      <svg
        viewBox="0 0 44 44"
        className="w-8 h-8 md:w-9 md:h-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Thruster Flame with double pulse */}
        <g className="animate-pulse">
          <path
            d="M5 22 C8 18.5, 14 19.5, 16 22 C14 24.5, 8 25.5, 5 22 Z"
            fill="var(--brand-primary)"
            opacity="0.95"
          />
          <path
            d="M8 22 C10 20, 13 20, 15 22 C13 24, 10 24, 8 22 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
        </g>

        {/* Thruster Nozzle */}
        <path
          d="M15 19.5 L18 20.5 L18 23.5 L15 24.5 Z"
          fill="#3F3F46"
          stroke="#18181B"
          strokeWidth="0.8"
        />

        {/* Top Wing / Fin */}
        <path
          d="M18 20.5 L22 13 C25 12, 27 13, 27 15 L25 20.5 Z"
          fill="var(--brand-primary)"
          stroke="#18181B"
          strokeWidth="1"
        />

        {/* Bottom Wing / Fin */}
        <path
          d="M18 23.5 L22 31 C25 32, 27 31, 27 29 L25 23.5 Z"
          fill="var(--brand-primary)"
          stroke="#18181B"
          strokeWidth="1"
        />

        {/* Fuselage (Rocket Body) */}
        <path
          d="M17 22 C17 17.5, 25 15.5, 35 22 C25 28.5, 17 26.5, 17 22 Z"
          fill="#F4F4F5"
          stroke="#18181B"
          strokeWidth="1.2"
        />

        {/* Nose Cone Tip */}
        <path
          d="M32 19.8 C34 21, 37 22, 37 22 C37 22, 34 23, 32 24.2 C33 22.8, 33 21.2, 32 19.8 Z"
          fill="var(--brand-primary)"
        />

        {/* Cockpit Porthole Glass Window */}
        <circle
          cx="25"
          cy="22"
          r="2.8"
          fill="#09090B"
          stroke="var(--brand-primary)"
          strokeWidth="1.2"
        />
        <circle cx="24.3" cy="21.3" r="0.75" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  );
}

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileNodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  const [pathD, setPathD] = useState<string>("");
  const [pathLength, setPathLength] = useState<number>(0);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [trailProgress, setTrailProgress] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Hardware-accelerated motion values for coordinates, tangent rotation, and docking opacity
  const rocketX = useMotionValue(-100);
  const rocketY = useMotionValue(-100);
  const rocketRotate = useMotionValue(90);
  const rocketOpacity = useMotionValue(1);

  // Synchronize scroll progress strictly with section boundaries
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 65%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 22,
    mass: 0.15,
    restDelta: 0.0005,
  });

  // Calculate winding path based on actual card geometries
  const updatePath = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      const nodes = mobileNodeRefs.current;
      if (nodes.length < 3 || nodes.some((el) => !el)) return;
      const p0 = {
        x: nodes[0]!.getBoundingClientRect().left + nodes[0]!.getBoundingClientRect().width / 2 - containerRect.left,
        y: nodes[0]!.getBoundingClientRect().top + nodes[0]!.getBoundingClientRect().height / 2 - containerRect.top,
      };
      const p2 = {
        x: nodes[2]!.getBoundingClientRect().left + nodes[2]!.getBoundingClientRect().width / 2 - containerRect.left,
        y: nodes[2]!.getBoundingClientRect().top + nodes[2]!.getBoundingClientRect().height / 2 - containerRect.top,
      };
      setPathD(`M ${p0.x} ${p0.y} L ${p2.x} ${p2.y}`);
      return;
    }

    // Desktop Path: Continuous S-curve winding route connecting Card 0 -> Card 1 -> Card 2
    const cards = cardRefs.current;
    if (cards.length < 3 || cards.some((el) => !el)) return;

    const rect0 = cards[0]!.getBoundingClientRect();
    const rect1 = cards[1]!.getBoundingClientRect();
    const rect2 = cards[2]!.getBoundingClientRect();

    // Key Milestone Coordinates relative to container
    const c0Right = rect0.right - containerRect.left;
    const c0CenterY = rect0.top + rect0.height * 0.5 - containerRect.top;

    const c1CenterX = rect1.left + rect1.width * 0.5 - containerRect.left;
    const c1TopY = rect1.top - containerRect.top;
    const c1BottomY = rect1.bottom - containerRect.top;

    const c2CenterX = rect2.left + rect2.width * 0.5 - containerRect.left;
    const c2TopY = rect2.top - containerRect.top;

    const R = 24; // Smooth corner radius
    const exitOffset = 22; // Small vertical drop before horizontal curve

    const d = [
      // 1. Starts at Card 0 right edge (milestone exit)
      `M ${c0Right} ${c0CenterY}`,

      // 2. Heads right across center gap to Card 1 center line, curves smoothly down
      `L ${c1CenterX - R} ${c0CenterY}`,
      `Q ${c1CenterX} ${c0CenterY}, ${c1CenterX} ${c0CenterY + R}`,

      // 3. Descends down directly into the top of Card 1
      `L ${c1CenterX} ${c1TopY}`,

      // 4. Passes straight down through Card 1 (rocket travels safely behind card at z-10)
      `L ${c1CenterX} ${c1BottomY}`,

      // 5. Exits Card 1 bottom, descends slightly, curves left
      `L ${c1CenterX} ${c1BottomY + exitOffset}`,
      `Q ${c1CenterX} ${c1BottomY + exitOffset + R}, ${c1CenterX - R} ${c1BottomY + exitOffset + R}`,

      // 6. Heads left across center corridor towards Card 2 center line
      `L ${c2CenterX + R} ${c1BottomY + exitOffset + R}`,
      `Q ${c2CenterX} ${c1BottomY + exitOffset + R}, ${c2CenterX} ${c1BottomY + exitOffset + 2 * R}`,

      // 7. Descends down into Card 2 top and docks securely under Card 2 (final milestone destination)
      `L ${c2CenterX} ${c2TopY}`,
      `L ${c2CenterX} ${c2TopY + 32}`,
    ].join(" ");

    setPathD(d);
  }, []);

  // Updates rocket position, tangent angle, and active milestone card
  const updateRocket = useCallback(
    (progress: number) => {
      if (!pathRef.current) return;
      const path = pathRef.current;
      let len = 0;
      try {
        len = path.getTotalLength();
      } catch {
        return;
      }
      if (len <= 0) return;

      const clamped = Math.max(0, Math.min(progress, 1));
      setTrailProgress(clamped);

      const dist = clamped * len;
      const pt = path.getPointAtLength(dist);

      // Tangent angle calculation along path direction
      const delta = 2;
      const pPrev = path.getPointAtLength(Math.max(0, dist - delta));
      const pNext = path.getPointAtLength(Math.min(len, dist + delta));
      const dx = pNext.x - pPrev.x;
      const dy = pNext.y - pPrev.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      rocketX.set(pt.x);
      rocketY.set(pt.y);
      rocketRotate.set(angle);

      // Smoothly fade out rocket as it securely docks under the final milestone card
      if (clamped > 0.92) {
        const fade = Math.max(0, 1 - (clamped - 0.92) / 0.08);
        rocketOpacity.set(fade);
      } else {
        rocketOpacity.set(1);
      }

      // Active milestone determination based on journey progress
      if (clamped < 0.32) {
        setActiveCardIndex(0);
      } else if (clamped < 0.72) {
        setActiveCardIndex(1);
      } else {
        setActiveCardIndex(2);
      }
    },
    [rocketX, rocketY, rocketRotate, rocketOpacity]
  );

  // Recalculate layout on mount, resize, and DOM changes
  useEffect(() => {
    updatePath();

    const handleResize = () => {
      updatePath();
    };

    window.addEventListener("resize", handleResize);

    const ro = new ResizeObserver(() => {
      updatePath();
    });
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, [updatePath]);

  // Measure path total length and initialize rocket position on path change
  useEffect(() => {
    if (!pathRef.current) return;
    try {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
      updateRocket(smoothProgress.get());
    } catch {
      // SVG not yet rendered
    }
  }, [pathD, smoothProgress, updateRocket]);

  // Synchronize rocket coordinates and active state with smooth scroll
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    updateRocket(latest);
    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 180);
  });

  return (
    <SectionWrapper id="timeline">
      <SectionHeading
        badge="Career Trajectory"
        title="Engineering Journey"
        subtitle="A chronological flight path of my professional experience, education, and milestones"
      />

      <div ref={containerRef} className="relative max-w-4xl mx-auto">
        {/* Layer 0: SVG Winding Route & Golden Light Trail (z-0, under cards) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          <defs>
            {/* Mask to cleanly reveal golden dashed trail behind the rocket */}
            {pathD && pathLength > 0 && (
              <mask id="rocket-trail-mask" maskUnits="userSpaceOnUse">
                <path
                  d={pathD}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                  strokeDasharray={pathLength}
                  strokeDashoffset={pathLength * (1 - trailProgress)}
                  strokeLinecap="round"
                />
              </mask>
            )}
          </defs>

          {/* Background Inactive Dashed Path (Subtle) */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
          )}

          {/* Reference Path for Length Measurement */}
          {pathD && (
            <path
              ref={pathRef}
              d={pathD}
              fill="none"
              stroke="transparent"
              strokeWidth="2"
            />
          )}

          {/* Golden Yellow Active Trail (Traces behind the rocket) */}
          {pathD && pathLength > 0 && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--brand-primary)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
              mask="url(#rocket-trail-mask)"
              style={{
                filter: "drop-shadow(0 0 6px rgba(229, 160, 13, 0.5))",
              }}
            />
          )}
        </svg>

        {/* Layer 1: Small Traveling Rocket (z-10, UNDER the cards at z-20) */}
        {!shouldReduceMotion && pathD && (
          <motion.div
            className="absolute top-0 left-0 pointer-events-none z-10"
            style={{
              x: rocketX,
              y: rocketY,
              rotate: rocketRotate,
              opacity: rocketOpacity,
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <RocketShip isMoving={isScrolling} />
          </motion.div>
        )}

        {/* Layer 2: Experience Cards (Elegantly staggered, zero collisions, zero giant voids) */}
        <div className="relative z-20 space-y-8 md:space-y-0">
          {timelineItems.map((item, index) => {
            const isLeft = index % 2 === 0;
            const Icon = item.type === "education" ? GraduationCap : Briefcase;
            const isActive = activeCardIndex === index;
            const isPassed = activeCardIndex > index;

            // Stagger classes on desktop to match reference layout:
            // Card 0: Top Left
            // Card 1: Middle Right, shifted up with -mt-20 so it sits alongside Card 0 without a giant void
            // Card 2: Bottom Left, mt-12 below Card 1 so Card 0 and Card 2 have generous breathing room
            const staggerClasses =
              index === 0
                ? "md:justify-start"
                : index === 1
                ? "md:justify-end md:-mt-20"
                : "md:justify-start md:mt-12";

            return (
              <div
                key={item.title}
                className={`flex items-start ${staggerClasses}`}
              >
                {/* Responsive Card Container */}
                <div className="w-full md:w-[calc(50%-32px)] pl-12 sm:pl-14 md:pl-0">
                  <div
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className={`rounded-2xl border transition-all duration-300 p-6 sm:p-7 bg-surface relative z-20 group ${
                      isActive
                        ? "border-brand-primary ring-1 ring-brand-primary/40 shadow-[0_0_28px_rgba(229,160,13,0.16)] bg-surface-elevated"
                        : isPassed
                        ? "border-border-strong bg-surface"
                        : "border-border-subtle hover:border-border-strong bg-surface"
                    }`}
                  >
                    {/* Header: Date Badge & Milestone ID */}
                    <div className="flex items-center justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-md transition-colors ${
                            isActive
                              ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/40"
                              : "bg-surface-elevated text-text-muted border border-border-subtle"
                          }`}
                        >
                          <Calendar className="inline h-3 w-3 mr-1.5 opacity-75" />
                          {item.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isPassed && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-primary" />
                        )}
                        <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">
                          {`0${index + 1} // ${item.type}`}
                        </span>
                      </div>
                    </div>

                    {/* Title & Organization */}
                    <h3
                      className={`font-heading text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                        isActive
                          ? "text-brand-primary"
                          : "text-text-heading group-hover:text-brand-primary"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs sm:text-sm font-medium text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-brand-primary/80 flex-shrink-0" />
                        <span className="text-text-heading">{item.company}</span>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-sm text-text-body font-normal mt-3.5 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Key Focus Tags */}
                    {item.skills && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3.5 border-t border-border-subtle/70">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                              isActive
                                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                                : "bg-surface-subtle text-text-muted border border-border-subtle"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Desktop Milestone Node Anchors (z-30, seamlessly docking path) */}
                    {/* Card 0: Exit Node on right border */}
                    {index === 0 && (
                      <div
                        className={`hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border bg-surface items-center justify-center z-30 transition-all duration-300 ${
                          isActive
                            ? "border-brand-primary text-brand-primary shadow-[0_0_14px_rgba(229,160,13,0.5)] scale-110"
                            : isPassed
                            ? "border-brand-primary/60 text-brand-primary"
                            : "border-border-subtle text-text-muted"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* Card 1: Entry Node on top border & Exit Node on bottom border */}
                    {index === 1 && (
                      <>
                        <div
                          className={`hidden md:flex absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border bg-surface items-center justify-center z-30 transition-all duration-300 ${
                            isActive
                              ? "border-brand-primary text-brand-primary shadow-[0_0_14px_rgba(229,160,13,0.5)] scale-110"
                              : isPassed
                              ? "border-brand-primary/60 text-brand-primary"
                              : "border-border-subtle text-text-muted"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div
                          className={`hidden md:flex absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border bg-surface items-center justify-center z-30 transition-all duration-300 ${
                            isActive
                              ? "border-brand-primary text-brand-primary shadow-[0_0_14px_rgba(229,160,13,0.5)] scale-110"
                              : isPassed
                              ? "border-brand-primary/60 text-brand-primary"
                              : "border-border-subtle text-text-muted"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </>
                    )}

                    {/* Card 2: Entry Node on top border */}
                    {index === 2 && (
                      <div
                        className={`hidden md:flex absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border bg-surface items-center justify-center z-30 transition-all duration-300 ${
                          isActive
                            ? "border-brand-primary text-brand-primary shadow-[0_0_14px_rgba(229,160,13,0.5)] scale-110"
                            : isPassed
                            ? "border-brand-primary/60 text-brand-primary"
                            : "border-border-subtle text-text-muted"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* Mobile Milestone Node Dot (On the left vertical track, z-30) */}
                    <div
                      ref={(el) => {
                        mobileNodeRefs.current[index] = el;
                      }}
                      className={`md:hidden absolute -left-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 z-30 ${
                        isActive
                          ? "bg-brand-primary border-brand-primary text-brand-on-primary shadow-[0_0_12px_rgba(229,160,13,0.4)] scale-110"
                          : isPassed
                          ? "bg-surface-elevated border-brand-primary/60 text-brand-primary"
                          : "bg-surface border-border-subtle text-text-muted"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
