"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ProjectsSection from "@/sections/ProjectsSection";
import SkillsSection from "@/sections/SkillsSection";
import TimelineSection from "@/sections/TimelineSection";
import ContactSection from "@/sections/ContactSection";
import { useAnalytics } from "@/hooks";

export default function HomePage() {
  const { logView } = useAnalytics();

  useEffect(() => {
    logView("/");
  }, [logView]);

  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <div className="section-divider" />
      <AboutSection />
      <div className="section-divider" />
      <ProjectsSection />
      <div className="section-divider" />
      <SkillsSection />
      <div className="section-divider" />
      <TimelineSection />
      <div className="section-divider" />
      <ContactSection />
      <Footer />
    </main>
  );
}
