import { Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { user, userStats } from "@/lib/data";

export function StatsPanel() {
  return (
    <aside className="space-y-4">
      <GlassCard className="p-4 sm:p-5">
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Your Stats
        </h2>
        <ul className="space-y-2">
          {userStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <li
                key={stat.label}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-surface-900/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-accent/70" />
                  <span className="text-xs text-zinc-500">{stat.label}</span>
                </div>
                <span className="text-xs font-bold">{stat.value}</span>
              </li>
            );
          })}
        </ul>
      </GlassCard>

      <GlassCard glow className="p-4 text-center sm:p-5">
        <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Your Badge
        </h2>
        <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="absolute inset-0 rotate-45 rounded-2xl border-2 border-accent/50 bg-accent/10 glow-accent" />
            <div className="absolute inset-2 rotate-45 rounded-xl border border-accent/40 bg-surface-900/90" />
            <Shield className="relative h-10 w-10 text-accent drop-shadow-[0_0_16px_rgba(34,255,136,0.65)]" />
          </div>
        </div>
        <p className="text-base font-bold text-accent">{user.badge}</p>
        <p className="mt-0.5 text-[11px] text-zinc-500">{user.badgeRange}</p>
      </GlassCard>
    </aside>
  );
}
