import type { PredictionResult, RiskLevel } from "@/types";
import { formatTimestamp, formatProbability, getRiskColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface AlertFeedProps {
  predictions: PredictionResult[];
  filter?: RiskLevel | "ALL";
}

const RISK_ICONS = {
  "HIGH RISK":   AlertTriangle,
  "MEDIUM RISK": AlertCircle,
  "LOW RISK":    CheckCircle,
};

export default function AlertFeed({ predictions, filter = "ALL" }: AlertFeedProps) {
  const items = [...predictions]
    .reverse()
    .filter((p) => filter === "ALL" || p.risk_level === filter);

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
        <CheckCircle className="w-10 h-10 opacity-30" />
        <p className="text-sm">No {filter === "ALL" ? "" : filter.toLowerCase() + " "}alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((p, i) => {
        const col  = getRiskColor(p.risk_level);
        const Icon = RISK_ICONS[p.risk_level];

        return (
          <div
            key={p.id}
            className={cn(
              "flex items-start gap-4 rounded-xl p-4 border",
              "animate-slide-in-left opacity-0 transition-shadow hover:shadow-lg",
              col.bg, col.border
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Icon */}
            <div className={cn("p-2 rounded-lg shrink-0", col.bg, col.border, "border")}>
              <Icon className={cn("w-4 h-4", col.text)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className={cn("text-sm font-bold tracking-wide", col.text)}>
                  {p.risk_level}
                </span>
                <span
                  className="text-lg font-bold tabular-nums"
                  style={{ color: col.hex }}
                >
                  {formatProbability(p.probability)}
                </span>
              </div>

              {/* SHAP top factor */}
              {p.explanation.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Key factor:{" "}
                  <span className={cn("font-medium", col.text)}>
                    {p.explanation[0].feature.replace(/\(.*?\)/g, "").trim()}
                  </span>{" "}
                  (impact {p.explanation[0].impact >= 0 ? "+" : ""}
                  {p.explanation[0].impact.toFixed(4)})
                </p>
              )}

              <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatTimestamp(p.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
