import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
  status?: "safe" | "warning" | "danger" | "neutral";
  className?: string;
  loading?: boolean;
}

const STATUS_COLORS = {
  safe:    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  warning: "text-amber-400   bg-amber-400/10   border-amber-400/20",
  danger:  "text-red-400     bg-red-400/10     border-red-400/20",
  neutral: "text-primary     bg-primary/10     border-primary/20",
};

const TREND_ICONS = {
  up:     TrendingUp,
  down:   TrendingDown,
  stable: Minus,
};

const TREND_COLORS = {
  up:     "text-emerald-400",
  down:   "text-red-400",
  stable: "text-muted-foreground",
};

export default function StatCard({
  id,
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendLabel,
  status = "neutral",
  className,
  loading = false,
}: StatCardProps) {
  const TrendIcon = trend ? TREND_ICONS[trend] : null;

  return (
    <div
      id={id}
      className={cn(
        "card-glow rounded-xl p-5 flex flex-col gap-3",
        "hover:scale-[1.02] transition-all duration-200",
        "animate-slide-up opacity-0",
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {title}
        </p>
        <div className={cn("p-2 rounded-lg border", STATUS_COLORS[status])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Value */}
      {loading ? (
        <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
      ) : (
        <div className="flex items-baseline gap-1.5">
          <span className="metric-value text-foreground">{value}</span>
          {unit && (
            <span className="text-sm text-muted-foreground font-medium">{unit}</span>
          )}
        </div>
      )}

      {/* Trend row */}
      {trend && TrendIcon && (
        <div className={cn("flex items-center gap-1 text-xs font-medium", TREND_COLORS[trend])}>
          <TrendIcon className="w-3.5 h-3.5" />
          <span>{trendLabel ?? trend}</span>
        </div>
      )}
    </div>
  );
}
