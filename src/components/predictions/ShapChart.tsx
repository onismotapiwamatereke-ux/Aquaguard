import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import type { ShapFeature } from "@/types";

interface ShapChartProps {
  features: ShapFeature[];
}

// Shorten long feature names for display
function shortName(name: string) {
  return name
    .replace("(% of Population)", "%")
    .replace("(per 1,000 live births)", "/1k")
    .replace("(people per km²)", "/km²")
    .replace("(mg/L)", "mg/L")
    .replace("(µg/L)", "µg/L")
    .replace("(CFU/mL)", "CFU")
    .replace("(NTU)", "NTU")
    .replace("(ppm)", "ppm")
    .replace("(USD)", "USD")
    .replace("(mm per year)", "mm/yr")
    .replace("(0-100)", "")
    .replace("(°C)", "°C")
    .replace(" Level", "")
    .replace(" Concentration", "")
    .replace(" Coverage", " Cov.")
    .trim();
}

function CustomTooltip({ active, payload }: {
  active?: boolean;
  payload?: { payload: ShapFeature }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const positive = d.impact >= 0;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs space-y-1 shadow-xl max-w-[220px]">
      <p className="text-foreground font-medium leading-snug">{d.feature}</p>
      <p className={positive ? "text-red-400" : "text-emerald-400"}>
        Impact: {d.impact >= 0 ? "+" : ""}{d.impact.toFixed(4)}
      </p>
      <p className="text-muted-foreground">
        {positive ? "Increases" : "Decreases"} outbreak risk
      </p>
    </div>
  );
}

export default function ShapChart({ features }: ShapChartProps) {
  if (!features.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No explanation data available
      </p>
    );
  }

  const data = features.map((f) => ({
    ...f,
    displayName: shortName(f.feature),
  }));

  return (
    <div className="space-y-2 animate-fade-in opacity-0">
      <p className="text-xs text-muted-foreground">
        Top factors driving this prediction (SHAP values)
      </p>
      <ResponsiveContainer width="100%" height={data.length * 48 + 24}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          barSize={18}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: "hsl(220,10%,55%)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v.toFixed(3)}
          />
          <YAxis
            type="category"
            dataKey="displayName"
            width={120}
            tick={{ fontSize: 11, fill: "hsl(195,20%,75%)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsla(220,20%,25%,0.4)" }} />
          <ReferenceLine x={0} stroke="hsl(220,18%,28%)" strokeWidth={1} />
          <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.impact >= 0 ? "#f87171" : "#34d399"}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-400 opacity-85" />
          Increases risk
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 opacity-85" />
          Reduces risk
        </span>
      </div>
    </div>
  );
}
