import { platformStats } from "@/lib/data";
import { ChessBoardHero } from "@/components/home/ChessBoardHero";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-surface-850/60 p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(34,255,136,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="mb-3 inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            The ultimate chess arena
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl xl:text-6xl">
            Play. Learn.{" "}
            <span className="text-gradient-accent">Dominate.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            Join millions of players worldwide. Master chess. Win tournaments.
            Become a legend.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-surface-950 transition hover:bg-accent-hover glow-accent"
            >
              <span aria-hidden>⚡</span>
              Play Now
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-border-light bg-transparent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:border-accent/40 hover:bg-accent/5"
            >
              <span aria-hidden>◎</span>
              Practice
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {platformStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-xl border border-border/80 bg-surface-900/70 px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-base font-bold leading-none">{stat.value}</p>
                    <p className="mt-1 text-xs text-zinc-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <ChessBoardHero />
        </div>
      </div>
    </section>
  );
}
