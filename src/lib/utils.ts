import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Colour tokens for each risk level */
export const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; border: string; hex: string }> = {
  "HIGH RISK":   { bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/40",   hex: "#f87171" },
  "MEDIUM RISK": { bg: "bg-amber-500/15",  text: "text-amber-400",  border: "border-amber-500/40", hex: "#fbbf24" },
  "LOW RISK":    { bg: "bg-emerald-500/15",text: "text-emerald-400",border: "border-emerald-500/40",hex: "#34d399" },
};

export function getRiskColor(level: RiskLevel | null) {
  if (!level) return RISK_COLORS["LOW RISK"];
  return RISK_COLORS[level];
}

/** Format a probability 0–1 as a percentage string */
export function formatProbability(p: number) {
  return `${(p * 100).toFixed(1)}%`;
}

/** Format an ISO timestamp nicely */
export function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Water quality thresholds for sensor values */
export const PH_SAFE = { min: 6.5, max: 8.5 };
export const TURBIDITY_SAFE = { max: 5 };   // NTU — WHO guideline
export const TEMPERATURE_SAFE = { min: 10, max: 30 };

export function phStatus(ph: number): "safe" | "warning" | "danger" {
  if (ph >= PH_SAFE.min && ph <= PH_SAFE.max) return "safe";
  if (ph < 5.5 || ph > 9.5) return "danger";
  return "warning";
}

export function turbidityStatus(t: number): "safe" | "warning" | "danger" {
  if (t <= TURBIDITY_SAFE.max) return "safe";
  if (t <= 50) return "warning";
  return "danger";
}
