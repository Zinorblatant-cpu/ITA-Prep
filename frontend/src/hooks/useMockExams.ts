import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateMockExamInput } from "@ita/shared-types";
import { mockExamsApi } from "../services/mock-exams.service";

export function useMockExams() {
  return useQuery({ queryKey: ["mock-exams"], queryFn: mockExamsApi.list });
}

export function useMockExamComparison() {
  return useQuery({ queryKey: ["mock-exams", "comparison"], queryFn: mockExamsApi.comparison });
}

function useInvalidateMockExams() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["mock-exams"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
    qc.invalidateQueries({ queryKey: ["gamification"] });
  };
}

export function useCreateMockExam() {
  const invalidate = useInvalidateMockExams();
  return useMutation({
    mutationFn: (input: CreateMockExamInput) => mockExamsApi.create(input),
    onSuccess: invalidate,
  });
}

export function useDeleteMockExam() {
  const invalidate = useInvalidateMockExams();
  return useMutation({
    mutationFn: (id: number) => mockExamsApi.delete(id),
    onSuccess: invalidate,
  });
}
