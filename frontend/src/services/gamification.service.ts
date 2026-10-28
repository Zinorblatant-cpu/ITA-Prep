import type { AchievementDTO, UserProfileDTO, XpLogEntryDTO } from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const gamificationApi = {
  async getProfile(): Promise<UserProfileDTO> {
    const { data } = await apiClient.get<ApiEnvelope<UserProfileDTO>>("/gamification/profile");
    return data.data;
  },
  async getAchievements(): Promise<AchievementDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<AchievementDTO[]>>("/gamification/achievements");
    return data.data;
  },
  async getXpLog(): Promise<XpLogEntryDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<XpLogEntryDTO[]>>("/gamification/xp-log");
    return data.data;
  },
};
