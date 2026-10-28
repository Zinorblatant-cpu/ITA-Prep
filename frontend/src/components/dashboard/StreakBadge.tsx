import { Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface StreakBadgeProps {
  currentStreak: number;
  longestStreak: number;
  level: number;
  totalXp: number;
}

export function StreakBadge({ currentStreak, longestStreak, level, totalXp }: StreakBadgeProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sequência de estudos</CardTitle>
        <Flame size={16} className="text-amber-500" />
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold tracking-tight text-ink">{currentStreak}</p>
          <p className="text-xs text-ink-subtle">
            {currentStreak === 1 ? "dia seguido" : "dias seguidos"} · recorde de {longestStreak}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-accent">Nível {level}</p>
          <p className="text-xs text-ink-subtle">{totalXp} XP</p>
        </div>
      </CardContent>
    </Card>
  );
}
