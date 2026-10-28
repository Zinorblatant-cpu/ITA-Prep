import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateQuestionInput, UpdateQuestionInput } from "@ita/shared-types";
import { questionsApi } from "../services/questions.service";

export function useQuestions(params?: { origin?: string; subjectId?: number; year?: number }) {
  return useQuery({ queryKey: ["questions", params], queryFn: () => questionsApi.list(params) });
}

function useInvalidateQuestions() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["questions"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
    qc.invalidateQueries({ queryKey: ["statistics"] });
  };
}

export function useCreateQuestion() {
  const invalidate = useInvalidateQuestions();
  return useMutation({
    mutationFn: (input: CreateQuestionInput) => questionsApi.create(input),
    onSuccess: invalidate,
  });
}

export function useUpdateQuestion() {
  const invalidate = useInvalidateQuestions();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateQuestionInput }) => questionsApi.update(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteQuestion() {
  const invalidate = useInvalidateQuestions();
  return useMutation({
    mutationFn: (id: number) => questionsApi.delete(id),
    onSuccess: invalidate,
  });
}
