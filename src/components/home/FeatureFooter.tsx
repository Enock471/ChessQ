import { features } from "@/lib/data";

export function FeatureFooter() {
  return (
    <section className="rounded-2xl border border-border bg-surface-850/40 p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="group flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-900 transition group-hover:border-accent/30 group-hover:bg-accent/10">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{feature.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
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
