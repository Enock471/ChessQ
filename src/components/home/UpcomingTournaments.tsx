import { GlassCard } from "@/components/ui/GlassCard";
import { tournamentIcons, tournaments } from "@/lib/data";

export function UpcomingTournaments() {
  return (
    <GlassCard className="h-full p-4 sm:p-5" id="tournaments">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
        Upcoming Tournaments
      </h2>

      <ul className="space-y-2">
        {tournaments.map((tournament) => {
          const Icon = tournamentIcons[tournament.icon];
          return (
            <li
              key={tournament.id}
              className="flex flex-col gap-3 rounded-xl border border-border/60 bg-surface-900/50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{tournament.name}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-gold">{tournament.prize}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{tournament.datetime}</p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-lg border border-border-light px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide transition hover:border-accent/50 hover:bg-accent/5 hover:text-accent"
              >
                Register
              </button>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
