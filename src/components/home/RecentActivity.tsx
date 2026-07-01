import { GlassCard } from "@/components/ui/GlassCard";
import { recentActivity } from "@/lib/data";

export function RecentActivity() {
  return (
    <GlassCard>
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
        Recent Activity
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recentActivity.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-xl border border-border/50 bg-surface-900/40 p-3.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-xs leading-snug text-zinc-300 sm:text-sm">{item.message}</p>
                <p className="mt-2 text-[11px] text-zinc-600">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
