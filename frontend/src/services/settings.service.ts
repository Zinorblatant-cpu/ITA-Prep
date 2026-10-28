import type {
  AppSettingsDTO,
  BookDTO,
  CourseDTO,
  CreateBookInput,
  CreateCourseInput,
  CreateTeacherInput,
  CreateYoutubeChannelInput,
  MissingTopicSearchResultDTO,
  TeacherDTO,
  UpdateAppSettingsInput,
  UpdateBookInput,
  UpdateCourseInput,
  UpdateTeacherInput,
  UpdateYoutubeChannelInput,
  YoutubeChannelDTO,
} from "@ita/shared-types";
import { apiClient, type ApiEnvelope } from "./api-client";

export const settingsApi = {
  async listBooks(): Promise<BookDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<BookDTO[]>>("/settings/books");
    return data.data;
  },
  async createBook(input: CreateBookInput): Promise<BookDTO> {
    const { data } = await apiClient.post<ApiEnvelope<BookDTO>>("/settings/books", input);
    return data.data;
  },
  async updateBook(id: number, input: UpdateBookInput): Promise<BookDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<BookDTO>>(`/settings/books/${id}`, input);
    return data.data;
  },
  async deleteBook(id: number): Promise<void> {
    await apiClient.delete(`/settings/books/${id}`);
  },

  async listCourses(): Promise<CourseDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<CourseDTO[]>>("/settings/courses");
    return data.data;
  },
  async createCourse(input: CreateCourseInput): Promise<CourseDTO> {
    const { data } = await apiClient.post<ApiEnvelope<CourseDTO>>("/settings/courses", input);
    return data.data;
  },
  async updateCourse(id: number, input: UpdateCourseInput): Promise<CourseDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<CourseDTO>>(`/settings/courses/${id}`, input);
    return data.data;
  },
  async deleteCourse(id: number): Promise<void> {
    await apiClient.delete(`/settings/courses/${id}`);
  },

  async listYoutubeChannels(): Promise<YoutubeChannelDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<YoutubeChannelDTO[]>>("/settings/youtube-channels");
    return data.data;
  },
  async createYoutubeChannel(input: CreateYoutubeChannelInput): Promise<YoutubeChannelDTO> {
    const { data } = await apiClient.post<ApiEnvelope<YoutubeChannelDTO>>("/settings/youtube-channels", input);
    return data.data;
  },
  async updateYoutubeChannel(id: number, input: UpdateYoutubeChannelInput): Promise<YoutubeChannelDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<YoutubeChannelDTO>>(`/settings/youtube-channels/${id}`, input);
    return data.data;
  },
  async deleteYoutubeChannel(id: number): Promise<void> {
    await apiClient.delete(`/settings/youtube-channels/${id}`);
  },
  async searchMissingTopicsOnChannel(id: number): Promise<MissingTopicSearchResultDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<MissingTopicSearchResultDTO[]>>(
      `/settings/youtube-channels/${id}/missing-topics-search`,
    );
    return data.data;
  },

  async listTeachers(): Promise<TeacherDTO[]> {
    const { data } = await apiClient.get<ApiEnvelope<TeacherDTO[]>>("/settings/teachers");
    return data.data;
  },
  async createTeacher(input: CreateTeacherInput): Promise<TeacherDTO> {
    const { data } = await apiClient.post<ApiEnvelope<TeacherDTO>>("/settings/teachers", input);
    return data.data;
  },
  async updateTeacher(id: number, input: UpdateTeacherInput): Promise<TeacherDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<TeacherDTO>>(`/settings/teachers/${id}`, input);
    return data.data;
  },
  async deleteTeacher(id: number): Promise<void> {
    await apiClient.delete(`/settings/teachers/${id}`);
  },

  async getAppSettings(): Promise<AppSettingsDTO> {
    const { data } = await apiClient.get<ApiEnvelope<AppSettingsDTO>>("/settings/app");
    return data.data;
  },
  async updateAppSettings(input: UpdateAppSettingsInput): Promise<AppSettingsDTO> {
    const { data } = await apiClient.patch<ApiEnvelope<AppSettingsDTO>>("/settings/app", input);
    return data.data;
  },
};
