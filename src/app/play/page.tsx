"use client";

import { useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
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

type PromotionPiece = "q" | "r" | "b" | "n";

// One entry per promotion choice: the chess.js piece code plus the
// unicode glyph to show on the picker button.
const PROMOTION_CHOICES: { piece: PromotionPiece; label: string }[] = [
  { piece: "q", label: "Queen" },
  { piece: "r", label: "Rook" },
  { piece: "b", label: "Bishop" },
  { piece: "n", label: "Knight" },
];

// Unicode chess glyphs, keyed by color ("w"/"b") then piece letter —
// used so the promotion picker shows the correct-colored piece.
const PIECE_GLYPHS: Record<"w" | "b", Record<PromotionPiece, string>> = {
  w: { q: "♕", r: "♖", b: "♗", n: "♘" },
  b: { q: "♛", r: "♜", b: "♝", n: "♞" },
};

type PendingPromotion = {
  from: Square;
  to: Square;
  color: "w" | "b";
};

// Legal-move highlight styles (sub-phase 0.4). A soft dot for empty
// destination squares, a colored ring for squares where the move would
// capture, and a tint on the square that's currently picked up.
const SELECTED_SQUARE_STYLE = { backgroundColor: "rgba(34, 255, 136, 0.25)" };
const LEGAL_MOVE_DOT_STYLE = {
  backgroundImage:
    "radial-gradient(circle, rgba(34, 255, 136, 0.65) 22%, transparent 23%)",
};
const LEGAL_CAPTURE_STYLE = {
  boxShadow: "inset 0 0 0 4px rgba(34, 255, 136, 0.8)",
  borderRadius: "4px",
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
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Reads chess.js's own game-over flags after a move is made. Nothing
  // here is specific to any particular opening or mating pattern — it
  // relies entirely on chess.js's move generator, so it works the same
  // for every checkmate/stalemate/draw position, not just common ones.
  function checkGameOver() {
    if (chessGame.isCheckmate()) {
      const winner = chessGame.turn() === "w" ? "Black" : "White";
      setGameOverMessage(`Checkmate — ${winner} wins`);
    } else if (chessGame.isStalemate()) {
      setGameOverMessage("Draw — Stalemate");
    } else if (chessGame.isThreefoldRepetition()) {
      setGameOverMessage("Draw — Threefold Repetition");
    } else if (chessGame.isInsufficientMaterial()) {
      setGameOverMessage("Draw — Insufficient Material");
    } else if (chessGame.isDrawByFiftyMoves()) {
      setGameOverMessage("Draw — Fifty-Move Rule");
    } else if (chessGame.isDraw()) {
      setGameOverMessage("Draw");
    } else {
      setGameOverMessage(null);
    }
  }

  function onPieceDrop({
    piece,
    sourceSquare,
    targetSquare,
  }: PieceDropHandlerArgs): boolean {
    // The drag has ended one way or another (dropped, cancelled, off-board)
    // so the highlight always clears here, regardless of outcome below.
    setSelectedSquare(null);

    if (gameOverMessage) return false;
    if (!targetSquare) return false;

    const from = sourceSquare as Square;
    const to = targetSquare as Square;

    // A pawn reaching the back rank needs a promotion choice from the
    // player before the move can be completed, so we pause here instead
    // of committing immediately. `piece.pieceType` looks like "wP"/"bP".
    const isPawn = piece.pieceType[1] === "P";
    const reachesLastRank = to[1] === "8" || to[1] === "1";

    if (isPawn && reachesLastRank) {
      // Confirm this is actually a legal destination for this pawn before
      // popping the picker — otherwise an illegal diagonal/forward move
      // would incorrectly open the promotion UI.
      const legalMoves = chessGame.moves({ square: from, verbose: true });
      const isLegalDestination = legalMoves.some((move) => move.to === to);

      if (!isLegalDestination) {
        setStatusMessage("Illegal move — try again.");
        return false;
      }

      setPendingPromotion({ from, to, color: chessGame.turn() });
      setStatusMessage(null);
      // Returning false leaves the board at the pre-move position; the
      // picker below commits the real move once a piece is chosen.
      return false;
    }

    try {
      // chess.js throws for illegal moves (wrong turn, moving through
      // pieces, leaving your own king in check, etc.) rather than
      // returning null, so we catch that and treat it as a rejected drop.
      chessGame.move({ from, to });
    } catch {
      setStatusMessage("Illegal move — try again.");
      return false;
    }

    setFen(chessGame.fen());
    setStatusMessage(null);
    checkGameOver();
    return true;
  }

  function choosePromotion(promotion: PromotionPiece) {
    if (!pendingPromotion) return;

    chessGame.move({
      from: pendingPromotion.from,
      to: pendingPromotion.to,
      promotion,
    });

    setFen(chessGame.fen());
    setPendingPromotion(null);
    checkGameOver();
  }

  function cancelPromotion() {
    // The pawn never actually moved (onPieceDrop returned false), so
    // there's nothing to undo — just close the picker.
    setPendingPromotion(null);
  }

  // Recomputed from chess.js's own move generator every time a piece is
  // selected — never a separately maintained list — so highlighted
  // squares can never drift out of sync with what's actually legal.
  const squareStyles: Record<string, React.CSSProperties> = {};
  if (selectedSquare) {
    squareStyles[selectedSquare] = SELECTED_SQUARE_STYLE;
    const legalMoves = chessGame.moves({
      square: selectedSquare,
      verbose: true,
    });
    for (const move of legalMoves) {
      const isCapture = move.flags.includes("c") || move.flags.includes("e");
      squareStyles[move.to] = isCapture
        ? LEGAL_CAPTURE_STYLE
        : LEGAL_MOVE_DOT_STYLE;
    }
  }

  const boardOptions: ChessboardOptions = {
    position: fen,
    onPieceDrop,
    // Fires when a drag starts — used to show legal-move highlights for
    // the picked-up piece.
    onPieceDrag: ({ square }) => {
      if (square) setSelectedSquare(square as Square);
    },
    squareStyles,
    // Only the side whose turn it is can pick up a piece, and nobody can
    // once the game has ended — this is what makes hotseat turn-passing
    // feel automatic instead of relying purely on illegal-move rejection.
    canDragPiece: ({ piece }) =>
      !gameOverMessage &&
      !pendingPromotion &&
      piece.pieceType[0] === chessGame.turn(),
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
                {statusMessage && !gameOverMessage && (
                  <p className="text-xs font-medium text-red-400">
                    {statusMessage}
                  </p>
                )}
              </div>

              {gameOverMessage && (
                <div className="glass-panel mb-4 border-accent/30 bg-accent/10 px-4 py-3 text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-accent">
                    {gameOverMessage}
                  </p>
                </div>
              )}

              <div className="relative mx-auto aspect-square w-full max-w-[560px]">
                <Chessboard options={boardOptions} />

                {pendingPromotion && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-950/85 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-[280px] p-5 text-center">
                      <p className="mb-4 text-sm font-semibold text-zinc-200">
                        Promote pawn to:
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {PROMOTION_CHOICES.map(({ piece, label }) => (
                          <button
                            key={piece}
                            type="button"
                            onClick={() => choosePromotion(piece)}
                            className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface-850 py-3 transition hover:border-accent/50 hover:bg-surface-800"
                          >
                            <span className="text-3xl leading-none">
                              {PIECE_GLYPHS[pendingPromotion.color][piece]}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              {label}
                            </span>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={cancelPromotion}
                        className="mt-4 text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
