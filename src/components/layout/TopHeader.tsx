"use client";

import { Bell, ChevronDown, Mail, Menu } from "lucide-react";
import { user } from "@/lib/data";
import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder";

type TopHeaderProps = {
  onMenuClick?: () => void;
};

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-end border-b border-border/70 bg-surface-950/90 px-4 py-3.5 backdrop-blur-xl sm:px-5 lg:px-6">
      <button
        type="button"
        aria-label="Open menu"
        className="mr-auto rounded-xl border border-border bg-surface-850 p-2.5 text-zinc-300 transition hover:border-border-light hover:text-white lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        <IconButton icon={Bell} label="Notifications" badge />
        <IconButton icon={Mail} label="Messages" badge />
        <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-border bg-surface-850 py-1.5 pl-1.5 pr-3">
          <AvatarPlaceholder size="md" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-none">{user.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Rating <span className="text-accent">{user.rating}</span>
            </p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-zinc-500 sm:block" />
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
