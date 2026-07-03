"use client";

import { useMemo, useState } from "react";
import { Chess } from "chess.js";
import {
  Chessboard,
  type ChessboardOptions,
  type PieceDropHandlerArgs,
} from "react-chessboard";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { GlassCard } from "@/components/ui/GlassCard";

// Board colors kept as a constant so the styling stays identical between
// renders (sub-phase 0.1's dark/gold theme match).
const boardTheme = {
  darkSquareStyle: { backgroundColor: "#1c1a17" },
  lightSquareStyle: { backgroundColor: "#caa968" },
  darkSquareNotationStyle: { color: "#caa968" },
  lightSquareNotationStyle: { color: "#1c1a17" },
};

export default function PlayPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The Chess instance holds the full game state (board, turn, legality
  // rules). useMemo (not useState) keeps the SAME instance alive across
  // re-renders — we mutate it in place via .move() and copy its FEN into
  // React state below to trigger re-renders.
  const chessGame = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chessGame.fen());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs): boolean {
    // Piece was dragged off the board entirely.
    if (!targetSquare) return false;

    try {
      // chess.js throws for illegal moves (wrong turn, moving through
      // pieces, leaving your own king in check, etc.) rather than
      // returning null, so we catch that and treat it as a rejected drop.
      // Promotions always auto-queen for now — a picker UI is sub-phase 0.3.
      chessGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    } catch {
      setStatusMessage("Illegal move — try again.");
      return false;
    }

    setFen(chessGame.fen());
    setStatusMessage(null);
    return true;
  }

  const boardOptions: ChessboardOptions = {
    position: fen,
    onPieceDrop,
    // Only the side whose turn it is can pick up a piece — this is what
    // makes hotseat turn-passing feel automatic instead of relying purely
    // on illegal-move rejection.
    canDragPiece: ({ piece }) => piece.pieceType[0] === chessGame.turn(),
    boardOrientation: "white",
    showNotation: true,
    ...boardTheme,
  };

  const turnLabel = chessGame.turn() === "w" ? "White" : "Black";

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
              <div className="mb-4 flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-zinc-200">
                  Turn: <span className="text-accent">{turnLabel}</span>
                </p>
                {statusMessage && (
                  <p className="text-xs font-medium text-red-400">
                    {statusMessage}
                  </p>
                )}
              </div>

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
