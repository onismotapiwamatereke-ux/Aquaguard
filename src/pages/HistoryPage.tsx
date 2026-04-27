import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { formatTimestamp } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function HistoryPage() {
  const { data: history = [], isLoading, isError } = useSensorHistory();

  const chartData = history.map((d) => ({
    label: formatTimestamp(d.timestamp).split(",")[1]?.trim() ?? String(d.id),
    ph: d.ph,
    turbidity: d.turbidity,
    temperature: d.temperature,
  }));

  const charts = [
    { key: "ph",          label: "pH Level",         color: "#22d3ee", safe: "Safe: 6.5–8.5",  domain: [0, 14] as [number,number] },
    { key: "turbidity",   label: "Turbidity (NTU)",  color: "#f59e0b", safe: "Safe: < 5 NTU",  domain: undefined },
    { key: "temperature", label: "Temperature (°C)", color: "#a78bfa", safe: "Optimal: 10–30°C",domain: undefined },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">Sensor History</h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Full time-series of all {history.length} recorded readings
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Cannot reach backend. Ensure Flask is running on port 5000.
        </div>
      )}

      {charts.map(({ key, label, color, safe, domain }, i) => (
        <div
          key={key}
          className={`card-glow rounded-xl p-5 space-y-3 animate-slide-up opacity-0 stagger-${i + 1}`}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: color }} />
            <p className="text-sm font-semibold">{label}</p>
            <span className="ml-auto text-xs text-muted-foreground">{safe}</span>
          </div>

          {isLoading ? (
            <div className="h-48 rounded-lg bg-muted/30 animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,20%,25%,0.5)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "hsl(220,10%,55%)" }}
                  tickLine={false} axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "hsl(220,10%,55%)" }}
                  tickLine={false} axisLine={false}
                  domain={domain}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(220,22%,11%)",
                    border: "1px solid hsl(220,18%,18%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: color }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      ))}
    </div>
  );
}
