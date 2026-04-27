import type { SensorReading, SensorFormInput, PredictionResult } from "@/types";

const BASE_URL = "http://localhost:5000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** POST /api/sensor-data — ingest a new ESP32 / manual reading */
export function postSensorData(data: SensorFormInput): Promise<SensorReading> {
  return request<SensorReading>("/sensor-data", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** GET /api/history — fetch all stored sensor readings */
export function fetchHistory(): Promise<SensorReading[]> {
  return request<SensorReading[]>("/history");
}

/**
 * GET /api/prediction — run the ML model on the latest sensor data.
 * Returns risk_level, probability, timestamp and top-3 SHAP explanations.
 */
export function fetchPrediction(): Promise<PredictionResult> {
  return request<PredictionResult>("/prediction");
}
