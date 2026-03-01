"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-4 left-0 right-0 z-50 transition-all duration-300 pointer-events-none px-4 sm:px-6 lg:px-8",
          scrolled ? "top-2" : "top-4"
        )}
      >
        <nav className={cn(
          "mx-auto max-w-4xl flex items-center justify-between h-14 rounded-full border border-white/10 px-6 transition-all duration-500 pointer-events-auto shadow-2xl backdrop-blur-md",
          scrolled 
            ? "bg-background/60 shadow-primary/5" 
            : "bg-white/5 shadow-none"
        )}>
          {/* Logo */}
          <a href="#" className="font-heading text-xl font-bold tracking-tighter hover:scale-105 transition-transform">
            MEHEDI<span className="text-primary">.</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <a 
              href="#contact" 
              className="hidden md:block text-xs font-heading font-bold uppercase tracking-widest bg-white text-black px-5 py-2 rounded-full hover:bg-primary transition-colors"
            >
              Hire
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden rounded-lg p-2 text-foreground hover:text-primary transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 pt-16 bg-deep-dark/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-6 pt-12">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xl font-heading text-foreground hover:text-electric transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button variant="glow" size="lg" asChild>
                <a href="#contact" onClick={() => setMobileOpen(false)}>
                  Hire Me
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
