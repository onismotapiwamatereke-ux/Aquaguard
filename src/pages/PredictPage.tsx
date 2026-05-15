import { useState } from "react";
import { ShieldCheck, Loader2, AlertCircle, Droplets, FlaskConical } from "lucide-react";
import { usePrediction } from "@/hooks/usePrediction";
import { useLatestSensor } from "@/hooks/useSensorHistory";
import { useAppLocation } from "@/context/LocationContext";
import LocationSelector from "@/components/dashboard/LocationSelector";
import PredictionCard from "@/components/predictions/PredictionCard";
import { cn } from "@/lib/utils";
import type { PredictionInput } from "@/types";

const WATER_SOURCES = ["Well", "River", "Lake", "Tap / Piped Water", "Spring", "Borehole", "Rainwater", "Other"];
const TREATMENT_METHODS = ["None", "Boiling", "Chlorination", "Filtration", "UV Treatment", "Reverse Osmosis", "Solar Disinfection"];

interface ExtraField {
  key: keyof PredictionInput;
  label: string;
  description: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  placeholder: string;
  safeHint: string;
}

const EXTRA_FIELDS: ExtraField[] = [
  { key: "contaminant_level",  label: "Chemical Contamination",    description: "General level of chemical pollutants in the water",  unit: "ppm",     min: 0,    max: 100,   step: 0.1, placeholder: "e.g. 5",    safeHint: "Below 10 ppm is generally acceptable" },
  { key: "dissolved_oxygen",   label: "Dissolved Oxygen",          description: "Amount of oxygen dissolved in the water",            unit: "mg/L",    min: 0,    max: 20,    step: 0.1, placeholder: "e.g. 6",    safeHint: "Healthy water: 6 – 9 mg/L" },
  { key: "nitrate_level",      label: "Nitrate Content",           description: "Nitrate from fertilisers or sewage in the water",    unit: "mg/L",    min: 0,    max: 500,   step: 0.1, placeholder: "e.g. 10",   safeHint: "WHO limit: below 50 mg/L" },
  { key: "lead_concentration", label: "Lead Content",              description: "Amount of lead detected in the water",               unit: "µg/L",    min: 0,    max: 1000,  step: 0.1, placeholder: "e.g. 2",    safeHint: "WHO safe limit: below 10 µg/L" },
  { key: "bacteria_count",     label: "Bacteria Count",            description: "Number of bacteria colonies found per mL",           unit: "CFU/mL",  min: 0,    max: 100000, step: 1,  placeholder: "e.g. 500",  safeHint: "Drinking water should be 0 CFU/mL" },
  { key: "access_clean_water", label: "Access to Clean Water",     description: "% of people in your area with clean water access",   unit: "%",       min: 0,    max: 100,   step: 1,  placeholder: "e.g. 60",   safeHint: "Higher % = better community water access" },
  { key: "rainfall",           label: "Annual Rainfall",           description: "Approximate yearly rainfall in your area",           unit: "mm/year", min: 0,    max: 5000,  step: 10, placeholder: "e.g. 800",  safeHint: "Average varies by region" },
];

export default function PredictPage() {
  const { country, region } = useAppLocation();
  const { data: prediction, runPrediction, isFetching, isError, error } = usePrediction();
  const { latest } = useLatestSensor();

  const [waterSource, setWaterSource]       = useState("Well");
  const [treatmentMethod, setTreatmentMethod] = useState("Boiling");
  const [extras, setExtras] = useState<Partial<Record<keyof PredictionInput, string>>>({});

  const handleRun = () => {
    const parsed: PredictionInput = {
      country,
      region,
      water_source: waterSource,
      treatment_method: treatmentMethod,
    };
    EXTRA_FIELDS.forEach(({ key }) => {
      const v = extras[key];
      if (v !== undefined && v !== "") {
        (parsed as Record<string, unknown>)[key] = parseFloat(v);
      }
    });
    runPrediction(parsed);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight animate-fade-in opacity-0">
          Detailed Safety Analysis
        </h1>
        <p className="text-sm text-muted-foreground mt-1 animate-fade-in opacity-0 stagger-1">
          Provide as much information as possible for a more accurate result
        </p>
      </div>

      {/* Location */}
      <LocationSelector />

      {/* Water source & treatment */}
      <div className="card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-1">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          <Droplets className="w-3.5 h-3.5" />
          Water Source Information
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Where does the water come from?</label>
            <select
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {WATER_SOURCES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">How is the water treated?</label>
            <select
              value={treatmentMethod}
              onChange={(e) => setTreatmentMethod(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {TREATMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Extra water quality fields */}
      <div className="card-glow rounded-xl p-5 space-y-4 animate-slide-up opacity-0 stagger-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            <FlaskConical className="w-3.5 h-3.5" />
            Additional Water Quality Details
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            These fields are optional — leave blank if you don't have the readings and the AI will use safe estimates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXTRA_FIELDS.map(({ key, label, description, unit, min, max, step, placeholder, safeHint }) => (
            <div key={key} className="space-y-1.5">
              <label className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">{description}</span>
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2.5">
                <input
                  type="number"
                  step={step}
                  min={min}
                  max={max}
                  placeholder={placeholder}
                  value={extras[key] ?? ""}
                  onChange={(e) => setExtras((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="flex-1 bg-transparent text-sm text-foreground font-mono focus:outline-none placeholder:text-muted-foreground/40 tabular-nums"
                />
                <span className="text-xs text-muted-foreground shrink-0">{unit}</span>
              </div>
              <p className="text-xs text-muted-foreground">{safeHint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Run button */}
      <div className="flex flex-col items-center gap-3">
        {!latest && (
          <p className="text-sm text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Please enter pH, clarity and temperature readings first (Water Test Results page).
          </p>
        )}

        <button
          onClick={handleRun}
          disabled={isFetching || !latest}
          className={cn(
            "flex items-center gap-2.5 px-10 py-4 rounded-xl",
            "text-base font-bold tracking-wide transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:brightness-110 active:scale-95",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
            "shadow-[0_0_32px_hsla(185,80%,45%,0.5)]"
          )}
        >
          {isFetching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analysing Water Safety…
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Run Safety Analysis
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Analysis failed</p>
            <p className="text-xs mt-0.5 text-destructive/80">{(error as Error)?.message}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {prediction && !isFetching && <PredictionCard prediction={prediction} />}
    </div>
  );
}
