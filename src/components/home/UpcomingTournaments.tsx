import { GlassCard } from "@/components/ui/GlassCard";
import { tournamentIcons, tournaments } from "@/lib/data";

export function UpcomingTournaments() {
  return (
    <GlassCard className="h-full" id="tournaments">
      <h2 className="mb-5 text-sm font-bold uppercase tracking-wider">
        Upcoming Tournaments
      </h2>

      <ul className="space-y-3">
        {tournaments.map((tournament) => {
          const Icon = tournamentIcons[tournament.icon];
          return (
            <li
              key={tournament.id}
              className="flex flex-col gap-3 rounded-xl border border-border/70 bg-surface-900/60 p-4 transition hover:border-accent/20 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{tournament.name}</p>
                  <p className="mt-0.5 text-xs font-medium text-gold">{tournament.prize}</p>
                  <p className="mt-1 text-xs text-zinc-500">{tournament.datetime}</p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-xl border border-border-light px-4 py-2 text-xs font-bold uppercase tracking-wide transition hover:border-accent/50 hover:bg-accent/5 hover:text-accent"
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
