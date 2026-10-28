import { motion } from "framer-motion";
import { Flame, Lock, Trophy } from "lucide-react";
import { useAchievements, useUserProfile, useXpLog } from "../hooks/useGamification";
import { resolveIcon } from "../utils/icon-map";
import { formatDateTime } from "../utils/format";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../utils/cn";

const XP_REASON_LABEL: Record<string, string> = {
  sessao_estudo: "Sessão de estudo",
  revisao_concluida: "Revisão concluída",
  simulado: "Simulado registrado",
  streak_bonus: "Bônus de sequência",
  conquista: "Conquista desbloqueada",
};

export function GamificationPage() {
  const { data: profile, isLoading: loadingProfile } = useUserProfile();
  const { data: achievements, isLoading: loadingAchievements } = useAchievements();
  const { data: xpLog } = useXpLog();

  const levelRange = profile ? profile.xpToNextLevel - profile.xpForCurrentLevel : 1;
  const levelProgress = profile
    ? Math.min(((profile.totalXp - profile.xpForCurrentLevel) / Math.max(levelRange, 1)) * 100, 100)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Gamificação</h1>
        <p className="text-sm text-ink-subtle">Níveis, experiência, conquistas e sua sequência de estudos.</p>
      </div>

      {loadingProfile && <Skeleton className="h-32 w-full" />}
      {profile && (
        <Card>
          <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-lg font-semibold text-ink">Nível {profile.level}</p>
                <p className="text-xs text-ink-subtle">{profile.totalXp} XP acumulados</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-500">
              <Flame size={18} />
              <span className="text-sm font-semibold text-ink">{profile.currentStreak} dias seguidos</span>
              <span className="text-xs text-ink-subtle">(recorde: {profile.longestStreak})</span>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <ProgressBar value={levelProgress} />
            <p className="mt-1.5 text-xs text-ink-subtle">
              {profile.totalXp} / {profile.xpToNextLevel} XP para o nível {profile.level + 1}
            </p>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Conquistas</h2>
        {loadingAchievements && <Skeleton className="h-40 w-full" />}
        {achievements && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => {
              const Icon = achievement.unlockedAt ? resolveIcon(achievement.icon) : Lock;
              return (
                <Card key={achievement.id} className={cn(!achievement.unlockedAt && "opacity-60")}>
                  <CardContent className="flex items-start gap-3 pt-4">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        achievement.unlockedAt ? "bg-accent/10 text-accent" : "bg-surface-subtle text-ink-subtle",
                      )}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{achievement.name}</p>
                      <p className="text-xs text-ink-subtle">{achievement.description}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="neutral">+{achievement.xpReward} XP</Badge>
                        {achievement.unlockedAt && <Badge variant="success">Desbloqueada</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-ink">Histórico de XP</h2>
        <Card>
          <CardHeader>
            <CardTitle>Últimos ganhos</CardTitle>
          </CardHeader>
          <CardContent>
            {xpLog && xpLog.length === 0 && <p className="text-sm text-ink-subtle">Nenhum XP registrado ainda.</p>}
            {xpLog && xpLog.length > 0 && (
              <ul className="divide-y divide-border">
                {xpLog.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between py-2 text-sm first:pt-0 last:pb-0">
                    <span className="text-ink-muted">{XP_REASON_LABEL[entry.reason] ?? entry.reason}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-xs text-ink-subtle">{formatDateTime(entry.createdAt)}</span>
                      <span className="font-medium text-accent">+{entry.amount} XP</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
