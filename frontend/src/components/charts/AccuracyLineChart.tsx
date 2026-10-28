import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useQuestionsStatistics } from "../../hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { PeriodToggle } from "./PeriodToggle";

const ACCENT = "#2563eb";

export function AccuracyLineChart() {
  const [groupBy, setGroupBy] = useState<"week" | "month">("week");
  const { data, isLoading } = useQuestionsStatistics(groupBy);

  const chartData = useMemo(
    () =>
      data?.map((point) => ({
        periodLabel: point.periodLabel,
        accuracy: point.total > 0 ? Math.round((point.correct / point.total) * 100) : 0,
      })) ?? [],
    [data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de acerto ao longo do tempo</CardTitle>
        <PeriodToggle value={groupBy} onChange={setGroupBy} />
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-64 w-full" />}
        {!isLoading && chartData.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-subtle">Sem questões registradas ainda.</p>
        )}
        {!isLoading && chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
              <XAxis dataKey="periodLabel" tick={{ fontSize: 11, fill: "currentColor" }} className="text-ink-subtle" tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor" }}
                className="text-ink-subtle"
                tickLine={false}
                axisLine={false}
                width={36}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid rgb(var(--border))", background: "rgb(var(--surface))", fontSize: 12 }}
                formatter={(value: number) => [`${value}%`, "Taxa de acerto"]}
              />
              <Line type="monotone" dataKey="accuracy" stroke={ACCENT} strokeWidth={2} dot={{ r: 3, fill: ACCENT }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
