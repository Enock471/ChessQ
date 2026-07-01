import { Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { user, userStats } from "@/lib/data";

export function StatsPanel() {
  return (
    <aside className="space-y-4">
      <GlassCard>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Your Stats
        </h2>
        <ul className="space-y-3">
          {userStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <li
                key={stat.label}
                className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-900/50 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-accent/80" />
                  <span className="text-sm text-zinc-400">{stat.label}</span>
                </div>
                <span className="text-sm font-bold">{stat.value}</span>
              </li>
            );
          })}
        </ul>
      </GlassCard>

      <GlassCard glow className="text-center">
        <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Your Badge
        </h2>
        <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 rotate-45 rounded-2xl border-2 border-accent/40 bg-accent/10 glow-accent" />
            <div className="absolute inset-2 rotate-45 rounded-xl border border-accent/60 bg-surface-900/80" />
            <Shield className="relative h-12 w-12 text-accent drop-shadow-[0_0_12px_rgba(34,255,136,0.6)]" />
          </div>
        </div>
        <p className="text-lg font-bold text-accent">{user.badge}</p>
        <p className="mt-1 text-xs text-zinc-500">{user.badgeRange}</p>
      </GlassCard>
    </aside>
  );
}
