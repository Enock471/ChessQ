const lightSquares = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];

const pieces: Record<string, string> = {
  "0-0": "♜",
  "0-7": "♜",
  "0-1": "♞",
  "0-6": "♞",
  "0-2": "♝",
  "0-5": "♝",
  "0-3": "♛",
  "0-4": "♚",
  "1-0": "♟",
  "1-1": "♟",
  "1-2": "♟",
  "1-3": "♟",
  "1-4": "♟",
  "1-5": "♟",
  "1-6": "♟",
  "1-7": "♟",
  "6-0": "♙",
  "6-1": "♙",
  "6-2": "♙",
  "6-3": "♙",
  "6-4": "♙",
  "6-5": "♙",
  "6-6": "♙",
  "6-7": "♙",
  "7-0": "♖",
  "7-7": "♖",
  "7-1": "♘",
  "7-6": "♘",
  "7-2": "♗",
  "7-5": "♗",
  "7-3": "♕",
  "7-4": "♔",
};

export function ChessBoardHero() {
  return (
    <div className="chess-board-wrap relative w-full max-w-md">
      <div className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-3xl" />

      <div className="chess-board-3d relative mx-auto">
        <div
          className="overflow-hidden rounded-xl border-2 border-zinc-700/80 shadow-[0_30px_80px_rgba(0,0,0,0.65),0_0_40px_rgba(34,255,136,0.15)]"
          style={{
            transform: "translateZ(0)",
            boxShadow:
              "0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="grid grid-cols-8 gap-0">
            {lightSquares.map((row, rowIndex) =>
              row.map((isLight, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const piece = pieces[key];
                const isGoldPiece = rowIndex <= 1;

                return (
                  <div
                    key={key}
                    className="relative flex aspect-square items-center justify-center text-2xl sm:text-3xl"
                    style={{
                      background: isLight
                        ? "linear-gradient(145deg, #c4a35a 0%, #9a7b3f 100%)"
                        : "linear-gradient(145deg, #1a1a1f 0%, #0d0d10 100%)",
                    }}
                  >
                    {piece && (
                      <span
                        className="select-none drop-shadow-lg"
                        style={{
                          color: isGoldPiece ? "#f0d060" : "#e8e8ea",
                          textShadow: isGoldPiece
                            ? "0 2px 8px rgba(212,175,55,0.5)"
                            : "0 2px 6px rgba(0,0,0,0.8)",
                          transform: "translateZ(12px)",
                        }}
                      >
                        {piece}
                      </span>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div
          className="absolute -bottom-4 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-[100%] bg-black/50 blur-xl"
          style={{ transform: "translateX(-50%) translateZ(-40px)" }}
        />
      </div>
    </div>
  );
}
