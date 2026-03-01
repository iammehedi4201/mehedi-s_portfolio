"use client";

import { Menu } from "lucide-react";

interface TopbarProps {
  onMobileMenuToggle: () => void;
}

export default function Topbar({ onMobileMenuToggle }: TopbarProps) {
  return (
    <header className="h-16 border-b border-white/[0.06] bg-dash-bg/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-white/[0.06] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-heading font-semibold">Dashboard</h1>
        </div>
      </div>
    </header>
  );
}
