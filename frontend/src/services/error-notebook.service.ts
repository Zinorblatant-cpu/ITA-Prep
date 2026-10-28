import type {
  CreateErrorNotebookEntryInput,
  ErrorNotebookEntryDTO,
  UpdateErrorNotebookEntryInput,
} from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const errorNotebookApi = {
  async list(params?: { status?: string; subjectId?: number }): Promise<ErrorNotebookEntryDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<ErrorNotebookEntryDTO[]>>("/error-notebook", { params });
    return data.data;
  },

  async create(input: CreateErrorNotebookEntryInput): Promise<ErrorNotebookEntryDTO> {
    const { data } = await apiClient.post<ApiEnvelope<ErrorNotebookEntryDTO>>("/error-notebook", input);
    return data.data;
  },

  async update(id: number, input: UpdateErrorNotebookEntryInput): Promise<ErrorNotebookEntryDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<ErrorNotebookEntryDTO>>(`/error-notebook/${id}`, input);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/error-notebook/${id}`);
  },
};
