import type { PredictionResult } from "@/types";
import { formatTimestamp, formatProbability, getRiskColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface RecentPredictionsProps {
  predictions: PredictionResult[];
}

export default function RecentPredictions({ predictions }: RecentPredictionsProps) {
  if (!predictions.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No predictions run yet. Go to the{" "}
        <a href="/predict" className="text-primary underline-offset-2 hover:underline">
          AI Predict
        </a>{" "}
        page.
      </p>
    );
  }

  const recent = [...predictions].reverse().slice(0, 5);

  return (
    <div className="space-y-2">
      {recent.map((p, i) => {
        const col = getRiskColor(p.risk_level);
        return (
          <div
            key={p.id}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5",
              "border bg-card/50 hover:bg-card transition-colors",
              "animate-slide-up opacity-0",
              `stagger-${Math.min(i + 1, 5)}`
            )}
          >
            {/* Risk badge */}
            <span
              className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", col.bg, col.text, col.border)}
            >
              {p.risk_level}
            </span>

            {/* Probability */}
            <span className="tabular-nums font-semibold text-sm" style={{ color: col.hex }}>
              {formatProbability(p.probability)}
            </span>

            {/* Timestamp */}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {formatTimestamp(p.timestamp)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
