import { useQuery } from "@tanstack/react-query";
import { statisticsApi } from "../services/statistics.service";

export function useHoursStatistics(groupBy: "week" | "month") {
  return useQuery({ queryKey: ["statistics", "hours", groupBy], queryFn: () => statisticsApi.hours(groupBy) });
}

export function useQuestionsStatistics(groupBy: "week" | "month") {
  return useQuery({ queryKey: ["statistics", "questions", groupBy], queryFn: () => statisticsApi.questions(groupBy) });
}

export function useAccuracyBySubject() {
  return useQuery({ queryKey: ["statistics", "accuracy-by-subject"], queryFn: statisticsApi.accuracyBySubject });
}

export function useHeatmap(year: number) {
  return useQuery({ queryKey: ["statistics", "heatmap", year], queryFn: () => statisticsApi.heatmap(year) });
}

export function useWeakStrongTopics() {
  return useQuery({ queryKey: ["statistics", "weak-strong-topics"], queryFn: statisticsApi.weakStrongTopics });
}
