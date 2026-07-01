"use client";

import { Crown, Sparkles, X } from "lucide-react";
import { navItems, user } from "@/lib/data";
import { cn } from "@/lib/utils";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
  className?: string;
};

export function Sidebar({ open, onClose, className }: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface-900/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 ring-1 ring-accent/30">
              <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.2} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Chess<span className="text-accent">Q</span>
            </span>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="rounded-lg p-2 text-zinc-400 hover:bg-surface-800 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  item.active
                    ? "border-l-2 border-accent bg-accent/10 text-accent"
                    : "border-l-2 border-transparent text-zinc-400 hover:bg-surface-800 hover:text-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    item.active ? "text-accent" : "text-zinc-500 group-hover:text-zinc-300",
                  )}
                />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="space-y-4 px-4 pb-6">
          <div className="glass-panel relative overflow-hidden p-4">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Crown className="h-5 w-5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-wider text-gold">
                  ChessQ Premium
                </span>
              </div>
              <p className="mb-4 text-xs leading-relaxed text-zinc-400">
                Unlock all features, advanced analytics, and exclusive tournaments.
              </p>
              <button
                type="button"
                className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-surface-950 transition hover:bg-accent-hover glow-accent"
              >
                Upgrade Now
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-850 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-accent/30 to-emerald-600/20 text-sm font-bold text-accent ring-2 ring-accent/20">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-zinc-500">
                Rating <span className="font-medium text-accent">{user.rating}</span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
