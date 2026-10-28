import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FinishStudySessionInput, StartStudySessionInput } from "@ita/shared-types";
import { studySessionsApi } from "../services/study-sessions.service";

export function useStudySessions(params?: { subjectId?: number; type?: string }) {
  return useQuery({
    queryKey: ["study-sessions", params],
    queryFn: () => studySessionsApi.list(params),
  });
}

export function useStartSession() {
  return useMutation({
    mutationFn: (input: StartStudySessionInput) => studySessionsApi.start(input),
  });
}

export function useFinishSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: FinishStudySessionInput }) =>
      studySessionsApi.finish(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["gamification"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}
