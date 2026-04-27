import { Link } from "react-router-dom";
import { Droplets, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 text-center px-4">
      {/* Animated icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <Droplets className="w-10 h-10 text-primary/60" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center">
          <span className="text-xs font-bold text-destructive">!</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-8xl font-black tracking-tight text-primary/20">404</p>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          This page doesn&apos;t exist in the AquaGuard system.
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all shadow-[0_0_20px_hsla(185,80%,45%,0.3)]"
      >
        <Home className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
