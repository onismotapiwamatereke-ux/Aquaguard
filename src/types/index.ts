// ─── Backend Model Types (aligned with SQLAlchemy models) ─────────────────────

export type RiskLevel = "HIGH RISK" | "MEDIUM RISK" | "LOW RISK";

/** Mirrors backend SensorData model */
export interface SensorReading {
  id: number;
  ph: number;
  turbidity: number;
  temperature: number;
  timestamp: string; // ISO 8601
}

/** SHAP feature impact from prediction_service.py */
export interface ShapFeature {
  feature: string;
  impact: number;
}

/** Mirrors backend Prediction model + explanation */
export interface PredictionResult {
  id: number;
  risk_level: RiskLevel;
  probability: number; // 0.0 – 1.0
  timestamp: string; // ISO 8601
  explanation: ShapFeature[];
}

/** Mirrors backend RegionData model */
export interface RegionData {
  region: string;
  sanitation: number;
  healthcare_index: number;
  population_density: number;
}

// ─── Sensor Form Types ─────────────────────────────────────────────────────────

/** Input payload for POST /api/sensor-data */
export interface SensorFormInput {
  ph: number;          // 0 – 14
  turbidity: number;   // 0 – 4000 NTU
  temperature: number; // -10 – 50 °C
}

// ─── ML Feature Labels (for display purposes) ─────────────────────────────────

export const ML_FEATURE_RANGES: Record<string, { min: number; max: number; unit: string; label: string }> = {
  "pH Level": { min: 0, max: 14, unit: "", label: "pH Level" },
  "Turbidity (NTU)": { min: 0, max: 4000, unit: "NTU", label: "Turbidity" },
  "Temperature (°C)": { min: -10, max: 50, unit: "°C", label: "Temperature" },
  "Contaminant Level (ppm)": { min: 0, max: 100, unit: "ppm", label: "Contaminant Level" },
  "Nitrate Level (mg/L)": { min: 0, max: 100, unit: "mg/L", label: "Nitrate Level" },
  "Lead Concentration (µg/L)": { min: 0, max: 50, unit: "µg/L", label: "Lead Concentration" },
  "Bacteria Count (CFU/mL)": { min: 0, max: 10000, unit: "CFU/mL", label: "Bacteria Count" },
  "Dissolved Oxygen (mg/L)": { min: 0, max: 20, unit: "mg/L", label: "Dissolved Oxygen" },
  "Sanitation Coverage (% of Population)": { min: 0, max: 100, unit: "%", label: "Sanitation Coverage" },
  "Healthcare Access Index (0-100)": { min: 0, max: 100, unit: "", label: "Healthcare Access" },
  "Population Density (people per km²)": { min: 0, max: 5000, unit: "/km²", label: "Population Density" },
};

// ─── Dashboard / UI Types ──────────────────────────────────────────────────────

export interface DashboardStats {
  latestPh: number | null;
  latestTurbidity: number | null;
  latestTemperature: number | null;
  latestRiskLevel: RiskLevel | null;
  latestProbability: number | null;
  totalReadings: number;
}
