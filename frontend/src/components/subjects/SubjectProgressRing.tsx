interface SubjectProgressRingProps {
  value: number;
  color: string;
  size?: number;
}

export function SubjectProgressRing({ value, color, size = 56 }: SubjectProgressRingProps) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-surface-subtle" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="none"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-ink">{Math.round(clamped)}%</span>
    </div>
  );
}
