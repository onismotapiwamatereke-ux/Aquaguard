import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPrediction } from "@/lib/api";
import type { PredictionInput, PredictionResult } from "@/types";

export function usePrediction(defaultParams: PredictionInput = {}) {
  const queryClient = useQueryClient();
  const [runId, setRunId] = useState(0);
  const paramsRef = useRef<PredictionInput>(defaultParams);

  const query = useQuery<PredictionResult>({
    queryKey: ["prediction", runId],
    queryFn: () => fetchPrediction(paramsRef.current),
    enabled: runId > 0,
    staleTime: 0,
    retry: 1,
  });

  const runPrediction = async (overrides?: PredictionInput) => {
    paramsRef.current = { ...defaultParams, ...overrides };
    await queryClient.invalidateQueries({ queryKey: ["prediction"] });
    setRunId((id) => id + 1);
  };

  return { ...query, runPrediction };
}
