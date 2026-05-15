import { createContext, useContext, useState } from "react";

interface LocationState {
  country: string;
  region: string;
  setCountry: (c: string) => void;
  setRegion: (r: string) => void;
}

const LocationContext = createContext<LocationState>({
  country: "Zimbabwe",
  region: "Harare",
  setCountry: () => {},
  setRegion: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [country, setCountryRaw] = useState("Zimbabwe");
  const [region, setRegion] = useState("Harare");

  const setCountry = (c: string) => {
    setCountryRaw(c);
    setRegion(""); // reset region when country changes
  };

  return (
    <LocationContext.Provider value={{ country, region, setCountry, setRegion }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useAppLocation = () => useContext(LocationContext);
