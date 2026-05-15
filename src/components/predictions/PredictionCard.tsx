import type { PredictionResult } from "@/types";
import RiskGauge from "@/components/dashboard/RiskGauge";
import ShapChart from "./ShapChart";
import { formatTimestamp, formatProbability, getRiskColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock, Lightbulb, BarChart2, Info } from "lucide-react";

interface PredictionCardProps {
  prediction: PredictionResult;
}

// Human-readable advice per risk level
const RISK_ADVICE: Record<string, string[]> = {
  "HIGH RISK": [
    "Immediately notify public health authorities.",
    "Advise community to boil or treat all drinking water.",
    "Deploy mobile health units for symptomatic screening.",
    "Check and isolate suspected contamination sources.",
  ],
  "MEDIUM RISK": [
    "Issue precautionary water-quality advisory.",
    "Increase water-testing frequency in affected regions.",
    "Alert healthcare facilities to expect elevated case load.",
  ],
  "LOW RISK": [
    "Continue routine water monitoring.",
    "Maintain current sanitation and treatment protocols.",
    "Log data for trend analysis.",
  ],
};

export default function PredictionCard({ prediction }: PredictionCardProps) {
  const col = getRiskColor(prediction.risk_level);
  const advice = RISK_ADVICE[prediction.risk_level] ?? [];

  return (
    <div className="space-y-5 animate-slide-up opacity-0">
      {/* Top row: gauge + metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Gauge */}
        <div className="card-glow rounded-xl p-6 flex flex-col items-center justify-center gap-4">
          <RiskGauge
            probability={prediction.probability}
            riskLevel={prediction.risk_level}
            size={200}
          />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Predicted at {formatTimestamp(prediction.timestamp)}</span>
          </div>
        </div>

        {/* Stats & thresholds */}
        <div className="space-y-4">
          {/* Probability bar */}
          <div className="card-glow rounded-xl p-5 space-y-3">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Disease Outbreak Risk Score
            </p>
            <p className="text-4xl font-bold tabular-nums" style={{ color: col.hex }}>
              {formatProbability(prediction.probability)}
            </p>
            <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${prediction.probability * 100}%`,
                  background: col.hex,
                  boxShadow: `0 0 12px ${col.hex}88`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0% — LOW</span>
              <span>40% — MEDIUM</span>
              <span>70%+ — HIGH</span>
            </div>
          </div>

          {/* Threshold legend */}
          <div className="card-glow rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Risk Thresholds
            </p>
            {[
              { range: "≥ 70%", level: "HIGH RISK",   col: "#f87171" },
              { range: "40–70%",level: "MEDIUM RISK", col: "#fbbf24" },
              { range: "< 40%", level: "LOW RISK",    col: "#34d399" },
            ].map(({ range, level, col: c }) => (
              <div key={level} className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{range}</span>
                <span className="font-semibold" style={{ color: c }}>{level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SHAP Explanation */}
      {prediction.explanation.length > 0 && (
        <div className="card-glow rounded-xl p-5 space-y-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" />
            What Influenced This Result
          </p>
          <ShapChart features={prediction.explanation} />
        </div>
      )}

      {/* Recommended actions */}
      <div
        className={cn("rounded-xl p-5 space-y-3 border", col.bg, col.border)}
      >
        <p className={cn("text-xs font-semibold tracking-widest uppercase flex items-center gap-1.5", col.text)}>
          <Lightbulb className="w-3.5 h-3.5" />
          Recommended Actions
        </p>
        <ul className="space-y-2">
          {advice.map((a, i) => (
            <li key={i} className={cn("text-sm flex items-start gap-2", col.text)}>
              <span className="mt-0.5 shrink-0">→</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
