"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crown, LogOut, Sparkles, X } from "lucide-react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AvatarPlaceholder } from "@/components/ui/AvatarPlaceholder";
import { useAuth } from "@/lib/auth-context";

type SidebarProps = {
  open?: boolean;
  onClose?: () => void;
  className?: string;
};

export function Sidebar({ open, onClose, className }: SidebarProps) {
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
          "fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-border bg-surface-900/98 backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className,
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 ring-1 ring-accent/25">
              <Sparkles className="h-4 w-4 text-accent" strokeWidth={2.2} />
            </div>
            <span className="text-lg font-bold tracking-tight">
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

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                  item.active
                    ? "border-l-[3px] border-accent bg-accent/12 text-white"
                    : "border-l-[3px] border-transparent text-zinc-500 hover:bg-surface-800/80 hover:text-zinc-200",
                )}
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    item.active ? "text-accent" : "text-zinc-600 group-hover:text-zinc-400",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 px-3 pb-4">
          <div className="glass-panel relative overflow-hidden p-4">
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-accent/10 blur-2xl" />
            <div className="relative">
              <div className="mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-gold" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
                  ChessQ Premium
                </span>
              </div>
              <p className="mb-3 text-[11px] leading-relaxed text-zinc-500">
                Unlock all features, advanced analytics, and exclusive tournaments.
              </p>
              <button
                type="button"
                className="w-full rounded-lg bg-accent px-3 py-2 text-xs font-bold text-surface-950 transition hover:bg-accent-hover glow-accent"
              >
                Upgrade Now
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-[58px] animate-pulse rounded-xl border border-border bg-surface-850" />
          ) : user ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface-850 px-3 py-2.5">
              <AvatarPlaceholder size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {displayName}
                </p>
                <p className="text-[11px] text-zinc-500">
                  Rating{" "}
                  <span className="font-medium text-accent">{rating}</span>
                </p>
              </div>
              <button
                type="button"
                aria-label="Log out"
                onClick={handleLogout}
                className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-surface-800 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center rounded-xl border border-border bg-surface-850 px-3 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-accent/40 hover:text-accent"
            >
              Log In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
