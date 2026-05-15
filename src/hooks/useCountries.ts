import { useQuery } from "@tanstack/react-query";

export interface CountryItem {
  name: string;
}

export interface RegionItem {
  name: string;
}

export function useCountries() {
  return useQuery<CountryItem[]>({
    queryKey: ["countries-api"],
    queryFn: async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const json = await res.json();
      if (json.error) throw new Error("Could not load countries");
      return (json.data as { country: string }[])
        .map((c) => ({ name: c.country }))
        .sort((a, b) => a.name.localeCompare(b.name));
    },
    staleTime: Infinity,
    retry: 2,
  });
}

export function useRegions(country: string) {
  return useQuery<RegionItem[]>({
    queryKey: ["regions-api", country],
    queryFn: async () => {
      if (!country) return [];
      const res = await fetch(
        `https://countriesnow.space/api/v0.1/countries/states/q?country=${encodeURIComponent(country)}`
      );
      const json = await res.json();
      if (json.error || !json.data?.states) return [];
      return (json.data.states as { name: string }[]).map((s) => ({ name: s.name }));
    },
    enabled: !!country,
    staleTime: Infinity,
    retry: 1,
  });
}
