import Link from "next/link";
import { Github, Linkedin, Mail, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-deep-dark">
      <div className="section-divider" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo (Solid Text, Amber period) */}
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-bold text-text-heading">
              MH<span className="text-brand-primary">.</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {[
              { icon: Github, href: "https://github.com/iammehedi4201", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mehedi-hasan-4b81131a6", label: "LinkedIn" },
              { icon: Mail, href: "mailto:iammehedi296@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-brand-primary transition-colors"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
            <Link
              href="/design-system"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-elevated hover:bg-surface-subtle text-text-body hover:text-text-heading border border-border-subtle transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
              <span>Design System</span>
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-text-muted flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-color-error fill-color-error" /> by Mehedi Hasan ·{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}

