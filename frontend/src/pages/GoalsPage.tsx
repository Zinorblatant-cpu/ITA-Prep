import { motion } from "framer-motion";
import { Flag, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { GoalDTO, GoalMetric, GoalType } from "@ita/shared-types";
import { useCreateGoal, useDeleteGoal, useGoalProgress, useGoals } from "../hooks/useGoals";
import { useToast } from "../components/ui/Toast";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { DatePicker } from "../components/ui/DatePicker";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";

const TYPE_LABEL: Record<GoalType, string> = { diaria: "Diária", semanal: "Semanal", mensal: "Mensal", anual: "Anual" };
const METRIC_LABEL: Record<GoalMetric, string> = {
  horas_estudo: "Horas de estudo",
  questoes_resolvidas: "Questões resolvidas",
  revisoes: "Revisões concluídas",
  simulados: "Simulados",
};

function GoalRow({ goal }: { goal: GoalDTO }) {
  const { data: progress, isLoading } = useGoalProgress(goal.id);
  const deleteGoal = useDeleteGoal();

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-ink">{METRIC_LABEL[goal.metric]}</p>
              <Badge variant="neutral">{TYPE_LABEL[goal.type]}</Badge>
              {progress?.achieved && <Badge variant="success">Atingida</Badge>}
            </div>
            <p className="mt-0.5 text-xs text-ink-subtle">Meta: {goal.targetValue}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => deleteGoal.mutate(goal.id)} aria-label="Remover">
            <Trash2 size={14} />
          </Button>
        </div>
        <div className="mt-3">
          {isLoading && <Skeleton className="h-2 w-full" />}
          {progress && (
            <>
              <ProgressBar value={progress.percentage} />
              <p className="mt-1 text-xs text-ink-subtle">
                {progress.currentValue} / {goal.targetValue} ({progress.percentage}%)
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function GoalsPage() {
  const { data: goals, isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = useState(false);

  const [type, setType] = useState<GoalType>("semanal");
  const [metric, setMetric] = useState<GoalMetric>("horas_estudo");
  const [targetValue, setTargetValue] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetValue || !periodStart || !periodEnd) return;
    try {
      await createGoal.mutateAsync({
        type,
        metric,
        targetValue: Number(targetValue),
        periodStart,
        periodEnd,
      });
      toast({ title: "Meta criada", variant: "success" });
      setTargetValue("");
      setFormOpen(false);
    } catch {
      toast({ title: "Não foi possível criar a meta", variant: "error" });
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Metas</h1>
          <p className="text-sm text-ink-subtle">Metas diárias, semanais, mensais e anuais com progresso em tempo real.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Nova meta
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}
      {!isLoading && goals?.length === 0 && (
        <EmptyState icon={Flag} title="Nenhuma meta cadastrada" description="Ex: 18 horas por semana, 200 questões por semana, 4 revisões por dia." />
      )}
      {!isLoading && goals && goals.length > 0 && (
        <div className="space-y-3">
          {goals.map((goal) => (
            <GoalRow key={goal.id} goal={goal} />
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Nova meta">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Tipo</label>
              <Select value={type} onChange={(e) => setType(e.target.value as GoalType)}>
                {Object.entries(TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Métrica</label>
              <Select value={metric} onChange={(e) => setMetric(e.target.value as GoalMetric)}>
                {Object.entries(METRIC_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Valor alvo</label>
            <Input type="number" min={0} value={targetValue} onChange={(e) => setTargetValue(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Início do período</label>
              <DatePicker value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Fim do período</label>
              <DatePicker value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={createGoal.isPending}>Salvar</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
