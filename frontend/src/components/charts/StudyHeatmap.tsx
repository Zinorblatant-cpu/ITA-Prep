import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useHeatmap } from "../../hooks/useStatistics";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

const LEVEL_COLORS = ["#dbeafe", "#93c5fd", "#3b82f6", "#1e3a8a"];

function bucketFor(hours: number): number {
  if (hours < 1) return 0;
  if (hours < 2) return 1;
  if (hours < 4) return 2;
  return 3;
}

export function StudyHeatmap() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, isLoading } = useHeatmap(year);

  const hoursByDate = useMemo(() => {
    const map = new Map<string, number>();
    data?.forEach((d) => map.set(d.date.slice(0, 10), d.hours));
    return map;
  }, [data]);

  const weeks = useMemo(() => {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const startPadding = start.getDay();
    const days: { date: string; hours: number }[] = [];

    for (let i = 0; i < startPadding; i++) days.push({ date: "", hours: -1 });

    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      days.push({ date: key, hours: hoursByDate.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const result: { date: string; hours: number }[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [year, hoursByDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de calor de estudos</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="secondary" onClick={() => setYear((y) => y - 1)} aria-label="Ano anterior">
            <ChevronLeft size={14} />
          </Button>
          <span className="w-12 text-center text-sm font-medium text-ink">{year}</span>
          <Button size="icon" variant="secondary" onClick={() => setYear((y) => y + 1)} aria-label="Próximo ano">
            <ChevronRight size={14} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-32 w-full" />}
        {!isLoading && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) =>
                    day.hours === -1 ? (
                      <div key={dayIndex} className="h-[11px] w-[11px]" />
                    ) : (
                      <div
                        key={dayIndex}
                        title={`${day.date}: ${day.hours.toFixed(1)}h`}
                        className="h-[11px] w-[11px] rounded-[2px] bg-surface-subtle"
                        style={day.hours > 0 ? { backgroundColor: LEVEL_COLORS[bucketFor(day.hours)] } : undefined}
                      />
                    ),
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-subtle">
              <span>Menos</span>
              <span className="h-[11px] w-[11px] rounded-[2px] bg-surface-subtle" />
              {LEVEL_COLORS.map((color) => (
                <span key={color} className="h-[11px] w-[11px] rounded-[2px]" style={{ backgroundColor: color }} />
              ))}
              <span>Mais</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
