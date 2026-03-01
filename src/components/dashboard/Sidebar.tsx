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
  Settings,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "CV Manager", href: "/dashboard/cv", icon: FileText },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06]">
        {!collapsed && (
          <Link href="/dashboard" className="font-heading text-lg font-bold gradient-text">
            MH<span className="text-electric">.</span> Admin
          </Link>
        )}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/[0.06] transition-colors text-muted-foreground"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </button>
        <button
          onClick={onMobileClose}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/[0.06] text-muted-foreground"
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
                  ? "text-white bg-white/[0.06]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-violet"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="h-4.5 w-4.5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User / Sign-out */}
      <div className="border-t border-white/[0.06] p-3">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2",
            collapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric to-violet flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
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
            "flex items-center gap-3 px-3 py-2. rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors w-full mt-1",
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
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col bg-sidebar-bg border-r border-white/[0.06] h-full overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[256px] bg-sidebar-bg border-r border-white/[0.06] z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
