import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../services/subjects.service";

export function useSubjects() {
  return useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });
}

export function useSubject(id: number) {
  return useQuery({
    queryKey: ["subjects", id],
    queryFn: () => subjectsApi.getById(id),
    enabled: Number.isFinite(id),
  });
}

export function useSubjectStats(id: number) {
  return useQuery({
    queryKey: ["subjects", id, "stats"],
    queryFn: () => subjectsApi.getStats(id),
    enabled: Number.isFinite(id),
  });
}
