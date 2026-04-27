import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Waves,
  Brain,
  History,
  Bell,
  Droplets,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLatestSensor } from "@/hooks/useSensorHistory";

const NAV_ITEMS = [
  { to: "/",        label: "Dashboard",   icon: LayoutDashboard, end: true },
  { to: "/sensor",  label: "Sensor Input", icon: Waves },
  { to: "/predict", label: "AI Predict",   icon: Brain },
  { to: "/history", label: "History",      icon: History },
  { to: "/alerts",  label: "Alerts",       icon: Bell },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function AppSidebar({ open, onClose }: AppSidebarProps) {
  const location = useLocation();
  const { latest } = useLatestSensor();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 flex-col",
          "border-r border-sidebar-border",
          "transition-transform duration-300 ease-in-out",
          "glass-strong flex flex-col",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 border border-primary/30">
            <Droplets className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground tracking-widest uppercase">
              AquaGuard
            </p>
            <p className="text-[10px] text-muted-foreground">Disease Detection AI</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Navigation
          </p>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn("nav-link group", isActive && "active")
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        {/* Live sensor snapshot */}
        <div className="px-3 pb-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-3 space-y-2">
            <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase flex items-center gap-1.5">
              <span className="pulse-dot bg-emerald-400 w-1.5 h-1.5" />
              Live Sensor
            </p>
            {latest ? (
              <div className="grid grid-cols-3 gap-1 text-center">
                {[
                  { label: "pH", value: latest.ph.toFixed(1) },
                  { label: "NTU", value: latest.turbidity.toFixed(0) },
                  { label: "°C", value: latest.temperature.toFixed(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-background/40 rounded-lg p-1.5">
                    <p className="text-[9px] text-muted-foreground">{label}</p>
                    <p className="text-xs font-bold text-foreground tabular-nums">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground text-center py-1">
                No data yet
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
