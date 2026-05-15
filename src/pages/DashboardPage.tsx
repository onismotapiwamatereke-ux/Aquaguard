import { FlaskConical, Waves, Thermometer, Activity, ShieldCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/dashboard/StatCard";
import SensorSparkline from "@/components/dashboard/SensorSparkline";
import RiskGauge from "@/components/dashboard/RiskGauge";
import RecentPredictions from "@/components/dashboard/RecentPredictions";
import LocationSelector from "@/components/dashboard/LocationSelector";
import { useLatestSensor, useSensorHistory } from "@/hooks/useSensorHistory";
import { usePrediction } from "@/hooks/usePrediction";
import { useAppLocation } from "@/context/LocationContext";
import { phStatus, turbidityStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";

const RISK_STYLES = {
  "HIGH RISK":   { bg: "bg-red-500/10 border-red-500/30",    text: "text-red-400",    label: "High Risk — Action Needed" },
  "MEDIUM RISK": { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400",  label: "Medium Risk — Monitor Closely" },
  "LOW RISK":    { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", label: "Low Risk — Water Appears Safe" },
};

export default function DashboardPage() {
  const { latest, isLoading: sensorLoading } = useLatestSensor();
  const { data: history = [] } = useSensorHistory();
  const { country, region } = useAppLocation();
  const { data: prediction, runPrediction, isFetching: predicting } = usePrediction({ country, region });

  const phSt   = latest ? phStatus(latest.ph)              : "safe";
  const turbSt = latest ? turbidityStatus(latest.turbidity) : "safe";

  const riskStyle = prediction ? RISK_STYLES[prediction.risk_level] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          Water Safety Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Monitor your water quality and check for disease outbreak risk
        </p>
      </div>

      {/* Location selector */}
      <LocationSelector />

      {/* Big Check Safety button */}
      <div className="card-glow rounded-xl p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex-1 space-y-1">
          <p className="text-lg font-bold text-foreground">Check Water Safety Now</p>
          <p className="text-sm text-muted-foreground">
            Our AI analyses your latest water readings and tells you if there is a risk of
            waterborne disease in your area.
          </p>
          {!latest && (
            <p className="text-xs text-amber-400 mt-1">
              No water readings found yet.{" "}
              <Link to="/sensor" className="underline underline-offset-2 hover:text-amber-300">
                Enter your readings first →
              </Link>
            </p>
          )}
        </div>

        <button
          onClick={() => runPrediction({ country, region })}
          disabled={predicting || !latest}
          className={cn(
            "shrink-0 flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold",
            "bg-primary text-primary-foreground transition-all duration-200",
            "hover:brightness-110 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
            "shadow-[0_0_32px_hsla(185,80%,45%,0.5)]"
          )}
        >
          {predicting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Check Safety
            </>
          )}
        </button>
      </div>

      {/* Risk result (full-width banner when available) */}
      {prediction && riskStyle && (
        <div className={cn("rounded-xl border px-6 py-5 flex items-center gap-4", riskStyle.bg)}>
          <ShieldCheck className={cn("w-8 h-8 shrink-0", riskStyle.text)} />
          <div className="flex-1">
            <p className={cn("text-lg font-bold", riskStyle.text)}>{riskStyle.label}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              AI confidence: {(prediction.probability * 100).toFixed(0)}% chance of outbreak risk
              {prediction.explanation.length > 0 && (
                <> &mdash; main factor: <span className="text-foreground font-medium">{prediction.explanation[0].feature.split('(')[0].trim()}</span></>
              )}
            </p>
          </div>
          <RiskGauge probability={prediction.probability} riskLevel={prediction.risk_level} size={100} />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-ph"
          title="pH Level"
          value={latest?.ph.toFixed(2) ?? "—"}
          icon={FlaskConical}
          status={phSt}
          loading={sensorLoading}
          trendLabel={phSt === "safe" ? "Within safe range" : phSt === "warning" ? "Slightly off" : "Needs attention"}
          trend={phSt === "safe" ? "stable" : "up"}
          className="stagger-1"
        />
        <StatCard
          id="stat-turbidity"
          title="Water Clarity"
          value={latest?.turbidity.toFixed(1) ?? "—"}
          unit="NTU"
          icon={Waves}
          status={turbSt}
          loading={sensorLoading}
          trendLabel={turbSt === "safe" ? "Clear water" : "Cloudy water"}
          trend={turbSt === "safe" ? "stable" : "up"}
          className="stagger-2"
        />
        <StatCard
          id="stat-temperature"
          title="Water Temperature"
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

      {/* Sparkline */}
      <div className="card-glow rounded-xl p-5 space-y-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Water Quality Over Time
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Last {Math.min(history.length, 20)} readings
          </p>
        </div>
        <SensorSparkline data={history} />
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
          {[
            { color: "#22d3ee", label: "pH" },
            { color: "#f59e0b", label: "Turbidity / Clarity (NTU)" },
            { color: "#a78bfa", label: "Temperature (°C)" },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 rounded-full" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Recent predictions */}
      {prediction && (
        <div className="card-glow rounded-xl p-5 space-y-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Recent Safety Checks
          </p>
          <RecentPredictions predictions={[prediction]} />
        </div>
      )}
    </div>
  );
}
