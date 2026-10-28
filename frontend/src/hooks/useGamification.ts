import { useQuery } from "@tanstack/react-query";
import { gamificationApi } from "../services/gamification.service";

export function useUserProfile() {
  return useQuery({ queryKey: ["gamification", "profile"], queryFn: gamificationApi.getProfile });
}

export function useAchievements() {
  return useQuery({ queryKey: ["gamification", "achievements"], queryFn: gamificationApi.getAchievements });
}

export function useXpLog() {
  return useQuery({ queryKey: ["gamification", "xp-log"], queryFn: gamificationApi.getXpLog });
}
