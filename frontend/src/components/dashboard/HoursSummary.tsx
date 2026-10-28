import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { formatHours } from "../../utils/format";

interface HoursSummaryProps {
  hoursToday: number;
  hoursThisWeek: number;
  hoursThisMonth: number;
  hoursTotal: number;
}

export function HoursSummary({ hoursToday, hoursThisWeek, hoursThisMonth, hoursTotal }: HoursSummaryProps) {
  const items = [
    { label: "Hoje", value: hoursToday },
    { label: "Esta semana", value: hoursThisWeek },
    { label: "Este mês", value: hoursThisMonth },
    { label: "Total", value: hoursTotal },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas estudadas</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs text-ink-subtle">{item.label}</p>
            <p className="mt-1 text-lg font-semibold text-ink">{formatHours(item.value)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
