import { Brain, Play, AlertCircle, Info } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { useLatestSensor } from "@/hooks/useSensorHistory";
import PredictionCard from "@/components/predictions/PredictionCard";
import { cn } from "@/lib/utils";

// All features the model uses (from prediction_service.py)
const MODEL_FEATURES = [
  { group: "Live Sensor (from /api/history)",
    items: ["pH Level", "Turbidity (NTU)", "Temperature (°C)"] },
  { group: "Water Quality (backend defaults)",
    items: ["Contaminant Level (ppm)", "Dissolved Oxygen (mg/L)", "Nitrate Level (mg/L)", "Lead Concentration (µg/L)", "Bacteria Count (CFU/mL)"] },
  { group: "Socioeconomic (from RegionData table)",
    items: ["Sanitation Coverage (%)", "Healthcare Access Index (0-100)", "Population Density (/km²)", "Access to Clean Water (%)", "GDP per Capita (USD)", "Urbanization Rate (%)", "Rainfall (mm/yr)"] },
  { group: "Categorical (backend defaults)",
    items: ["Country", "Region", "Water Source Type", "Water Treatment Method"] },
];

export default function PredictPage() {
  const { data: prediction, runPrediction, isFetching, isError, error } = usePrediction();
  const { latest } = useLatestSensor();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          AI Prediction Engine
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Runs XGBoost / RandomForest on latest sensor + regional data
        </p>
      </div>

      {/* Trigger panel */}
      <div className="card-glow rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 animate-slide-up opacity-0 stagger-1">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-5 h-5 text-primary" />
            <p className="font-semibold">Run Outbreak Prediction</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Calls <code className="text-primary font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">GET /api/prediction</code>
            &mdash; fetches latest sensor reading, combines with regional data, runs the trained model and returns risk level + SHAP explanation.
          </p>
          {!latest && (
            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              No sensor data found. Submit a reading on the Sensor page first.
            </p>
          )}
        </div>

        <button
          id="run-prediction-btn"
          onClick={runPrediction}
          disabled={isFetching || !latest}
          className={cn(
            "shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-xl",
            "text-sm font-bold tracking-wide transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:brightness-110 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
            "shadow-[0_0_24px_hsla(185,80%,45%,0.4)]"
          )}
        >
          {isFetching ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Prediction
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive animate-fade-in opacity-0">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Prediction failed</p>
            <p className="text-xs mt-0.5 text-destructive/80">{(error as Error)?.message}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {prediction && !isFetching && (
        <PredictionCard prediction={prediction} />
      )}

      {/* Feature info panel */}
      <div className="card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-3">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Model Feature Map
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODEL_FEATURES.map(({ group, items }) => (
            <div key={group} className="space-y-1.5">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                {group}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => (
                  <li key={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
