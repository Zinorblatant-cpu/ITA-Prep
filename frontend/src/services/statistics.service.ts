import type {
  AccuracyBySubjectDTO,
  HeatmapDayDTO,
  HoursByPeriodPointDTO,
  QuestionsStatsDTO,
  WeakStrongTopicsDTO,
} from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const statisticsApi = {
  async hours(groupBy: "week" | "month"): Promise<HoursByPeriodPointDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<HoursByPeriodPointDTO[]>>("/statistics/hours", { params: { groupBy } });
    return data.data;
  },
  async questions(groupBy: "week" | "month"): Promise<QuestionsStatsDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<QuestionsStatsDTO[]>>("/statistics/questions", { params: { groupBy } });
    return data.data;
  },
  async accuracyBySubject(): Promise<AccuracyBySubjectDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<AccuracyBySubjectDTO[]>>("/statistics/accuracy-by-subject");
    return data.data;
  },
  async heatmap(year: number): Promise<HeatmapDayDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<HeatmapDayDTO[]>>("/statistics/heatmap", { params: { year } });
    return data.data;
  },
  async weakStrongTopics(): Promise<WeakStrongTopicsDTO> {
    const { data } = await apiClient.get<ApiEnvelope<WeakStrongTopicsDTO>>("/statistics/weak-strong-topics");
    return data.data;
  },
};
