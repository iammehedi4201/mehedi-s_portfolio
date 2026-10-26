"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  LogOut,
  ChevronLeft,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "CV Manager", href: "/dashboard/cv", icon: FileText },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar-bg border-r border-white/[0.06]">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle">
        {!collapsed && (
          <Link href="/dashboard" className="font-heading text-lg font-bold text-text-heading">
            MH<span className="text-brand-primary">.</span> Admin
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-elevated transition-colors text-text-muted"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </button>
        <button
          onClick={onMobileClose}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-elevated text-text-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group",
                isActive
                  ? "text-text-heading bg-surface-elevated font-semibold"
                  : "text-text-muted hover:text-text-heading hover:bg-surface-subtle"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="h-4.5 w-4.5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Quick Link to Design System & Live Site */}
        <div className="pt-4 mt-4 border-t border-border-subtle">
          <Link
            href="/dashboard/design-system"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative",
              pathname === "/dashboard/design-system"
                ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-sm"
                : "text-brand-primary hover:bg-surface-elevated",
              collapsed && "justify-center"
            )}
          >
            {pathname === "/dashboard/design-system" && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand-primary"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <Sparkles className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Design System</span>}
          </Link>
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-text-heading hover:bg-surface-subtle transition-all mt-1",
              collapsed && "justify-center"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
            {!collapsed && <span>View Portfolio</span>}
          </Link>
        </div>
      </nav>

      {/* User / Sign-out */}
      <div className="border-t border-border-subtle p-3">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2",
            collapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold text-brand-on-primary flex-shrink-0">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email || ""}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors w-full mt-1 cursor-pointer",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden md:block transition-all duration-300 h-screen z-20",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
