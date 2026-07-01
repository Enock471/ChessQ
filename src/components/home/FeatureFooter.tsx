import { features } from "@/lib/data";

export function FeatureFooter() {
  return (
    <section className="rounded-2xl border border-border/80 bg-surface-850/30 px-4 py-6 sm:px-6 sm:py-7">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="group flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-900/80 transition group-hover:border-accent/25 group-hover:bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{feature.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
