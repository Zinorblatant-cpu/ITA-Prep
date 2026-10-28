import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateGoalInput } from "@ita/shared-types";
import { goalsApi } from "../services/goals.service";

export function useGoals() {
  return useQuery({ queryKey: ["goals"], queryFn: () => goalsApi.list() });
}

export function useGoalProgress(id: number) {
  return useQuery({ queryKey: ["goals", id, "progress"], queryFn: () => goalsApi.progress(id) });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateGoalInput) => goalsApi.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => goalsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
}
