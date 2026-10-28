import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useAppSettings,
  useBooks,
  useCourses,
  useCreateBook,
  useCreateCourse,
  useCreateTeacher,
  useDeleteBook,
  useDeleteCourse,
  useDeleteTeacher,
  useTeachers,
  useUpdateAppSettings,
} from "../hooks/useSettings";
import { useToast } from "../components/ui/Toast";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { DatePicker } from "../components/ui/DatePicker";
import { Input } from "../components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { YoutubeChannelManager } from "../components/settings/YoutubeChannelManager";

function SimpleListManager<T extends { id: number }>({
  title,
  placeholder,
  items,
  onCreate,
  onDelete,
  getLabel,
}: {
  title: string;
  placeholder: string;
  items: T[] | undefined;
  onCreate: (name: string) => Promise<unknown>;
  onDelete: (id: number) => void;
  getLabel: (item: T) => string;
}) {
  const [value, setValue] = useState("");
  const { toast } = useToast();

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    try {
      await onCreate(value.trim());
      setValue("");
    } catch {
      toast({ title: "Não foi possível salvar", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="mb-4 flex gap-2">
          <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
          <Button type="submit">
            <Plus size={14} /> Adicionar
          </Button>
        </form>
        {items && items.length === 0 && <p className="text-sm text-ink-subtle">Nenhum item cadastrado.</p>}
        {items && items.length > 0 && (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-ink">{getLabel(item)}</span>
                <Button size="icon" variant="ghost" onClick={() => onDelete(item.id)} aria-label="Remover">
                  <Trash2 size={14} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function GeneralSettings() {
  const { data: settings, isLoading } = useAppSettings();
  const updateSettings = useUpdateAppSettings();
  const { toast } = useToast();
  const [weeklyHourTarget, setWeeklyHourTarget] = useState("");
  const [examDate, setExamDate] = useState("");

  if (isLoading || !settings) return <p className="text-sm text-ink-subtle">Carregando...</p>;

  const currentWeeklyHourTarget = weeklyHourTarget || String(settings.weeklyHourTarget);
  const currentExamDate = examDate || settings.examDate.slice(0, 10);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        weeklyHourTarget: Number(currentWeeklyHourTarget),
        examDate: currentExamDate,
      });
      toast({ title: "Configurações salvas", variant: "success" });
    } catch {
      toast({ title: "Não foi possível salvar", variant: "error" });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Data da prova (ITA)</label>
            <DatePicker value={currentExamDate} onChange={(e) => setExamDate(e.target.value)} className="max-w-xs" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">Carga horária semanal (horas)</label>
            <Input
              type="number"
              min={0}
              value={currentWeeklyHourTarget}
              onChange={(e) => setWeeklyHourTarget(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <Button type="submit" disabled={updateSettings.isPending}>Salvar</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { data: books } = useBooks();
  const { data: courses } = useCourses();
  const { data: teachers } = useTeachers();

  const createBook = useCreateBook();
  const deleteBook = useDeleteBook();
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();
  const createTeacher = useCreateTeacher();
  const deleteTeacher = useDeleteTeacher();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-ink">Configurações</h1>
        <p className="text-sm text-ink-subtle">Livros, cursos, canais, professores e preferências gerais.</p>
      </div>

      <Tabs defaultValue="geral">
        <TabsList>
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="books">Livros</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="teachers">Professores</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="books">
          <SimpleListManager
            title="Livros"
            placeholder="Título do livro"
            items={books}
            onCreate={(title) => createBook.mutateAsync({ title, author: null, subjectId: null, totalPages: null, notes: null })}
            onDelete={(id) => deleteBook.mutate(id)}
            getLabel={(item) => item.title}
          />
        </TabsContent>

        <TabsContent value="courses">
          <SimpleListManager
            title="Cursos"
            placeholder="Nome do curso"
            items={courses}
            onCreate={(name) => createCourse.mutateAsync({ name, platform: null, url: null, subjectId: null, notes: null })}
            onDelete={(id) => deleteCourse.mutate(id)}
            getLabel={(item) => item.name}
          />
        </TabsContent>

        <TabsContent value="channels">
          <YoutubeChannelManager />
        </TabsContent>

        <TabsContent value="teachers">
          <SimpleListManager
            title="Professores"
            placeholder="Nome do professor"
            items={teachers}
            onCreate={(name) => createTeacher.mutateAsync({ name, subjectId: null, notes: null })}
            onDelete={(id) => deleteTeacher.mutate(id)}
            getLabel={(item) => item.name}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
