import { useLocation } from "react-router-dom";
import { Menu, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSensorHistory } from "@/hooks/useSensorHistory";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  "/":        "Dashboard",
  "/sensor":  "Sensor Input",
  "/predict": "AI Prediction",
  "/history": "Sensor History",
  "/alerts":  "Alerts",
};

interface AppHeaderProps {
  onMenuClick: () => void;
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const location = useLocation();
  const label = ROUTE_LABELS[location.pathname] ?? "Page";

  const queryClient = useQueryClient();
  const { isFetching, isError } = useSensorHistory();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["sensor-history"] });
    queryClient.invalidateQueries({ queryKey: ["prediction"] });
  };

  const online = !isError;

  return (
    <header className="h-14 flex items-center gap-3 px-4 border-b border-border glass sticky top-0 z-20">
      {/* Mobile menu toggle */}
      <button
        id="header-menu-btn"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-muted-foreground text-sm hidden sm:block">AquaGuard</span>
        <span className="text-muted-foreground text-sm hidden sm:block">/</span>
        <span className="text-sm font-semibold truncate">{label}</span>
      </div>

      {/* Status + refresh */}
      <div className="flex items-center gap-2">
        {/* Backend status pill */}
        <div
          className={cn(
            "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            online
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
              : "bg-red-500/10 text-red-400 border-red-500/25"
          )}
        >
          {online ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {online ? "Backend Online" : "Offline"}
        </div>

        {/* Refresh button */}
        <button
          id="header-refresh-btn"
          onClick={handleRefresh}
          disabled={isFetching}
          className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
          aria-label="Refresh data"
        >
          <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
        </button>
      </div>
    </header>
  );
}
