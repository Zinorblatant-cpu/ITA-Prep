import { cn } from "../../utils/cn";

interface PeriodToggleProps {
  value: "week" | "month";
  onChange: (value: "week" | "month") => void;
}

export function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md bg-surface-subtle p-1">
      {(["week", "month"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            value === option ? "bg-surface text-ink shadow-subtle" : "text-ink-muted hover:text-ink",
          )}
        >
          {option === "week" ? "Semana" : "Mês"}
        </button>
      ))}
    </div>
  );
}
