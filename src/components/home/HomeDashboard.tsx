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
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
            <HeroSection />
            <div className="xl:order-none">
              <StatsPanel />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <LiveMatches />
            <UpcomingTournaments />
          </div>

          <RecentActivity />
          <FeatureFooter />
        </main>

        <footer className="border-t border-border px-4 py-6 text-center text-xs text-zinc-600 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ChessQ. Play fair. Play bold.
        </footer>
      </div>
    </div>
  );
}
