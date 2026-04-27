import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { SensorReading } from "@/types";
import { formatTimestamp } from "@/lib/utils";

interface SensorSparklineProps {
  data: SensorReading[];
  maxPoints?: number;
}

const LINES = [
  { key: "ph",          color: "#22d3ee", label: "pH"           },
  { key: "turbidity",   color: "#f59e0b", label: "Turbidity"    },
  { key: "temperature", color: "#a78bfa", label: "Temp °C"      },
] as const;

type LineKey = typeof LINES[number]["key"];

// Custom tooltip
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs space-y-1 shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: p.color }}>{p.name}:</span>
          <span className="font-semibold tabular-nums">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SensorSparkline({ data, maxPoints = 20 }: SensorSparklineProps) {
  const sliced = data.slice(-maxPoints).map((d) => ({
    ...d,
    label: formatTimestamp(d.timestamp).split(",")[1]?.trim() ?? d.id,
  }));

  if (sliced.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        No sensor data recorded yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={sliced} margin={{ top: 6, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsla(220,20%,25%,0.5)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: "hsl(220,10%,55%)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "hsl(220,10%,55%)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {LINES.map(({ key, color, label }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key as LineKey}
            name={label}
            stroke={color}
            strokeWidth={1.8}
            dot={false}
            activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
