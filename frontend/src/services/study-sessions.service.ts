import type {
  FinishStudySessionInput,
  FinishStudySessionResultDTO,
  StartStudySessionInput,
  StudySessionDTO,
} from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const studySessionsApi = {
  async list(params?: { subjectId?: number; type?: string; from?: string; to?: string }): Promise<StudySessionDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<StudySessionDTO[]>>("/study-sessions", { params });
    return data.data;
  },

  async start(input: StartStudySessionInput): Promise<StudySessionDTO> {
    const { data } = await apiClient.post<ApiEnvelope<StudySessionDTO>>("/study-sessions/start", input);
    return data.data;
  },

  async finish(id: number, input: FinishStudySessionInput): Promise<FinishStudySessionResultDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<FinishStudySessionResultDTO>>(
      `/study-sessions/${id}/finish`,
      input,
    );
    return data.data;
  },
};
