import SensorForm from "@/components/sensor/SensorForm";
import SensorHistoryTable from "@/components/sensor/SensorHistoryTable";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { Droplets, ClipboardList, AlertCircle, Info } from "lucide-react";

export default function SensorPage() {
  const { data: history = [], isLoading, isError } = useSensorHistory();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          Enter Water Test Results
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Record your water measurements here — the AI will use this data to assess safety
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Droplets className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">New Water Reading</p>
                <p className="text-[11px] text-muted-foreground">Fill in each value from your test kit</p>
              </div>
            </div>

            <SensorForm />
          </div>

          {/* Helper info */}
          <div className="card-glow rounded-xl p-4 space-y-2 animate-slide-up opacity-0 stagger-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              <Info className="w-3.5 h-3.5" />
              How to read your test kit
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">pH:</span>
                Use a pH strip or digital meter. Normal drinking water is 6.5–8.5.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">Clarity:</span>
                A turbidity meter measures cloudiness. Below 5 NTU is safe.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold shrink-0">Temp:</span>
                Use a thermometer. Record the actual water temperature.
              </li>
            </ul>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-3 card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">Previous Readings</p>
                <p className="text-[11px] text-muted-foreground">
                  {history.length} reading{history.length !== 1 ? "s" : ""} recorded
                </p>
              </div>
            </div>
          </div>

          {isError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Cannot connect to the server. Make sure it is running.
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
