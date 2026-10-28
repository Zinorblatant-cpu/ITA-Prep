import { Play } from "lucide-react";
import { useState } from "react";
import type { StudySessionDTO, StudySessionType } from "@ita/shared-types";
import type { PomodoroConfig, SessionMode } from "../../hooks/useActiveSessionTimer";
import { useSubjects } from "../../hooks/useSubjects";
import { useTopics } from "../../hooks/useTopics";
import { useBooks, useTeachers, useYoutubeChannels } from "../../hooks/useSettings";
import { useStartSession } from "../../hooks/useStudySessions";
import { useToast } from "../ui/Toast";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { cn } from "../../utils/cn";

const TYPE_LABEL: Record<StudySessionType, string> = {
  teoria: "Teoria",
  exercicios: "Exercícios",
  revisao: "Revisão",
  simulado: "Simulado",
};

const DEFAULT_POMODORO: PomodoroConfig = {
  workMinutes: 25,
  breakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
};

interface StartSessionFormProps {
  onStarted: (session: StudySessionDTO, mode: SessionMode, pomodoroConfig?: PomodoroConfig) => void;
}

export function StartSessionForm({ onStarted }: StartSessionFormProps) {
  const { data: subjects } = useSubjects();
  const [subjectId, setSubjectId] = useState<number | "">("");
  const [topicId, setTopicId] = useState<number | "">("");
  const [bookId, setBookId] = useState<number | "">("");
  const [youtubeChannelId, setYoutubeChannelId] = useState<number | "">("");
  const [teacherId, setTeacherId] = useState<number | "">("");
  const [type, setType] = useState<StudySessionType>("teoria");
  const [mode, setMode] = useState<SessionMode>("livre");
  const [pomodoro, setPomodoro] = useState<PomodoroConfig>(DEFAULT_POMODORO);

  const { data: topics } = useTopics(Number(subjectId));
  const { data: books } = useBooks();
  const { data: channels } = useYoutubeChannels();
  const { data: teachers } = useTeachers();

  const startSession = useStartSession();
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId) return;
    try {
      const session = await startSession.mutateAsync({
        subjectId: Number(subjectId),
        topicId: topicId ? Number(topicId) : undefined,
        bookId: bookId ? Number(bookId) : undefined,
        youtubeChannelId: youtubeChannelId ? Number(youtubeChannelId) : undefined,
        teacherId: teacherId ? Number(teacherId) : undefined,
        type,
      });
      onStarted(session, mode, mode === "pomodoro" ? pomodoro : undefined);
      toast({
        title: "Sessão iniciada",
        description: mode === "pomodoro" ? `Modo Pomodoro: ${pomodoro.workMinutes}min foco / ${pomodoro.breakMinutes}min pausa.` : "Bons estudos!",
        variant: "success",
      });
    } catch {
      toast({ title: "Não foi possível iniciar a sessão", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sessão de estudo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Modo de estudo</label>
            <div className="inline-flex items-center gap-1 rounded-md bg-surface-subtle p-1">
              {(["livre", "pomodoro"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                    mode === option ? "bg-surface text-ink shadow-subtle" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {option === "livre" ? "Cronômetro livre" : "Pomodoro"}
                </button>
              ))}
            </div>
          </div>

          {mode === "pomodoro" && (
            <div className="grid grid-cols-2 gap-3 rounded-md border border-border bg-surface-subtle/50 p-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Foco (min)</label>
                <Input
                  type="number"
                  min={1}
                  value={pomodoro.workMinutes}
                  onChange={(e) => setPomodoro((p) => ({ ...p, workMinutes: Number(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Pausa curta (min)</label>
                <Input
                  type="number"
                  min={1}
                  value={pomodoro.breakMinutes}
                  onChange={(e) => setPomodoro((p) => ({ ...p, breakMinutes: Number(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Pausa longa (min)</label>
                <Input
                  type="number"
                  min={1}
                  value={pomodoro.longBreakMinutes}
                  onChange={(e) => setPomodoro((p) => ({ ...p, longBreakMinutes: Number(e.target.value) || 1 }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-muted">Ciclos p/ pausa longa</label>
                <Input
                  type="number"
                  min={1}
                  value={pomodoro.cyclesBeforeLongBreak}
                  onChange={(e) => setPomodoro((p) => ({ ...p, cyclesBeforeLongBreak: Number(e.target.value) || 1 }))}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Matéria</label>
              <Select value={subjectId} onChange={(e) => { setSubjectId(Number(e.target.value)); setTopicId(""); }} required>
                <option value="">Selecione...</option>
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Conteúdo</label>
              <Select value={topicId} onChange={(e) => setTopicId(Number(e.target.value))} disabled={!subjectId}>
                <option value="">—</option>
                {topics?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Tipo</label>
              <Select value={type} onChange={(e) => setType(e.target.value as StudySessionType)}>
                {Object.entries(TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Livro</label>
              <Select value={bookId} onChange={(e) => setBookId(Number(e.target.value))}>
                <option value="">—</option>
                {books?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Canal do YouTube</label>
              <Select value={youtubeChannelId} onChange={(e) => setYoutubeChannelId(Number(e.target.value))}>
                <option value="">—</option>
                {channels?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-muted">Professor</label>
              <Select value={teacherId} onChange={(e) => setTeacherId(Number(e.target.value))}>
                <option value="">—</option>
                {teachers?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={!subjectId || startSession.isPending} className="w-full sm:w-auto">
            <Play size={14} /> Iniciar sessão
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
