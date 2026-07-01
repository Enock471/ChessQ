import { GlassCard } from "@/components/ui/GlassCard";
import { recentActivity } from "@/lib/data";

export function RecentActivity() {
  return (
    <section>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-400">
        Recent Activity
      </h2>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
        {recentActivity.map((item) => {
          const Icon = item.icon;
          return (
            <GlassCard
              key={item.id}
              className="min-w-[240px] shrink-0 p-4 sm:min-w-[260px]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm leading-snug text-zinc-300">{item.message}</p>
                  <p className="mt-2 text-xs text-zinc-600">{item.time}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
