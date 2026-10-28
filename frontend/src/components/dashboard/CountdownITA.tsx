import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { formatDate } from "../../utils/format";

interface CountdownITAProps {
  daysUntilExam: number;
  examDate: string;
  progressToExamPercentage: number;
}

export function CountdownITA({ daysUntilExam, examDate, progressToExamPercentage }: CountdownITAProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rumo ao ITA 2028</CardTitle>
        <CalendarClock size={16} className="text-ink-subtle" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight text-ink">{daysUntilExam}</p>
        <p className="text-xs text-ink-subtle">dias até a prova em {formatDate(examDate)}</p>
        <div className="mt-4">
          <ProgressBar value={progressToExamPercentage} />
          <p className="mt-1.5 text-xs text-ink-subtle">{progressToExamPercentage}% do tempo de preparação percorrido</p>
        </div>
      </CardContent>
    </Card>
  );
}
