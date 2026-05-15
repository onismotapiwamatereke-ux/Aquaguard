import { Routes, Route } from "react-router-dom";
import { LocationProvider } from "@/context/LocationContext";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import SensorPage from "@/pages/SensorPage";
import PredictPage from "@/pages/PredictPage";
import HistoryPage from "@/pages/HistoryPage";
import AlertsPage from "@/pages/AlertsPage";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <LocationProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/"        element={<DashboardPage />} />
          <Route path="/sensor"  element={<SensorPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/alerts"  element={<AlertsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </LocationProvider>
  );
}
