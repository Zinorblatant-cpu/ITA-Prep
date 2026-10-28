import { useStudySessions } from "../../hooks/useStudySessions";
import { useSubjects } from "../../hooks/useSubjects";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { Skeleton } from "../ui/Skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { formatDateTime, formatDuration } from "../../utils/format";
import type { StudySessionType } from "@ita/shared-types";

const TYPE_LABEL: Record<StudySessionType, string> = {
  teoria: "Teoria",
  exercicios: "Exercícios",
  revisao: "Revisão",
  simulado: "Simulado",
};

export function SessionHistoryTable() {
  const { data: sessions, isLoading } = useStudySessions();
  const { data: subjects } = useSubjects();

  const finished = sessions?.filter((s) => s.endedAt).slice().reverse().slice(0, 15) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico recente</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-32 w-full" />}
        {!isLoading && finished.length === 0 && (
          <EmptyState title="Nenhuma sessão registrada ainda" description="Suas sessões finalizadas aparecerão aqui." />
        )}
        {!isLoading && finished.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Matéria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Exercícios</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finished.map((session) => {
                const subject = subjects?.find((s) => s.id === session.subjectId);
                return (
                  <TableRow key={session.id}>
                    <TableCell>{formatDateTime(session.startedAt)}</TableCell>
                    <TableCell>{subject?.name ?? "—"}</TableCell>
                    <TableCell>{TYPE_LABEL[session.type]}</TableCell>
                    <TableCell>{session.durationSeconds ? formatDuration(session.durationSeconds) : "—"}</TableCell>
                    <TableCell>
                      {session.exercisesCorrect}/{session.exercisesTotal}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
