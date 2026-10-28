import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAccuracyBySubject } from "../../hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

const ACCENT = "#2563eb";

export function SubjectRadarChart() {
  const { data, isLoading } = useAccuracyBySubject();

  const chartData = data?.map((d) => ({
    subject: d.subjectName,
    accuracy: Math.round(d.accuracyRate * 100),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxa de acerto por disciplina</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-72 w-full" />}
        {!isLoading && chartData && (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={chartData}>
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "currentColor" }} className="text-ink-muted" />
              <Radar dataKey="accuracy" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25} strokeWidth={2} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid rgb(var(--border))", background: "rgb(var(--surface))", fontSize: 12 }}
                formatter={(value: number) => [`${value}%`, "Taxa de acerto"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
