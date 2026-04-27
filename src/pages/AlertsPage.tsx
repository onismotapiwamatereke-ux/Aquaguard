import { useState } from "react";
import AlertFeed from "@/components/alerts/AlertFeed";
import { usePrediction } from "@/hooks/usePrediction";
import type { RiskLevel } from "@/types";
import { Bell, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterTab = "ALL" | RiskLevel;

const TABS: { id: FilterTab; label: string; icon: React.ElementType; color: string }[] = [
  { id: "ALL",         label: "All",    icon: Bell,          color: "text-primary" },
  { id: "HIGH RISK",   label: "High",   icon: AlertTriangle, color: "text-red-400" },
  { id: "MEDIUM RISK", label: "Medium", icon: AlertCircle,   color: "text-amber-400" },
  { id: "LOW RISK",    label: "Low",    icon: CheckCircle,   color: "text-emerald-400" },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterTab>("ALL");
  const { data: prediction } = usePrediction();

  // Build a prediction array — in real deployment this would come from
  // a GET /api/predictions history endpoint; for now use the session cache.
  const predictions = prediction ? [prediction] : [];

  const counts: Record<FilterTab, number> = {
    ALL:          predictions.length,
    "HIGH RISK":  predictions.filter((p) => p.risk_level === "HIGH RISK").length,
    "MEDIUM RISK":predictions.filter((p) => p.risk_level === "MEDIUM RISK").length,
    "LOW RISK":   predictions.filter((p) => p.risk_level === "LOW RISK").length,
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          Alerts
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Prediction-based outbreak alerts filtered by risk level
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap animate-slide-up opacity-0 stagger-1">
        {TABS.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            id={`alert-tab-${id.toLowerCase().replace(" ", "-")}`}
            onClick={() => setFilter(id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
              filter === id
                ? "bg-secondary border-border text-foreground shadow-sm"
                : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className={cn("w-3.5 h-3.5", filter === id ? color : "")} />
            {label}
            <span
              className={cn(
                "ml-1 text-xs px-1.5 py-0.5 rounded-full font-semibold",
                counts[id] > 0 ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              {counts[id]}
            </span>
          </button>
        ))}
      </div>

      {/* Alert feed */}
      <div className="animate-slide-up opacity-0 stagger-2">
        {predictions.length === 0 ? (
          <div className="card-glow rounded-xl p-10 flex flex-col items-center gap-3 text-center">
            <Bell className="w-12 h-12 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              No alerts yet. Run a prediction from the{" "}
              <a href="/predict" className="text-primary hover:underline underline-offset-2">
                AI Predict
              </a>{" "}
              page to generate alerts.
            </p>
          </div>
        ) : (
          <AlertFeed predictions={predictions} filter={filter} />
        )}
      </div>
    </div>
  );
}
