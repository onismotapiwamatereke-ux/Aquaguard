// ─── Backend Model Types ────────────────────────────────────────────────────────

export type RiskLevel = "HIGH RISK" | "MEDIUM RISK" | "LOW RISK";

export interface SensorReading {
  id: number;
  ph: number;
  turbidity: number;
  temperature: number;
  timestamp: string;
}

export interface ShapFeature {
  feature: string;
  impact: number;
}

export interface PredictionResult {
  id: number;
  risk_level: RiskLevel;
  probability: number;
  timestamp: string;
  explanation: ShapFeature[];
}

export interface RegionData {
  region: string;
  sanitation: number;
  healthcare_index: number;
  population_density: number;
  gdp_per_capita: number;
  urbanization_rate: number;
}

// ─── Sensor Form ───────────────────────────────────────────────────────────────

export interface SensorFormInput {
  ph: number;
  turbidity: number;
  temperature: number;
}

// ─── Prediction Input ──────────────────────────────────────────────────────────

export interface PredictionInput {
  country?: string;
  region?: string;
  water_source?: string;
  treatment_method?: string;
  contaminant_level?: number;
  dissolved_oxygen?: number;
  nitrate_level?: number;
  lead_concentration?: number;
  bacteria_count?: number;
  access_clean_water?: number;
  rainfall?: number;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  latestPh: number | null;
  latestTurbidity: number | null;
  latestTemperature: number | null;
  latestRiskLevel: RiskLevel | null;
  latestProbability: number | null;
  totalReadings: number;
}
