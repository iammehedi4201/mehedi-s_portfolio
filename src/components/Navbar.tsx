"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Terminal, FileText } from "lucide-react";

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Timeline", href: "/#timeline" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-200 pointer-events-none px-4 sm:px-6 lg:px-8",
          scrolled ? "top-3" : "top-5"
        )}
      >
        <nav
          className={cn(
            "mx-auto max-w-7xl flex items-center justify-between h-14 rounded-2xl border transition-colors duration-200 pointer-events-auto px-5 sm:px-6 shadow-card",
            scrolled
              ? "bg-surface-elevated/90 backdrop-blur-xl border-white/10"
              : "bg-surface/60 backdrop-blur-md border-border-subtle"
          )}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-subtle border border-brand-primary/30 flex items-center justify-center text-brand-primary">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-base sm:text-lg tracking-tight text-heading">
              MEHEDI<span className="text-brand-primary font-black">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-200",
                    isActive
                      ? "text-brand-primary font-bold bg-brand-subtle"
                      : "text-body hover:text-heading hover:bg-surface-elevated"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* View Resume Button in Navbar */}
            <a
              href="/Mehedi_Hasan_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-heading bg-surface-elevated hover:bg-surface-subtle border border-border-subtle hover:border-brand-primary transition-colors shadow-sm"
              title="View Resume in new tab"
            >
              <FileText className="w-3.5 h-3.5 text-brand-primary" />
              <span>Resume</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-heading bg-surface-elevated hover:bg-surface-subtle border border-border-subtle transition-colors"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Drawer Menu (Solid) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 p-6 rounded-2xl bg-surface border border-border-subtle shadow-card md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-sm font-bold text-heading hover:bg-surface-elevated hover:text-brand-primary transition-colors"
                >
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="pt-2 border-t border-border-subtle">
                <a
                  href="/Mehedi_Hasan_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-sm font-bold text-brand-primary bg-brand-subtle border border-brand-primary/30"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    View Resume (CV)
                  </span>
                  <span className="text-xs">PDF</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { Navbar as Nav };
