import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateErrorNotebookEntryInput, UpdateErrorNotebookEntryInput } from "@ita/shared-types";
import { errorNotebookApi } from "../services/error-notebook.service";

export function useErrorNotebookEntries(params?: { status?: string; subjectId?: number }) {
  return useQuery({
    queryKey: ["error-notebook", params],
    queryFn: () => errorNotebookApi.list(params),
  });
}

export function useCreateErrorEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateErrorNotebookEntryInput) => errorNotebookApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["error-notebook"] }),
  });
}

export function useUpdateErrorEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateErrorNotebookEntryInput }) =>
      errorNotebookApi.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["error-notebook"] }),
  });
}

export function useDeleteErrorEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => errorNotebookApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["error-notebook"] }),
  });
}
