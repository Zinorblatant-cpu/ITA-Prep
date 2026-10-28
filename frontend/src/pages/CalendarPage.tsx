import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCalendarMonth } from "../hooks/useCalendarMonth";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../utils/cn";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTH_LABELS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  const { data, isLoading } = useCalendarMonth(year, month);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const leadingBlanks = Array.from({ length: firstWeekday });

  function goToPreviousMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); } else { setMonth((m) => m - 1); }
  }
  function goToNextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); } else { setMonth((m) => m + 1); }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Calendário</h1>
          <p className="text-sm text-ink-subtle">Dias estudados, revisões, simulados e metas.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="secondary" onClick={goToPreviousMonth} aria-label="Mês anterior">
            <ChevronLeft size={16} />
          </Button>
          <span className="w-36 text-center text-sm font-medium text-ink">
            {MONTH_LABELS[month - 1]} {year}
          </span>
          <Button size="icon" variant="secondary" onClick={goToNextMonth} aria-label="Próximo mês">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-5">
          {isLoading && <Skeleton className="h-96 w-full" />}
          {!isLoading && data && (
            <div>
              <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-medium text-ink-subtle">
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {leadingBlanks.map((_, index) => (
                  <div key={`blank-${index}`} />
                ))}
                {data.days.map((day) => {
                  const dayNumber = new Date(day.date).getDate();
                  const isToday = new Date(day.date).toDateString() === today.toDateString();
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center rounded-lg border border-transparent p-1.5 text-center",
                        day.studied ? "bg-accent/10" : "bg-surface-subtle",
                        isToday && "border-accent",
                      )}
                    >
                      <span className="text-xs font-semibold text-ink">{dayNumber}</span>
                      {day.hours > 0 && <span className="text-[10px] text-accent">{day.hours.toFixed(1)}h</span>}
                      <div className="mt-0.5 flex gap-0.5">
                        {day.reviewsCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" title={`${day.reviewsCount} revisões`} />}
                        {day.mockExamsCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-purple-500" title={`${day.mockExamsCount} simulados`} />}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-subtle">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent/10" /> Dia estudado</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Revisão agendada</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Simulado</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
