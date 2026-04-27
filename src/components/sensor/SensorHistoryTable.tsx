import type { SensorReading } from "@/types";
import { formatTimestamp, phStatus, turbidityStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SensorHistoryTableProps {
  data: SensorReading[];
  pageSize?: number;
}

const PH_COLORS    = { safe: "text-emerald-400", warning: "text-amber-400", danger: "text-red-400" };
const TURB_COLORS  = { safe: "text-emerald-400", warning: "text-amber-400", danger: "text-red-400" };

export default function SensorHistoryTable({ data, pageSize = 10 }: SensorHistoryTableProps) {
  const [page, setPage] = useState(0);
  const sorted  = [...data].reverse(); // newest first
  const total   = Math.ceil(sorted.length / pageSize);
  const sliced  = sorted.slice(page * pageSize, (page + 1) * pageSize);

  if (!data.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No sensor readings stored yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["#", "pH", "Turbidity (NTU)", "Temp (°C)", "Recorded At"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[11px] font-semibold tracking-widest text-muted-foreground uppercase whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sliced.map((row, i) => {
              const phSt   = phStatus(row.ph);
              const turbSt = turbidityStatus(row.turbidity);
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20",
                    "animate-fade-in opacity-0"
                  )}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{row.id}</td>
                  <td className={cn("px-4 py-2.5 font-mono font-semibold tabular-nums", PH_COLORS[phSt])}>
                    {row.ph.toFixed(2)}
                  </td>
                  <td className={cn("px-4 py-2.5 font-mono font-semibold tabular-nums", TURB_COLORS[turbSt])}>
                    {row.turbidity.toFixed(1)}
                  </td>
                  <td className="px-4 py-2.5 font-mono tabular-nums text-violet-300">
                    {row.temperature.toFixed(1)}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">
                    {formatTimestamp(row.timestamp)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {page + 1} of {total} ({data.length} total)
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              disabled={page >= total - 1}
              className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
