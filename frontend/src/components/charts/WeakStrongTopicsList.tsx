import { TrendingDown, TrendingUp } from "lucide-react";
import { useWeakStrongTopics } from "../../hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Skeleton } from "../ui/Skeleton";
import type { TopicStrengthDTO } from "@ita/shared-types";

function TopicRankList({ topics }: { topics: TopicStrengthDTO[] }) {
  if (topics.length === 0) {
    return <p className="text-sm text-ink-subtle">Sem dados suficientes ainda.</p>;
  }
  return (
    <ul className="space-y-2">
      {topics.map((topic) => (
        <li key={topic.topicId} className="flex items-center justify-between text-sm">
          <div className="min-w-0">
            <p className="truncate text-ink">{topic.topicName}</p>
            <p className="text-xs text-ink-subtle">{topic.subjectName}</p>
          </div>
          <span className="shrink-0 font-medium text-ink">{Math.round(topic.accuracyRate * 100)}%</span>
        </li>
      ))}
    </ul>
  );
}

export function WeakStrongTopicsList() {
  const { data, isLoading } = useWeakStrongTopics();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assuntos mais fracos</CardTitle>
          <TrendingDown size={16} className="text-red-500" />
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {!isLoading && data && <TopicRankList topics={data.weakest} />}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assuntos mais fortes</CardTitle>
          <TrendingUp size={16} className="text-emerald-500" />
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {!isLoading && data && <TopicRankList topics={data.strongest} />}
        </CardContent>
      </Card>
    </div>
  );
}
