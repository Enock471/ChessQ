import { cn } from "@/lib/utils";

type AvatarPlaceholderProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-11 w-11",
};

export function AvatarPlaceholder({ size = "md", className }: AvatarPlaceholderProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "shrink-0 rounded-full border border-border-light/60 bg-surface-700/40",
        sizes[size],
        className,
      )}
    />
  );
}
