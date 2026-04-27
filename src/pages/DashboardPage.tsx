import { FlaskConical, Waves, Thermometer, Activity, RefreshCw } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SensorSparkline from "@/components/dashboard/SensorSparkline";
import RiskGauge from "@/components/dashboard/RiskGauge";
import RecentPredictions from "@/components/dashboard/RecentPredictions";
import { useLatestSensor, useSensorHistory } from "@/hooks/useSensorHistory";
import { usePrediction } from "@/hooks/usePrediction";
import { phStatus, turbidityStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { latest, isLoading: sensorLoading } = useLatestSensor();
  const { data: history = [] } = useSensorHistory();
  const { data: prediction, runPrediction, isFetching: predicting } = usePrediction();

  const phSt   = latest ? phStatus(latest.ph)             : "safe";
  const turbSt = latest ? turbidityStatus(latest.turbidity): "safe";

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          System Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Real-time waterborne disease outbreak monitoring
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-ph"
          title="pH Level"
          value={latest?.ph.toFixed(2) ?? "—"}
          icon={FlaskConical}
          status={phSt}
          loading={sensorLoading}
          trendLabel={phSt === "safe" ? "Within range" : phSt === "warning" ? "Off range" : "Critical"}
          trend={phSt === "safe" ? "stable" : phSt === "warning" ? "up" : "up"}
          className="stagger-1"
        />
        <StatCard
          id="stat-turbidity"
          title="Turbidity"
          value={latest?.turbidity.toFixed(1) ?? "—"}
          unit="NTU"
          icon={Waves}
          status={turbSt}
          loading={sensorLoading}
          trendLabel={turbSt === "safe" ? "Clear water" : "Elevated"}
          trend={turbSt === "safe" ? "stable" : "up"}
          className="stagger-2"
        />
        <StatCard
          id="stat-temperature"
          title="Temperature"
          value={latest?.temperature.toFixed(1) ?? "—"}
          unit="°C"
          icon={Thermometer}
          status="neutral"
          loading={sensorLoading}
          trendLabel="Latest reading"
          trend="stable"
          className="stagger-3"
        />
        <StatCard
          id="stat-readings"
          title="Total Readings"
          value={history.length}
          icon={Activity}
          status="neutral"
          loading={sensorLoading}
          trendLabel="All time"
          trend="stable"
          className="stagger-4"
        />
      </div>

      {/* Main content: gauge + sparkline */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Latest prediction gauge */}
        <div className="lg:col-span-2 card-glow rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Latest Prediction
              </p>
              {prediction && (
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Model: XGBoost / RandomForest
                </p>
              )}
            </div>
            <button
              id="dashboard-run-predict-btn"
              onClick={runPrediction}
              disabled={predicting || !latest}
              title={!latest ? "Submit sensor data first" : "Run prediction"}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                "bg-primary/15 text-primary border border-primary/30",
                "hover:bg-primary/25 transition-colors disabled:opacity-40"
              )}
            >
              <RefreshCw className={cn("w-3.5 h-3.5", predicting && "animate-spin")} />
              {predicting ? "Running…" : "Run"}
            </button>
          </div>

          {prediction ? (
            <div className="flex flex-col items-center">
              <RiskGauge
                probability={prediction.probability}
                riskLevel={prediction.risk_level}
                size={180}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-2">
              <Activity className="w-10 h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                {latest
                  ? "Click Run to generate a prediction"
                  : "Submit sensor data first"}
              </p>
            </div>
          )}
        </div>

        {/* Sparkline chart */}
        <div className="lg:col-span-3 card-glow rounded-xl p-5 space-y-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Sensor Trends
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Last {Math.min(history.length, 20)} readings
            </p>
          </div>
          <SensorSparkline data={history} />

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
            {[
              { color: "#22d3ee", label: "pH" },
              { color: "#f59e0b", label: "Turbidity (NTU)" },
              { color: "#a78bfa", label: "Temperature (°C)" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded-full" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent predictions */}
      <div className="card-glow rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Recent Predictions
        </p>
        <RecentPredictions predictions={prediction ? [prediction] : []} />
      </div>
    </div>
  );
}
