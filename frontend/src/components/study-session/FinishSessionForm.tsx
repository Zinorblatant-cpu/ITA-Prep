import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { StudySessionDTO } from "@ita/shared-types";
import { useFinishSession } from "../../hooks/useStudySessions";
import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface FinishSessionFormProps {
  session: StudySessionDTO;
  onFinished: () => void;
}

export function FinishSessionForm({ session, onFinished }: FinishSessionFormProps) {
  const [exercisesTotal, setExercisesTotal] = useState("");
  const [exercisesCorrect, setExercisesCorrect] = useState("");
  const [notes, setNotes] = useState("");
  const finishSession = useFinishSession();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await finishSession.mutateAsync({
        id: session.id,
        input: {
          exercisesTotal: exercisesTotal ? Number(exercisesTotal) : undefined,
          exercisesCorrect: exercisesCorrect ? Number(exercisesCorrect) : undefined,
          notes: notes || undefined,
        },
      });
      toast({
        title: `Sessão salva! +${result.xpEarned} XP`,
        description: result.levelUp ? `Você subiu para o nível ${result.newLevel}!` : `Sequência atual: ${result.currentStreak} dia(s).`,
        variant: "success",
      });
      onFinished();
    } catch {
      toast({ title: "Não foi possível finalizar a sessão", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finalizar sessão</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Exercícios feitos</label>
              <Input type="number" min={0} value={exercisesTotal} onChange={(e) => setExercisesTotal(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Exercícios corretos</label>
              <Input
                type="number"
                min={0}
                value={exercisesCorrect}
                onChange={(e) => setExercisesCorrect(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Observações</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="O que você estudou, dificuldades encontradas..." />
          </div>
          <Button type="submit" disabled={finishSession.isPending} className="w-full">
            <CheckCircle2 size={14} /> Salvar e concluir
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
