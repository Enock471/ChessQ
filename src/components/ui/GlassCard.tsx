import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  id?: string;
};

export function GlassCard({ children, className, glow, id }: GlassCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "glass-panel p-5 transition-colors hover:border-border-light/60",
        glow && "glow-accent border-accent/20",
        className,
      )}
    >
      {children}
    </div>
  );
}
