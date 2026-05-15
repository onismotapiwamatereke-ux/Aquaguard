import type { SensorReading, SensorFormInput, PredictionResult, PredictionInput } from "@/types";

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

export function postSensorData(data: SensorFormInput): Promise<SensorReading> {
  return request<SensorReading>("/sensor-data", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchHistory(): Promise<SensorReading[]> {
  return request<SensorReading[]>("/history");
}

export function fetchPrediction(params: PredictionInput = {}): Promise<PredictionResult> {
  return request<PredictionResult>("/prediction", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
