"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30 * 1000, retry: 1 },
        },
      })
  );
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="flex h-screen bg-dash-bg text-foreground overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            onMobileClose={() => setMobileOpen(false)}
          />

          {/* Main area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar
              onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}
