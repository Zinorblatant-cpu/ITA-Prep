import { useSubjects } from "../../hooks/useSubjects";
import { Select } from "../ui/Select";

interface ErrorFilterBarProps {
  status: string;
  onStatusChange: (status: string) => void;
  subjectId: string;
  onSubjectChange: (subjectId: string) => void;
}

export function ErrorFilterBar({ status, onStatusChange, subjectId, onSubjectChange }: ErrorFilterBarProps) {
  const { data: subjects } = useSubjects();

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={status} onChange={(e) => onStatusChange(e.target.value)} className="w-40">
        <option value="">Todos os status</option>
        <option value="pendente">Pendente</option>
        <option value="revisado">Revisado</option>
        <option value="dominado">Dominado</option>
      </Select>
      <Select value={subjectId} onChange={(e) => onSubjectChange(e.target.value)} className="w-48">
        <option value="">Todas as matérias</option>
        {subjects?.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </Select>
    </div>
  );
}
