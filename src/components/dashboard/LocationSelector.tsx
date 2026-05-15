import { Globe, MapPin, Loader2 } from "lucide-react";
import { useAppLocation } from "@/context/LocationContext";
import { useCountries, useRegions } from "@/hooks/useCountries";

export default function LocationSelector() {
  const { country, region, setCountry, setRegion } = useAppLocation();
  const { data: countries = [], isLoading: loadingCountries } = useCountries();
  const { data: regions = [], isLoading: loadingRegions } = useRegions(country);

  return (
    <div className="card-glow rounded-xl p-5">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-4">
        Your Location
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Country */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Country
          </label>
          <div className="relative">
            {loadingCountries && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
            )}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none pr-8"
            >
              <option value="">Select your country…</option>
              {countries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">Where is the water source located?</p>
        </div>

        {/* Region */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Province / Region
          </label>
          <div className="relative">
            {loadingRegions && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
            )}
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              disabled={!country || loadingRegions}
              className="w-full rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none pr-8 disabled:opacity-50"
            >
              <option value="">
                {!country ? "Select country first" : "Select your province…"}
              </option>
              {regions.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            {regions.length === 0 && country && !loadingRegions
              ? "Type your region name if not listed"
              : "Pick the nearest province or district"}
          </p>
        </div>
      </div>
    </div>
  );
}
