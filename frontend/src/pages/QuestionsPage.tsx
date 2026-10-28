import { motion } from "framer-motion";
import { LayoutTemplate, ListChecks, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { QuestionAlternative, QuestionDTO, QuestionOrigin } from "@ita/shared-types";
import { useSubjects } from "../hooks/useSubjects";
import { useCreateQuestion, useDeleteQuestion, useQuestions } from "../hooks/useQuestions";
import { useToast } from "../components/ui/Toast";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ImageUploadField } from "../components/ui/ImageUploadField";
import { Input } from "../components/ui/Input";
import { MarkdownEditorField } from "../components/ui/MarkdownEditorField";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Textarea } from "../components/ui/Textarea";
import { QuestionAlternativesEditor } from "../components/questions/QuestionAlternativesEditor";
import { hasFlashcardContent, QuestionFlashcard } from "../components/questions/QuestionFlashcard";
import { formatDate } from "../utils/format";

const ORIGINS: QuestionOrigin[] = ["ITA", "IME", "AFA", "EsPCEx", "ENEM", "Livro", "Outro"];

export function QuestionsPage() {
  const { data: subjects } = useSubjects();
  const { data: questions, isLoading } = useQuestions();
  const createQuestion = useCreateQuestion();
  const deleteQuestion = useDeleteQuestion();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [origin, setOrigin] = useState<QuestionOrigin>("ITA");
  const [year, setYear] = useState("");
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [subtopic, setSubtopic] = useState("");
  const [timeSpentSeconds, setTimeSpentSeconds] = useState("");
  const [isCorrect, setIsCorrect] = useState(true);
  const [comments, setComments] = useState("");
  const [statementImage, setStatementImage] = useState<string | undefined>(undefined);
  const [statementText, setStatementText] = useState("");
  const [alternatives, setAlternatives] = useState<QuestionAlternative[]>([]);
  const [correctAlternative, setCorrectAlternative] = useState("");
  const [resolutionImage, setResolutionImage] = useState<string | undefined>(undefined);
  const [resolutionText, setResolutionText] = useState("");

  const [flashcardQuestion, setFlashcardQuestion] = useState<QuestionDTO | null>(null);

  function resetFlashcardFields() {
    setStatementImage(undefined);
    setStatementText("");
    setAlternatives([]);
    setCorrectAlternative("");
    setResolutionImage(undefined);
    setResolutionText("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId) return;
    try {
      await createQuestion.mutateAsync({
        origin,
        year: year ? Number(year) : undefined,
        subjectId: Number(subjectId),
        subtopic: subtopic || undefined,
        timeSpentSeconds: timeSpentSeconds ? Number(timeSpentSeconds) : undefined,
        isCorrect,
        comments: comments || undefined,
        statementImage,
        statementText: statementText || undefined,
        alternatives: alternatives.length > 0 ? alternatives : undefined,
        correctAlternative: correctAlternative || undefined,
        resolutionImage,
        resolutionText: resolutionText || undefined,
      });
      toast({ title: "Questão registrada", variant: "success" });
      setSubtopic("");
      setTimeSpentSeconds("");
      setComments("");
      resetFlashcardFields();
      setFormOpen(false);
    } catch {
      toast({ title: "Não foi possível registrar a questão", variant: "error" });
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Questões</h1>
          <p className="text-sm text-ink-subtle">Histórico de questões resolvidas, por origem e assunto.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={14} /> Registrar questão
        </Button>
      </div>

      {isLoading && <Skeleton className="h-64 w-full" />}
      {!isLoading && questions?.length === 0 && (
        <EmptyState icon={ListChecks} title="Nenhuma questão registrada" />
      )}
      {!isLoading && questions && questions.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Matéria</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((q) => {
              const subject = subjects?.find((s) => s.id === q.subjectId);
              return (
                <TableRow key={q.id}>
                  <TableCell>{formatDate(q.createdAt)}</TableCell>
                  <TableCell>{q.origin}</TableCell>
                  <TableCell>{q.year ?? "—"}</TableCell>
                  <TableCell>{subject?.name ?? "—"}</TableCell>
                  <TableCell>{q.subtopic ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={q.isCorrect ? "success" : "danger"}>{q.isCorrect ? "Correta" : "Incorreta"}</Badge>
                  </TableCell>
                  <TableCell>
                    {hasFlashcardContent(q) && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFlashcardQuestion(q)}
                        aria-label="Ver flashcard"
                      >
                        <LayoutTemplate size={14} />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => deleteQuestion.mutate(q.id)} aria-label="Remover">
                      <Trash2 size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Registrar questão"
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Origem</label>
              <Select value={origin} onChange={(e) => setOrigin(e.target.value as QuestionOrigin)}>
                {ORIGINS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Ano</label>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Matéria</label>
              <Select value={subjectId} onChange={(e) => setSubjectId(Number(e.target.value))} required>
                <option value="">Selecione...</option>
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Assunto/Subassunto</label>
              <Input value={subtopic} onChange={(e) => setSubtopic(e.target.value)} placeholder="Ex: Funções" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Tempo gasto (s)</label>
              <Input type="number" value={timeSpentSeconds} onChange={(e) => setTimeSpentSeconds(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Resultado</label>
              <Select value={isCorrect ? "correct" : "wrong"} onChange={(e) => setIsCorrect(e.target.value === "correct")}>
                <option value="correct">Correta</option>
                <option value="wrong">Incorreta</option>
              </Select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Comentários</label>
            <Textarea value={comments} onChange={(e) => setComments(e.target.value)} />
          </div>

          <div className="border-t border-border pt-3">
            <p className="mb-2 text-sm font-semibold text-ink">Flashcard da questão (opcional)</p>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-ink-muted">Enunciado — foto</label>
              <ImageUploadField value={statementImage} onChange={setStatementImage} label="Foto do enunciado" />
              <label className="mt-2 block text-xs font-medium text-ink-muted">Enunciado — markdown (fórmulas com LaTeX, ex: $x^2$)</label>
              <MarkdownEditorField value={statementText} onChange={setStatementText} placeholder="Digite o enunciado, se preferir a texto..." />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Alternativas</label>
            <QuestionAlternativesEditor
              alternatives={alternatives}
              correctAlternative={correctAlternative}
              onChange={setAlternatives}
              onCorrectChange={setCorrectAlternative}
            />
          </div>

          <div className="border-t border-border pt-3">
            <p className="mb-2 text-sm font-semibold text-ink">Resolução</p>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-ink-muted">Resolução — foto</label>
              <ImageUploadField value={resolutionImage} onChange={setResolutionImage} label="Foto da resolução" />
              <label className="mt-2 block text-xs font-medium text-ink-muted">Resolução — markdown</label>
              <MarkdownEditorField value={resolutionText} onChange={setResolutionText} placeholder="Digite a resolução, se preferir a texto..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={createQuestion.isPending}>Salvar</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={flashcardQuestion !== null}
        onClose={() => setFlashcardQuestion(null)}
        title="Flashcard"
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        {flashcardQuestion && <QuestionFlashcard question={flashcardQuestion} />}
      </Modal>
    </motion.div>
  );
}
