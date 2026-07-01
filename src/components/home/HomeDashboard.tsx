"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { FeatureFooter } from "@/components/home/FeatureFooter";
import { HeroSection } from "@/components/home/HeroSection";
import { LiveMatches } from "@/components/home/LiveMatches";
import { RecentActivity } from "@/components/home/RecentActivity";
import { StatsPanel } from "@/components/home/StatsPanel";
import { UpcomingTournaments } from "@/components/home/UpcomingTournaments";

export function HomeDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 space-y-5 p-4 sm:space-y-6 sm:p-5 lg:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-5">
            <HeroSection />
            <StatsPanel />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <LiveMatches />
            <UpcomingTournaments />
          </div>

          <RecentActivity />
          <FeatureFooter />
        </main>

        <footer className="border-t border-border px-4 py-5 text-center text-[11px] text-zinc-600 sm:px-6">
          © {new Date().getFullYear()} ChessQ. Play fair. Play bold.
        </footer>
      </div>
    </div>
  );
}
