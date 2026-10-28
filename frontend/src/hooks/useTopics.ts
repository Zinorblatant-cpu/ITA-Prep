import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTopicInput, UpdateTopicInput } from "@ita/shared-types";
import { topicsApi } from "../services/topics.service";

export function useTopics(subjectId: number) {
  return useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => topicsApi.listBySubject(subjectId),
    enabled: Number.isFinite(subjectId),
  });
}

function useInvalidateTopicQueries() {
  const queryClient = useQueryClient();
  return (subjectId?: number) => {
    queryClient.invalidateQueries({ queryKey: ["topics"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["calendar"] });
    if (subjectId) {
      queryClient.invalidateQueries({ queryKey: ["subjects", subjectId, "stats"] });
    }
  };
}

export function useCreateTopic() {
  const invalidate = useInvalidateTopicQueries();
  return useMutation({
    mutationFn: (input: CreateTopicInput) => topicsApi.create(input),
    onSuccess: (topic) => invalidate(topic.subjectId),
  });
}

export function useUpdateTopic() {
  const invalidate = useInvalidateTopicQueries();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTopicInput }) => topicsApi.update(id, input),
    onSuccess: (topic) => invalidate(topic.subjectId),
  });
}

export function useDeleteTopic() {
  const invalidate = useInvalidateTopicQueries();
  return useMutation({
    mutationFn: (id: number) => topicsApi.delete(id),
    onSuccess: () => invalidate(),
  });
}

export function useCompleteTopic() {
  const invalidate = useInvalidateTopicQueries();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => topicsApi.complete(id),
    onSuccess: (result) => {
      invalidate(result.topic.subjectId);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
