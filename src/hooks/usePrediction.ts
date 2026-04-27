import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchPrediction } from "@/lib/api";

/** 
 * Hook to trigger and retrieve ML predictions.
 * Call `refetch()` to run a new prediction against the latest sensor data.
 */
export function usePrediction() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["prediction"],
    queryFn: fetchPrediction,
    enabled: false,   // manual trigger only
    staleTime: 0,
    retry: 1,
  });

  const runPrediction = async () => {
    // Invalidate previous result so a fresh request is made
    await queryClient.invalidateQueries({ queryKey: ["prediction"] });
    return query.refetch();
  };

  return { ...query, runPrediction };
}
