import { Link } from "react-router-dom";
import { useCalendarMonth } from "../../hooks/useCalendarMonth";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { cn } from "../../utils/cn";

const WEEKDAY_LABELS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function StudyCalendarWidget() {
  const today = new Date();
  const { data, isLoading } = useCalendarMonth(today.getFullYear(), today.getMonth() + 1);

  const firstWeekday = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const leadingBlanks = Array.from({ length: firstWeekday });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de estudos</CardTitle>
        <Link to="/calendar" className="text-xs font-medium text-accent hover:underline">
          Ver completo
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-40 w-full" />}
        {!isLoading && data && (
          <div>
            <div className="mb-1.5 grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-ink-subtle">
              {WEEKDAY_LABELS.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {leadingBlanks.map((_, index) => (
                <div key={`blank-${index}`} />
              ))}
              {data.days.map((day) => {
                const dayNumber = new Date(day.date).getDate();
                const isToday = new Date(day.date).toDateString() === today.toDateString();
                return (
                  <div
                    key={day.date}
                    title={`${day.hours.toFixed(1)}h estudadas`}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-md text-[11px] font-medium",
                      day.studied ? "bg-accent text-accent-fg" : "bg-surface-subtle text-ink-subtle",
                      isToday && "ring-2 ring-accent ring-offset-1 ring-offset-surface",
                    )}
                  >
                    {dayNumber}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
