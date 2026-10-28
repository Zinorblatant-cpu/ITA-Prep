import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useHoursStatistics } from "../../hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { PeriodToggle } from "./PeriodToggle";
import { useState } from "react";

const ACCENT = "#2563eb";

export function HoursBarChart() {
  const [groupBy, setGroupBy] = useState<"week" | "month">("week");
  const { data, isLoading } = useHoursStatistics(groupBy);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas estudadas</CardTitle>
        <PeriodToggle value={groupBy} onChange={setGroupBy} />
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-64 w-full" />}
        {!isLoading && (!data || data.length === 0) && (
          <p className="py-12 text-center text-sm text-ink-subtle">Sem dados suficientes ainda.</p>
        )}
        {!isLoading && data && data.length > 0 && (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="periodLabel" tick={{ fontSize: 11, fill: "currentColor" }} className="text-ink-subtle" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-ink-subtle" tickLine={false} axisLine={false} width={32} />
              <Tooltip
                cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
                contentStyle={{ borderRadius: 8, border: "1px solid rgb(var(--border))", background: "rgb(var(--surface))", fontSize: 12 }}
                formatter={(value: number) => [`${value.toFixed(1)}h`, "Horas"]}
              />
              <Bar dataKey="hours" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
