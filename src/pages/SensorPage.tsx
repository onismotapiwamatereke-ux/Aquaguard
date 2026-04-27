import SensorForm from "@/components/sensor/SensorForm";
import SensorHistoryTable from "@/components/sensor/SensorHistoryTable";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { Waves, Database, AlertCircle } from "lucide-react";

export default function SensorPage() {
  const { data: history = [], isLoading, isError } = useSensorHistory();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          Sensor Input
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Submit manual or ESP32 sensor readings to the backend
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-2 card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Waves className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">New Reading</p>
              <p className="text-[11px] text-muted-foreground">POST → /api/sensor-data</p>
            </div>
          </div>

          {/* Field guide */}
          <div className="rounded-lg bg-muted/40 border border-border p-3 space-y-1.5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-[11px] uppercase tracking-widest mb-2">
              Model inputs from sensor
            </p>
            {[
              { name: "pH Level",       range: "0–14",      safe: "6.5–8.5" },
              { name: "Turbidity",      range: "0–4000 NTU",safe: "< 5 NTU" },
              { name: "Temperature",    range: "-10–50 °C", safe: "10–30 °C" },
            ].map(({ name, range, safe }) => (
              <div key={name} className="flex justify-between">
                <span>{name}</span>
                <span className="tabular-nums">
                  {range}{" "}
                  <span className="text-emerald-400">({safe})</span>
                </span>
              </div>
            ))}
          </div>

          <SensorForm />
        </div>

        {/* History panel */}
        <div className="lg:col-span-3 card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Sensor History</p>
                <p className="text-[11px] text-muted-foreground">
                  GET /api/history · {history.length} records
                </p>
              </div>
            </div>
          </div>

          {isError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Cannot reach backend. Make sure Flask is running on port 5000.
            </div>
          )}

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : (
            <SensorHistoryTable data={history} />
          )}
        </div>
      </div>
    </div>
  );
}
