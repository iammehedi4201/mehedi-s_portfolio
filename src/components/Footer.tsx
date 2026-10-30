import Link from "next/link";
import { Terminal, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-6 pb-8 px-3 sm:px-6 lg:px-8 bg-canvas">
      {/* Outer Card with native solid surface background */}
      <div className="mx-auto max-w-7xl rounded-3xl sm:rounded-[2.5rem] bg-surface border border-border-subtle pt-8 sm:pt-10 px-0 pb-0 overflow-hidden relative shadow-card">
        {/* Top Row: Brand Logo with Circular Icon & Verified Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-12 relative z-10">
          {/* Brand Logo matching Navbar and unified brand identity */}
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-subtle border border-brand-primary/30 flex items-center justify-center text-brand-subtle-text">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg tracking-tight text-heading">
              MEHEDI<span className="text-brand-primary font-bold">.</span>
            </span>
          </Link>

          {/* Social Links */}
          <div className="flex items-center gap-3">
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
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-surface-elevated hover:bg-surface-subtle border border-border-subtle hover:border-brand-primary text-body hover:text-brand-primary flex items-center justify-center transition-colors shadow-sm"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Centered Copyright Line directly above the big name */}
        <div className="text-center pb-6 sm:pb-8 px-6 relative z-10">
          <p className="text-xs sm:text-sm text-text-muted font-normal tracking-wide">
            Copyright &copy; {currentYear} Mehedi Hasan. All Rights Reserved.
          </p>
        </div>

        {/* Big Highlighted Name — Edge-to-Edge Typography touching bottom edge with zero gap */}
        <div className="pt-2 sm:pt-4 pb-0 px-2 sm:px-3 w-full flex justify-center items-end overflow-hidden relative z-10">
          <h2 className="font-heading font-bold text-[15.2vw] sm:text-[14.6vw] md:text-[13.8vw] lg:text-[13vw] xl:text-[180px] tracking-tight leading-none text-heading select-none text-center pointer-events-none whitespace-nowrap -mb-[3vw] xl:-mb-[22px] w-full">
            Mehedi Hasan
          </h2>
        </div>
      </div>
    </footer>
  );
}
