import { motion } from "framer-motion";
import { ClipboardList, Plus, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useCreateMockExam, useDeleteMockExam, useMockExamComparison, useMockExams } from "../hooks/useMockExams";
import { useToast } from "../components/ui/Toast";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { DatePicker } from "../components/ui/DatePicker";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { Skeleton } from "../components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { formatDate, formatDuration } from "../utils/format";

const TREND_ICON = { subindo: TrendingUp, descendo: TrendingDown, estavel: null } as const;

export function MockExamsPage() {
  const { data: exams, isLoading } = useMockExams();
  const { data: comparison } = useMockExamComparison();
  const createExam = useCreateMockExam();
  const deleteExam = useDeleteMockExam();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");
  const [score, setScore] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !examDate || !totalQuestions || !correctAnswers || !durationSeconds) return;
    try {
      const result = await createExam.mutateAsync({
        name,
        examDate,
        totalQuestions: Number(totalQuestions),
        correctAnswers: Number(correctAnswers),
        durationSeconds: Number(durationSeconds),
        score: score ? Number(score) : undefined,
      });
      toast({ title: `Simulado registrado! +${result.xpEarned} XP`, variant: "success" });
      setName(""); setExamDate(""); setTotalQuestions(""); setCorrectAnswers(""); setDurationSeconds(""); setScore("");
      setFormOpen(false);
    } catch {
      toast({ title: "Não foi possível registrar o simulado", variant: "error" });
    }
  }

  const TrendIcon = comparison ? TREND_ICON[comparison.trend] : null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Simulados</h1>
          <p className="text-sm text-ink-subtle">Acompanhe nota, tempo e evolução entre simulados.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Registrar simulado
        </Button>
      </div>

      {comparison && comparison.exams.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Comparação</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-ink-subtle">Nota média</p>
              <p className="text-lg font-semibold text-ink">{comparison.averageScore.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-subtle">Acerto médio</p>
              <p className="text-lg font-semibold text-ink">{Math.round(comparison.averageAccuracy * 100)}%</p>
            </div>
            <div className="flex items-center gap-1.5">
              {TrendIcon && <TrendIcon size={16} className={comparison.trend === "subindo" ? "text-emerald-500" : "text-red-500"} />}
              <Badge variant={comparison.trend === "subindo" ? "success" : comparison.trend === "descendo" ? "danger" : "neutral"}>
                {comparison.trend === "subindo" ? "Em alta" : comparison.trend === "descendo" ? "Em queda" : "Estável"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && <Skeleton className="h-64 w-full" />}
      {!isLoading && exams?.length === 0 && <EmptyState icon={ClipboardList} title="Nenhum simulado registrado" />}
      {!isLoading && exams && exams.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Nota</TableHead>
              <TableHead>Acertos</TableHead>
              <TableHead>Tempo</TableHead>
              <TableHead>Tempo/questão</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell>{exam.name}</TableCell>
                <TableCell>{formatDate(exam.examDate)}</TableCell>
                <TableCell>{exam.score ?? "—"}</TableCell>
                <TableCell>
                  {exam.correctAnswers}/{exam.totalQuestions}
                </TableCell>
                <TableCell>{formatDuration(exam.durationSeconds)}</TableCell>
                <TableCell>{formatDuration(Math.round(exam.durationSeconds / exam.totalQuestions))}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => deleteExam.mutate(exam.id)} aria-label="Remover">
                    <Trash2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Registrar simulado">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Simulado ITA #3" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Data</label>
              <DatePicker value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Nota</label>
              <Input type="number" step="0.1" value={score} onChange={(e) => setScore(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Questões</label>
              <Input type="number" min={1} value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Acertos</label>
              <Input type="number" min={0} value={correctAnswers} onChange={(e) => setCorrectAnswers(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Duração (s)</label>
              <Input type="number" min={1} value={durationSeconds} onChange={(e) => setDurationSeconds(e.target.value)} required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={createExam.isPending}>Salvar</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
