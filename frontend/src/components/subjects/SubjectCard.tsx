import { Link } from "react-router-dom";
import type { SubjectDTO } from "@ita/shared-types";
import { useSubjectStats } from "../../hooks/useSubjects";
import { Card, CardContent } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import { resolveIcon } from "../../utils/icon-map";
import { formatHours } from "../../utils/format";
import { SubjectProgressRing } from "./SubjectProgressRing";

export function SubjectCard({ subject }: { subject: SubjectDTO }) {
  const { data: stats, isLoading } = useSubjectStats(subject.id);
  const Icon = resolveIcon(subject.icon);

  return (
    <Link to={`/subjects/${subject.id}`}>
      <Card className="h-full transition-shadow hover:shadow-card">
        <CardContent className="flex items-center gap-4 pt-5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${subject.color}1a`, color: subject.color }}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{subject.name}</p>
            {isLoading && <Skeleton className="mt-1.5 h-3 w-24" />}
            {stats && (
              <p className="text-xs text-ink-subtle">
                {stats.completedTopics}/{stats.totalTopics} conteúdos · {formatHours(stats.totalHours)}
              </p>
            )}
          </div>
          {stats ? (
            <SubjectProgressRing value={stats.progressPercentage} color={subject.color} />
          ) : (
            <Skeleton className="h-14 w-14 rounded-full" />
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
