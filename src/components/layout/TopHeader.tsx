"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Mail, Menu } from "lucide-react";
import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder";
import { useAuth } from "@/lib/auth-context";

type TopHeaderProps = {
  onMenuClick?: () => void;
};

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const displayName =
    profile?.display_name || profile?.username || user?.email?.split("@")[0];
  const rating = profile?.rating ?? 1200;

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

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
        {loading ? (
          <div className="ml-1 h-11 w-11 animate-pulse rounded-xl border border-border bg-surface-850 sm:w-40" />
        ) : user ? (
          <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-border bg-surface-850 py-1.5 pl-1.5 pr-2">
            <AvatarPlaceholder size="md" />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none">
                {displayName}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Rating <span className="text-accent">{rating}</span>
              </p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-surface-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="ml-1 rounded-xl border border-border bg-surface-850 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-accent/40 hover:text-accent"
          >
            Log In
          </Link>
        )}
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
