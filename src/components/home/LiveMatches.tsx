import { Radio } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { liveMatches } from "@/lib/data";

export function LiveMatches() {
  return (
    <GlassCard className="h-full">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider">Live Matches</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-400">
          <Radio className="h-3 w-3 animate-pulse" />
          Live
        </span>
      </div>

      <ul className="space-y-3">
        {liveMatches.map((match) => (
          <li
            key={match.id}
            className="rounded-xl border border-border/70 bg-surface-900/60 p-3 transition hover:border-accent/20 hover:bg-surface-900"
          >
            <div className="flex items-center justify-between gap-2">
              <PlayerChip
                avatar={match.white.avatar}
                name={match.white.name}
                rating={match.white.rating}
                align="left"
              />
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                vs
              </span>
              <PlayerChip
                avatar={match.black.avatar}
                name={match.black.name}
                rating={match.black.rating}
                align="right"
              />
            </div>
            <div className="mt-3 flex justify-end">
              <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                Live
              </span>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function PlayerChip({
  avatar,
  name,
  rating,
  align,
}: {
  avatar: string;
  name: string;
  rating: number;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-700 text-[10px] font-bold text-zinc-300">
        {avatar}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{name}</p>
        <p className="text-[10px] text-zinc-500">{rating}</p>
      </div>
    </div>
  );
}
