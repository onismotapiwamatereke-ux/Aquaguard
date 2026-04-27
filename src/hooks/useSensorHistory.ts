import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "@/lib/api";

/** Returns all stored sensor readings, refreshed every 30 s */
export function useSensorHistory() {
  return useQuery({
    queryKey: ["sensor-history"],
    queryFn: fetchHistory,
    staleTime: 30_000,
    retry: 2,
  });
}

/** Returns only the latest (most recent) sensor reading */
export function useLatestSensor() {
  const query = useSensorHistory();
  const latest = query.data?.length
    ? query.data[query.data.length - 1]
    : null;
  return { ...query, latest };
}
