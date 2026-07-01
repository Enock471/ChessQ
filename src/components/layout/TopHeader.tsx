"use client";

import { Bell, Mail, Menu } from "lucide-react";
import { user } from "@/lib/data";

type TopHeaderProps = {
  onMenuClick?: () => void;
};

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/80 bg-surface-950/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="rounded-xl border border-border bg-surface-850 p-2.5 text-zinc-300 transition hover:border-border-light hover:text-white lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="lg:hidden">
          <p className="text-sm font-semibold">Welcome back, {user.name}</p>
          <p className="text-xs text-zinc-500">Ready to dominate?</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <IconButton icon={Bell} label="Notifications" badge />
        <IconButton icon={Mail} label="Messages" badge />
        <div className="ml-1 hidden items-center gap-3 rounded-xl border border-border bg-surface-850 py-1.5 pl-1.5 pr-4 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-accent/30 to-emerald-700/20 text-sm font-bold text-accent">
            {user.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Rating <span className="text-accent">{user.rating}</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  icon: Icon,
  label,
  badge,
}: {
  icon: typeof Bell;
  label: string;
  badge?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative rounded-xl border border-border bg-surface-850 p-2.5 text-zinc-400 transition hover:border-border-light hover:text-white"
    >
      <Icon className="h-5 w-5" />
      {badge && (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-surface-950" />
      )}
    </button>
  );
}
