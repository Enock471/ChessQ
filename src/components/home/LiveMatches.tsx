import { Swords } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder";
import { liveMatches } from "@/lib/data";

export function LiveMatches() {
  return (
    <GlassCard className="h-full">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
        Live Matches
      </h2>

      <ul className="space-y-2">
        {liveMatches.map((match) => (
          <li
            key={match.id}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-900/50 px-3 py-3"
          >
            <PlayerSide name={match.white.name} rating={match.white.rating} />
            <div className="flex shrink-0 flex-col items-center px-1">
              <Swords className="h-3.5 w-3.5 text-zinc-600" />
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                vs
              </span>
            </div>
            <PlayerSide name={match.black.name} rating={match.black.rating} align="right" />
            <span className="ml-auto shrink-0 rounded-md bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
              Live
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

function PlayerSide({
  name,
  rating,
  align = "left",
}: {
  name: string;
  rating: number;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${align === "right" ? "flex-row-reverse text-right" : ""}`}
    >
      <AvatarPlaceholder size="sm" />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{name}</p>
        <p className="text-[10px] text-zinc-500">{rating}</p>
      </div>
    </div>
  );
}
