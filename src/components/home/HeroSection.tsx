import Image from "next/image";
import { platformStats } from "@/lib/data";
import { Target, Zap } from "lucide-react";

const BOARD_IMAGE = "/images/chess-board-hero.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[440px] overflow-hidden rounded-2xl border border-border bg-surface-950 lg:min-h-[500px]">
      {/* Board: right-aligned, bottom-anchored, ~65% width coverage */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 bottom-0 h-[88%] w-[min(78%,520px)] sm:h-[90%] sm:w-[min(72%,560px)] lg:h-[92%] lg:w-[min(68%,620px)] xl:w-[min(65%,680px)]">
          <Image
            src={BOARD_IMAGE}
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 78vw, (max-width: 1280px) 68vw, 680px"
            className="object-contain object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
          />
        </div>
      </div>

      {/* Left text zone — keeps ~35–40% of hero clear */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-surface-950 from-0% via-surface-950/95 via-[38%] to-transparent to-[72%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-surface-950/40 from-0% via-transparent via-[35%] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_55%,rgba(34,255,136,0.07),transparent_50%)]"
      />

      <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-center p-6 sm:p-8 lg:min-h-[500px] lg:p-10">
        <div className="max-w-[min(100%,420px)]">
          <h1 className="text-[2.1rem] font-black uppercase leading-[0.92] tracking-tight sm:text-5xl xl:text-[3.4rem]">
            Play. Learn.{" "}
            <span className="text-gradient-accent">Dominate.</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
            Join millions of players worldwide. Master chess. Win tournaments.
            Become a legend.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2.5 rounded-xl bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-surface-950 transition hover:bg-accent-hover glow-accent"
            >
              <Zap className="h-4 w-4 fill-current" />
              Play Now
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2.5 rounded-xl border border-border-light bg-surface-950/50 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white backdrop-blur-sm transition hover:border-accent/40 hover:bg-accent/5"
            >
              <Target className="h-4 w-4 text-accent" />
              Practice
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {platformStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-sm font-bold leading-none text-white">{stat.value}</p>
                    <p className="mt-1 text-[11px] text-zinc-400">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
