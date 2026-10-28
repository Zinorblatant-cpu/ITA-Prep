import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAccuracyBySubject } from "../../hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";

export function QuestionsBySubjectChart() {
  const { data, isLoading } = useAccuracyBySubject();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questões por disciplina</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-64 w-full" />}
        {!isLoading && data && (
          <>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                <XAxis dataKey="subjectName" tick={{ fontSize: 11, fill: "currentColor" }} className="text-ink-subtle" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-ink-subtle" tickLine={false} axisLine={false} width={28} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid rgb(var(--border))", background: "rgb(var(--surface))", fontSize: 12 }}
                  formatter={(value: number) => [value, "Questões"]}
                />
                <Bar dataKey="totalQuestions" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {data.map((entry) => (
                    <Cell key={entry.subjectId} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {data.map((entry) => (
                <span key={entry.subjectId} className="flex items-center gap-1.5 text-xs text-ink-subtle">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.subjectName}
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
