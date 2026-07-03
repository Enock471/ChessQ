"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard, type ChessboardOptions } from "react-chessboard";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { GlassCard } from "@/components/ui/GlassCard";

// Sub-phase 0.1: just get a board on screen at the standard starting
// position, styled to match ChessQ's dark theme. Move logic (chess.js
// validation, turn handling) is wired up in sub-phase 0.2 — this board
// isn't interactive yet.
const boardOptions: ChessboardOptions = {
  position: new Chess().fen(),
  boardOrientation: "white",
  showNotation: true,
  darkSquareStyle: { backgroundColor: "#1c1a17" },
  lightSquareStyle: { backgroundColor: "#caa968" },
  darkSquareNotationStyle: { color: "#caa968" },
  lightSquareNotationStyle: { color: "#1c1a17" },
};

export default function PlayPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-1 text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Play <span className="text-gradient-accent">Local</span>
            </h1>
            <p className="mb-6 text-sm text-zinc-400">
              Hotseat mode — pass the device to play a friend on the same
              board. No account or internet connection needed yet.
            </p>

            <GlassCard className="p-3 sm:p-5">
              <div className="mx-auto aspect-square w-full max-w-[560px]">
                <Chessboard options={boardOptions} />
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
