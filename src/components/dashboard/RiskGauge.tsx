import { useMemo } from "react";
import type { RiskLevel } from "@/types";
import { formatProbability } from "@/lib/utils";

interface RiskGaugeProps {
  probability: number; // 0 – 1
  riskLevel: RiskLevel;
  size?: number;
}

const RISK_CONFIG: Record<RiskLevel, { color: string; glow: string; label: string }> = {
  "HIGH RISK":   { color: "#f87171", glow: "rgba(248,113,113,0.4)", label: "HIGH RISK" },
  "MEDIUM RISK": { color: "#fbbf24", glow: "rgba(251,191,36,0.4)",  label: "MEDIUM RISK" },
  "LOW RISK":    { color: "#34d399", glow: "rgba(52,211,153,0.4)",  label: "LOW RISK" },
};

export default function RiskGauge({ probability, riskLevel, size = 200 }: RiskGaugeProps) {
  const config = RISK_CONFIG[riskLevel];

  // Arc math — 220° sweep starting from 160° (bottom-left)
  const cx = size / 2;
  const cy = size / 2;
  const r  = (size / 2) * 0.78;
  const strokeW = size * 0.065;

  const START_ANGLE = 145; // degrees
  const SWEEP       = 250; // degrees

  function polarToXY(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function describeArc(startDeg: number, endDeg: number, radius: number) {
    const s = polarToXY(startDeg, radius);
    const e = polarToXY(endDeg, radius);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  // Track arc (full sweep)
  const trackPath = describeArc(START_ANGLE, START_ANGLE + SWEEP, r);
  // Fill arc (probability portion)
  const fillEnd   = START_ANGLE + SWEEP * Math.min(probability, 1);
  const fillPath  = describeArc(START_ANGLE, fillEnd, r);

  // Needle tip
  const needleAngle = START_ANGLE + SWEEP * Math.min(probability, 1);
  const needleTip   = polarToXY(needleAngle, r);

  // Circumference for dash animation
  const circumference = 2 * Math.PI * r;
  const fillFraction  = (SWEEP / 360) * probability;
  const dashLen       = circumference * (SWEEP / 360);
  const dashOffset    = dashLen * (1 - probability);

  const id = useMemo(() => `gauge-filter-${Math.random().toString(36).slice(2)}`, []);

  return (
    <div className="flex flex-col items-center gap-3 animate-scale-in opacity-0">
      <svg
        width={size}
        height={size * 0.72}
        viewBox={`0 0 ${size} ${size * 0.72}`}
        aria-label={`Risk gauge: ${riskLevel} at ${formatProbability(probability)}`}
      >
        <defs>
          <filter id={id}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="hsla(220,20%,20%,0.8)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />

        {/* Fill arc with glow */}
        <path
          d={fillPath}
          fill="none"
          stroke={config.color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          filter={`url(#${id})`}
          style={{
            strokeDasharray: dashLen,
            strokeDashoffset: dashOffset,
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.4s",
          }}
        />

        {/* Needle dot */}
        <circle
          cx={needleTip.x}
          cy={needleTip.y}
          r={strokeW * 0.55}
          fill={config.color}
          style={{ filter: `drop-shadow(0 0 6px ${config.glow})` }}
        />

        {/* Centre label */}
        <text
          x={cx}
          y={cy * 1.08}
          textAnchor="middle"
          fontSize={size * 0.14}
          fontWeight="700"
          fill={config.color}
          fontFamily="'Inter', sans-serif"
        >
          {formatProbability(probability)}
        </text>
        <text
          x={cx}
          y={cy * 1.08 + size * 0.09}
          textAnchor="middle"
          fontSize={size * 0.065}
          fill="hsla(195,20%,70%,1)"
          fontFamily="'Inter', sans-serif"
          letterSpacing="0.08em"
        >
          PROBABILITY
        </text>
      </svg>

      {/* Risk level badge */}
      <div
        className="px-5 py-1.5 rounded-full text-sm font-bold tracking-widest border"
        style={{
          color: config.color,
          background: `${config.glow.replace("0.4", "0.12")}`,
          borderColor: `${config.glow.replace("0.4", "0.35")}`,
          boxShadow: `0 0 18px ${config.glow}`,
        }}
      >
        {config.label}
      </div>
    </div>
  );
}
