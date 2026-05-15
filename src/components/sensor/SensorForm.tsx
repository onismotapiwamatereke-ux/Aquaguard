import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { postSensorData } from "@/lib/api";
import type { SensorFormInput } from "@/types";
import { phStatus, turbidityStatus } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Send, FlaskConical, Thermometer, Waves } from "lucide-react";

const num = (label: string, min: number, max: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z
      .number({ required_error: `${label} is required`, invalid_type_error: `${label} must be a number` })
      .min(min, `${label} must be ≥ ${min}`)
      .max(max, `${label} must be ≤ ${max}`)
  );

const schema = z.object({
  ph:          num("pH Level", 0, 14),
  turbidity:   num("Turbidity", 0, 4000),
  temperature: num("Temperature", -10, 50),
});

type FormValues = z.infer<typeof schema>;

const FIELDS = [
  {
    key: "ph" as const,
    label: "pH Level",
    description: "How acidic or basic the water is",
    icon: FlaskConical,
    unit: "",
    min: 0, max: 14, step: 0.1,
    placeholder: "e.g. 7.0",
    hint: "Safe range: 6.5 – 8.5  |  Pure neutral water = 7.0",
    safeMin: 6.5, safeMax: 8.5,
  },
  {
    key: "turbidity" as const,
    label: "Water Clarity",
    description: "How cloudy or clear the water looks",
    icon: Waves,
    unit: "NTU",
    min: 0, max: 4000, step: 0.1,
    placeholder: "e.g. 1.0",
    hint: "Safe limit: below 5 NTU  |  Higher = cloudier water",
    safeMax: 5,
  },
  {
    key: "temperature" as const,
    label: "Water Temperature",
    description: "Current temperature of the water",
    icon: Thermometer,
    unit: "°C",
    min: -10, max: 50, step: 0.1,
    placeholder: "e.g. 25.0",
    hint: "Optimal: 10 – 30 °C",
  },
] as const;

export default function SensorForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const watched = watch();

  const mutation = useMutation({
    mutationFn: (data: SensorFormInput) => postSensorData(data),
    onSuccess: (reading) => {
      toast.success("Water reading saved!", {
        description: `pH ${reading.ph} · Clarity ${reading.turbidity} NTU · ${reading.temperature}°C`,
      });
      queryClient.invalidateQueries({ queryKey: ["sensor-history"] });
      reset();
    },
    onError: (err: Error) => {
      toast.error("Could not save reading", { description: err.message });
    },
  });

  const onSubmit = (data: FormValues) => mutation.mutate(data as SensorFormInput);

  const phSt   = phStatus(watched.ph ?? 7);
  const turbSt = turbidityStatus(watched.turbidity ?? 0);
  const statusColors = {
    safe:    "border-emerald-500/50 bg-emerald-500/5 focus-within:border-emerald-400",
    warning: "border-amber-500/50 bg-amber-500/5 focus-within:border-amber-400",
    danger:  "border-red-500/50 bg-red-500/5 focus-within:border-red-400",
  };

  return (
    <form id="sensor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {FIELDS.map(({ key, label, description, icon: Icon, unit, min, max, step, placeholder, hint }) => {
        const st = key === "ph" ? phSt : key === "turbidity" ? turbSt : "safe";
        const hasError = !!errors[key];

        return (
          <div key={key} className="space-y-1.5">
            <label htmlFor={`field-${key}`} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
                {unit && <span className="text-muted-foreground text-xs">({unit})</span>}
              </span>
              <span className="text-xs text-muted-foreground pl-5">{description}</span>
            </label>

            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                hasError ? "border-destructive/60 bg-destructive/5" : statusColors[st]
              )}
            >
              <input
                id={`field-${key}`}
                type="number"
                step={step}
                min={min}
                max={max}
                placeholder={placeholder}
                {...register(key)}
                className="flex-1 bg-transparent text-foreground text-sm font-mono focus:outline-none placeholder:text-muted-foreground/40 tabular-nums"
              />
              {unit && (
                <span className="text-xs text-muted-foreground shrink-0">{unit}</span>
              )}
            </div>

            {hasError ? (
              <p className="text-xs text-destructive">{errors[key]?.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{hint}</p>
            )}
          </div>
        );
      })}

      <button
        id="submit-sensor-btn"
        type="submit"
        disabled={!isValid || mutation.isPending}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3",
          "text-sm font-semibold transition-all duration-200",
          "bg-primary text-primary-foreground",
          "hover:brightness-110 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100",
          "shadow-[0_0_20px_hsla(185,80%,45%,0.3)]"
        )}
      >
        {mutation.isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            Saving…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Save Water Reading
          </>
        )}
      </button>
    </form>
  );
}
